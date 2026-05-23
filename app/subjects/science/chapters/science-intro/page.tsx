"use client";

import BackButton from "@/components/BackButton";
import DashboardLayout from "@/components/DashboardLayout";
import { useCallback, useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    YT: { Player: any };
    onYouTubeIframeAPIReady: () => void;
  }
}

const CHAPTER_META = { title: "What is a Habitat?", desc: "Exploring what habitats are and how animals live in them." };
const VIDEO_IDS = { en: "PLACEHOLDER_VIDEO_ID", ur: "PLACEHOLDER_VIDEO_ID" };
const CHAPTER_ID = "science-intro";

export default function ScienceLessonPage() {
  const [lang, setLang] = useState<"en" | "ur">("en");
  const langRef = useRef<"en" | "ur">("en");
  const playerRef = useRef<any>(null);
  const ytReadyRef = useRef(false);
  const [lessonCompletions, setLessonCompletions] = useState<Record<string, string>>({});

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

  const initPlayer = useCallback((startSeconds = 0) => {
    playerRef.current?.destroy?.();
    playerRef.current = new window.YT.Player("yt-player-science", {
      height: "100%",
      width: "100%",
      videoId: VIDEO_IDS[langRef.current],
      playerVars: { enablejsapi: 1, start: Math.floor(startSeconds), rel: 0, modestbranding: 1 },
      events: {
        onReady: (e: any) => { if (startSeconds > 0) e.target.seekTo(startSeconds, true); }
      },
    });
  }, []);

  useEffect(() => {
    const setup = () => { ytReadyRef.current = true; initPlayer(0); };
    if (window.YT?.Player) { setup(); }
    else {
      window.onYouTubeIframeAPIReady = setup;
      if (!document.querySelector('script[src*="youtube.com/iframe_api"]')) {
        const tag = document.createElement("script");
        tag.src = "https://www.youtube.com/iframe_api";
        document.head.appendChild(tag);
      }
    }
    return () => { playerRef.current?.destroy?.(); };
  }, [initPlayer]);

  function handleLangSwitch(newLang: "en" | "ur") {
    if (newLang === lang) return;
    const time: number = playerRef.current?.getCurrentTime?.() ?? 0;
    langRef.current = newLang;
    setLang(newLang);
    if (ytReadyRef.current) initPlayer(time);
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
      <main className="min-h-screen bg-white text-[#0F172A]">
        <div className="mx-auto max-w-4xl px-6 py-10">
          <BackButton href="/dashboard" label="Back to Dashboard" />
          <h1 className="mt-6 text-3xl font-semibold tracking-tight">Science • {CHAPTER_META.title}</h1>
          <p className="mt-2 text-sm text-[#475569]">{CHAPTER_META.desc}</p>
          <div className="mt-10">
            {VIDEO_IDS.en === "PLACEHOLDER_VIDEO_ID" ? (
              <div className="aspect-video w-full overflow-hidden rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] flex items-center justify-center">
                <div className="text-center">
                  <div className="text-4xl mb-3">🎬</div>
                  <p className="text-sm font-semibold text-[#475569]">Video coming soon</p>
                  <p className="text-xs text-[#94A3B8] mt-1">Check back after full launch</p>
                </div>
              </div>
            ) : (
              <div className="aspect-video w-full overflow-hidden rounded-2xl border border-[#E2E8F0] bg-black">
                <div id="yt-player-science" className="h-full w-full" />
              </div>
            )}
            <div className="mt-3 flex w-fit items-center gap-1 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-1">
              <button type="button" onClick={() => handleLangSwitch("en")} className={`rounded-lg px-4 py-2 text-sm font-semibold transition-all duration-150 ${lang === "en" ? "bg-[#0B2B5A] text-white shadow-sm" : "text-[#475569] hover:text-[#0F172A]"}`}>English</button>
              <button type="button" onClick={() => handleLangSwitch("ur")} className={`rounded-lg px-4 py-2 text-sm font-semibold transition-all duration-150 ${lang === "ur" ? "bg-[#0B2B5A] text-white shadow-sm" : "text-[#475569] hover:text-[#0F172A]"}`}>اردو (Urdu)</button>
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
