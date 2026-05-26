"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import BackButton from "@/components/BackButton";
import DashboardLayout from "@/components/DashboardLayout";

const CHAPTER_QUIZ_IFRAMES: Record<string, { src: string; title: string }> = {
  "numbers": {
    src: "/StudiesMate_Quiz_PlaceValue.html",
    title: "Place Value Quiz",
  },
  "addition-subtraction": {
    src: "/StudiesMate_Quiz_3Forms.html",
    title: "3 Forms of Numbers Quiz",
  },
};

const CHAPTER_META: Record<string, { title: string }> = {
  numbers: { title: "Numbers & Place Value" },
  "addition-subtraction": { title: "Reading & Writing Whole Numbers" },
};

export default function QuizPage() {
  const params = useParams<{ chapterId: string }>();
  const chapterId = params.chapterId;
  const meta = CHAPTER_META[chapterId] ?? { title: "Quiz" };
  const quiz = CHAPTER_QUIZ_IFRAMES[chapterId];

  useEffect(() => {
    try {
      localStorage.setItem("studiesmate_last_activity_v2", JSON.stringify({
        action: "Opened Numbers & Place Value Quiz",
        href: `/subjects/maths/chapters/${chapterId}/quiz`,
        timestamp: new Date().toISOString(),
      }));
    } catch {}
  }, [chapterId]);

  useEffect(() => {
    function handleMessage(e: MessageEvent) {
      if (e.data?.type === "quizComplete" && e.data?.quizId === "math-npv") {
        try {
          const completions = JSON.parse(localStorage.getItem("studiesmate_quiz_completions") || "{}");
          completions["math-npv"] = true;
          localStorage.setItem("studiesmate_quiz_completions", JSON.stringify(completions));
          localStorage.setItem("studiesmate_last_activity_v2", JSON.stringify({
            action: "Completed Numbers & Place Value Quiz",
            href: `/subjects/maths/chapters/${chapterId}/quiz`,
            timestamp: new Date().toISOString(),
          }));
        } catch {}
      }
    }
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  return (
    <DashboardLayout>
      <main className="min-h-screen bg-white text-[#0F172A] pb-20 md:pb-16">
        <div className="mx-auto max-w-4xl px-6 py-10">
          <BackButton href="/dashboard" label="Back to Dashboard" />
          <h1 className="mt-6 text-3xl font-semibold tracking-tight">
            Maths • {meta.title} — Quiz
          </h1>
          <p className="mt-2 text-sm text-[#475569]">Test your understanding with this quiz.</p>
          <div className="mt-8">
            {quiz ? (
              <iframe
                src={quiz.src}
                width="100%"
                height="700px"
                style={{ border: "none", borderRadius: "12px" }}
                title={quiz.title}
              />
            ) : (
              <div className="rounded-2xl border border-[#E2E8F0] bg-white p-6">
                <p className="text-sm text-[#475569]">Quiz coming soon.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </DashboardLayout>
  );
}
