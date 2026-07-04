import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY;
const GROQ_API_KEY = process.env.GROQ_API_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE || !GROQ_API_KEY) {
  throw new Error("explain route: missing NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, or GROQ_API_KEY");
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    if (!body) {
      return NextResponse.json({ error: "invalid_request" }, { status: 400 });
    }

    const { topic, subject, language, userId } = body;

    if (
      !topic || !subject || !language || !userId ||
      typeof topic !== "string" || typeof subject !== "string" ||
      typeof language !== "string" || typeof userId !== "string"
    ) {
      return NextResponse.json({ error: "missing_fields" }, { status: 400 });
    }

    let { data: profile } = await supabase
      .from("profiles")
      .select("explain_credits, explain_credits_reset_at")
      .eq("id", userId)
      .maybeSingle();

    if (!profile) {
      await supabase.from("profiles").upsert({
        id: userId,
        explain_credits: 4,
        explain_credits_reset_at: null,
      }, { onConflict: "id" });
      profile = { explain_credits: 4, explain_credits_reset_at: null };
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

    const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        max_tokens: 200,
        messages: [
          {
            role: "system",
            content:
              "You are StudiesMate, a friendly tutor for Pakistani school students Grade 4. Explain topics in very simple language a 9-10 year old understands. Maximum 4-5 sentences. If language is urdu respond in Roman Urdu. Use simple, everyday spoken Urdu that a Grade 4 student and their parent would easily understand. Avoid difficult or literary Urdu words. Keep sentences short and conversational. Do NOT translate technical or subject-specific keywords (like 'quadratic', 'photosynthesis', 'place value', 'noun', 'verb', etc.) — keep these English terms as-is within the Urdu explanation, since these are standard terms students learn in English regardless of language. If language is english respond in simple English.",
          },
          {
            role: "user",
            content: `Explain this topic simply: ${topic} from subject ${subject}. Language: ${language}`,
          },
        ],
      }),
    });

    if (!groqRes.ok) {
      const errorText = await groqRes.text();
      console.error("Groq error:", groqRes.status, errorText);
      return NextResponse.json({ error: "groq_failed" }, { status: 500 });
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
    console.error("explain route error:", err);
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}
