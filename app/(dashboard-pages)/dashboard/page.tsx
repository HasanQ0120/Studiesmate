"use client";

import { useContext, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/auth";
import { CURRICULUM, SubjectKey } from "@/lib/curriculum";
import { SubjectContext } from "../layout";

const QUIZ_COMPLETIONS_KEY = "studiesmate_quiz_completions";
const LESSON_COMPLETIONS_KEY = "studiesmate_lesson_completions";
const LAST_ACTIVITY_V2_KEY = "studiesmate_last_activity_v2";

// ── Progress snapshot constants ──
const SNAP_LESSON_KEYS: Record<string, string> = {
  "intro-to-place-value": "numbers",
  "simple-sentences":     "english-intro",
  "habitats":             "science-intro",
};
const SNAP_QUIZ_KEYS: Record<string, string> = {
  "intro-to-place-value": "math-npv",
  "simple-sentences":     "english-intro",
  "habitats":             "science-intro",
};
const SNAP_TOPIC_IDS = [
  "intro-to-place-value", "reading-writing-whole-numbers",
  "simple-sentences",     "compound-sentences",
  "habitats",             "food-chains",
];

function ProgressRing({ pct, size = 80, strokeWidth = 8, color = "#22C55E", fontSize = 17 }: {
  pct: number; size?: number; strokeWidth?: number; color?: string; fontSize?: number;
}) {
  const r = (size - strokeWidth) / 2;
  const circ = 2 * Math.PI * r;
  const filled = Math.max(0, Math.min(1, pct / 100)) * circ;
  const cx = size / 2;
  const cy = size / 2;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ flexShrink: 0, display: "block" }}>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#E5E7EB" strokeWidth={strokeWidth} />
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth={strokeWidth}
        strokeDasharray={`${filled} ${circ - filled}`}
        strokeLinecap="round"
        transform={`rotate(-90 ${cx} ${cy})`}
        style={{ transition: "stroke-dasharray 0.6s ease" }}
      />
      <text x={cx} y={cy} textAnchor="middle" dominantBaseline="central"
        fontSize={fontSize} fontWeight="700" fill="#111827">
        {pct}%
      </text>
    </svg>
  );
}

function safeParseJSON<T>(raw: string | null, fallback: T): T {
  try {
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

type LastActivityData = { action: string; timestamp: string; href?: string };

const GRADES = ["Grade 1", "Grade 2", "Grade 3", "Grade 4", "Grade 5", "Grade 6", "Grade 7", "Grade 8"];

const SUBJECT_CONFIG = {
  mathematics: { emoji: "🧮", bg: "#F0FDF4", accent: "#22C55E", dark: "#16A34A", label: "Numbers & Place Value · 1 lesson in Beta" },
  english:     { emoji: "📚", bg: "#EFF6FF", accent: "#3B82F6", dark: "#2563EB", label: "Simple Sentences · 1 lesson in Beta" },
  science:     { emoji: "🔬", bg: "#FEFCE8", accent: "#F59E0B", dark: "#D97706", label: "What is a Habitat? · 1 lesson in Beta" },
} as const;

const FIRST_LESSON_URL: Record<string, string> = {
  mathematics: "/subjects/maths/chapters/numbers",
  english: "/subjects/english/chapters/english-intro",
  science: "/subjects/science/chapters/science-intro",
};

function getLastViewUrl(subject: "mathematics" | "english" | "science"): string | null {
  try {
    const raw = localStorage.getItem(`last_view_${subject}`);
    if (!raw) return null;
    const { section } = JSON.parse(raw) as { section: string };
    if (!section) return null;
    const base = FIRST_LESSON_URL[subject];
    if (!base) return null;
    if (section === "lesson") return base;
    const isMath = subject === "mathematics";
    if (section === "quiz") return isMath ? `${base}/quiz` : `${base}?view=quiz`;
    if (section === "worksheet") return isMath ? `${base}/worksheet` : `${base}?view=worksheet`;
    return null;
  } catch {
    return null;
  }
}

export default function DashboardPage() {
  const router = useRouter();
  const { selectedSubject, setSelectedSubject } = useContext(SubjectContext);

  useEffect(() => {
    try {
      const last = localStorage.getItem("last_selected_subject");
      if (last) {
        setSelectedSubject(last);
        localStorage.removeItem("last_selected_subject");
      }
    } catch {}
  }, [setSelectedSubject]);

  const [quizCompletions, setQuizCompletions] = useState<Record<string, boolean>>({});
  const [lessonCompletions, setLessonCompletions] = useState<Record<string, string>>({});
  const [lastActivityData, setLastActivityData] = useState<LastActivityData | null>(null);
  const [streak, setStreak] = useState(1);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [lastLessons, setLastLessons] = useState({ math: "", english: "", science: "" });

  const [profileLoading, setProfileLoading] = useState(true);

  const [explainCredits, setExplainCredits] = useState<number | null>(null);
  const [resetAt, setResetAt] = useState<string | null>(null);
  const [countdown, setCountdown] = useState("");

  const [showWelcome, setShowWelcome] = useState(false);
  const [welcomeName, setWelcomeName] = useState("");
  const [studentName, setStudentName] = useState("");

  const [connectCode, setConnectCode] = useState<string>("");

  // ── Profile fetch ──
  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      const { data } = await supabase
        .from("profiles")
        .select("explain_credits, explain_credits_reset_at, current_streak")
        .eq("id", session.user.id)
        .maybeSingle();
      if (data) {
        setExplainCredits(data.explain_credits ?? 3);
        setResetAt(data.explain_credits_reset_at ?? null);
        setCurrentStreak(data.current_streak ?? 0);
      }
    };
    fetchProfile();
  }, []);

  // ── Explain credits countdown ──
  useEffect(() => {
    if (!resetAt || explainCredits === null || explainCredits >= 3) { setCountdown(""); return; }
    function calcCountdown() {
      const resetPlusTwo = new Date(new Date(resetAt!).getTime() + 2 * 24 * 60 * 60 * 1000);
      const diffMs = resetPlusTwo.getTime() - Date.now();
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

  // ── Welcome screen ──
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
      if (!data.user) { router.push("/"); return; }
      const name = ((data.user.user_metadata?.studentName as string | undefined) || "").trim();
      const firstName = name.split(" ")[0] || "";
      setStudentName(firstName || (data.user.email || "").split("@")[0] || "Student");
      setProfileLoading(false);
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
      <div className="flex min-h-screen w-full flex-col items-center justify-center bg-white px-6 text-center">
        <div className="w-full max-w-lg">
          <h1 className="text-4xl font-bold text-[#0B2B5A] md:text-5xl">Welcome, {welcomeName}! 👋</h1>
          <p className="mt-6 text-base leading-8 text-slate-700 md:text-lg">
            You have just joined the StudiesMate family. We are proud to have you here.
            Your learning journey starts today, one small step at a time.
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
    );
  }

  return (
    <>
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

      {selectedSubject ? (
        /* ── SUBJECT INTRO VIEW ── */
        <SubjectIntroView
          subjectKey={selectedSubject as SubjectKey}
          onBack={() => setSelectedSubject(null)}
        />
      ) : (
        /* ── DEFAULT DASHBOARD VIEW ── */
        <div className="min-h-screen bg-[#F9FAFB] px-6 py-8 pb-24 md:pb-10">
          <div className="mx-auto max-w-5xl">

            {/* Mobile home button */}
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

            {/* Greeting */}
            {profileLoading ? (
              <div className="mb-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="skeleton" style={{ height: 36, width: 260, borderRadius: 8 }} />
                  <div className="skeleton flex-shrink-0" style={{ height: 34, width: 130, borderRadius: 9999 }} />
                </div>
                <div className="skeleton mt-3" style={{ height: 26, width: 180, borderRadius: 9999 }} />
              </div>
            ) : (
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
                        {explainCredits < 3 && resetAt && countdown && (
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
            )}

            {/* Grade Progress */}
            <div className="mb-6 rounded-2xl bg-white p-5 shadow-sm premium-card-hover">
              <div className="flex items-start justify-between mb-5 gap-4">
                <div>
                  <h2 className="text-base font-bold text-[#111827]">Grade Progress</h2>
                  <p className="mt-1 text-xs text-[#9CA3AF] leading-relaxed max-w-sm">
                    Switch between grades as they launch. Purchase to unlock seamless travelling across your entire learning journey.
                  </p>
                </div>
                <Link
                  href="/phase-1"
                  className="flex-shrink-0 text-xs font-semibold transition-colors"
                  style={{
                    background: "white",
                    border: "1px solid #22C55E",
                    color: "#22C55E",
                    borderRadius: "9999px",
                    padding: "6px 14px",
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLAnchorElement).style.background = "#22C55E";
                    (e.currentTarget as HTMLAnchorElement).style.color = "white";
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLAnchorElement).style.background = "white";
                    (e.currentTarget as HTMLAnchorElement).style.color = "#22C55E";
                  }}
                >
                  View all grades →
                </Link>
              </div>
              <div className="grid grid-cols-4 gap-x-2 gap-y-4 sm:flex sm:items-start sm:justify-between sm:gap-0">
                {GRADES.map((grade, i) => {
                  const isGrade4 = i === 3;
                  return (
                    <div key={grade} className="flex flex-col items-center gap-1.5">
                      <div className={`h-4 w-4 rounded-full border-2 flex-shrink-0 ${isGrade4 ? "bg-[#22C55E] border-[#22C55E]" : "bg-white border-[#D1D5DB]"}`} />
                      <span className={`text-[10px] font-medium whitespace-nowrap ${isGrade4 ? "text-[#22C55E] font-semibold" : "text-[#9CA3AF]"}`}>
                        {grade}
                      </span>
                      {isGrade4 ? (
                        <div className="flex flex-col items-center gap-0.5">
                          <span className="rounded-full px-1.5 py-0.5 text-[9px] font-semibold whitespace-nowrap" style={{ background: "#DCFCE7", color: "#16A34A" }}>
                            In Progress
                          </span>
                          <span className="rounded-full px-1.5 py-0.5 text-[9px] font-semibold whitespace-nowrap" style={{ background: "#F0FDF4", color: "#22C55E" }}>
                            Beta
                          </span>
                        </div>
                      ) : (
                        <span className="rounded-full px-1.5 py-0.5 text-[9px] font-semibold whitespace-nowrap" style={{ background: "#DBEAFE", color: "#2563EB" }}>
                          Coming Soon
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Progress Snapshot */}
            {(() => {
              const snapPctSum = SNAP_TOPIC_IDS.reduce((sum, id) => {
                const lDone = SNAP_LESSON_KEYS[id] ? !!lessonCompletions[SNAP_LESSON_KEYS[id]] : false;
                const qDone = SNAP_QUIZ_KEYS[id]   ? !!quizCompletions[SNAP_QUIZ_KEYS[id]]    : false;
                return sum + (lDone ? 50 : 0) + (qDone ? 50 : 0);
              }, 0);
              const snapPct = Math.round(snapPctSum / SNAP_TOPIC_IDS.length);
              const snapCompleted = SNAP_TOPIC_IDS.filter((id) => {
                const lDone = SNAP_LESSON_KEYS[id] ? !!lessonCompletions[SNAP_LESSON_KEYS[id]] : false;
                const qDone = SNAP_QUIZ_KEYS[id]   ? !!quizCompletions[SNAP_QUIZ_KEYS[id]]    : false;
                return (lDone ? 50 : 0) + (qDone ? 50 : 0) === 100;
              }).length;
              return (
                <Link href="/my-progress" className="mb-6 block rounded-2xl bg-white p-5 shadow-sm premium-card-hover">
                  <div className="flex items-center gap-5">
                    <ProgressRing pct={snapPct} size={80} strokeWidth={8} color="#22C55E" fontSize={17} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-[#111827]">My Progress</p>
                      <p className="mt-1 text-sm text-[#6B7280]">{snapCompleted} of {SNAP_TOPIC_IDS.length} topics completed</p>
                      <p className="mt-1 text-xs font-semibold" style={{ color: "#22C55E" }}>View details →</p>
                    </div>
                  </div>
                </Link>
              );
            })()}

            {/* First-time motivational nudge */}
            {Object.keys(lessonCompletions).length === 0 && !Object.values(quizCompletions).some(Boolean) && (
              <div
                className="mb-6 rounded-2xl border border-[#BBF7D0] px-6 py-5 text-center"
                style={{ background: "#F0FDF4" }}
              >
                <p className="text-sm font-semibold text-[#15803D]">
                  Nothing here yet, but your first lesson is waiting for you! 🌟
                </p>
                <p className="mt-1 text-xs text-[#6B7280]">Pick a subject below to get started.</p>
              </div>
            )}

            {/* Your Subjects */}
            <h2 className="mb-3 text-base font-bold text-[#111827]">Your Subjects</h2>
            <div className="mb-6 grid gap-4 grid-cols-1">

              {(["mathematics", "english", "science"] as const).map((key) => {
                const cfg = SUBJECT_CONFIG[key];
                const lessonDone = key === "mathematics"
                  ? !!lessonCompletions["numbers"]
                  : !!lessonCompletions[key === "english" ? "english-intro" : "science-intro"];
                const quizDone = key === "mathematics"
                  ? !!quizCompletions["math-npv"]
                  : !!quizCompletions[key === "english" ? "english-intro" : "science-intro"];
                const progressPct = (lessonDone ? 50 : 0) + (quizDone ? 50 : 0);
                const isStarted = lessonDone || quizDone;

                const lastStudied = key === "mathematics"
                  ? lastLessons.math
                  : key === "english"
                  ? lastLessons.english
                  : lastLessons.science;

                const unitCount = CURRICULUM[key].units.length;
                const topicCount = CURRICULUM[key].units.reduce((sum, u) => sum + u.topics.length, 0);

                const subjectIndex = ["mathematics", "english", "science"].indexOf(key);
                return (
                  <div
                    key={key}
                    className="breathe-card w-full"
                    style={{ animationDelay: `${subjectIndex * 0.3}s` }}
                  >
                  <button
                    type="button"
                    onClick={() => setSelectedSubject(key)}
                    className="rounded-2xl p-6 text-left w-full cursor-pointer special-card-hover"
                    style={{ background: cfg.bg }}
                  >
                    {/* Top row: circular emoji badge + Active badge */}
                    <div className="flex items-start justify-between mb-4">
                      <div
                        className="flex h-12 w-12 items-center justify-center rounded-full text-2xl leading-none flex-shrink-0"
                        style={{ background: `${cfg.accent}20` }}
                      >
                        {cfg.emoji}
                      </div>
                      <span className="flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold" style={{ background: `${cfg.accent}20`, color: cfg.dark }}>
                        <span className="h-1.5 w-1.5 rounded-full" style={{ background: cfg.accent }} />
                        Active
                      </span>
                    </div>

                    {/* Name + scope badge */}
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h3 className="text-base font-bold text-[#111827]">{CURRICULUM[key].name}</h3>
                      <span className="rounded-full px-2 py-0.5 text-[10px] font-semibold text-[#6B7280]" style={{ background: "#F3F4F6" }}>
                        {unitCount} Units · {topicCount} Topics
                      </span>
                    </div>

                    <p className="text-xs text-[#6B7280] leading-relaxed">{cfg.label}</p>
                    {lastStudied && (
                      <p className="mt-1 text-xs font-medium" style={{ color: cfg.dark }}>Last studied: {lastStudied}</p>
                    )}

                    {/* Progress bar */}
                    <div className="mt-4 rounded-full overflow-hidden" style={{ height: 3, background: `${cfg.accent}20` }}>
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${progressPct}%`, background: cfg.accent, transition: "width 0.5s ease" }}
                      />
                    </div>
                    {progressPct > 0 && (
                      <p className="mt-1 text-[10px]" style={{ color: cfg.dark }}>{progressPct}% complete</p>
                    )}

                    {/* Bottom row: explore hint + compact continue button */}
                    <div className="mt-3 flex items-center justify-between gap-3">
                      <p className="text-[11px]" style={{ color: cfg.dark }}>Click to explore units & topics →</p>
                      <div
                        className="rounded-xl px-4 py-2 text-xs font-semibold text-white flex-shrink-0"
                        style={{ background: cfg.accent }}
                      >
                        {isStarted ? "Continue" : "Start Learning"}
                      </div>
                    </div>
                  </button>
                  </div>
                );
              })}
            </div>

          </div>
        </div>
      )}
    </>
  );
}

// ── Subject Intro Component ──
function SubjectIntroView({ subjectKey, onBack }: { subjectKey: SubjectKey; onBack: () => void }) {
  const [resumeUrl, setResumeUrl] = useState<string | null>(null);
  useEffect(() => { setResumeUrl(getLastViewUrl(subjectKey)); }, [subjectKey]);
  const data = CURRICULUM[subjectKey];
  const cfg = {
    mathematics: { emoji: "🧮", bg: "#F0FDF4", border: "#BBF7D0", accent: "#16A34A", light: "#DCFCE7" },
    english:     { emoji: "📚", bg: "#EFF6FF", border: "#BFDBFE", accent: "#2563EB", light: "#DBEAFE" },
    science:     { emoji: "🔬", bg: "#FEFCE8", border: "#FDE68A", accent: "#D97706", light: "#FEF3C7" },
  }[subjectKey];

  const unitCount = data.units.length;
  const topicCount = data.units.reduce((sum, u) => sum + u.topics.length, 0);

  return (
    <div className="min-h-screen bg-[#F9FAFB] px-6 py-8 pb-24 md:pb-10" style={{ animation: "fadeIn 0.3s ease-out" }}>
      <div className="mx-auto max-w-3xl">

        {/* Header */}
        <div className="flex items-center gap-4 mb-4">
          <div className="text-5xl leading-none">{cfg.emoji}</div>
          <div>
            <h1 className="text-3xl font-bold text-[#111827]">{data.name}</h1>
            <p className="text-sm text-[#6B7280] mt-1">Grade 4 · Beta · Use the sidebar to start a lesson</p>
          </div>
        </div>

        {/* Stats row */}
        <div className="flex items-center gap-2 mb-6 flex-wrap">
          <span className="rounded-full px-3 py-1 text-xs font-semibold text-[#374151]" style={{ background: "#F3F4F6" }}>
            {unitCount} Units
          </span>
          <span className="text-xs text-[#D1D5DB]">·</span>
          <span className="rounded-full px-3 py-1 text-xs font-semibold text-[#374151]" style={{ background: "#F3F4F6" }}>
            {topicCount} Topics
          </span>
          <span className="text-xs text-[#D1D5DB]">·</span>
          <span className="rounded-full px-3 py-1 text-xs font-semibold" style={{ background: cfg.light, color: cfg.accent }}>
            Grade 4
          </span>
        </div>

        {/* Who is this for */}
        <div className="rounded-2xl p-6 mb-5 premium-card-hover" style={{ background: cfg.bg, border: `1.5px solid ${cfg.border}` }}>
          <div className="text-[11px] font-bold uppercase tracking-wider mb-3" style={{ color: cfg.accent }}>
            Who is this for?
          </div>
          <p className="text-sm text-[#374151] leading-relaxed">{data.whoIsThisFor}</p>
        </div>

        {/* What you'll learn */}
        <div className="rounded-2xl bg-white border border-[#E5E7EB] p-6 shadow-sm mb-5 premium-card-hover">
          <div className="text-[11px] font-bold uppercase tracking-wider text-[#9CA3AF] mb-3">
            {"What you'll learn"}
          </div>
          <p className="text-sm text-[#374151] leading-relaxed">{data.whatYoullLearn}</p>
        </div>

        {/* Course Overview */}
        <div className="rounded-2xl bg-white border border-[#E5E7EB] p-6 shadow-sm mb-5 premium-card-hover">
          <div className="text-[11px] font-bold uppercase tracking-wider text-[#9CA3AF] mb-4">
            Course Overview
          </div>
          <div>
            {data.units.map((unit) => {
              const hasAvailable = unit.topics.some(
                (t) => t.status === "unlocked" || t.status === "locked-until-quiz"
              );
              return (
                <div
                  key={unit.id}
                  className="flex items-center justify-between gap-3 py-2.5 border-b border-[#F9FAFB] last:border-0"
                >
                  <span className="text-sm text-[#374151] font-medium flex-1 leading-tight">{unit.name}</span>
                  {hasAvailable ? (
                    <span className="rounded-full px-2 py-0.5 text-[10px] font-semibold flex-shrink-0" style={{ background: "#DCFCE7", color: "#16A34A" }}>
                      Available Now
                    </span>
                  ) : (
                    <span className="rounded-full px-2 py-0.5 text-[10px] font-semibold flex-shrink-0" style={{ background: "#F3F4F6", color: "#9CA3AF" }}>
                      Coming Soon
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Start CTA */}
        <div className="rounded-2xl bg-white border border-[#E5E7EB] p-6 shadow-sm premium-card-hover">
          <h3 className="text-base font-bold text-[#111827] mb-1">Ready to begin?</h3>
          <p className="text-sm text-[#6B7280] mb-4">Jump straight into your first lesson.</p>
          <div className="flex flex-wrap gap-3">
            <Link
              href={FIRST_LESSON_URL[subjectKey] ?? "/dashboard"}
              className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white"
              style={{ background: cfg.accent }}
            >
              Start Learning →
            </Link>
            {resumeUrl && (
              <Link
                href={resumeUrl}
                className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold"
                style={{ background: "white", color: cfg.accent, border: `1.5px solid ${cfg.accent}` }}
              >
                Continue from last position →
              </Link>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
