import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: NextRequest) {
  try {
  const { topic, subject, language, userId } = await req.json();
  console.log("Request body:", { topic, subject, language, userId });

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: profile } = await supabase
    .from("profiles")
    .select("explain_credits, explain_credits_reset_at")
    .eq("id", userId)
    .single();

  if (!profile) {
    return NextResponse.json({ error: "no_credits", creditsLeft: 0 }, { status: 403 });
  }

  let currentCredits: number = profile.explain_credits ?? 0;
  let currentResetAt: string | null = profile.explain_credits_reset_at ?? null;

  // Check if 3-day reset is due
  if (currentResetAt !== null) {
    const resetPlusThree = new Date(new Date(currentResetAt).getTime() + 3 * 24 * 60 * 60 * 1000);
    if (new Date() >= resetPlusThree) {
      await supabase
        .from("profiles")
        .update({ explain_credits: 4, explain_credits_reset_at: null })
        .eq("id", userId);
      currentCredits = 4;
      currentResetAt = null;
    }
  }

  if (currentCredits <= 0) {
    return NextResponse.json({ error: "no_credits", creditsLeft: 0 }, { status: 403 });
  }

  console.log("Sending to Groq:", `Explain this topic simply: ${topic} from subject ${subject}. Language: ${language}`);
  const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      max_tokens: 200,
      messages: [
        {
          role: "system",
          content:
            "You are StudiesMate, a friendly tutor for Pakistani school students Grade 4. Explain topics in very simple language a 9-10 year old understands. Maximum 4-5 sentences. If language is urdu respond in Roman Urdu. If language is english respond in simple English.",
        },
        {
          role: "user",
          content: `Explain this topic simply: ${topic} from subject ${subject}. Language: ${language}`,
        },
      ],
    }),
  });

  console.log("Groq response:", groqRes.status, groqRes.statusText);
  if (!groqRes.ok) {
    const errorText = await groqRes.text();
    console.error("Groq error:", groqRes.status, errorText);
    return NextResponse.json({ error: "groq_failed", detail: errorText }, { status: 500 });
  }

  const groqData = await groqRes.json();
  const explanation: string = groqData.choices?.[0]?.message?.content ?? "";

  const newCredits = currentCredits - 1;
  const nowIso = new Date().toISOString();
  const newResetAt = currentCredits === 4 ? nowIso : currentResetAt;

  const updatePayload: Record<string, unknown> = { explain_credits: newCredits };
  if (currentCredits === 4) {
    updatePayload.explain_credits_reset_at = nowIso;
  }

  await supabase.from("profiles").update(updatePayload).eq("id", userId);

  return NextResponse.json({
    explanation,
    creditsLeft: newCredits,
    resetAt: newResetAt,
  });
  } catch (err) {
    console.error("API route error:", err);
    return NextResponse.json({ error: "server_error", detail: String(err) }, { status: 500 });
  }
}
