import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

function isAllowed(req: Request) {
  const pass = req.headers.get("x-admin-password") || "";
  const correct = process.env.FEEDBACK_ADMIN_PASSWORD || "";
  return Boolean(correct && pass && pass === correct);
}

export async function GET(req: Request) {
  if (!isAllowed(req)) {
    return NextResponse.json(
      { ok: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  const sb = supabaseAdmin();

  const { data, error } = await sb
    .from("feedback")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(500);

  if (error) {
    return NextResponse.json(
      { ok: false, error: error.message },
      { status: 500 }
    );
  }

  // ✅ return exactly what the admin UI expects
  return NextResponse.json({
    ok: true,
    rows: data || [],
  });
}
