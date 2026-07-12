"use client";

import DashboardLayout from "@/components/DashboardLayout";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";
import { FileText } from "lucide-react";
import { supabase } from "@/lib/auth";
import { updateStreak } from "@/lib/streak";
import confetti from "canvas-confetti";
import Link from "next/link";

const VIDEO_IDS = {
  en: "https://studiesmate.b-cdn.net/simple_sentences_english.mp4.mp4",
  ur: "https://studiesmate.b-cdn.net/simple_sentence_urdu.mp4.mp4",
};
const CHAPTER_ID = "english-intro";

const TRANSCRIPT = `Welcome back to StudiesMate, where English is fun. Today we will learn about simple sentences.

Hello, Grade 4. Every sentence is like a complete package. If it is missing a piece, it does not work. Today we will learn what makes a sentence complete.

Here is the rule. A complete simple sentence needs two things, a Subject and a Verb. If you have both, your sentence is complete.

First, the Subject. The subject tells us who or what the sentence is about. In this sentence, 'The dog' is the subject. It is who we are talking about.

Next, the Verb. The verb tells us the action. What does the subject do? In this sentence, 'barks' is the verb. It is the action.

Let's look at another example. 'The brave knight fights the dragon.' Who is this about? The knight. So 'knight' is our subject. What does he do? He fights. So 'fights' is our verb.

What happens if we miss a piece? 'Ran to the store.' This is incomplete. We do not know who ran. 'The fluffy cat.' This is also incomplete. We do not know what the cat did.

Now it is your turn. Find the missing verb for this subject. 'The little bird ___.' Pause the video and write your answer.

Did you get it? 'The little bird sings.' Sings is the verb.

Great work today. Remember, a simple sentence needs a Subject and a Verb. Download your StudiesMate worksheet to practise. See you in the next video.`;

const NOTES_UR: Array<{ type: "yellow" | "green"; heading: string; body: string }> = [
  {
    type: "yellow",
    heading: "🟡 Core Concept",
    body: "Sentence aik complete package ki tarah hota hai, agar koi piece missing ho to poori baat adhoori reh jati hai. Har complete sentence mein do zaroori parts hone chahiye: SUBJECT (sentence kis ke baare mein hai) aur VERB (subject kya action kar raha hai). Agar dono na hon to jo bhi hai woh sirf ek fragment hai, complete sentence nahi.",
  },
  {
    type: "green",
    heading: "🟢 How to Find the Subject",
    body: "Apne aap se poocho: 'Yeh sentence kis ke baare mein hai, ya kya cheez kar rahi hai?' Jo jawab aaye, wohi aapka subject hai.",
  },
  {
    type: "green",
    heading: "🟢 How to Find the Verb",
    body: "Apne aap se poocho: 'Kya action ho raha hai?' Jo jawab aaye, wohi aapka verb hai.",
  },
  {
    type: "yellow",
    heading: '🟡 Solved Example 1: "The teacher explains the lesson."',
    body: "Step 1: Yeh kis ke baare mein hai? Teacher → Subject: teacher. Step 2: Teacher kya karta hai? Explains → Verb: explains. Answer: Complete sentence hai, subject aur verb dono maujood hain",
  },
  {
    type: "yellow",
    heading: '🟡 Solved Example 2: "Birds fly south in winter."',
    body: "Step 1: Yeh kis ke baare mein hai? Birds → Subject: Birds. Step 2: Birds kya karte hain? Fly → Verb: fly. Answer: Complete sentence hai",
  },
  {
    type: "yellow",
    heading: '🟡 Solved Example 3: Kya yeh complete hai? "Ate the whole cake."',
    body: "Step 1: Cake kis ne khaya? Humein pata nahi! Answer: Adhoora hai, subject missing hai. Theek kiya hua version: 'She ate the whole cake.'",
  },
  {
    type: "yellow",
    heading: '🟡 Solved Example 4: Is sentence ko theek karo: "The clever fox."',
    body: "Step 1: Humein pata hai kaun (the clever fox) lekin fox ne kya kiya? Kuch nahi bataya gaya! Answer: Adhoora hai, verb missing hai. Theek kiya hua version: 'The clever fox ran.'",
  },
  {
    type: "green",
    heading: "🟢 Common Mistake to Avoid",
    body: "Students aksar sochte hain ke sentence sirf 'sunne mein complete' lagna chahiye, lekin asli test yeh hai ke dono cheezein check karo: SUBJECT aur VERB. Apna sentence parho aur poocho: Kya mujhe pata hai KAUN ya KYA, aur kya mujhe pata hai ACTION? Agar koi bhi jawab na ho to sentence ko theek karna zaroori hai.",
  },
];

function EnglishLessonPageInner() {
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
  const [view, setView] = useState<"lesson" | "quiz" | "worksheet">(
    searchParams.get("view") === "quiz" ? "quiz" :
    searchParams.get("view") === "worksheet" ? "worksheet" : "lesson"
  );

  const videoEnRef = useRef<HTMLVideoElement>(null);
  const videoUrRef = useRef<HTMLVideoElement>(null);

  // Sync view state when searchParams changes (sidebar navigation)
  useEffect(() => {
    const v = searchParams.get("view");
    setView(v === "quiz" ? "quiz" : v === "worksheet" ? "worksheet" : "lesson");
  }, [searchParams]);

  // Track last view for "Continue" resume on dashboard
  useEffect(() => {
    try {
      localStorage.setItem("last_view_english", JSON.stringify({ section: view, topicId: "simple-sentences" }));
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
        action: "Opened Simple Sentences lesson",
        href: "/subjects/english/chapters/english-intro",
        timestamp: new Date().toISOString(),
      }));
      localStorage.setItem("last_lesson_english", "Simple Sentences");
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
        setShowWorksheetPrompt(true);
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
        topic: "Simple Sentences",
        subject: "English",
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
        action: "Completed Simple Sentences lesson",
        href: "/subjects/english/chapters/english-intro",
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

  function unmarkComplete() {
    try {
      const completions = JSON.parse(localStorage.getItem("studiesmate_lesson_completions") || "{}");
      delete completions[CHAPTER_ID];
      localStorage.setItem("studiesmate_lesson_completions", JSON.stringify(completions));
      setLessonCompletions(completions);
    } catch {}
  }

  const isCompleted = !!lessonCompletions[CHAPTER_ID];

  return (
    <DashboardLayout selectedSubject="english" onSubjectChange={() => {}}>
      <div className="min-h-screen bg-[#F9FAFB] px-5 py-7 pb-20 md:pb-10">

        {/* Breadcrumb */}
        <p className="text-xs text-[#9CA3AF]">English › Simple Sentences</p>

        {/* Title */}
        <h1 className="mt-1.5 text-2xl font-bold text-[#111827]">Lesson 1: Simple Sentences</h1>

        {/* Two-column layout */}
        <div className="mt-6 grid gap-5 lg:grid-cols-[1fr_300px]">

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
                      controlsList="nodownload"
                      onLoadedMetadata={(e) => {
                        try {
                          const saved = localStorage.getItem(`video_progress_${CHAPTER_ID}_en`);
                          if (saved) e.currentTarget.currentTime = parseFloat(saved);
                        } catch {}
                      }}
                      className="absolute inset-0 h-full w-full"
                      style={{ display: lang === "en" ? "block" : "none" }}
                    />
                    <video
                      ref={videoUrRef}
                      src={VIDEO_IDS.ur}
                      controls
                      controlsList="nodownload"
                      onLoadedMetadata={(e) => {
                        try {
                          const saved = localStorage.getItem(`video_progress_${CHAPTER_ID}_ur`);
                          if (saved) e.currentTarget.currentTime = parseFloat(saved);
                        } catch {}
                      }}
                      className="absolute inset-0 h-full w-full"
                      style={{ display: lang === "ur" ? "block" : "none" }}
                    />
                  </div>
                  <div className="px-4 py-3">
                    <p className="text-sm font-bold text-white">Simple Sentences</p>
                    <p className="mt-0.5 text-xs text-[#9CA3AF]">English · Beta · 8:45</p>
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
                              <p style={{ fontSize: "14px", lineHeight: "1.7", color: "#44403C" }}>{"A sentence is like a complete package. If any piece is missing, the whole thing falls apart. Every complete sentence needs exactly two essential parts: a SUBJECT (who or what the sentence is about) and a VERB (the action that subject performs). Without both working together, what you have is just a fragment."}</p>
                            </div>
                            <div style={{ background: "#F0FDF4", borderLeft: "3px solid #22C55E", borderRadius: "8px", padding: "12px 14px" }}>
                              <p className="text-xs font-bold text-[#166534] mb-1">🟢 How to Find the Subject</p>
                              <p style={{ fontSize: "14px", lineHeight: "1.7", color: "#14532D" }}>{"Ask yourself: 'Who or what is doing something in this sentence?' That answer is your subject."}</p>
                            </div>
                            <div style={{ background: "#F0FDF4", borderLeft: "3px solid #22C55E", borderRadius: "8px", padding: "12px 14px" }}>
                              <p className="text-xs font-bold text-[#166534] mb-1">🟢 How to Find the Verb</p>
                              <p style={{ fontSize: "14px", lineHeight: "1.7", color: "#14532D" }}>{"Ask yourself: 'What action is happening?' That answer is your verb."}</p>
                            </div>
                            <div style={{ background: "#FEFCE8", borderLeft: "3px solid #EAB308", borderRadius: "8px", padding: "12px 14px" }}>
                              <p className="text-xs font-bold text-[#92400E] mb-1">{'🟡 Solved Example 1: "The teacher explains the lesson."'}</p>
                              <p style={{ fontSize: "14px", lineHeight: "1.7", color: "#44403C" }}>{"Step 1: Who is this about? The teacher → Subject: teacher. Step 2: What does the teacher do? Explains → Verb: explains. "}<strong>{"Answer: Complete sentence, has both subject and verb"}</strong></p>
                            </div>
                            <div style={{ background: "#FEFCE8", borderLeft: "3px solid #EAB308", borderRadius: "8px", padding: "12px 14px" }}>
                              <p className="text-xs font-bold text-[#92400E] mb-1">{'🟡 Solved Example 2: "Birds fly south in winter."'}</p>
                              <p style={{ fontSize: "14px", lineHeight: "1.7", color: "#44403C" }}>{"Step 1: Who is this about? Birds → Subject: Birds. Step 2: What do birds do? Fly → Verb: fly. "}<strong>{"Answer: Complete sentence"}</strong></p>
                            </div>
                            <div style={{ background: "#FEFCE8", borderLeft: "3px solid #EAB308", borderRadius: "8px", padding: "12px 14px" }}>
                              <p className="text-xs font-bold text-[#92400E] mb-1">{'🟡 Solved Example 3: Is this complete? "Ate the whole cake."'}</p>
                              <p style={{ fontSize: "14px", lineHeight: "1.7", color: "#44403C" }}>{"Step 1: Who ate the cake? We don't know! "}<strong>{"Answer: Incomplete, missing the subject."}</strong>{' Fixed version: "She ate the whole cake."'}</p>
                            </div>
                            <div style={{ background: "#FEFCE8", borderLeft: "3px solid #EAB308", borderRadius: "8px", padding: "12px 14px" }}>
                              <p className="text-xs font-bold text-[#92400E] mb-1">{'🟡 Solved Example 4: Fix this sentence: "The clever fox."'}</p>
                              <p style={{ fontSize: "14px", lineHeight: "1.7", color: "#44403C" }}>{"Step 1: We know who (the clever fox) but what did the fox do? Nothing is stated! "}<strong>{"Answer: Incomplete, missing the verb."}</strong>{' Fixed version: "The clever fox ran."'}</p>
                            </div>
                            <div style={{ background: "#F0FDF4", borderLeft: "3px solid #22C55E", borderRadius: "8px", padding: "12px 14px" }}>
                              <p className="text-xs font-bold text-[#166534] mb-1">🟢 Common Mistake to Avoid</p>
                              <p style={{ fontSize: "14px", lineHeight: "1.7", color: "#14532D" }}>{"Students often think a sentence just needs to 'sound complete', but the real test is checking for BOTH a subject and a verb specifically. Read your sentence and ask: Do I know WHO or WHAT, and do I know the ACTION? If either answer is no, the sentence needs fixing."}</p>
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
                    try { localStorage.setItem("last_selected_subject", "english"); } catch {}
                    router.push("/dashboard");
                  }}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#0B2B5A] px-4 py-2 text-sm font-semibold text-white hover:bg-[#0A2550] transition"
                >
                  <span className="text-base leading-none">←</span>
                  <span>Back to Dashboard</span>
                </button>
                <iframe
                  src="/StudiesMate_Quiz_SimpleSentences.html"
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
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => {
                    try { localStorage.setItem("last_selected_subject", "english"); } catch {}
                    router.push("/dashboard");
                  }}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#0B2B5A] px-4 py-2 text-sm font-semibold text-white hover:bg-[#0A2550] transition"
                >
                  <span className="text-base leading-none">←</span>
                  <span>Back to Dashboard</span>
                </button>
                <iframe
                  src="/worksheet_simple_sentence.pdf"
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
                <div className="flex flex-col gap-3">
                  <button
                    type="button"
                    onClick={unmarkComplete}
                    className="w-full rounded-full border border-[#6EE7B7] bg-[#ECFDF5] py-3 text-sm font-semibold text-[#10B981] hover:bg-[#D1FAE5] transition-colors"
                  >
                    ✓ Completed — Click to Undo
                  </button>
                  <Link
                    href="/subjects/english/chapters/english-intro?view=quiz"
                    className="flex items-center justify-center gap-1.5 w-full rounded-full bg-[#22C55E] py-3 text-sm font-semibold text-white hover:bg-[#16A34A] transition-colors"
                  >
                    Continue to Quiz →
                  </Link>
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
            </div>

          </div>

        </div>
      </div>
    </DashboardLayout>
  );
}

export default function EnglishLessonPage() {
  return (
    <Suspense fallback={null}>
      <EnglishLessonPageInner />
    </Suspense>
  );
}
