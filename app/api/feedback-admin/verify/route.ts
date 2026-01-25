import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const pass = String(body?.password || "");
    const correct = process.env.FEEDBACK_ADMIN_PASSWORD || "";

    console.log("PASS_LEN", pass.length);
    console.log("CORRECT_LEN", correct.length);
    console.log("PASS_JSON", JSON.stringify(pass));
    console.log("CORRECT_JSON", JSON.stringify(correct));

    if (!correct || pass !== correct) {
      return NextResponse.json({ ok: false }, { status: 401 });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
}
