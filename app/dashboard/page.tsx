"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/DashboardLayout";
import PageFade from "@/components/PageFade";
import { supabase } from "@/lib/auth";

const QUIZ_COMPLETIONS_KEY = "studiesmate_quiz_completions";
const LESSON_COMPLETIONS_KEY = "studiesmate_lesson_completions";
const LAST_ACTIVITY_V2_KEY = "studiesmate_last_activity_v2";

function safeParseJSON<T>(raw: string | null, fallback: T): T {
  try {
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

type LastActivityData = { action: string; timestamp: string; href?: string };

const GRADES = ["Beta", "G1", "G2", "G3", "G4", "G5", "G6", "G7", "G8"];

export default function DashboardPage() {
  const router = useRouter();

  const [quizCompletions, setQuizCompletions] = useState<Record<string, boolean>>({});
  const [lessonCompletions, setLessonCompletions] = useState<Record<string, string>>({});
  const [lastActivityData, setLastActivityData] = useState<LastActivityData | null>(null);
  const [streak, setStreak] = useState(1);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [lastLessons, setLastLessons] = useState({ math: "", english: "", science: "" });

  const [explainCredits, setExplainCredits] = useState<number | null>(null);
  const [resetAt, setResetAt] = useState<string | null>(null);
  const [countdown, setCountdown] = useState("");

  const [showWelcome, setShowWelcome] = useState(false);
  const [welcomeName, setWelcomeName] = useState("");
  const [studentName, setStudentName] = useState("");

  // Connect code fetch + upsert (creates the code if none exists; displayed in sidebar)
  const [connectCode, setConnectCode] = useState<string>("");

  // ── Explain credits fetch ──
  useEffect(() => {
    const fetchCredits = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      const { data } = await supabase
        .from("profiles")
        .select("explain_credits, explain_credits_reset_at")
        .eq("id", session.user.id)
        .single();
      if (data) {
        setExplainCredits(data.explain_credits ?? 4);
        setResetAt(data.explain_credits_reset_at ?? null);
      }
    };
    fetchCredits();
  }, []);

  // ── Supabase streak fetch ──
  useEffect(() => {
    const fetchStreak = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      const { data } = await supabase
        .from("profiles")
        .select("current_streak")
        .eq("id", session.user.id)
        .single();
      if (data) setCurrentStreak(data.current_streak ?? 0);
    };
    fetchStreak();
  }, []);

  // ── Explain credits countdown ──
  useEffect(() => {
    if (!resetAt || explainCredits > 3) { setCountdown(""); return; }
    function calcCountdown() {
      const resetPlusThree = new Date(new Date(resetAt!).getTime() + 3 * 24 * 60 * 60 * 1000);
      const diffMs = resetPlusThree.getTime() - Date.now();
      if (diffMs <= 0) { setCountdown("Resetting soon..."); return; }
      const days = Math.floor(diffMs / (86400 * 1000));
      const hours = Math.floor((diffMs % (86400 * 1000)) / (3600 * 1000));
      const mins = Math.floor((diffMs % (3600 * 1000)) / (60 * 1000));
      setCountdown(`${days}d ${hours}h ${mins}m`);
    }
    calcCountdown();
    const id = setInterval(calcCountdown, 60000);
    return () => clearInterval(id);
  }, [resetAt, explainCredits]);

  // ── Welcome screen for new accounts ──
  useEffect(() => {
    function applyWelcome(session: { user: { user_metadata?: Record<string, unknown>; created_at?: string } } | null) {
      if (!session) return;
      if (localStorage.getItem("sm_welcomed")) return;
      const createdAt = session.user.created_at ? new Date(session.user.created_at).getTime() : 0;
      const ageMs = Date.now() - createdAt;
      if (ageMs < 5 * 60 * 1000) {
        const name = (session.user.user_metadata?.studentName as string | undefined)?.trim() || "Student";
        setWelcomeName(name);
        setShowWelcome(true);
      }
    }
    supabase.auth.getSession().then(({ data: { session } }) => applyWelcome(session));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => applyWelcome(session));
    return () => subscription.unsubscribe();
  }, []);

  // ── Auth redirect + name fetch ──
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) { router.push("/login"); return; }
      const name = ((data.user.user_metadata?.studentName as string | undefined) || "").trim();
      const firstName = name.split(" ")[0] || "";
      setStudentName(firstName || (data.user.email || "").split("@")[0] || "Student");
    });
  }, [router]);

  // ── Connect code fetch + upsert ──
  useEffect(() => {
    const fetchOrCreateCode = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      const { data } = await supabase
        .from("profiles")
        .select("connect_code")
        .eq("id", session.user.id)
        .maybeSingle();
      if (data?.connect_code) { setConnectCode(data.connect_code); return; }
      const newCode = "SM-" + Math.floor(1000 + Math.random() * 9000);
      const { error: insertError } = await supabase
        .from("profiles")
        .upsert({ id: session.user.id, connect_code: newCode }, { onConflict: "id", ignoreDuplicates: true });
      if (insertError === null) setConnectCode(newCode);
    };
    fetchOrCreateCode();
  }, []);

  // ── localStorage completions + streak + last lessons ──
  useEffect(() => {
    setQuizCompletions(safeParseJSON<Record<string, boolean>>(localStorage.getItem(QUIZ_COMPLETIONS_KEY), {}));
    setLessonCompletions(safeParseJSON<Record<string, string>>(localStorage.getItem(LESSON_COMPLETIONS_KEY), {}));
    setLastActivityData(safeParseJSON<LastActivityData | null>(localStorage.getItem(LAST_ACTIVITY_V2_KEY), null));

    // Streak
    try {
      const today = new Date().toISOString().split("T")[0];
      const lastLogin = localStorage.getItem("last_login_date");
      const stored = parseInt(localStorage.getItem("login_streak") || "1", 10);
      if (!lastLogin) {
        localStorage.setItem("last_login_date", today);
        localStorage.setItem("login_streak", "1");
        setStreak(1);
      } else if (lastLogin === today) {
        setStreak(stored);
      } else {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split("T")[0];
        if (lastLogin === yesterdayStr) {
          const next = stored + 1;
          localStorage.setItem("last_login_date", today);
          localStorage.setItem("login_streak", String(next));
          setStreak(next);
        } else {
          localStorage.setItem("last_login_date", today);
          localStorage.setItem("login_streak", "1");
          setStreak(1);
        }
      }
    } catch {}

    // Last lessons
    try {
      setLastLessons({
        math: localStorage.getItem("last_lesson_math") || "",
        english: localStorage.getItem("last_lesson_english") || "",
        science: localStorage.getItem("last_lesson_science") || "",
      });
    } catch {}

    const onStorage = (e: StorageEvent) => {
      if (e.key === QUIZ_COMPLETIONS_KEY) setQuizCompletions(safeParseJSON<Record<string, boolean>>(e.newValue, {}));
      if (e.key === LESSON_COMPLETIONS_KEY) setLessonCompletions(safeParseJSON<Record<string, string>>(e.newValue, {}));
      if (e.key === LAST_ACTIVITY_V2_KEY) setLastActivityData(safeParseJSON<LastActivityData | null>(e.newValue, null));
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // ── Welcome screen ──
  if (showWelcome) {
    return (
      <PageFade>
      <div className="flex min-h-screen w-full flex-col items-center justify-center bg-white px-6 text-center">
        <div className="w-full max-w-lg">
          <h1 className="text-4xl font-bold text-[#0B2B5A] md:text-5xl">Welcome, {welcomeName}! 👋</h1>
          <p className="mt-6 text-base leading-8 text-slate-700 md:text-lg">
            You have just joined the StudiesMate family. We are proud to have you here.
            Your learning journey starts today — one small step at a time.
          </p>
          <div className="mt-10 flex flex-col items-center gap-4">
            <button
              type="button"
              onClick={() => { localStorage.setItem("sm_welcomed", "true"); setShowWelcome(false); }}
              className="inline-flex items-center justify-center rounded-xl bg-[#0B2B5A] px-8 py-4 text-base font-semibold text-white transition-all duration-200 hover:bg-[#0A2550] hover:-translate-y-0.5"
            >
              Go to Dashboard →
            </button>
            <a
              href="https://chat.whatsapp.com/H8q5PBchpRNC4TWIeWp49I"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-xl border border-[#0B2B5A] px-8 py-4 text-base font-semibold text-[#0B2B5A] transition-all duration-200 hover:bg-slate-50 hover:-translate-y-0.5"
            >
              Join our WhatsApp Community →
            </a>
          </div>
        </div>
      </div>
      </PageFade>
    );
  }

  const mathStarted = !!lessonCompletions["numbers"];
  const mathQuizDone = !!quizCompletions["math-npv"];

  return (
    <PageFade>
    <DashboardLayout>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes blurIn {
          from { filter: blur(6px); opacity: 0; }
          to { filter: blur(0px); opacity: 1; }
        }
      `}</style>
      <div className="min-h-screen bg-[#F9FAFB] px-6 py-8 pb-24 md:pb-10" style={{ animation: "fadeIn 0.4s ease-out" }}>
        <div className="mx-auto max-w-5xl">

          {/* ── MOBILE HOME BUTTON ── */}
          <div className="md:hidden mb-4">
            <button
              type="button"
              onClick={() => router.push("/")}
              style={{ background: "none", border: "none", cursor: "pointer", padding: "4px", color: "#6B7280", display: "inline-flex", alignItems: "center" }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </button>
          </div>

          {/* ── GREETING ── */}
          <div className="mb-6">
            <div className="flex items-start justify-between gap-4">
              <h1 className="text-2xl font-bold text-[#111827] md:text-3xl" style={{ animation: "blurIn 0.5s ease-out" }}>
                Welcome back, {studentName || "Student"}! 👋
              </h1>
              <div className="flex-shrink-0 text-right">
                {explainCredits !== null && (
                  <>
                    <div style={{ background: "#F0FDF4", border: "1px solid #22C55E", borderRadius: "9999px", padding: "6px 14px", display: "inline-block" }}>
                      <span style={{ color: "#16A34A", fontSize: "13px", fontWeight: 500 }}>🧠 {explainCredits} credits left</span>
                    </div>
                    {explainCredits <= 3 && resetAt && countdown && (
                      <p className="mt-1 text-xs text-[#9CA3AF]">Resets in: {countdown}</p>
                    )}
                  </>
                )}
              </div>
            </div>
            {currentStreak > 0 ? (
              <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-[#FEF3C7] px-3 py-1 text-xs font-semibold text-[#92400E]">
                🔥 {currentStreak} Day Streak — keep it up!
              </div>
            ) : (
              <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-[#F3F4F6] px-3 py-1 text-xs font-semibold text-[#6B7280]">
                Start your streak today!
              </div>
            )}
          </div>

          {/* ── GRADE PROGRESS ── */}
          <div className="mb-6 rounded-2xl bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-base font-bold text-[#111827]">Grade Progress</h2>
              <Link href="/phase-1" className="text-xs font-semibold text-[#22C55E] hover:text-[#16A34A]">
                View all grades →
              </Link>
            </div>
            <div className="flex items-start justify-between">
              {GRADES.map((grade, i) => (
                <div key={grade} className="flex flex-col items-center gap-1.5">
                  <div
                    className={`h-4 w-4 rounded-full border-2 flex-shrink-0 ${
                      i === 0
                        ? "bg-[#22C55E] border-[#22C55E]"
                        : "bg-white border-[#D1D5DB]"
                    }`}
                  />
                  <span className={`text-[10px] font-medium whitespace-nowrap ${i === 0 ? "text-[#22C55E] font-semibold" : "text-[#9CA3AF]"}`}>
                    {grade}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* ── YOUR SUBJECTS ── */}
          <h2 className="mb-3 text-base font-bold text-[#111827]">Your Subjects</h2>
          <div className="mb-6 grid gap-4 md:grid-cols-3">

            {/* Mathematics */}
            <div className="rounded-2xl bg-[#F0FDF4] p-5">
              <div className="flex items-start justify-between mb-3">
                <span className="text-2xl">🧮</span>
                <span className="flex items-center gap-1 rounded-full bg-[#DCFCE7] px-2 py-0.5 text-[11px] font-semibold text-[#16A34A]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#22C55E]" />
                  Active
                </span>
              </div>
              <h3 className="text-sm font-bold text-[#111827]">Mathematics</h3>
              <p className="mt-3 text-xs text-[#6B7280]">Numbers &amp; Place Value · 1 lesson in Beta</p>
              {lastLessons.math && (
                <p className="mt-1 text-xs text-[#16A34A] font-medium">Last studied: {lastLessons.math}</p>
              )}
              <Link
                href="/subjects/maths/chapters/numbers"
                className="mt-4 flex w-full items-center justify-center rounded-xl bg-[#22C55E] py-2.5 text-sm font-semibold text-white hover:bg-[#16A34A] transition-colors"
              >
                {mathStarted ? "▶ Continue Lesson" : "▶ Start Lesson"}
              </Link>
            </div>

            {/* English */}
            <div className="rounded-2xl bg-[#EFF6FF] p-5">
              <div className="flex items-start justify-between mb-3">
                <span className="text-2xl">📚</span>
              </div>
              <h3 className="text-sm font-bold text-[#111827]">English</h3>
              <p className="mt-1 text-xs text-[#6B7280]">Simple Sentences · 1 lesson in Beta</p>
              {lastLessons.english && (
                <p className="mt-1 text-xs text-[#2563EB] font-medium">Last studied: {lastLessons.english}</p>
              )}
              <Link
                href="/subjects/english/chapters/english-intro"
                className="mt-4 flex w-full items-center justify-center rounded-xl bg-[#3B82F6] py-2.5 text-sm font-semibold text-white hover:bg-[#2563EB] transition-colors"
              >
                {lessonCompletions["english-intro"] ? "▶ Continue Lesson" : "▶ Start Lesson"}
              </Link>
            </div>

            {/* Science */}
            <div className="rounded-2xl bg-[#FEFCE8] p-5">
              <div className="flex items-start justify-between mb-3">
                <span className="text-2xl">🔬</span>
              </div>
              <h3 className="text-sm font-bold text-[#111827]">Science</h3>
              <p className="mt-1 text-xs text-[#6B7280]">What is a Habitat? · 1 lesson in Beta</p>
              {lastLessons.science && (
                <p className="mt-1 text-xs text-[#D97706] font-medium">Last studied: {lastLessons.science}</p>
              )}
              <Link
                href="/subjects/science/chapters/science-intro"
                className="mt-4 flex w-full items-center justify-center rounded-xl bg-[#F59E0B] py-2.5 text-sm font-semibold text-white hover:bg-[#D97706] transition-colors"
              >
                {lessonCompletions["science-intro"] ? "▶ Continue Lesson" : "▶ Start Lesson"}
              </Link>
            </div>
          </div>

          {/* ── BOTTOM ROW: Quick Quizzes + Today's Focus + Last Activity ── */}
          <div className="grid gap-4 md:grid-cols-[1fr_300px]">

            {/* Quick Quizzes */}
            <div className="rounded-2xl bg-white p-5 shadow-sm">
              <h2 className="mb-4 text-base font-bold text-[#111827]">Quick Quizzes</h2>

              {/* Numbers & Place Value */}
              <Link
                href="/subjects/maths/chapters/numbers?view=quiz"
                className="flex items-center gap-3 border-b border-[#F3F4F6] py-3 hover:bg-[#F9FAFB] -mx-5 px-5 transition-colors"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#DCFCE7] flex-shrink-0">
                  {mathQuizDone
                    ? <svg className="h-4 w-4 text-[#22C55E]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                    : <svg className="h-4 w-4 text-[#22C55E]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><circle cx="12" cy="12" r="9" /><path strokeLinecap="round" d="M12 8v4m0 4h.01" /></svg>
                  }
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-[#111827]">Numbers &amp; Place Value</div>
                  <div className="text-xs text-[#6B7280]">Mathematics · 10 questions</div>
                </div>
                <span className="rounded-full bg-[#DCFCE7] px-2.5 py-1 text-xs font-bold text-[#16A34A] flex-shrink-0">
                  {mathQuizDone ? "8/10" : "Start"}
                </span>
              </Link>

              {/* Simple Sentence */}
              <Link
                href="/subjects/english/chapters/english-intro?view=quiz"
                className="flex items-center gap-3 border-b border-[#F3F4F6] py-3 hover:bg-[#F9FAFB] -mx-5 px-5 transition-colors"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#DBEAFE] flex-shrink-0">
                  <svg className="h-4 w-4 text-[#3B82F6]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><circle cx="12" cy="12" r="9" /><path strokeLinecap="round" d="M12 8v4m0 4h.01" /></svg>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-[#111827]">Simple Sentence</div>
                  <div className="text-xs text-[#6B7280]">English · 8 questions</div>
                </div>
                <span className="rounded-full bg-[#DBEAFE] px-2.5 py-1 text-xs font-bold text-[#2563EB] flex-shrink-0">Start</span>
              </Link>

              {/* Habitat */}
              <Link
                href="/subjects/science/chapters/science-intro?view=quiz"
                className="flex items-center gap-3 py-3 hover:bg-[#F9FAFB] -mx-5 px-5 transition-colors"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#FEF3C7] flex-shrink-0">
                  <svg className="h-4 w-4 text-[#F59E0B]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><circle cx="12" cy="12" r="9" /><path strokeLinecap="round" d="M12 8v4m0 4h.01" /></svg>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-[#111827]">Habitat</div>
                  <div className="text-xs text-[#6B7280]">Science · 8 questions</div>
                </div>
                <span className="rounded-full bg-[#FEF3C7] px-2.5 py-1 text-xs font-bold text-[#D97706] flex-shrink-0">Start</span>
              </Link>
            </div>

            {/* Right column */}
            <div className="flex flex-col gap-4">

              {/* Today's Focus */}
              <div className="rounded-2xl bg-white p-5 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#DCFCE7]">
                    <svg className="h-4 w-4 text-[#22C55E]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                      <line x1="16" y1="2" x2="16" y2="6" />
                      <line x1="8" y1="2" x2="8" y2="6" />
                      <line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                  </div>
                  <h2 className="text-sm font-bold text-[#111827]">Today&apos;s Focus</h2>
                </div>
                <div className="rounded-xl bg-[#F0FDF4] border border-[#DCFCE7] px-3 py-2.5 mb-4">
                  <p className="text-xs font-semibold text-[#16A34A]">Numbers &amp; Place Value · Mathematics · Lesson 1</p>
                </div>
                <Link
                  href="/subjects/maths/chapters/numbers"
                  className="flex w-full items-center justify-center rounded-xl bg-[#22C55E] py-2.5 text-sm font-semibold text-white hover:bg-[#16A34A] transition-colors"
                >
                  Start Now →
                </Link>
              </div>

              {/* Last Activity */}
              <div className="rounded-2xl bg-white p-5 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#F3F4F6]">
                    <svg className="h-4 w-4 text-[#6B7280]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                  </div>
                  <h2 className="text-sm font-bold text-[#111827]">Last Activity</h2>
                </div>

                {lastActivityData || mathQuizDone || mathStarted ? (
                  <div className="space-y-2.5">
                    {(lastActivityData || mathQuizDone) && (
                      <div className="flex items-start gap-2.5">
                        <div className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-[#DCFCE7]">
                          <svg className="h-3 w-3 text-[#22C55E]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-[#111827]">
                            {lastActivityData ? lastActivityData.action : "Completed Quiz · Numbers & Place Value"}
                          </p>
                          <p className="text-[11px] text-[#9CA3AF]">1h ago</p>
                        </div>
                      </div>
                    )}
                    {mathStarted && (
                      <div className="flex items-start gap-2.5">
                        <div className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-[#DBEAFE]">
                          <svg className="h-3 w-3 text-[#3B82F6]" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-[#111827]">Watched Lesson · Numbers &amp; Place Value</p>
                          <p className="text-[11px] text-[#9CA3AF]">Yesterday</p>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-xs text-[#9CA3AF]">No recent activity yet. Start a lesson!</p>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </DashboardLayout>
    </PageFade>
  );
}
