"use client";

import DashboardLayout from "@/components/DashboardLayout";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";
import { FileText, Download, HelpCircle, ChevronRight } from "lucide-react";
import { supabase } from "@/lib/auth";
import { updateStreak } from "@/lib/streak";
import PageFade from "@/components/PageFade";

const VIDEO_IDS = {
  en: "https://studiesmate.b-cdn.net/habitat_english.mp4.mp4",
  ur: "https://studiesmate.b-cdn.net/habitat_urdu.mp4.mp4",
};
const CHAPTER_ID = "science-intro";

const EXPLAIN = {
  en: "A habitat is simply the natural home where an animal lives. Just like you need a house, food, water, and air — animals need the same things from their habitat. A fish needs water, a camel needs a hot dry desert, and a polar bear needs icy cold land. Each animal is perfectly made for its own habitat!",
  ur: "Habitat صرف وہ قدرتی جگہ ہے جہاں کوئی جانور رہتا ہے۔ جیسے آپ کو گھر، کھانا، پانی، اور ہوا چاہیے — جانوروں کو بھی اپنے habitat سے یہی ضروریات ملتی ہیں۔ مچھلی کو پانی چاہیے، اونٹ کو گرم صحرا، اور polar bear کو برفیلی زمین چاہیے۔ ہر جانور اپنے habitat کے لیے بنا ہوا ہے۔",
};

const TRANSCRIPT = `Welcome back to StudiesMate. Today we will learn about animal homes called habitats. Understanding habitats helps us see how animals survive in nature.

So what is a habitat? A habitat is the natural home of a living thing. It is the place where an animal or plant lives and grows in nature.

Every habitat must provide four basic needs — food for energy, water to drink, air to breathe, and shelter to stay safe. Without these, animals cannot survive.

There are many types of habitats. Deserts are hot and dry. The Arctic is freezing cold. Oceans are full of salt water. Forests are filled with trees.

Animals have special features to survive in their habitats. These are called adaptations. For example, camels have wide feet to walk on sand and they store fat. Polar bears have thick fur to stay warm.

Let's look at a common mistake. Remember, a habitat is a natural home. A dog's natural habitat is a field or forest — not a house made by humans. A habitat is found in nature.

Let's take a moment to think. Why does a cactus store water inside its stem? Pause the video and think about your answer. Because it lives in a dry desert where it rarely rains — storing water keeps it alive.

You are doing great work today. Let's remember — a habitat is a natural home that gives animals food, water, air, and shelter. Don't forget to download your StudiesMate worksheet. See you in the next video.`;

const QUIZ_OPTIONS = [
  "A type of animal.",
  "The natural home of an animal.",
  "A kind of plant.",
  "A weather condition.",
];

function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-2 rounded-lg bg-[#0F172A] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#1E293B]"
    >
      ← Back to Lesson
    </button>
  );
}

function ScienceLessonPageInner() {
  const searchParams = useSearchParams();
  const [lang, setLang] = useState<"en" | "ur">("en");
  const [lessonCompletions, setLessonCompletions] = useState<Record<string, string>>({});
  const [transcriptOpen, setTranscriptOpen] = useState(false);
  const [explanation, setExplanation] = useState("");
  const [isExplaining, setIsExplaining] = useState(false);
  const [creditsLeft, setCreditsLeft] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [view, setView] = useState<"lesson" | "quiz" | "worksheet">(
    searchParams.get("view") === "quiz" ? "quiz" :
    searchParams.get("view") === "worksheet" ? "worksheet" : "lesson"
  );

  const videoEnRef = useRef<HTMLVideoElement>(null);
  const videoUrRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    try {
      setLessonCompletions(JSON.parse(localStorage.getItem("studiesmate_lesson_completions") || "{}"));
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("studiesmate_last_activity_v2", JSON.stringify({
        action: "Opened What is a Habitat? lesson",
        href: "/subjects/science/chapters/science-intro",
        timestamp: new Date().toISOString(),
      }));
      localStorage.setItem("last_lesson_science", "What is a Habitat?");
    } catch {}
  }, []);

  function handleLangSwitch(newLang: "en" | "ur") {
    if (newLang === lang) return;
    const activeRef = lang === "en" ? videoEnRef : videoUrRef;
    const nextRef = newLang === "en" ? videoEnRef : videoUrRef;
    const currentTime = activeRef.current?.currentTime ?? 0;
    activeRef.current?.pause();
    if (nextRef.current) {
      nextRef.current.currentTime = currentTime;
    }
    setLang(newLang);
    nextRef.current?.play().catch(() => {});
  }

  async function handleExplainAgain() {
    setIsExplaining(true);
    setShowExplanation(false);
    const { data: { session } } = await supabase.auth.getSession();
    const userId = session?.user?.id;
    const response = await fetch("/api/explain", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        topic: "What is a Habitat",
        subject: "Science",
        language: lang === "ur" ? "urdu" : "english",
        userId,
      }),
    });
    const data = await response.json();
    if (response.status === 403 && data.error === "no_credits") {
      setExplanation("no_credits");
    } else {
      setExplanation(data.explanation);
      setCreditsLeft(data.creditsLeft);
    }
    setIsExplaining(false);
    setShowExplanation(true);
  }

  function markComplete() {
    try {
      const completions = JSON.parse(localStorage.getItem("studiesmate_lesson_completions") || "{}");
      completions[CHAPTER_ID] = new Date().toISOString();
      localStorage.setItem("studiesmate_lesson_completions", JSON.stringify(completions));
      localStorage.setItem("studiesmate_last_activity_v2", JSON.stringify({
        action: "Completed What is a Habitat? lesson",
        href: "/subjects/science/chapters/science-intro",
        timestamp: new Date().toISOString(),
      }));
      setLessonCompletions(completions);
    } catch {}
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user.id) updateStreak(session.user.id);
    });
  }

  const isCompleted = !!lessonCompletions[CHAPTER_ID];

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-[#F9FAFB] px-5 py-7 pb-20 md:pb-10">

        {/* Breadcrumb */}
        <p className="text-xs text-[#9CA3AF]">Science › Habitat</p>

        {/* Title */}
        <h1 className="mt-1.5 text-2xl font-bold text-[#111827]">Lesson 1: What is a Habitat?</h1>

        {/* Two-column layout */}
        <div className="mt-6 grid gap-5 lg:grid-cols-[1fr_340px]">

          {/* ── LEFT COLUMN ── */}
          <div className="flex flex-col gap-4">
            {view === "lesson" ? (
              <>
                {/* Video player */}
                <div className="overflow-hidden rounded-xl bg-[#0F172A]">
                  <div className="aspect-video relative">
                    <video
                      ref={videoEnRef}
                      src={VIDEO_IDS.en}
                      controls
                      className="absolute inset-0 h-full w-full"
                      style={{ display: lang === "en" ? "block" : "none" }}
                    />
                    <video
                      ref={videoUrRef}
                      src={VIDEO_IDS.ur}
                      controls
                      className="absolute inset-0 h-full w-full"
                      style={{ display: lang === "ur" ? "block" : "none" }}
                    />
                  </div>
                  <div className="px-4 py-3">
                    <p className="text-sm font-bold text-white">What is a Habitat?</p>
                    <p className="mt-0.5 text-xs text-[#9CA3AF]">Science · Beta · 8:45</p>
                  </div>
                </div>

                {/* Bilingual Mode card */}
                <div className="flex items-center justify-between rounded-xl border border-[#F3F4F6] bg-white p-4 shadow-sm">
                  <div>
                    <p className="text-sm font-bold text-[#111827]">Bilingual Mode</p>
                    <p className="mt-0.5 text-xs text-[#6B7280]">Video continues from the same timestamp</p>
                  </div>
                  <div className="flex overflow-hidden rounded-lg border border-[#E5E7EB]">
                    <button
                      type="button"
                      onClick={() => handleLangSwitch("en")}
                      className={`px-3 py-1.5 text-xs font-semibold transition-colors ${lang === "en" ? "bg-[#22C55E] text-white" : "text-[#9CA3AF] hover:text-[#374151]"}`}
                    >
                      English
                    </button>
                    <button
                      type="button"
                      onClick={() => handleLangSwitch("ur")}
                      className={`px-3 py-1.5 text-xs font-semibold transition-colors ${lang === "ur" ? "bg-[#22C55E] text-white" : "text-[#9CA3AF] hover:text-[#374151]"}`}
                    >
                      اردو
                    </button>
                  </div>
                </div>

                {/* Explain Again card */}
                <div className="rounded-xl border border-[#F3F4F6] bg-white shadow-sm">
                  <div className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#F3F4F6]">
                        <FileText className="h-4 w-4 text-[#6B7280]" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-[#111827]">Explain Again</p>
                        <p className="mt-0.5 text-xs text-[#6B7280]">
                          Get a simple explanation in {lang === "en" ? "English" : "اردو"}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleExplainAgain}
                      disabled={isExplaining}
                      className="inline-flex items-center gap-1.5 rounded-full bg-[#22C55E] px-4 py-1.5 text-xs font-semibold text-white hover:bg-[#16A34A] transition-colors disabled:opacity-70"
                    >
                      {isExplaining ? (
                        <>
                          <span className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent" />
                          Explaining...
                        </>
                      ) : "Explain Again →"}
                    </button>
                  </div>
                </div>
                {showExplanation && (
                  <div className="rounded-xl border border-[#E5E7EB] bg-white p-4 mt-2">
                    {explanation === "no_credits" ? (
                      <div>
                        <p className="text-sm text-[#6B7280]">You&apos;ve used all your Explain Again credits. Grade 4 is launching soon — purchase it to get 25 credits every day.</p>
                        <a href="/phase-1" className="mt-3 inline-block rounded-full bg-[#22C55E] px-4 py-1.5 text-xs font-semibold text-white hover:bg-[#16A34A] transition-colors">Upgrade to Grade 4 →</a>
                      </div>
                    ) : (
                      <div>
                        <p style={{ fontSize: "15px", lineHeight: "1.6", color: "#111827" }}>{explanation}</p>
                        <p className="mt-2 text-xs text-[#9CA3AF]">Credits left: {creditsLeft}</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Transcript card */}
                <div className="rounded-xl border border-[#F3F4F6] bg-white shadow-sm">
                  <button
                    type="button"
                    onClick={() => setTranscriptOpen((v) => !v)}
                    className="flex w-full items-center gap-3 p-4"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#F3F4F6]">
                      <FileText className="h-4 w-4 text-[#6B7280]" />
                    </div>
                    <span className="flex-1 text-left text-sm font-bold text-[#111827]">Read Transcript</span>
                    <ChevronRight
                      className="h-4 w-4 text-[#9CA3AF] transition-transform duration-200"
                      style={{ transform: transcriptOpen ? "rotate(90deg)" : "rotate(0deg)" }}
                    />
                  </button>
                  <div
                    className="overflow-hidden transition-all duration-300"
                    style={{ maxHeight: transcriptOpen ? "2000px" : "0px" }}
                  >
                    <div className="border-t border-[#F3F4F6] px-4 pb-4 pt-3">
                      <p style={{ fontSize: "14px", lineHeight: "1.8", color: "#475569", whiteSpace: "pre-line" }}>
                        {TRANSCRIPT}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Mark as Complete */}
                {isCompleted ? (
                  <div className="flex items-center justify-center gap-2 rounded-full border border-[#6EE7B7] bg-[#ECFDF5] py-3 text-sm font-semibold text-[#10B981]">
                    ✓ Lesson Completed
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={markComplete}
                    className="w-full rounded-full bg-[#0F172A] py-3 text-sm font-semibold text-white hover:bg-[#1E293B] transition-colors"
                  >
                    ✓ Mark as Complete
                  </button>
                )}
              </>
            ) : view === "quiz" ? (
              <>
                <BackButton onClick={() => setView("lesson")} />
                <iframe
                  src="/StudiesMate_Quiz_WhatIsAHabitat.html"
                  width="100%"
                  height={600}
                  style={{ border: "none", borderRadius: "12px" }}
                  scrolling="auto"
                />
              </>
            ) : (
              <>
                <BackButton onClick={() => setView("lesson")} />
                <iframe
                  src="/worksheet_habitat.pdf"
                  width="100%"
                  height={700}
                  style={{ border: "none", borderRadius: "12px" }}
                />
              </>
            )}
          </div>

          {/* ── RIGHT COLUMN ── */}
          <div className="flex flex-col gap-4">

            {/* Quick Quiz card */}
            <div className="rounded-xl border border-[#F3F4F6] bg-white p-5 shadow-sm">
              <div className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5 text-[#22C55E]" />
                <h3 className="text-sm font-bold text-[#111827]">Quick Quiz</h3>
              </div>
              <p className="mt-1 text-xs text-[#6B7280]">Test your understanding of Habitats</p>

              <p className="mt-4 text-sm font-semibold text-[#111827]">What is a habitat?</p>
              <div className="mt-3 space-y-2">
                {QUIZ_OPTIONS.map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setSelectedOption(option)}
                    className={`w-full rounded-lg border px-3 py-2 text-left text-sm transition-colors ${
                      selectedOption === option
                        ? "border-[#22C55E] bg-[#F0FDF4] font-semibold text-[#16A34A]"
                        : "border-[#E5E7EB] bg-white text-[#374151] hover:border-[#D1D5DB]"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={() => setView("quiz")}
                className="mt-4 flex w-full items-center justify-center rounded-xl bg-[#22C55E] py-2.5 text-sm font-semibold text-white hover:bg-[#16A34A] transition-colors"
              >
                Start Full Quiz →
              </button>
            </div>

            {/* Worksheet card */}
            <div className="rounded-xl border border-[#F3F4F6] bg-white p-5 shadow-sm">
              <div className="flex items-center gap-2">
                <Download className="h-5 w-5 text-[#6B7280]" />
                <h3 className="text-sm font-bold text-[#111827]">Worksheet</h3>
              </div>
              <p className="mt-1 text-xs text-[#6B7280]">Print and practice Habitat exercises</p>
              <button
                type="button"
                onClick={() => setView("worksheet")}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-[#E5E7EB] bg-white py-2.5 text-sm font-semibold text-[#374151] hover:border-[#D1D5DB] transition-colors"
              >
                <Download className="h-4 w-4" />
                Download PDF
              </button>
            </div>
          </div>

        </div>
      </div>
    </DashboardLayout>
  );
}

export default function ScienceLessonPage() {
  return (
    <PageFade>
      <Suspense fallback={null}>
        <ScienceLessonPageInner />
      </Suspense>
    </PageFade>
  );
}
