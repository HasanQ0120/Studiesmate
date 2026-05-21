"use client";

import BackButton from "@/components/BackButton";
import DashboardLayout from "@/components/DashboardLayout";
import { useEffect } from "react";

export default function EnglishQuizPage() {
  useEffect(() => {
    try {
      localStorage.setItem("studiesmate_last_activity_v2", JSON.stringify({
        action: "Opened Simple Sentences Quiz",
        href: "/subjects/english/chapters/english-intro/quiz",
        timestamp: new Date().toISOString(),
      }));
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
      <main className="min-h-screen bg-white text-[#0F172A]">
        <div className="mx-auto max-w-4xl px-6 py-10">
          <BackButton href="/dashboard" label="Back to Dashboard" />
          <h1 className="mt-6 text-3xl font-semibold tracking-tight">English • Simple Sentences Quiz</h1>
          <div className="mt-8">
            <iframe
              src="/StudiesMate_Quiz_SimpleSentences.html"
              width="100%"
              height="700px"
              style={{ border: "none", borderRadius: "12px" }}
              title="Simple Sentences Quiz"
            />
          </div>
        </div>
      </main>
    </DashboardLayout>
  );
}
