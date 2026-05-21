"use client";

import BackButton from "@/components/BackButton";
import DashboardLayout from "@/components/DashboardLayout";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    YT: { Player: any };
    onYouTubeIframeAPIReady: () => void;
  }
}

const SUBJECT_TITLE = "Maths";

// Placeholder video IDs — update Urdu ID when ready
const VIDEO_IDS: Record<string, { en: string; ur: string }> = {
  numbers:             { en: "PLACEHOLDER_VIDEO_ID", ur: "PLACEHOLDER_VIDEO_ID" },
  "addition-subtraction": { en: "PLACEHOLDER_VIDEO_ID", ur: "PLACEHOLDER_VIDEO_ID" },
};

const CHAPTER_META: Record<string, { title: string; desc: string }> = {
  numbers: { title: "Numbers & Place Value", desc: "Understanding numbers, counting, and place value." },
  "addition-subtraction": { title: "Reading & Writing Whole Numbers", desc: "Reading, writing and understanding whole numbers in standard and expanded form." },
  "multiplication-division": { title: "Multiplication & Division", desc: "Repeated addition, sharing, and grouping." },
  fractions: { title: "Fractions", desc: "Parts of a whole using simple visuals." },
  decimals: { title: "Decimals", desc: "Introduction to decimal numbers." },
  measurement: { title: "Measurement", desc: "Length, mass, and time basics." },
  geometry: { title: "Geometry", desc: "Shapes, angles, and spatial understanding." },
  "data-handling": { title: "Data Handling", desc: "Simple graphs, tables, and charts." },
  patterns: { title: "Patterns & Sequences", desc: "Finding patterns and logical sequences." },
  "word-problems": { title: "Word Problems", desc: "Applying maths to daily life situations." },
};

export default function ChapterPage() {
  const params = useParams<{ chapterId: string }>();
  const chapterId = params.chapterId;

  const meta = CHAPTER_META[chapterId] ?? {
    title: "Chapter",
    desc: "This chapter will be added soon.",
  };

  const [lessonCompletions, setLessonCompletions] = useState<Record<string, string>>({});

  useEffect(() => {
    try {
      const completions = JSON.parse(localStorage.getItem("studiesmate_lesson_completions") || "{}");
      setLessonCompletions(completions);
    } catch {}
  }, []);

  useEffect(() => {
    if (!CHAPTER_META[chapterId]) return;
    try {
      localStorage.setItem("studiesmate_last_activity_v2", JSON.stringify({
        action: `Opened ${CHAPTER_META[chapterId].title} lesson`,
        href: `/subjects/maths/chapters/${chapterId}`,
        timestamp: new Date().toISOString(),
      }));
    } catch {}
  }, [chapterId]);

  const [lang, setLang] = useState<"en" | "ur">("en");
  const langRef = useRef<"en" | "ur">("en");
  const playerRef = useRef<any>(null);
  const ytReadyRef = useRef(false);

  const videoIds = VIDEO_IDS[chapterId] ?? { en: "PLACEHOLDER_VIDEO_ID", ur: "PLACEHOLDER_VIDEO_ID" };

  const initPlayer = useCallback(
    (startSeconds = 0) => {
      playerRef.current?.destroy?.();
      playerRef.current = new window.YT.Player("yt-player", {
        height: "100%",
        width: "100%",
        videoId: videoIds[langRef.current],
        playerVars: {
          enablejsapi: 1,
          start: Math.floor(startSeconds),
          rel: 0,
          modestbranding: 1,
        },
        events: {
          onReady: (e: any) => {
            if (startSeconds > 0) e.target.seekTo(startSeconds, true);
          },
        },
      });
    },
    [videoIds]
  );

  useEffect(() => {
    const setup = () => {
      ytReadyRef.current = true;
      initPlayer(0);
    };

    if (window.YT?.Player) {
      setup();
    } else {
      window.onYouTubeIframeAPIReady = setup;
      if (!document.querySelector('script[src*="youtube.com/iframe_api"]')) {
        const tag = document.createElement("script");
        tag.src = "https://www.youtube.com/iframe_api";
        document.head.appendChild(tag);
      }
    }

    return () => {
      playerRef.current?.destroy?.();
    };
  }, [initPlayer]);

  function handleLangSwitch(newLang: "en" | "ur") {
    if (newLang === lang) return;
    const time: number = playerRef.current?.getCurrentTime?.() ?? 0;
    langRef.current = newLang;
    setLang(newLang);
    if (ytReadyRef.current) initPlayer(time);
  }

  return (
    <DashboardLayout>
    <main className="min-h-screen bg-white text-slate-900">
      <div className="mx-auto max-w-4xl px-6 py-10">
        <BackButton href="/dashboard" label="Back to Dashboard" />

        <h1 className="mt-6 text-3xl font-semibold tracking-tight">
          {SUBJECT_TITLE} • {meta.title}
        </h1>
        <p className="mt-2 text-sm text-slate-700">{meta.desc}</p>

        {/* Video player + bilingual slider */}
        <div className="mt-10">
          <div className="aspect-video w-full overflow-hidden rounded-2xl border border-slate-200 bg-black">
            <div id="yt-player" className="h-full w-full" />
          </div>

          {/* Bilingual slider */}
          <div className="mt-3 flex w-fit items-center gap-1 rounded-xl border border-slate-200 bg-slate-50 p-1">
            <button
              type="button"
              onClick={() => handleLangSwitch("en")}
              className={`rounded-lg px-4 py-2 text-sm font-semibold transition-all duration-150 ${
                lang === "en"
                  ? "bg-[#0B2B5A] text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              English
            </button>
            <button
              type="button"
              onClick={() => handleLangSwitch("ur")}
              className={`rounded-lg px-4 py-2 text-sm font-semibold transition-all duration-150 ${
                lang === "ur"
                  ? "bg-[#0B2B5A] text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              اردو (Urdu)
            </button>
          </div>
        </div>

        <div className="mt-6">
          {lessonCompletions[chapterId] ? (
            <div className="inline-flex items-center gap-2 rounded-xl bg-[#ECFDF5] border border-[#6EE7B7] px-4 py-2 text-sm font-semibold text-[#10B981]">
              ✓ Lesson Completed
            </div>
          ) : (
            <button
              type="button"
              onClick={() => {
                try {
                  const completions = JSON.parse(localStorage.getItem("studiesmate_lesson_completions") || "{}");
                  completions[chapterId] = new Date().toISOString();
                  localStorage.setItem("studiesmate_lesson_completions", JSON.stringify(completions));
                  localStorage.setItem("studiesmate_last_activity_v2", JSON.stringify({
                    action: `Completed ${CHAPTER_META[chapterId]?.title || chapterId} lesson`,
                    href: `/subjects/maths/chapters/${chapterId}`,
                    timestamp: new Date().toISOString(),
                  }));
                  setLessonCompletions(completions);
                } catch {}
              }}
              className="inline-flex items-center gap-2 rounded-xl bg-[#F97316] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#EA580C] transition-colors shadow-sm"
            >
              ✓ Mark as Complete
            </button>
          )}
        </div>
      </div>
    </main>
    </DashboardLayout>
  );
}
