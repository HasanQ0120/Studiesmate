"use client";

import DashboardLayout from "@/components/DashboardLayout";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";
import { FileText } from "lucide-react";
import { supabase } from "@/lib/auth";
import { updateStreak } from "@/lib/streak";
import confetti from "canvas-confetti";
import Link from "next/link";

const VIDEO_PATHS = {
  en: "habitat_english.mp4.mp4",
  ur: "habitat_urdu.mp4.mp4",
};
const CHAPTER_ID = "science-intro";

const TRANSCRIPT = `Welcome back to StudiesMate. Today we will learn about animal homes called habitats. Understanding habitats helps us see how animals survive in nature.

So what is a habitat? A habitat is the natural home of a living thing. It is the place where an animal or plant lives and grows in nature.

Every habitat must provide four basic needs, food for energy, water to drink, air to breathe, and shelter to stay safe. Without these, animals cannot survive.

There are many types of habitats. Deserts are hot and dry. The Arctic is freezing cold. Oceans are full of salt water. Forests are filled with trees.

Animals have special features to survive in their habitats. These are called adaptations. For example, camels have wide feet to walk on sand and they store fat. Polar bears have thick fur to stay warm.

Let's look at a common mistake. Remember, a habitat is a natural home. A dog's natural habitat is a field or forest, not a house made by humans. A habitat is found in nature.

Let's take a moment to think. Why does a cactus store water inside its stem? Pause the video and think about your answer. Because it lives in a dry desert where it rarely rains, storing water keeps it alive.

You are doing great work today. Let's remember, a habitat is a natural home that gives animals food, water, air, and shelter. Don't forget to download your StudiesMate worksheet. See you in the next video.`;

const NOTES_UR: Array<{ type: "yellow" | "green"; heading: string; body: string }> = [
  {
    type: "yellow",
    heading: "🟡 Core Concept",
    body: "Habitat kisi living cheez ka natural ghar hota hai, woh jagah jahan koi jaanwar ya paudha nature mein rehta hai aur barhta hai. Har habitat ko chaar zaroori cheezein deni parti hain: energy ke liye khana, peene ke liye pani, saans lene ke liye hawa, aur mehfooz rehne ke liye panagah. In mein se koi bhi na ho to jaanwar aur paudhe zinda nahi reh sakte.",
  },
  {
    type: "green",
    heading: "🟢 Types of Habitats",
    body: "Deserts, garam aur khushk. Arctic, bohat sard. Oceans, namkeen paani se bhare huye. Forests, darakhton aur ghane paudhon se bhare huye.",
  },
  {
    type: "yellow",
    heading: "🟡 What Are Adaptations",
    body: "Jaanwar khaas features develop karte hain jinhe adaptations kehte hain, jo unhe apne habitat mein survive karne mein madad karte hain. Yeh features generations ke through develop hote hain taake woh environment ki zarooriyat ke mutabiq ho sakein.",
  },
  {
    type: "yellow",
    heading: "🟡 Solved Example 1: Penguin kahan rehta hai, aur woh kaunsa habitat hai?",
    body: "Step 1: Penguins bohat sard ilaqon mein paye jate hain. Answer: Penguins Arctic/Antarctic mein rehte hain, jo ek bohat sard habitat hai",
  },
  {
    type: "yellow",
    heading: "🟡 Solved Example 2: Sahi ya Ghalat — Fish tank machli ka natural habitat hai.",
    body: "Step 1: Kya fish tank nature mein paya jata hai, ya insaan ne banaya hai? Answer: Ghalat, fish tank insaan ka banaya hua hai. Machli ka asli natural habitat darya, jheel, ya samandar hai",
  },
  {
    type: "yellow",
    heading: "🟡 Solved Example 3: Cactus jaise desert plants ke moti stems kyun hote hain?",
    body: "Step 1: Sochein deserts mein kis cheez ki kami hoti hai, barish aur pani. Answer: Cactus apne moti stems mein pani store karta hai kyunke deserts mein kam hi barish hoti hai, aur yeh stored pani use zinda rakhta hai lambi khushk periods mein",
  },
  {
    type: "yellow",
    heading: "🟡 Solved Example 4: Ek adaptation batao jo machli ko pani ke andar survive karne mein madad karta hai.",
    body: "Step 1: Sochein machli ko kis cheez ki zarurat hai jo land animals se different hai. Answer: Gills, yeh machli ko pani mein se oxygen nikal kar saans lene mein madad karte hain, jabke insaan ko hawa mein saans lena parta hai",
  },
  {
    type: "green",
    heading: "🟢 Common Mistake to Avoid",
    body: "Students aksar 'habitat' ko sirf 'jahan jaanwar rakha jata hai' samajh lete hain, jaise zoo ka enclosure ya fish tank. Yaad rakhein: asli habitat hamesha NATURE mein paya jata hai, insaan ka banaya hua nahi, chahe insaan usi jaisi conditions banane ki koshish kare.",
  },
];

function ScienceLessonPageInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [lang, setLang] = useState<"en" | "ur">("en");
  const [lessonCompletions, setLessonCompletions] = useState<Record<string, string>>({});
  const [activeTab, setActiveTab] = useState<"notes" | "transcript" | "explain">("notes");
  const [notesLang, setNotesLang] = useState<"en" | "ur">("en");
  const [explanation, setExplanation] = useState("");
  const [isExplaining, setIsExplaining] = useState(false);
  const [creditsLeft, setCreditsLeft] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [tabVisible, setTabVisible] = useState(true);
  const [showWorksheetPrompt, setShowWorksheetPrompt] = useState(false);
  const [showRetryMessage, setShowRetryMessage] = useState(false);
  const [celebrationShown, setCelebrationShown] = useState(false);
  const [videoSrcs, setVideoSrcs] = useState<{ en: string; ur: string } | null>(null);
  const [videoError, setVideoError] = useState(false);
  const [videoRateLimited, setVideoRateLimited] = useState(false);
  const [view, setView] = useState<"lesson" | "quiz" | "worksheet">(
    searchParams.get("view") === "quiz" ? "quiz" :
    searchParams.get("view") === "worksheet" ? "worksheet" : "lesson"
  );

  const videoEnRef = useRef<HTMLVideoElement>(null);
  const videoUrRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    async function fetchVideoUrls() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) { setVideoError(true); return; }
        const headers = { Authorization: `Bearer ${session.access_token}` };
        const [enRes, urRes] = await Promise.all([
          fetch(`/api/video-url?path=${VIDEO_PATHS.en}`, { headers }),
          fetch(`/api/video-url?path=${VIDEO_PATHS.ur}`, { headers }),
        ]);
        if (!enRes.ok || !urRes.ok) {
          if (enRes.status === 429 || urRes.status === 429) { setVideoRateLimited(true); } else { setVideoError(true); }
          return;
        }
        const [enData, urData] = await Promise.all([enRes.json(), urRes.json()]);
        if (!enData.url || !urData.url) { setVideoError(true); return; }
        setVideoSrcs({ en: enData.url, ur: urData.url });
      } catch {
        setVideoError(true);
      }
    }
    fetchVideoUrls();
  }, []);

  // Sync view state when searchParams changes (sidebar navigation)
  useEffect(() => {
    const v = searchParams.get("view");
    setView(v === "quiz" ? "quiz" : v === "worksheet" ? "worksheet" : "lesson");
  }, [searchParams]);

  // Track last view for "Continue" resume on dashboard
  useEffect(() => {
    try {
      localStorage.setItem("last_view_science", JSON.stringify({ section: view, topicId: "habitats" }));
    } catch {}
  }, [view]);

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

  // Video timestamp persistence — save every 5s while playing, clear on end
  useEffect(() => {
    const activeRef = lang === "en" ? videoEnRef : videoUrRef;
    const video = activeRef.current;
    const key = `video_progress_${CHAPTER_ID}_${lang}`;
    if (!video) return;

    const intervalId = setInterval(() => {
      if (!video.paused && !video.ended && video.currentTime > 0) {
        try { localStorage.setItem(key, String(Math.floor(video.currentTime))); } catch {}
      }
    }, 5000);

    function handleEnded() {
      try { localStorage.removeItem(key); } catch {}
    }
    video.addEventListener("ended", handleEnded);

    return () => {
      clearInterval(intervalId);
      video.removeEventListener("ended", handleEnded);
    };
  }, [lang]);

  // Quiz completion detection
  useEffect(() => {
    function handleMessage(e: MessageEvent) {
      if (e.data?.type === "quizComplete") {
        const score = typeof e.data?.score === "number" ? e.data.score : 100;
        console.log("[StudiesMate][SCIENCE LESSON PAGE] quizComplete received — quizId:", e.data?.quizId, "score:", score);
        console.log("[StudiesMate][SCIENCE LESSON PAGE] studiesmate_quiz_completions BEFORE:", localStorage.getItem("studiesmate_quiz_completions"));
        console.log("[StudiesMate][SCIENCE LESSON PAGE] ⚠️ This handler does NOT write to quizCompletions — unlock will NOT happen from this path");
        if (score >= 60) {
          setShowWorksheetPrompt(true);
          setShowRetryMessage(false);
        } else {
          setShowRetryMessage(true);
          setShowWorksheetPrompt(false);
        }
        console.log("[StudiesMate][SCIENCE LESSON PAGE] studiesmate_quiz_completions AFTER:", localStorage.getItem("studiesmate_quiz_completions"));
        console.log("[StudiesMate][SCIENCE LESSON PAGE] Expected: {\"science-intro\":true} — Actual has it?", JSON.parse(localStorage.getItem("studiesmate_quiz_completions") || "{}")["science-intro"] === true);
      }
    }
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  function handleTabChange(tab: "notes" | "transcript" | "explain") {
    if (tab === activeTab) return;
    setTabVisible(false);
    setTimeout(() => { setActiveTab(tab); }, 150);
    setTimeout(() => { setTabVisible(true); }, 160);
  }

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
      headers: {
        "Content-Type": "application/json",
        ...(session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {}),
      },
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
      const isFirstEver = !localStorage.getItem("sm_first_lesson_completed");
      const completions = JSON.parse(localStorage.getItem("studiesmate_lesson_completions") || "{}");
      completions[CHAPTER_ID] = new Date().toISOString();
      localStorage.setItem("studiesmate_lesson_completions", JSON.stringify(completions));
      localStorage.setItem("studiesmate_last_activity_v2", JSON.stringify({
        action: "Completed What is a Habitat? lesson",
        href: "/subjects/science/chapters/science-intro",
        timestamp: new Date().toISOString(),
      }));
      setLessonCompletions(completions);
      if (isFirstEver) {
        localStorage.setItem("sm_first_lesson_completed", "true");
        confetti({ particleCount: 220, spread: 90, origin: { y: 0.6 } });
        setTimeout(() => confetti({ particleCount: 100, spread: 120, origin: { y: 0.5 }, angle: 60 }), 300);
        setTimeout(() => confetti({ particleCount: 100, spread: 120, origin: { y: 0.5 }, angle: 120 }), 500);
      }
    } catch {}
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user.id) updateStreak(session.user.id);
    });
  }

  function handleVideoProgress(e: React.SyntheticEvent<HTMLVideoElement>) {
    if (celebrationShown || isCompleted) return;
    const video = e.currentTarget;
    if (video.duration && video.currentTime / video.duration >= 0.8) {
      setCelebrationShown(true);
      markComplete();
    }
  }

  function handleRefreshPage() {
    const activeRef = lang === "en" ? videoEnRef : videoUrRef;
    const key = `video_progress_${CHAPTER_ID}_${lang}`;
    try {
      const t = activeRef.current?.currentTime;
      if (t && t > 0) localStorage.setItem(key, String(Math.floor(t)));
    } catch {}
    window.location.reload();
  }

  const isCompleted = !!lessonCompletions[CHAPTER_ID];

  return (
    <DashboardLayout selectedSubject="science" onSubjectChange={() => {}}>
      <div className="min-h-screen bg-[#F9FAFB] px-5 py-7 pb-20 md:pb-10">

        {/* Breadcrumb */}
        <p className="text-xs text-[#9CA3AF]">Science › Habitat</p>

        {/* Title */}
        <h1 className="mt-1.5 text-2xl font-bold text-[#111827]">Lesson 1: What is a Habitat?</h1>

        {/* Two-column layout */}
        <div className="mt-6 grid gap-5 lg:grid-cols-[1fr_300px]">

          {/* ── LEFT COLUMN ── */}
          <div className="flex flex-col gap-4">
            {view === "lesson" ? (
              <>
                {/* Video player */}
                <div className="overflow-hidden rounded-xl bg-[#0F172A]">
                  <div className="aspect-video relative">
                    {!videoSrcs && !videoError && !videoRateLimited && (
                      <div className="absolute inset-0 flex items-center justify-center bg-[#0F172A]">
                        <div className="h-8 w-8 animate-spin rounded-full border-4 border-white/30 border-t-white" />
                      </div>
                    )}
                    {videoRateLimited && (
                      <div className="absolute inset-0 flex items-center justify-center bg-[#0F172A] px-6">
                        <p className="text-center text-sm text-white/70">{"You've reached the video request limit. Please try again in 10 minutes."}</p>
                      </div>
                    )}
                    {videoError && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center gap-5 bg-[#0F172A] px-6">
                        <p className="text-center text-sm text-white/70">This video session has expired. Please refresh the page to continue watching.</p>
                        <button
                          type="button"
                          onClick={handleRefreshPage}
                          style={{ background: "#22C55E", color: "white", borderRadius: "9999px", padding: "12px 24px", fontWeight: 600, border: "none", cursor: "pointer", fontSize: "14px" }}
                          onMouseEnter={(e) => { e.currentTarget.style.background = "#16A34A"; }}
                          onMouseLeave={(e) => { e.currentTarget.style.background = "#22C55E"; }}
                        >
                          Refresh Page
                        </button>
                      </div>
                    )}
                    <video
                      ref={videoEnRef}
                      src={videoSrcs?.en ?? ""}
                      controls
                      controlsList="nodownload"
                      onEnded={markComplete}
                      onTimeUpdate={handleVideoProgress}
                      onError={() => { if (videoSrcs) setVideoError(true); }}
                      onLoadedMetadata={(e) => {
                        setVideoError(false);
                        try {
                          const saved = localStorage.getItem(`video_progress_${CHAPTER_ID}_en`);
                          if (saved) e.currentTarget.currentTime = parseFloat(saved);
                        } catch {}
                      }}
                      className="absolute inset-0 h-full w-full"
                      style={{ display: videoSrcs && !videoError && !videoRateLimited && lang === "en" ? "block" : "none" }}
                    />
                    <video
                      ref={videoUrRef}
                      src={videoSrcs?.ur ?? ""}
                      controls
                      controlsList="nodownload"
                      onEnded={markComplete}
                      onTimeUpdate={handleVideoProgress}
                      onError={() => { if (videoSrcs) setVideoError(true); }}
                      onLoadedMetadata={(e) => {
                        setVideoError(false);
                        try {
                          const saved = localStorage.getItem(`video_progress_${CHAPTER_ID}_ur`);
                          if (saved) e.currentTarget.currentTime = parseFloat(saved);
                        } catch {}
                      }}
                      className="absolute inset-0 h-full w-full"
                      style={{ display: videoSrcs && !videoError && !videoRateLimited && lang === "ur" ? "block" : "none" }}
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

                {/* Notes | Transcript | Explain Again tabs */}
                <div className="rounded-xl border border-[#E5E7EB] bg-white shadow-sm overflow-hidden">

                  {/* Tab bar */}
                  <div className="flex border-b border-[#E5E7EB]">
                    {(["notes", "transcript", "explain"] as const).map((tab) => (
                      <button
                        key={tab}
                        type="button"
                        onClick={() => handleTabChange(tab)}
                        className={`relative flex-1 py-3 text-sm font-semibold transition-colors ${
                          activeTab === tab ? "text-[#22C55E]" : "text-[#6B7280] hover:text-[#374151]"
                        }`}
                      >
                        {tab === "notes" ? "Notes" : tab === "transcript" ? "Transcript" : "Explain Again"}
                        {activeTab === tab && (
                          <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#22C55E]" />
                        )}
                      </button>
                    ))}
                  </div>

                  {/* Tab content */}
                  <div
                    className="p-4"
                    style={{
                      opacity: tabVisible ? 1 : 0,
                      transform: tabVisible ? "translateY(0)" : "translateY(8px)",
                      transition: "opacity 0.15s ease-out, transform 0.15s ease-out",
                    }}
                  >

                    {/* ── NOTES ── */}
                    {activeTab === "notes" && (
                      <>
                        <div className="flex items-center justify-between mb-4">
                          <p className="text-xs text-[#6B7280]">🟡 Most Important &nbsp;|&nbsp; 🟢 Good to Know</p>
                          <div className="flex overflow-hidden rounded-lg border border-[#E5E7EB]">
                            <button
                              type="button"
                              onClick={() => setNotesLang("en")}
                              className={`px-3 py-1 text-xs font-semibold transition-colors ${notesLang === "en" ? "bg-[#22C55E] text-white" : "text-[#9CA3AF] hover:text-[#374151]"}`}
                            >
                              English
                            </button>
                            <button
                              type="button"
                              onClick={() => setNotesLang("ur")}
                              className={`px-3 py-1 text-xs font-semibold transition-colors ${notesLang === "ur" ? "bg-[#22C55E] text-white" : "text-[#9CA3AF] hover:text-[#374151]"}`}
                            >
                              Roman Urdu
                            </button>
                          </div>
                        </div>

                        {notesLang === "en" ? (
                          <div className="flex flex-col gap-3">
                            <div style={{ background: "#FEFCE8", borderLeft: "3px solid #EAB308", borderRadius: "8px", padding: "12px 14px" }}>
                              <p className="text-xs font-bold text-[#92400E] mb-1">🟡 Core Concept</p>
                              <p style={{ fontSize: "14px", lineHeight: "1.7", color: "#44403C" }}>{"A habitat is the natural home of a living thing, the specific place in nature where an animal or plant lives and grows. Every habitat must provide four essential things: food for energy, water to drink, air to breathe, and shelter to stay safe. Without even one of these, animals and plants cannot survive."}</p>
                            </div>
                            <div style={{ background: "#F0FDF4", borderLeft: "3px solid #22C55E", borderRadius: "8px", padding: "12px 14px" }}>
                              <p className="text-xs font-bold text-[#166534] mb-1">🟢 Types of Habitats</p>
                              <p style={{ fontSize: "14px", lineHeight: "1.7", color: "#14532D" }}>{"Deserts, hot and dry. Arctic, freezing cold. Oceans, full of salt water. Forests, filled with trees and dense plant life."}</p>
                            </div>
                            <div style={{ background: "#FEFCE8", borderLeft: "3px solid #EAB308", borderRadius: "8px", padding: "12px 14px" }}>
                              <p className="text-xs font-bold text-[#92400E] mb-1">🟡 What Are Adaptations</p>
                              <p style={{ fontSize: "14px", lineHeight: "1.7", color: "#44403C" }}>{"Animals develop special features called adaptations that help them survive specifically in their habitat. These features develop over generations to match exactly what that environment demands."}</p>
                            </div>
                            <div style={{ background: "#FEFCE8", borderLeft: "3px solid #EAB308", borderRadius: "8px", padding: "12px 14px" }}>
                              <p className="text-xs font-bold text-[#92400E] mb-1">🟡 Solved Example 1: Where does a penguin live, and what habitat is that?</p>
                              <p style={{ fontSize: "14px", lineHeight: "1.7", color: "#44403C" }}>{"Step 1: Penguins are found in extremely cold regions. "}<strong>{"Answer: Penguins live in the Arctic/Antarctic, a freezing cold habitat"}</strong></p>
                            </div>
                            <div style={{ background: "#FEFCE8", borderLeft: "3px solid #EAB308", borderRadius: "8px", padding: "12px 14px" }}>
                              <p className="text-xs font-bold text-[#92400E] mb-1">{"🟡 Solved Example 2: True or False — A fish tank is a fish's natural habitat."}</p>
                              <p style={{ fontSize: "14px", lineHeight: "1.7", color: "#44403C" }}>{"Step 1: Is a fish tank found in nature, or made by humans? "}<strong>{"Answer: False, a fish tank is man-made."}</strong>{"  A fish's REAL natural habitat is a river, lake, or ocean"}</p>
                            </div>
                            <div style={{ background: "#FEFCE8", borderLeft: "3px solid #EAB308", borderRadius: "8px", padding: "12px 14px" }}>
                              <p className="text-xs font-bold text-[#92400E] mb-1">🟡 Solved Example 3: Why do desert plants like cacti have thick stems?</p>
                              <p style={{ fontSize: "14px", lineHeight: "1.7", color: "#44403C" }}>{"Step 1: Think about what deserts lack, rain and water. "}<strong>{"Answer: Cacti store water in their thick stems because deserts rarely get rain, and this stored water keeps them alive during long dry periods"}</strong></p>
                            </div>
                            <div style={{ background: "#FEFCE8", borderLeft: "3px solid #EAB308", borderRadius: "8px", padding: "12px 14px" }}>
                              <p className="text-xs font-bold text-[#92400E] mb-1">🟡 Solved Example 4: Name one adaptation that helps a fish survive underwater.</p>
                              <p style={{ fontSize: "14px", lineHeight: "1.7", color: "#44403C" }}>{"Step 1: Think about what fish need that's different from land animals. "}<strong>{"Answer: Gills, they allow fish to breathe underwater by extracting oxygen from water, unlike humans who need to breathe air"}</strong></p>
                            </div>
                            <div style={{ background: "#F0FDF4", borderLeft: "3px solid #22C55E", borderRadius: "8px", padding: "12px 14px" }}>
                              <p className="text-xs font-bold text-[#166534] mb-1">🟢 Common Mistake to Avoid</p>
                              <p style={{ fontSize: "14px", lineHeight: "1.7", color: "#14532D" }}>{"Students often confuse 'habitat' with just 'where an animal is kept', like a zoo enclosure or fish tank. Remember: a TRUE habitat is always found in NATURE, not created by humans, even if humans try to recreate similar conditions."}</p>
                            </div>
                          </div>
                        ) : (
                          <div className="flex flex-col gap-3">
                            {NOTES_UR.map((note, i) => (
                              <div
                                key={i}
                                style={{
                                  background: note.type === "yellow" ? "#FEFCE8" : "#F0FDF4",
                                  borderLeft: `3px solid ${note.type === "yellow" ? "#EAB308" : "#22C55E"}`,
                                  borderRadius: "8px",
                                  padding: "12px 14px",
                                }}
                              >
                                <p className={`text-xs font-bold mb-1 ${note.type === "yellow" ? "text-[#92400E]" : "text-[#166534]"}`}>
                                  {note.heading}
                                </p>
                                <p style={{ fontSize: "14px", lineHeight: "1.7", color: note.type === "yellow" ? "#44403C" : "#14532D" }}>
                                  {note.body}
                                </p>
                              </div>
                            ))}
                          </div>
                        )}
                      </>
                    )}

                    {/* ── TRANSCRIPT ── */}
                    {activeTab === "transcript" && (
                      <p style={{ fontSize: "14px", lineHeight: "1.8", color: "#475569", whiteSpace: "pre-line" }}>
                        {TRANSCRIPT}
                      </p>
                    )}

                    {/* ── EXPLAIN AGAIN ── */}
                    {activeTab === "explain" && (
                      <div className="flex flex-col gap-4">
                        <div className="flex items-center justify-between">
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
                        {showExplanation && (
                          <div className="rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] p-4">
                            {explanation === "no_credits" ? (
                              <div>
                                <p className="text-sm text-[#6B7280]">You&apos;ve used all your Explain Again credits. Grade 4 is launching soon. Purchase it to get 25 credits every day.</p>
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
                      </div>
                    )}

                  </div>
                </div>
              </>
            ) : view === "quiz" ? (
              <>
                <button
                  type="button"
                  onClick={() => {
                    try { localStorage.setItem("last_selected_subject", "science"); } catch {}
                    router.push("/dashboard");
                  }}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#0B2B5A] px-4 py-2 text-sm font-semibold text-white hover:bg-[#0A2550] transition"
                >
                  <span className="text-base leading-none">←</span>
                  <span>Back to Dashboard</span>
                </button>
                <iframe
                  src="/StudiesMate_Quiz_WhatIsAHabitat.html"
                  width="100%"
                  height={600}
                  style={{ border: "none", borderRadius: "12px" }}
                  scrolling="auto"
                />
                {showWorksheetPrompt && (
                  <div className="rounded-xl border border-[#E5E7EB] bg-white p-5">
                    <p className="text-sm font-semibold text-[#111827] mb-1">Well done!</p>
                    <p className="text-sm text-[#6B7280] mb-4">Practice makes perfect. Head to your worksheet to master this topic.</p>
                    <button
                      type="button"
                      onClick={() => { setView("worksheet"); setShowWorksheetPrompt(false); }}
                      className="inline-flex items-center gap-2 rounded-xl bg-[#22C55E] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#16A34A] transition-colors"
                    >
                      Go to Worksheet →
                    </button>
                  </div>
                )}
                {showRetryMessage && (
                  <div className="rounded-xl border border-[#FEF3C7] bg-[#FFFBEB] p-5">
                    <p className="text-sm font-semibold text-[#92400E] mb-1">Keep going!</p>
                    <p className="text-sm text-[#6B7280]">You need 60% to unlock the next topic. Review the material and try again!</p>
                  </div>
                )}
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => {
                    try { localStorage.setItem("last_selected_subject", "science"); } catch {}
                    router.push("/dashboard");
                  }}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#0B2B5A] px-4 py-2 text-sm font-semibold text-white hover:bg-[#0A2550] transition"
                >
                  <span className="text-base leading-none">←</span>
                  <span>Back to Dashboard</span>
                </button>
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
          {view === "lesson" && (
            <div className="flex flex-col gap-4">

              {/* Quick Actions card */}
              <div className="rounded-xl border border-[#E5E7EB] bg-white shadow-sm p-5 premium-card-hover">
                <p className="text-sm font-bold text-[#111827] mb-4">Quick Actions</p>
                {isCompleted ? (
                  <div className="flex items-center justify-center gap-2 rounded-full bg-[#ECFDF5] border border-[#6EE7B7] px-3 py-2.5">
                    <span className="font-bold text-[#10B981]">✓</span>
                    <span className="text-sm font-semibold text-[#10B981]">Lesson completed</span>
                  </div>
                ) : (
                  <p className="text-sm text-[#9CA3AF] text-center py-2">Watch the full video to complete this lesson.</p>
                )}
              </div>

            </div>
          )}

        </div>
      </div>
    </DashboardLayout>
  );
}

export default function ScienceLessonPage() {
  return (
    <Suspense fallback={null}>
      <ScienceLessonPageInner />
    </Suspense>
  );
}
