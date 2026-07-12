import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE || !SUPABASE_ANON_KEY) {
  throw new Error("check-duplicate-email: missing required env vars");
}

const adminClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE, {
  auth: { persistSession: false, autoRefreshToken: false },
});

export async function POST(req: NextRequest) {
  try {
    // Verify the caller is an authenticated Google user
    const token = req.headers.get("Authorization")?.replace(/^Bearer\s+/i, "");
    if (!token) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

    const userClient = createClient(SUPABASE_URL!, SUPABASE_ANON_KEY!, {
      global: { headers: { Authorization: `Bearer ${token}` } },
      auth: { persistSession: false },
    });
    const { data: { user }, error: authErr } = await userClient.auth.getUser();
    if (authErr || !user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

    const email = user.email;
    if (!email) return NextResponse.json({ conflict: false });

    // List users and search for an email/password account with the same email.
    // perPage:1000 is safe for beta scale; add pagination if user base grows.
    const { data: listData, error: listErr } = await adminClient.auth.admin.listUsers({
      page: 1,
      perPage: 1000,
    });
    if (listErr) {
      console.error("check-duplicate-email: listUsers error", listErr);
      return NextResponse.json({ conflict: false }); // fail-safe: don't block sign-in on error
    }

    const conflictUser = listData.users.find((u) => {
      if (u.id === user.id) return false; // skip the current (new) Google user
      if (u.email?.toLowerCase() !== email.toLowerCase()) return false;
      // A conflict exists when another account for this email was created with email/password
      return u.identities?.some((identity) => identity.provider === "email") ?? false;
    });

    if (conflictUser) {
      // Delete the phantom Google account immediately so it doesn't accumulate in auth.users
      try {
        await adminClient.auth.admin.deleteUser(user.id);
      } catch (deleteErr) {
        console.error("check-duplicate-email: failed to delete phantom user", deleteErr);
      }
      return NextResponse.json({ conflict: true });
    }

    return NextResponse.json({ conflict: false });
  } catch (err) {
    console.error("check-duplicate-email error:", err);
    return NextResponse.json({ conflict: false }); // fail-safe
  }
}
