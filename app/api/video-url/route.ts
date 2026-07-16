import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const BUNNY_AUTH_KEY = process.env.BUNNY_TOKEN_AUTH_KEY;
const CDN_HOSTNAME = "studiesmate.b-cdn.net";
const EXPIRY_SECONDS = 1 * 60 * 60; // 1 hour

// All video filenames that can be signed
const ALLOWED_PATHS = new Set([
  "simple_sentences_english.mp4.mp4",
  "simple_sentence_urdu.mp4.mp4",
  "habitat_english.mp4.mp4",
  "habitat_urdu.mp4.mp4",
  "place_value_english.mp4.mp4",
  "place_value_urdu.mp4.mp4",
]);

// Subset that can be signed without user authentication (homepage demo)
const DEMO_PATHS = new Set([
  "simple_sentences_english.mp4.mp4",
  "simple_sentence_urdu.mp4.mp4",
]);

// In-memory rate limiter — resets per server instance (acceptable for Vercel MVP)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_MAX = 15;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000; // 10 minutes

function checkRateLimit(userId: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(userId);
  if (!entry || now >= entry.resetAt) {
    rateLimitMap.set(userId, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }
  if (entry.count >= RATE_LIMIT_MAX) return false;
  entry.count++;
  return true;
}

function generateSignedUrl(filename: string): string {
  const path = `/${filename}`;
  const expiry = Math.floor(Date.now() / 1000) + EXPIRY_SECONDS;
  // Bunny.net token: MD5(auth_key + url_path + expiry_timestamp), base64-url-safe encoded
  const rawMd5 = crypto
    .createHash("md5")
    .update(BUNNY_AUTH_KEY + path + expiry.toString())
    .digest();
  const token = rawMd5
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");
  return `https://${CDN_HOSTNAME}${path}?token=${token}&expires=${expiry}`;
}

export async function GET(req: NextRequest) {
  console.log("[video-url] GET", req.nextUrl.searchParams.toString());

  if (!BUNNY_AUTH_KEY) {
    console.log("[video-url] BUNNY_AUTH_KEY missing → 503");
    return NextResponse.json({ error: "video_unavailable" }, { status: 503 });
  }

  const filename = req.nextUrl.searchParams.get("path") ?? "";
  if (!filename || !ALLOWED_PATHS.has(filename)) {
    console.log("[video-url] invalid path:", filename, "→ 400");
    return NextResponse.json({ error: "invalid_path" }, { status: 400 });
  }

  const authHeader = req.headers.get("Authorization");
  const token = authHeader?.replace(/^Bearer\s+/i, "");
  console.log("[video-url] auth header present:", !!authHeader, "| token present:", !!token);

  let userId: string | null = null;

  if (token) {
    // Authenticated request — verify the session belongs to a real user
    const userClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      global: { headers: { Authorization: `Bearer ${token}` } },
      auth: { persistSession: false },
    });
    const { data: { user }, error } = await userClient.auth.getUser();
    console.log("[video-url] getUser result — userId:", user?.id ?? null, "| error:", error?.message ?? null);
    if (error || !user) {
      console.log("[video-url] → 401 unauthorized");
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }
    userId = user.id;
  } else {
    // Unauthenticated request — only demo paths are allowed (homepage)
    if (!DEMO_PATHS.has(filename)) {
      console.log("[video-url] no token + non-demo path → 401");
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }
    console.log("[video-url] demo path, no auth required");
  }

  if (userId && !checkRateLimit(userId)) {
    console.log("[video-url] rate limited for userId:", userId, "→ 429");
    return NextResponse.json(
      { error: "Too many video requests. Please wait a few minutes and try again." },
      { status: 429 }
    );
  }

  const signedUrl = generateSignedUrl(filename);
  console.log("[video-url] → 200 signed URL:", signedUrl);
  return NextResponse.json({ url: signedUrl });
}
