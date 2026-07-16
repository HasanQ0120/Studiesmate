"use client";

import { useEffect, useState } from "react";
import confetti from "canvas-confetti";
import Link from "next/link";
import DashboardLayout from "@/components/DashboardLayout";
import { supabase } from "@/lib/auth";

async function sendQuizNotification(quizId: string) {
  try {
    if (localStorage.getItem("sm_email_notifications") === "false") return;
    if (localStorage.getItem(`sm_quiz_email_sent_${quizId}`)) return;
    // Email sending disabled until domain verification with Resend is complete. Re-enable by uncommenting the API call below.
    // const { data: { session } } = await supabase.auth.getSession();
    // if (!session?.access_token) return;
    // const res = await fetch("/api/send-quiz-notification", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //     "Authorization": `Bearer ${session.access_token}`,
    //   },
    //   body: JSON.stringify({ quizId }),
    // });
    // if (res.ok) localStorage.setItem(`sm_quiz_email_sent_${quizId}`, "true");
  } catch {}
}

export default function ScienceQuizPage() {
  const [showFeedbackNudge, setShowFeedbackNudge] = useState(false);
  const [showWorksheetPrompt, setShowWorksheetPrompt] = useState(false);
  const [showRetryMessage, setShowRetryMessage] = useState(false);
  const [quizPassed, setQuizPassed] = useState<boolean | null>(null);
  useEffect(() => {
    try {
      localStorage.setItem("studiesmate_last_activity_v2", JSON.stringify({
        action: "Opened What is a Habitat? Quiz",
        href: "/subjects/science/chapters/science-intro/quiz",
        timestamp: new Date().toISOString(),
      }));
      localStorage.setItem("last_view_science", JSON.stringify({ section: "quiz", topicId: "habitats" }));
    } catch {}

    function handleMessage(e: MessageEvent) {
      if (e.data?.type === "quizComplete" && e.data?.quizId === "science-intro") {
        const score = typeof e.data?.score === "number" ? e.data.score : 100;
        console.log("[StudiesMate][SCIENCE QUIZ] raw e.data:", JSON.stringify(e.data));
        console.log("[StudiesMate][SCIENCE QUIZ] e.data.score raw value:", e.data?.score, "| typeof:", typeof e.data?.score);
        console.log("[StudiesMate][SCIENCE QUIZ] calculated score used for gate:", score, "| passes 60% check (score >= 60):", score >= 60);
        console.log("[StudiesMate][SCIENCE QUIZ] ⚠️ score defaulted to 100 because HTML did not send score field:", typeof e.data?.score !== "number");
        if (score >= 60) {
          try {
            const completions = JSON.parse(localStorage.getItem("studiesmate_quiz_completions") || "{}");
            completions["science-intro"] = true;
            localStorage.setItem("studiesmate_quiz_completions", JSON.stringify(completions));
            console.log("[StudiesMate] Science quiz passed — wrote studiesmate_quiz_completions:", JSON.stringify(completions));
            localStorage.setItem("studiesmate_last_activity_v2", JSON.stringify({
              action: "Completed What is a Habitat? Quiz",
              href: "/subjects/science/chapters/science-intro/quiz",
              timestamp: new Date().toISOString(),
            }));
          } catch {}
          try {
            if (!localStorage.getItem("first_quiz_completed")) {
              localStorage.setItem("first_quiz_completed", "true");
              setShowFeedbackNudge(true);
            }
          } catch {}
          confetti({ particleCount: 160, spread: 75, origin: { y: 0.6 } });
          setShowWorksheetPrompt(true);
          setShowRetryMessage(false);
          setQuizPassed(true);
          window.dispatchEvent(new CustomEvent("sm-quiz-update"));
          console.log("[StudiesMate] sm-quiz-update dispatched from Science quiz — DashboardLayout should reload quizCompletions now");
          sendQuizNotification("science-intro");
        } else {
          setShowWorksheetPrompt(false);
          setShowRetryMessage(true);
          setQuizPassed(false);
        }
      }
    }

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  return (
    <DashboardLayout selectedSubject="science" onSubjectChange={() => {}}>
      <main className="min-h-screen bg-[#F9FAFB] text-[#0F172A] pb-20 md:pb-16">
        <div className="mx-auto max-w-4xl px-6 py-10">
          <h1 className="mt-6 text-3xl font-semibold tracking-tight">Science • What is a Habitat? Quiz</h1>
          <p className="mt-2 text-sm text-[#475569]">Test your understanding of habitats.</p>
          <div className="mt-8">
            <iframe
              src="/StudiesMate_Quiz_WhatIsAHabitat.html"
              width="100%"
              height="700px"
              style={{ border: "none", borderRadius: "12px" }}
              title="What is a Habitat? Quiz"
            />
            {showWorksheetPrompt && (
              <div className="mt-4 rounded-xl border border-[#E5E7EB] bg-white p-5">
                <p className="text-sm font-semibold text-[#111827] mb-1">Well done!</p>
                <p className="text-sm text-[#6B7280] mb-4">Practice makes perfect. Head to your worksheet to master this topic.</p>
                <Link
                  href="/subjects/science/chapters/science-intro?view=worksheet"
                  className="inline-flex items-center gap-2 rounded-xl bg-[#22C55E] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#16A34A] transition-colors"
                >
                  Go to Worksheet →
                </Link>
              </div>
            )}
            {showRetryMessage && (
              <div className="mt-4 rounded-xl border border-[#FEF3C7] bg-[#FFFBEB] p-5">
                <p className="text-sm font-semibold text-[#92400E] mb-1">Keep going!</p>
                <p className="text-sm text-[#6B7280]">You need 60% to unlock the next topic. Review the material and try again!</p>
              </div>
            )}
            {quizPassed === true && (
              <>
                <div className="mt-4 rounded-xl border border-[#D1FAE5] bg-[#F0FDF4] p-5">
                  <p className="text-xs font-bold text-[#16A34A] uppercase tracking-wide mb-2">Key Takeaway</p>
                  <p className="text-sm text-[#374151] leading-relaxed">A habitat is the natural home of a living thing. Every habitat must provide food, water, air, and shelter. Different animals are specially adapted to survive in their specific habitats.</p>
                </div>
                <div className="mt-4 rounded-xl border border-[#E5E7EB] bg-white p-5">
                  <p className="text-sm font-bold text-[#111827] mb-1">Next topic unlocked!</p>
                  <p className="text-sm text-[#6B7280] mb-4">You have unlocked Food Chains. Continue your learning with the next lesson.</p>
                  <Link href="/subjects/science/chapters/food-chains" className="inline-flex items-center gap-2 rounded-xl bg-[#22C55E] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#16A34A] transition-colors">Next Lesson →</Link>
                </div>
              </>
            )}
            {quizPassed === false && (
              <div className="mt-4">
                <Link
                  href="/subjects/science/chapters/science-intro"
                  className="inline-flex items-center gap-2 rounded-xl border border-[#E5E7EB] bg-white px-4 py-2.5 text-sm font-semibold text-[#374151] hover:bg-[#F9FAFB] transition-colors"
                >
                  ← Watch Lesson Again
                </Link>
              </div>
            )}
            {showFeedbackNudge && (
              <div className="mt-4 flex items-center justify-between gap-4 rounded-xl border border-[#DCFCE7] bg-[#F0FDF4] px-4 py-3">
                <p className="text-sm text-[#16A34A] font-medium">Enjoying StudiesMate? Leave us a quick review →</p>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Link href="/feedback" className="rounded-lg bg-[#22C55E] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#16A34A] transition-colors">Leave review</Link>
                  <button type="button" onClick={() => setShowFeedbackNudge(false)} className="text-[#6B7280] hover:text-[#374151] text-lg leading-none">×</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </DashboardLayout>
  );
}
