"use client";

import BackButton from "@/components/BackButton";
import DashboardLayout from "@/components/DashboardLayout";
import { useEffect, useRef, useState } from "react";

const CHAPTER_META = { title: "Simple Sentences", desc: "Understanding subjects and verbs in simple sentences." };
const VIDEO_IDS = {
  en: "https://studiesmate.b-cdn.net/simple_sentence_english.mp4.mp4",
  ur: "https://studiesmate.b-cdn.net/Copy%20of%20StudiesMate_SimpleSentences_Grade4_v3.pptx.mp4",
};
const CHAPTER_ID = "english-intro";

export default function EnglishLessonPage() {
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
        action: "Opened Simple Sentences lesson",
        href: "/subjects/english/chapters/english-intro",
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
        href: "/subjects/english/chapters/english-intro",
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
          <h1 className="mt-6 text-3xl font-semibold tracking-tight">English • {CHAPTER_META.title}</h1>
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
                    {`Welcome back to StudiesMate, where English is fun. Today we will learn about simple sentences.

Hello, Grade 4. Every sentence is like a complete package. If it is missing a piece, it does not work. Today we will learn what makes a sentence complete.

Here is the rule. A complete simple sentence needs two things — a Subject and a Verb. If you have both, your sentence is complete.

First, the Subject. The subject tells us who or what the sentence is about. In this sentence, 'The dog' is the subject. It is who we are talking about.

Next, the Verb. The verb tells us the action. What does the subject do? In this sentence, 'barks' is the verb. It is the action.

Let's look at another example. 'The brave knight fights the dragon.' Who is this about? The knight. So 'knight' is our subject. What does he do? He fights. So 'fights' is our verb.

What happens if we miss a piece? 'Ran to the store.' This is incomplete. We do not know who ran. 'The fluffy cat.' This is also incomplete. We do not know what the cat did.

Now it is your turn. Find the missing verb for this subject. 'The little bird ___.' Pause the video and write your answer.

Did you get it? 'The little bird sings.' Sings is the verb.

Great work today. Remember — a simple sentence needs a Subject and a Verb. Download your StudiesMate worksheet to practise. See you in the next video.`}
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
