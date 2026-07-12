import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const RESEND_FROM = process.env.RESEND_FROM_EMAIL ?? "StudiesMate <no-reply@studiesmate.pk>";

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error("send-quiz-notification: missing Supabase env vars");
}

const QUIZ_META: Record<string, { topic: string; subject: string }> = {
  "math-npv":       { topic: "Numbers & Place Value", subject: "Mathematics" },
  "english-intro":  { topic: "Simple Sentences",      subject: "English"     },
  "science-intro":  { topic: "What is a Habitat?",    subject: "Science"     },
};

export async function POST(req: NextRequest) {
  // No Resend key configured — skip silently
  if (!RESEND_API_KEY || RESEND_API_KEY.startsWith("re_xxx")) {
    return NextResponse.json({ ok: false, reason: "no_key" });
  }

  try {
    // Verify the caller is an authenticated user
    const authHeader = req.headers.get("Authorization");
    const token = authHeader?.replace(/^Bearer\s+/i, "");
    if (!token) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }

    const userClient = createClient(SUPABASE_URL!, SUPABASE_ANON_KEY!, {
      global: { headers: { Authorization: `Bearer ${token}` } },
      auth: { persistSession: false },
    });

    const { data: { user }, error: authErr } = await userClient.auth.getUser();
    if (authErr || !user) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }

    const email = user.email;
    if (!email) {
      return NextResponse.json({ ok: false, reason: "no_email" });
    }

    // Parse and validate quiz ID
    const { quizId } = await req.json() as { quizId?: string };
    const meta = quizId ? QUIZ_META[quizId] : undefined;
    if (!meta) {
      return NextResponse.json({ error: "invalid_quiz_id" }, { status: 400 });
    }

    const { topic, subject } = meta;

    const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family:system-ui,sans-serif;background:#f9fafb;margin:0;padding:32px 16px;">
  <div style="max-width:520px;margin:0 auto;background:white;border-radius:16px;padding:36px 32px;box-shadow:0 2px 8px rgba(0,0,0,0.06);">
    <div style="font-size:40px;text-align:center;margin-bottom:16px;">🎉</div>
    <h1 style="font-size:22px;font-weight:700;color:#111827;margin:0 0 8px;">Great job on your quiz!</h1>
    <p style="font-size:15px;color:#374151;line-height:1.7;margin:0 0 20px;">
      Congratulations on completing the <strong>${topic}</strong> quiz!
      Don&rsquo;t lose your streak. Keep the momentum going.
    </p>
    <p style="font-size:15px;color:#374151;line-height:1.7;margin:0 0 20px;">
      Practice more with your worksheet to strengthen what you just learned,
      or revisit the lesson video for extra clarity on any tricky parts.
    </p>
    <p style="font-size:15px;color:#374151;line-height:1.7;margin:0 0 28px;">
      Every quiz completed brings you one step closer to mastering
      <strong>${subject}</strong>. Keep it up!
    </p>
    <a href="https://studiesmate.pk/dashboard"
       style="display:inline-block;background:#22C55E;color:white;text-decoration:none;border-radius:9999px;padding:12px 28px;font-size:14px;font-weight:600;">
      Go to Dashboard →
    </a>
    <p style="margin-top:32px;font-size:12px;color:#9ca3af;">
      You received this because email notifications are enabled in your StudiesMate settings.
    </p>
  </div>
</body>
</html>`;

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: RESEND_FROM,
        to: email,
        subject: "Great job on your quiz! 🎉",
        html,
      }),
    });

    if (!res.ok) {
      const body = await res.text();
      console.error("[quiz-notification] Resend error", res.status, body);
      return NextResponse.json({ ok: false, reason: "send_failed" });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[quiz-notification] unexpected error", err);
    return NextResponse.json({ ok: false, reason: "server_error" });
  }
}
