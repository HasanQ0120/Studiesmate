"use client";

import DashboardLayout from "@/components/DashboardLayout";
import { useParams, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";
import { FileText } from "lucide-react";
import { supabase } from "@/lib/auth";
import { updateStreak } from "@/lib/streak";
import confetti from "canvas-confetti";

import Link from "next/link";

const VIDEO_PATHS: Record<string, { en: string; ur: string }> = {
  numbers: {
    en: "place_value_english.mp4.mp4",
    ur: "place_value_urdu.mp4.mp4",
  },
};

const CHAPTER_META: Record<string, {
  title: string;
  quizSubtitle: string;
  quizQuestion: string;
  quizOptions: string[];
  worksheetSubtitle: string;
  explainEn: string;
  explainUr: string;
  transcript: string;
  notesUr: Array<{ type: "yellow" | "green"; heading: string; body: string }>;
}> = {
  numbers: {
    title: "Numbers & Place Value",
    quizSubtitle: "Test your understanding of Place Value",
    quizQuestion: "In the number 456, what is the value of 4?",
    quizOptions: ["4", "40", "400", "4000"],
    worksheetSubtitle: "Print and practice Place Value exercises",
    explainEn: "In any number, each digit has a position called its 'place'. This position tells you exactly how much that digit is worth. In 456: the '4' is in the hundreds place, so its value is 400. The '5' is in the tens place. Its value is 50. The '6' is in the ones place. Its value is 6. The further left a digit sits, the bigger its value!",
    explainUr: "کسی بھی نمبر میں، ہر ہندسے کی ایک جگہ ہوتی ہے جسے 'place' کہتے ہیں۔ یہ جگہ بتاتی ہے کہ اس ہندسے کی قدر کتنی ہے۔ 456 میں: '4' سیکڑوں کی جگہ پر ہے، اس لیے اس کی قدر 400 ہے۔ '5' دہائیوں میں ہے — اس کی قدر 50 ہے۔ '6' اکائیوں میں ہے — اس کی قدر 6 ہے۔ جتنا ہندسہ بائیں طرف ہو، اتنی زیادہ اس کی قدر ہے۔",
    transcript: `Welcome to StudiesMate. Let's learn math.

Hello, Grade 4. Today we will learn about place value and how to read larger numbers.

You already know the smaller places, ones, tens, hundreds, and thousands. In Grade 4, we use larger numbers. Let us look at the thousands family, thousands, ten thousands, and hundred thousands.

Let us review. In the number four thousand, three hundred twenty-one, the four is in the thousands place. The three is in the hundreds place. The two is in the tens place. And the one is in the ones place.

Now let us look at a larger number. Fifty-four thousand, three hundred twenty-one. What is the value of the five? Because it sits in the ten thousands place, its value is fifty thousand.

Let us go even larger. Two hundred fifty-four thousand, three hundred twenty-one. The two is in the hundred thousands place. Its value is two hundred thousand. Let us break down this whole number, two hundred thousand, plus fifty thousand, plus four thousand, plus three hundred, plus twenty, plus one.

Now it is your turn. Look at the number eighty-nine thousand and twelve. Pause the video and write down the value of the eight.

The eight is in the ten thousands place. So its value is eighty thousand. Well done.

Remember, where a digit sits gives it its value. Thank you for learning with StudiesMate. Please download the worksheet to practise. See you in the next video.`,
    notesUr: [
      {
        type: "yellow",
        heading: "🟡 Core Concept",
        body: "Place value Math ka aik bohat important concept hai. Iska matlab hai ke ek hi digit alag alag amount represent kar sakta hai, depend karta hai ke woh number mein kahan position par hai. Agar '5' ones ki jagah par ho to sirf 5 hota hai, lekin agar wohi '5' ten thousands ki jagah par ho to 50,000 ban jata hai! Isi liye place value samajhna Math ki har cheez ki foundation hai.",
      },
      {
        type: "green",
        heading: "🟢 The Place Value Chart",
        body: "Ones → Tens → Hundreds → Thousands → Ten Thousands → Hundred Thousands. Har step left ki taraf value ko 10 se multiply karta hai.",
      },
      {
        type: "yellow",
        heading: "🟡 Solved Example 1: 47,392 mein 7 ki value kya hai?",
        body: "Step 1: 7 ki position identify karo, right se count karo: 2(ones), 9(tens), 3(hundreds), 7(thousands). Step 2: 7 thousands ki jagah par hai. Answer: Iski value 7,000 hai",
      },
      {
        type: "yellow",
        heading: "🟡 Solved Example 2: 356,891 mein 3 ki value kya hai?",
        body: "Step 1: Right se positions count karo: 1,9,8,6,5,3. Step 2: 3 right se 6th digit hai, hundred thousands ki jagah. Answer: Iski value 300,000 hai",
      },
      {
        type: "yellow",
        heading: "🟡 Solved Example 3: 62,504 ko place values mein break karo",
        body: "Step 1: Har digit ko uski jagah ke sath likho: 6(ten thousands), 2(thousands), 5(hundreds), 0(tens), 4(ones). Step 2: Har digit ko uski place value se multiply karo: 60,000 + 2,000 + 500 + 0 + 4. Answer: 62,504 = 60,000 + 2,000 + 500 + 0 + 4",
      },
      {
        type: "yellow",
        heading: "🟡 Solved Example 4: Kaunsa number bara hai: 45,231 ya 45,321?",
        body: "Step 1: Dono numbers same digits se shuru hote hain, 4 aur 5, is liye next digit compare karo. Step 2: 45,231 mein hundreds digit 2 hai. 45,321 mein hundreds digit 3 hai. Step 3: Chunke 3, 2 se bara hai, doosra number bara hai. Answer: 45,321 bara hai",
      },
      {
        type: "green",
        heading: "🟢 Common Mistake to Avoid",
        body: "Bohat se students sochte hain ke jis number mein zyada digits hon woh hamesha bara hota hai. Yeh sach hai! Lekin jab do numbers mein same digits ki tadaad ho, to left se right digit by digit compare karna zaroori hai jab tak koi difference na mile.",
      },
    ],
  },
};

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

function ChapterPageInner() {
  const params = useParams<{ chapterId: string }>();
  const searchParams = useSearchParams();
  const chapterId = params.chapterId;
  const meta = CHAPTER_META[chapterId];
  const videoPaths = VIDEO_PATHS[chapterId] ?? { en: "", ur: "" };

  const [lang, setLang] = useState<"en" | "ur">("en");
  const [lessonCompletions, setLessonCompletions] = useState<Record<string, string>>({});
  const [activeTab, setActiveTab] = useState<"notes" | "transcript" | "explain">("notes");
  const [notesLang, setNotesLang] = useState<"en" | "ur">("en");
  const [explanation, setExplanation] = useState("");
  const [isExplaining, setIsExplaining] = useState(false);
  const [creditsLeft, setCreditsLeft] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [tabVisible, setTabVisible] = useState(true);
  const [view, setView] = useState<"lesson" | "quiz" | "worksheet">(
    searchParams.get("view") === "quiz" ? "quiz" :
    searchParams.get("view") === "worksheet" ? "worksheet" : "lesson"
  );
  const [celebrationShown, setCelebrationShown] = useState(false);
  const [videoSrcs, setVideoSrcs] = useState<{ en: string; ur: string } | null>(null);
  const [videoError, setVideoError] = useState(false);
  const [videoRateLimited, setVideoRateLimited] = useState(false);

  const videoEnRef = useRef<HTMLVideoElement>(null);
  const videoUrRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    async function fetchVideoUrls() {
      if (!videoPaths.en || !videoPaths.ur) return;
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) { setVideoError(true); return; }
        const headers = { Authorization: `Bearer ${session.access_token}` };
        const [enRes, urRes] = await Promise.all([
          fetch(`/api/video-url?path=${videoPaths.en}`, { headers }),
          fetch(`/api/video-url?path=${videoPaths.ur}`, { headers }),
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chapterId]);

  useEffect(() => {
    try {
      setLessonCompletions(JSON.parse(localStorage.getItem("studiesmate_lesson_completions") || "{}"));
    } catch {}
  }, []);

  useEffect(() => {
    if (!meta) return;
    try {
      localStorage.setItem("studiesmate_last_activity_v2", JSON.stringify({
        action: `Opened ${meta.title} lesson`,
        href: `/subjects/maths/chapters/${chapterId}`,
        timestamp: new Date().toISOString(),
      }));
      localStorage.setItem("last_lesson_math", meta.title);
      const CHAPTER_TO_TOPIC: Record<string, string> = { numbers: "intro-to-place-value", "addition-subtraction": "reading-writing-whole-numbers" };
      localStorage.setItem("last_view_mathematics", JSON.stringify({ section: "lesson", topicId: CHAPTER_TO_TOPIC[chapterId] || chapterId }));
    } catch {}
  }, [chapterId, meta]);

  // Video timestamp persistence — save every 5 s while playing, clear on end
  useEffect(() => {
    const activeRef = lang === "en" ? videoEnRef : videoUrRef;
    const video = activeRef.current;
    const key = `video_progress_${chapterId}_${lang}`;
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
  }, [chapterId, lang]);

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
        topic: meta.title,
        subject: "Mathematics",
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
      completions[chapterId] = new Date().toISOString();
      localStorage.setItem("studiesmate_lesson_completions", JSON.stringify(completions));
      localStorage.setItem("studiesmate_last_activity_v2", JSON.stringify({
        action: `Completed ${meta?.title || chapterId} lesson`,
        href: `/subjects/maths/chapters/${chapterId}`,
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
    const key = `video_progress_${chapterId}_${lang}`;
    try {
      const t = activeRef.current?.currentTime;
      if (t && t > 0) localStorage.setItem(key, String(Math.floor(t)));
    } catch {}
    window.location.reload();
  }

  if (!meta || !videoIds.en) {
    return (
      <DashboardLayout selectedSubject="mathematics" onSubjectChange={() => {}}>
        <div className="flex min-h-screen items-center justify-center bg-[#F9FAFB] text-center px-6">
          <div>
            <p className="text-lg font-bold text-[#111827]">This chapter is coming soon.</p>
            <p className="mt-2 text-sm text-[#6B7280]">Check back after Beta launches more content.</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const isCompleted = !!lessonCompletions[chapterId];

  return (
    <DashboardLayout selectedSubject="mathematics" onSubjectChange={() => {}}>
      <div className="min-h-screen bg-[#F9FAFB] px-5 py-7 pb-20 md:pb-10">

        {/* Breadcrumb */}
        <p className="text-xs text-[#9CA3AF]">Mathematics › {meta.title}</p>

        {/* Title */}
        <h1 className="mt-1.5 text-2xl font-bold text-[#111827]">Lesson 1: {meta.title}</h1>

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
                        <p className="text-center text-sm text-white/70">{"You've reached the video request limit for now. Please try again in a few minutes."}</p>
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
                      onError={() => setVideoError(true)}
                      onLoadedMetadata={(e) => {
                        setVideoError(false);
                        try {
                          const saved = localStorage.getItem(`video_progress_${chapterId}_en`);
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
                      onError={() => setVideoError(true)}
                      onLoadedMetadata={(e) => {
                        setVideoError(false);
                        try {
                          const saved = localStorage.getItem(`video_progress_${chapterId}_ur`);
                          if (saved) e.currentTarget.currentTime = parseFloat(saved);
                        } catch {}
                      }}
                      className="absolute inset-0 h-full w-full"
                      style={{ display: videoSrcs && !videoError && !videoRateLimited && lang === "ur" ? "block" : "none" }}
                    />
                  </div>
                  <div className="px-4 py-3">
                    <p className="text-sm font-bold text-white">{meta.title}</p>
                    <p className="mt-0.5 text-xs text-[#9CA3AF]">Mathematics · Beta · 8:45</p>
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
                              <p style={{ fontSize: "14px", lineHeight: "1.7", color: "#44403C" }}>{"Place value is one of the most important ideas in math. It means that the SAME digit can represent completely different amounts depending on WHERE it sits in a number. A '5' sitting in the ones place means just 5, but that same '5' sitting in the ten thousands place means 50,000! This is why understanding place value is the foundation for everything else in math."}</p>
                            </div>
                            <div style={{ background: "#F0FDF4", borderLeft: "3px solid #22C55E", borderRadius: "8px", padding: "12px 14px" }}>
                              <p className="text-xs font-bold text-[#166534] mb-1">🟢 The Place Value Chart</p>
                              <p style={{ fontSize: "14px", lineHeight: "1.7", color: "#14532D" }}>{"Ones → Tens → Hundreds → Thousands → Ten Thousands → Hundred Thousands. Each step to the left multiplies the value by 10."}</p>
                            </div>
                            <div style={{ background: "#FEFCE8", borderLeft: "3px solid #EAB308", borderRadius: "8px", padding: "12px 14px" }}>
                              <p className="text-xs font-bold text-[#92400E] mb-1">🟡 Solved Example 1: What is the value of 7 in 47,392?</p>
                              <p style={{ fontSize: "14px", lineHeight: "1.7", color: "#44403C" }}>{"Step 1: Identify the position of 7, count from the right: 2(ones), 9(tens), 3(hundreds), 7(thousands). Step 2: The 7 is in the thousands place. "}<strong>{"Answer: Its value is 7,000"}</strong></p>
                            </div>
                            <div style={{ background: "#FEFCE8", borderLeft: "3px solid #EAB308", borderRadius: "8px", padding: "12px 14px" }}>
                              <p className="text-xs font-bold text-[#92400E] mb-1">🟡 Solved Example 2: What is the value of 3 in 356,891?</p>
                              <p style={{ fontSize: "14px", lineHeight: "1.7", color: "#44403C" }}>{"Step 1: Count positions from the right: 1,9,8,6,5,3. Step 2: The 3 is the 6th digit from the right, in the hundred thousands place. "}<strong>{"Answer: Its value is 300,000"}</strong></p>
                            </div>
                            <div style={{ background: "#FEFCE8", borderLeft: "3px solid #EAB308", borderRadius: "8px", padding: "12px 14px" }}>
                              <p className="text-xs font-bold text-[#92400E] mb-1">🟡 Solved Example 3: Break down 62,504 into its place values</p>
                              <p style={{ fontSize: "14px", lineHeight: "1.7", color: "#44403C" }}>{"Step 1: Write each digit with its place: 6(ten thousands), 2(thousands), 5(hundreds), 0(tens), 4(ones). Step 2: Multiply each digit by its place value: 60,000 + 2,000 + 500 + 0 + 4. "}<strong>{"Answer: 62,504 = 60,000 + 2,000 + 500 + 0 + 4"}</strong></p>
                            </div>
                            <div style={{ background: "#FEFCE8", borderLeft: "3px solid #EAB308", borderRadius: "8px", padding: "12px 14px" }}>
                              <p className="text-xs font-bold text-[#92400E] mb-1">🟡 Solved Example 4: Which number is bigger: 45,231 or 45,321?</p>
                              <p style={{ fontSize: "14px", lineHeight: "1.7", color: "#44403C" }}>{"Step 1: Both numbers start with the same digits, 4 and 5, so compare the next digit. Step 2: In 45,231 the hundreds digit is 2. In 45,321 the hundreds digit is 3. Step 3: Since 3 is greater than 2, the second number is bigger. "}<strong>{"Answer: 45,321 is bigger"}</strong></p>
                            </div>
                            <div style={{ background: "#F0FDF4", borderLeft: "3px solid #22C55E", borderRadius: "8px", padding: "12px 14px" }}>
                              <p className="text-xs font-bold text-[#166534] mb-1">🟢 Common Mistake to Avoid</p>
                              <p style={{ fontSize: "14px", lineHeight: "1.7", color: "#14532D" }}>{"Many students think a number with MORE digits is always bigger. That's true! But when two numbers have the SAME number of digits, you must compare digit by digit from left to right until you find a difference."}</p>
                            </div>
                          </div>
                        ) : (
                          <div className="flex flex-col gap-3">
                            {meta.notesUr.map((note, i) => (
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
                        {meta.transcript}
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
                <BackButton onClick={() => setView("lesson")} />
                <iframe
                  src="/StudiesMate_Quiz_PlaceValue.html"
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
                  src="/worksheet_place_value.pdf"
                  width="100%"
                  height={700}
                  style={{ border: "none", borderRadius: "12px" }}
                />
              </>
            )}
          </div>

          {/* ── RIGHT COLUMN ── */}
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

        </div>
      </div>
    </DashboardLayout>
  );
}

export default function ChapterPage() {
  return (
    <Suspense fallback={null}>
      <ChapterPageInner />
    </Suspense>
  );
}
