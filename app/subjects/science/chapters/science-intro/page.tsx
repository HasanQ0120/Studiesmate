"use client";

import BackButton from "@/components/BackButton";
import DashboardLayout from "@/components/DashboardLayout";
import { useEffect, useRef, useState } from "react";

const CHAPTER_META = { title: "What is a Habitat?", desc: "Exploring what habitats are and how animals live in them." };
const VIDEO_IDS = {
  en: "https://studiesmate.b-cdn.net/StudiesMate_Habitats_Grade4_v2.pptx.mp4",
  ur: "https://studiesmate.b-cdn.net/Copy%20of%20StudiesMate_Habitats_Grade4_v2.pptx.mp4",
};
const CHAPTER_ID = "science-intro";

export default function ScienceLessonPage() {
  const [lang, setLang] = useState<"en" | "ur">("en");
  const videoEnRef = useRef<HTMLVideoElement>(null);
  const videoUrRef = useRef<HTMLVideoElement>(null);
  const [lessonCompletions, setLessonCompletions] = useState<Record<string, string>>({});
  const [transcriptOpen, setTranscriptOpen] = useState(false);

  useEffect(() => {
    try {
      const completions = JSON.parse(localStorage.getItem("studiesmate_lesson_completions") || "{}");
      setLessonCompletions(completions);
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("studiesmate_last_activity_v2", JSON.stringify({
        action: "Opened What is a Habitat? lesson",
        href: "/subjects/science/chapters/science-intro",
        timestamp: new Date().toISOString(),
      }));
    } catch {}
  }, []);

  function handleLangSwitch(newLang: "en" | "ur") {
    if (newLang === lang) return;
    const currentVideo = lang === "en" ? videoEnRef.current : videoUrRef.current;
    const nextVideo = newLang === "en" ? videoEnRef.current : videoUrRef.current;
    if (currentVideo && nextVideo) {
      const currentTime = currentVideo.currentTime;
      currentVideo.pause();
      nextVideo.currentTime = currentTime;
      setLang(newLang);
      nextVideo.play().catch(() => {});
    } else {
      setLang(newLang);
    }
  }

  function markComplete() {
    try {
      const completions = JSON.parse(localStorage.getItem("studiesmate_lesson_completions") || "{}");
      completions[CHAPTER_ID] = new Date().toISOString();
      localStorage.setItem("studiesmate_lesson_completions", JSON.stringify(completions));
      localStorage.setItem("studiesmate_last_activity_v2", JSON.stringify({
        action: `Completed ${CHAPTER_META.title} lesson`,
        href: "/subjects/science/chapters/science-intro",
        timestamp: new Date().toISOString(),
      }));
      setLessonCompletions(completions);
    } catch {}
  }

  return (
    <DashboardLayout>
      <main className="min-h-screen bg-white text-[#0F172A] pb-20 md:pb-16">
        <div className="mx-auto max-w-4xl px-6 py-10">
          <BackButton href="/dashboard" label="Back to Dashboard" />
          <h1 className="mt-6 text-3xl font-semibold tracking-tight">Science • {CHAPTER_META.title}</h1>
          <p className="mt-2 text-sm text-[#475569]">{CHAPTER_META.desc}</p>
          <div className="mt-10">
            <div className="aspect-video w-full overflow-hidden rounded-2xl border border-[#E2E8F0] bg-black relative">
              <video
                ref={videoEnRef}
                src={VIDEO_IDS.en}
                controls
                className="h-full w-full"
                style={{ display: lang === "en" ? "block" : "none" }}
              />
              <video
                ref={videoUrRef}
                src={VIDEO_IDS.ur}
                controls
                className="h-full w-full"
                style={{ display: lang === "ur" ? "block" : "none" }}
              />
            </div>
            <div className="mt-3 flex w-fit items-center gap-1 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-1">
              <button type="button" onClick={() => handleLangSwitch("en")} className={`rounded-lg px-4 py-2 text-sm font-semibold transition-all duration-150 ${lang === "en" ? "bg-[#0B2B5A] text-white shadow-sm" : "text-[#475569] hover:text-[#0F172A]"}`}>English</button>
              <button type="button" onClick={() => handleLangSwitch("ur")} className={`rounded-lg px-4 py-2 text-sm font-semibold transition-all duration-150 ${lang === "ur" ? "bg-[#0B2B5A] text-white shadow-sm" : "text-[#475569] hover:text-[#0F172A]"}`}>اردو (Urdu)</button>
            </div>
            {/* Transcript */}
            <div className="mt-6">
              <button
                type="button"
                onClick={() => setTranscriptOpen((v) => !v)}
                className="rounded-xl bg-[#0B2B5A] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#0A2550] transition-colors"
              >
                {transcriptOpen ? "Hide Transcript ▲" : "Read Transcript ▼"}
              </button>
              <div
                className="overflow-hidden transition-all duration-300 ease-in-out"
                style={{ maxHeight: transcriptOpen ? "2000px" : "0px" }}
              >
                <div className="mt-4 rounded-2xl border border-[#E2E8F0] bg-white p-6">
                  <p style={{ fontSize: "14px", lineHeight: "1.8", color: "#475569", whiteSpace: "pre-line" }}>
                    {`Welcome back to StudiesMate. Today we will learn about animal homes called habitats. Understanding habitats helps us see how animals survive in nature.

So what is a habitat? A habitat is the natural home of a living thing. It is the place where an animal or plant lives and grows in nature.

Every habitat must provide four basic needs — food for energy, water to drink, air to breathe, and shelter to stay safe. Without these, animals cannot survive.

There are many types of habitats. Deserts are hot and dry. The Arctic is freezing cold. Oceans are full of salt water. Forests are filled with trees.

Animals have special features to survive in their habitats. These are called adaptations. For example, camels have wide feet to walk on sand and they store fat. Polar bears have thick fur to stay warm.

Let's look at a common mistake. Remember, a habitat is a natural home. A dog's natural habitat is a field or forest — not a house made by humans. A habitat is found in nature.

Let's take a moment to think. Why does a cactus store water inside its stem? Pause the video and think about your answer. Because it lives in a dry desert where it rarely rains — storing water keeps it alive.

You are doing great work today. Let's remember — a habitat is a natural home that gives animals food, water, air, and shelter. Don't forget to download your StudiesMate worksheet. See you in the next video.`}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6">
              {lessonCompletions[CHAPTER_ID] ? (
                <div className="inline-flex items-center gap-2 rounded-xl bg-[#ECFDF5] border border-[#6EE7B7] px-4 py-2 text-sm font-semibold text-[#10B981]">✓ Lesson Completed</div>
              ) : (
                <button type="button" onClick={markComplete} className="inline-flex items-center gap-2 rounded-xl bg-[#F97316] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#EA580C] transition-colors shadow-sm">✓ Mark as Complete</button>
              )}
            </div>
          </div>
        </div>
      </main>
    </DashboardLayout>
  );
}
