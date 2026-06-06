"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/DashboardLayout";
import { supabase } from "@/lib/auth";

const QUIZ_COMPLETIONS_KEY = "studiesmate_quiz_completions";
const LESSON_COMPLETIONS_KEY = "studiesmate_lesson_completions";
const LAST_ACTIVITY_V2_KEY = "studiesmate_last_activity_v2";

const TRACKER_STEPS = [
  "Numbers & Place Value",
  "Numbers & Place Value Quiz",
  "Simple Sentences",
  "Simple Sentences Quiz",
  "What is a Habitat?",
  "What is a Habitat? Quiz",
];

const QUIZ_STEP_MAP: Record<string, number> = {
  "math-npv": 1,
  "english-intro": 3,
  "science-intro": 5,
};

const LESSON_STEP_MAP: Record<string, number> = {
  "numbers": 0,
  "english-intro": 2,
  "science-intro": 4,
};

function safeParseJSON<T>(raw: string | null, fallback: T): T {
  try {
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}


type LastActivityData = { action: string; timestamp: string; href?: string };

export default function DashboardPage() {
  const router = useRouter();
  const [quizCompletions, setQuizCompletions] = useState<Record<string, boolean>>({});
  const [lessonCompletions, setLessonCompletions] = useState<Record<string, string>>({});
  const [lastActivityData, setLastActivityData] = useState<LastActivityData | null>(null);
  const [showWelcome, setShowWelcome] = useState(false);
  const [welcomeName, setWelcomeName] = useState("");

  useEffect(() => {
    function applyWelcome(session: { user: { user_metadata?: Record<string, unknown> } } | null) {
      if (session && !localStorage.getItem('sm_welcomed')) {
        const name = (session.user.user_metadata?.studentName as string | undefined)?.trim() || "Student";
        setWelcomeName(name);
        setShowWelcome(true);
      }
    }

    supabase.auth.getSession().then(({ data: { session } }) => applyWelcome(session));

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      applyWelcome(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) {
        router.push("/login");
      }
    });
  }, [router]);

  function handleWelcomeContinue() {
    localStorage.setItem('sm_welcomed', 'true');
    setShowWelcome(false);
  }

  useEffect(() => {
    setQuizCompletions(
      safeParseJSON<Record<string, boolean>>(localStorage.getItem(QUIZ_COMPLETIONS_KEY), {})
    );
    setLessonCompletions(
      safeParseJSON<Record<string, string>>(localStorage.getItem(LESSON_COMPLETIONS_KEY), {})
    );
    setLastActivityData(
      safeParseJSON<LastActivityData | null>(localStorage.getItem(LAST_ACTIVITY_V2_KEY), null)
    );

    const onStorage = (e: StorageEvent) => {
      if (e.key === QUIZ_COMPLETIONS_KEY) {
        setQuizCompletions(safeParseJSON<Record<string, boolean>>(e.newValue, {}));
      }
      if (e.key === LESSON_COMPLETIONS_KEY) {
        setLessonCompletions(safeParseJSON<Record<string, string>>(e.newValue, {}));
      }
      if (e.key === LAST_ACTIVITY_V2_KEY) {
        setLastActivityData(safeParseJSON<LastActivityData | null>(e.newValue, null));
      }
    };

    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // Progress tracker — quiz steps + lesson steps
  const completedStepSet = new Set([
    ...Object.entries(quizCompletions)
      .filter(([, done]) => done)
      .map(([id]) => QUIZ_STEP_MAP[id])
      .filter((idx): idx is number => idx !== undefined),
    ...Object.entries(lessonCompletions)
      .filter(([, date]) => !!date)
      .map(([id]) => LESSON_STEP_MAP[id])
      .filter((idx): idx is number => idx !== undefined),
  ]);

  const trackerDoneCount = [
    lessonCompletions["numbers"],
    quizCompletions["math-npv"],
    lessonCompletions["english-intro"],
    quizCompletions["english-intro"],
    lessonCompletions["science-intro"],
    quizCompletions["science-intro"],
  ].filter(Boolean).length;

  if (showWelcome) {
    return (
      <div className="flex min-h-screen w-full flex-col items-center justify-center bg-white px-6 text-center">
        <div className="w-full max-w-lg">
          <h1 className="text-4xl font-bold text-[#0B2B5A] md:text-5xl">
            Welcome, {welcomeName}! 👋
          </h1>
          <p className="mt-6 text-base leading-8 text-slate-700 md:text-lg">
            You have just joined the StudiesMate family. We are proud to have you here.
            Your learning journey starts today — one small step at a time.
          </p>
          <div className="mt-10 flex flex-col items-center gap-4">
            <button
              type="button"
              onClick={() => {
                localStorage.setItem('sm_welcomed', 'true');
                setShowWelcome(false);
              }}
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
    <DashboardLayout>
    <div className="min-h-screen bg-white px-6 py-10 pb-20 md:pb-16">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome 👋</h1>
        <p className="text-gray-600 mb-6">Your subjects are shown below.</p>

        {lastActivityData && (
          <div className="rounded-2xl border border-[#E2E8F0] bg-[#FFF7ED] p-5 shadow-sm mb-6 flex items-center justify-between gap-4 transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(15,31,61,0.12)] hover:border-[#0F1F3D]">
            <div className="flex items-center gap-3">
              <span className="text-2xl">▶️</span>
              <div>
                <p className="text-sm font-bold text-[#0F172A]">Continue where you left off</p>
                <p className="text-xs text-[#475569] mt-0.5">{lastActivityData.action}</p>
              </div>
            </div>
            <Link
              href={lastActivityData.href || "/dashboard"}
              className="shrink-0 rounded-xl bg-[#F97316] px-4 py-2 text-xs font-semibold text-white hover:bg-[#EA580C] transition-colors"
            >
              Continue →
            </Link>
          </div>
        )}

        {/* Daily Goal */}
        <div className="rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-sm mb-8 transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(15,31,61,0.12)] hover:border-[#0F1F3D]">
          <div className="mb-5">
            <h2 className="text-lg font-bold text-[#0F172A]">🎯 Your Daily Goal</h2>
            <p className="text-sm text-[#475569] mt-1">Pick what you want to do today</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Math Box */}
            <div className="rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-4 transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(15,31,61,0.12)] hover:border-[#0F1F3D]">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xl">📐</span>
                <span className="text-sm font-bold text-[#0F172A]">Mathematics</span>
              </div>
              <Link
                href="/subjects/maths/chapters/numbers"
                className="flex items-center gap-2 rounded-lg border border-[#E2E8F0] bg-white p-2.5 mb-2 hover:border-[#F97316] hover:shadow-sm transition-all group"
              >
                <span className="text-xs font-semibold text-[#475569] group-hover:text-[#F97316] flex-1">Numbers & Place Value</span>
                {lessonCompletions["numbers"] && <span className="text-[10px] text-[#10B981] font-bold">✓</span>}
              </Link>
              <Link
                href="/subjects/maths/chapters/numbers/quiz"
                className="flex items-center gap-2 rounded-lg border border-[#E2E8F0] bg-white p-2.5 hover:border-[#F97316] hover:shadow-sm transition-all group"
              >
                <span className="text-xs font-semibold text-[#475569] group-hover:text-[#F97316] flex-1">Numbers & Place Value Quiz</span>
                {quizCompletions["math-npv"] && <span className="text-[10px] text-[#10B981] font-bold">✓</span>}
              </Link>
            </div>

            {/* English Box */}
            <div className="rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-4 transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(15,31,61,0.12)] hover:border-[#0F1F3D]">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xl">📖</span>
                <span className="text-sm font-bold text-[#0F172A]">English</span>
              </div>
              <Link
                href="/subjects/english/chapters/english-intro"
                className="flex items-center gap-2 rounded-lg border border-[#E2E8F0] bg-white p-2.5 mb-2 hover:border-[#F97316] hover:shadow-sm transition-all group"
              >
                <span className="text-xs font-semibold text-[#475569] group-hover:text-[#F97316] flex-1">Simple Sentences</span>
                {lessonCompletions["english-intro"] && <span className="text-[10px] text-[#10B981] font-bold">✓</span>}
              </Link>
              <Link
                href="/subjects/english/chapters/english-intro/quiz"
                className="flex items-center gap-2 rounded-lg border border-[#E2E8F0] bg-white p-2.5 hover:border-[#F97316] hover:shadow-sm transition-all group"
              >
                <span className="text-xs font-semibold text-[#475569] group-hover:text-[#F97316] flex-1">Simple Sentences Quiz</span>
                {quizCompletions["english-intro"] && <span className="text-[10px] text-[#10B981] font-bold">✓</span>}
              </Link>
            </div>

            {/* Science Box */}
            <div className="rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-4 transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(15,31,61,0.12)] hover:border-[#0F1F3D]">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xl">🔬</span>
                <span className="text-sm font-bold text-[#0F172A]">Science</span>
              </div>
              <Link
                href="/subjects/science/chapters/science-intro"
                className="flex items-center gap-2 rounded-lg border border-[#E2E8F0] bg-white p-2.5 mb-2 hover:border-[#F97316] hover:shadow-sm transition-all group"
              >
                <span className="text-xs font-semibold text-[#475569] group-hover:text-[#F97316] flex-1">What is a Habitat?</span>
                {lessonCompletions["science-intro"] && <span className="text-[10px] text-[#10B981] font-bold">✓</span>}
              </Link>
              <Link
                href="/subjects/science/chapters/science-intro/quiz"
                className="flex items-center gap-2 rounded-lg border border-[#E2E8F0] bg-white p-2.5 hover:border-[#F97316] hover:shadow-sm transition-all group"
              >
                <span className="text-xs font-semibold text-[#475569] group-hover:text-[#F97316] flex-1">What is a Habitat? Quiz</span>
                {quizCompletions["science-intro"] && <span className="text-[10px] text-[#10B981] font-bold">✓</span>}
              </Link>
            </div>
          </div>

          {/* Auto suggestion */}
          <div className="mt-4 rounded-lg bg-[#FFF7ED] border border-[#FED7AA] px-4 py-2.5">
            <p className="text-xs font-semibold text-[#F97316]">
              💡 Suggestion: {
                !lessonCompletions["numbers"]
                  ? "Start with the Numbers & Place Value lesson"
                  : !quizCompletions["math-npv"]
                  ? "Take the Numbers & Place Value Quiz next"
                  : "Great job! All Math tasks done."
              }
            </p>
          </div>
        </div>

        {/* Progress Tracker */}
        <div className="mt-10 rounded-2xl border border-gray-200 bg-white p-8 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(15,31,61,0.12)] hover:border-[#0F1F3D]">
          <h3 className="text-lg font-semibold text-gray-900">Progress Tracker</h3>

          <div className="mt-5 flex gap-2">
            {TRACKER_STEPS.map((_, i) => (
              <div key={i} className="flex-1">
                <div
                  className={`h-3 rounded-full transition-all duration-300 ${
                    completedStepSet.has(i) ? "bg-[#0B2B5A]" : "bg-gray-200"
                  }`}
                />
              </div>
            ))}
          </div>

          <div className="mt-3 flex gap-2">
            {TRACKER_STEPS.map((label, i) => (
              <div key={i} className="flex-1 text-[11px] text-gray-500 leading-tight">
                <span className="font-semibold text-gray-700">Step {i + 1}</span>
                <br />
                {label}
              </div>
            ))}
          </div>

          <p className="mt-4 text-sm font-semibold text-gray-700">{trackerDoneCount}/6 tasks completed</p>

          <div className="flex justify-end mt-4">
            <button
              type="button"
              onClick={() => {
                localStorage.removeItem("studiesmate_quiz_completions");
                localStorage.removeItem("studiesmate_lesson_completions");
                localStorage.removeItem("studiesmate_last_activity_v2");
                setQuizCompletions({});
                setLessonCompletions({});
                setLastActivityData(null);
              }}
              className="text-xs font-semibold text-[#94A3B8] hover:text-[#EF4444] border border-[#E2E8F0] hover:border-[#EF4444] rounded-lg px-3 py-1.5 transition-all"
            >
              Reset Progress
            </button>
          </div>
        </div>
      </div>
    </div>
    </DashboardLayout>
  );
}
