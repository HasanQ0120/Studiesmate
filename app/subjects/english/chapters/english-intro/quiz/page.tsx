"use client";

import BackButton from "@/components/BackButton";
import DashboardLayout from "@/components/DashboardLayout";
import { useEffect, useState } from "react";
import confetti from "canvas-confetti";
import Link from "next/link";

export default function EnglishQuizPage() {
  const [showFeedbackNudge, setShowFeedbackNudge] = useState(false);
  useEffect(() => {
    try {
      localStorage.setItem("studiesmate_last_activity_v2", JSON.stringify({
        action: "Opened Simple Sentences Quiz",
        href: "/subjects/english/chapters/english-intro/quiz",
        timestamp: new Date().toISOString(),
      }));
      localStorage.setItem("last_view_english", JSON.stringify({ section: "quiz", topicId: "simple-sentences" }));
    } catch {}
  }, []);

  useEffect(() => {
    function handleMessage(e: MessageEvent) {
      if (e.data?.type === "quizComplete" && e.data?.quizId === "english-intro") {
        try {
          const completions = JSON.parse(localStorage.getItem("studiesmate_quiz_completions") || "{}");
          completions["english-intro"] = true;
          localStorage.setItem("studiesmate_quiz_completions", JSON.stringify(completions));
          localStorage.setItem("studiesmate_last_activity_v2", JSON.stringify({
            action: "Completed Simple Sentences Quiz",
            href: "/subjects/english/chapters/english-intro/quiz",
            timestamp: new Date().toISOString(),
          }));
        } catch {}
        try {
          if (!localStorage.getItem("first_quiz_completed")) {
            localStorage.setItem("first_quiz_completed", "true");
            setShowFeedbackNudge(true);
          }
        } catch {}
        const score = typeof e.data?.score === "number" ? e.data.score : 100;
        if (score >= 60) {
          confetti({ particleCount: 160, spread: 75, origin: { y: 0.6 } });
        }
      }
    }
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  return (
    <DashboardLayout selectedSubject="english" onSubjectChange={() => {}}>
      <main className="min-h-screen bg-white text-[#0F172A] pb-20 md:pb-16">
        <div className="mx-auto max-w-4xl px-6 py-10">
          <BackButton href="/dashboard" label="Back to Dashboard" />
          <h1 className="mt-6 text-3xl font-semibold tracking-tight">English • Simple Sentences Quiz</h1>
          <p className="mt-2 text-sm text-[#475569]">Test your understanding of simple sentences.</p>
          <div className="mt-8">
            <iframe
              src="/StudiesMate_Quiz_SimpleSentences.html"
              width="100%"
              height="700px"
              style={{ border: "none", borderRadius: "12px" }}
              title="Simple Sentences Quiz"
            />
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
