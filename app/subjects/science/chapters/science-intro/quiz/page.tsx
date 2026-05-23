"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import BackButton from "@/components/BackButton";
import DashboardLayout from "@/components/DashboardLayout";

export default function ScienceQuizPage() {
  useEffect(() => {
    try {
      localStorage.setItem("studiesmate_last_activity_v2", JSON.stringify({
        action: "Opened What is a Habitat? Quiz",
        href: "/subjects/science/chapters/science-intro/quiz",
        timestamp: new Date().toISOString(),
      }));
    } catch {}

    function handleMessage(e: MessageEvent) {
      if (e.data?.type === "quizComplete" && e.data?.quizId === "science-intro") {
        try {
          const completions = JSON.parse(localStorage.getItem("studiesmate_quiz_completions") || "{}");
          completions["science-intro"] = true;
          localStorage.setItem("studiesmate_quiz_completions", JSON.stringify(completions));
          localStorage.setItem("studiesmate_last_activity_v2", JSON.stringify({
            action: "Completed What is a Habitat? Quiz",
            href: "/subjects/science/chapters/science-intro/quiz",
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
      <main className="min-h-screen bg-white text-[#0F172A] pb-20 md:pb-0">
        <div className="mx-auto max-w-4xl px-6 py-10">
          <BackButton href="/dashboard" label="Back to Dashboard" />
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
          </div>
        </div>
      </main>
    </DashboardLayout>
  );
}
