"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";

const PROGRESS_KEY = "studiesmate_progress_v1";
const QUIZ_COMPLETIONS_KEY = "studiesmate_quiz_completions";
const LESSON_COMPLETIONS_KEY = "studiesmate_lesson_completions";
const LAST_ACTIVITY_V2_KEY = "studiesmate_last_activity_v2";

const TRACKER_STEPS = [
  "Lesson 1 — Numbers & Place Value",
  "Quiz 1",
  "Lesson 2 — Reading & Writing Whole Numbers",
  "Quiz 2",
];

const QUIZ_STEP_MAP: Record<string, number> = {
  "math-npv": 1,
  "math-rwn": 3,
};

const FIXED_SUBJECTS = [
  {
    title: "Mathematics",
    desc: "Numbers, algebra, geometry, and problem solving.",
    href: "/subjects/maths/chapters",
    unlocked: true,
  },
  {
    title: "English",
    desc: "Reading, writing, grammar, and vocabulary.",
    href: null,
    unlocked: false,
  },
  {
    title: "Science",
    desc: "Basics of physics, chemistry, and biology.",
    href: null,
    unlocked: false,
  },
];

function safeParseJSON<T>(raw: string | null, fallback: T): T {
  try {
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

type SubjectProgress = Record<string, { completed: number; total: number }>;
type ProgressPayload = { weeklyCompleted: number; subjects: SubjectProgress };
type LastActivityData = { action: string; timestamp: string };

export default function DashboardPage() {
  const router = useRouter();

  const [subjectProgress, setSubjectProgress] = useState<SubjectProgress>({});
  const [quizCompletions, setQuizCompletions] = useState<Record<string, boolean>>({});
  const [lessonCompletions, setLessonCompletions] = useState<Record<string, string>>({});
  const [lastActivityData, setLastActivityData] = useState<LastActivityData | null>(null);

  useEffect(() => {
    const progress = safeParseJSON<ProgressPayload>(localStorage.getItem(PROGRESS_KEY), {
      weeklyCompleted: 0,
      subjects: {},
    });
    setSubjectProgress(progress.subjects || {});
    setQuizCompletions(
      safeParseJSON<Record<string, boolean>>(localStorage.getItem(QUIZ_COMPLETIONS_KEY), {})
    );
    setLessonCompletions(
      safeParseJSON<Record<string, string>>(localStorage.getItem(LESSON_COMPLETIONS_KEY), {})
    );
    setLastActivityData(
      safeParseJSON<LastActivityData>(localStorage.getItem(LAST_ACTIVITY_V2_KEY), null)
    );

    const onStorage = (e: StorageEvent) => {
      if (e.key === PROGRESS_KEY) {
        const next = safeParseJSON<ProgressPayload>(e.newValue, { weeklyCompleted: 0, subjects: {} });
        setSubjectProgress(next.subjects || {});
      }
      if (e.key === QUIZ_COMPLETIONS_KEY) {
        setQuizCompletions(safeParseJSON<Record<string, boolean>>(e.newValue, {}));
      }
      if (e.key === LESSON_COMPLETIONS_KEY) {
        setLessonCompletions(safeParseJSON<Record<string, string>>(e.newValue, {}));
      }
      if (e.key === LAST_ACTIVITY_V2_KEY) {
        setLastActivityData(safeParseJSON<LastActivityData>(e.newValue, null));
      }
    };

    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // Today's Focus — step-by-step progression
  const todaysFocus: { text: string; href?: string } = (() => {
    if (!lessonCompletions["numbers"]) {
      return {
        text: "Start with Numbers & Place Value lesson",
        href: "/subjects/maths/chapters/numbers",
      };
    }
    if (!quizCompletions["math-npv"]) {
      return {
        text: "Take the Numbers & Place Value Quiz",
        href: "/quiz/play/math-npv",
      };
    }
    if (!lessonCompletions["addition-subtraction"]) {
      return {
        text: "Start Reading & Writing Whole Numbers lesson",
        href: "/subjects/maths/chapters/addition-subtraction",
      };
    }
    if (!quizCompletions["math-rwn"]) {
      return {
        text: "Take the Reading & Writing Whole Numbers Quiz",
        href: "/quiz/play/math-rwn",
      };
    }
    return { text: "Great job! All lessons completed." };
  })();

  // Progress tracker — which step indices are completed
  const completedStepSet = new Set(
    Object.entries(quizCompletions)
      .filter(([, done]) => done)
      .map(([id]) => QUIZ_STEP_MAP[id])
      .filter((idx): idx is number => idx !== undefined)
  );

  const trackerDoneCount = completedStepSet.size;

  // Quiz completions count for the Math module card
  const mathDoneCount = [quizCompletions["math-npv"], quizCompletions["math-rwn"]].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-white px-6 py-10">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome 👋</h1>
        <p className="text-gray-600 mb-6">Your subjects are shown below.</p>

        {/* Focus + Activity */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900">Today's Focus</h3>
            {todaysFocus.href ? (
              <Link
                href={todaysFocus.href}
                className="mt-2 inline-block text-sm font-medium text-[#0B2B5A] hover:underline"
              >
                {todaysFocus.text} →
              </Link>
            ) : (
              <p className="mt-1 text-sm text-gray-600">{todaysFocus.text}</p>
            )}
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900">Last Activity</h3>
            <p className="mt-1 text-sm text-gray-600">
              {lastActivityData
                ? `${lastActivityData.action} — ${timeAgo(lastActivityData.timestamp)}`
                : "No activity yet. Start your first lesson!"}
            </p>
          </div>
        </div>

        {/* Subject cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {FIXED_SUBJECTS.map((subject) => {
            const p = subjectProgress[subject.title];
            const pct = p && p.total > 0 ? Math.round((p.completed / p.total) * 100) : 0;

            return (
              <div
                key={subject.title}
                className="relative bg-white border border-gray-200 rounded-xl shadow-sm p-6"
              >
                <h3 className="text-lg font-semibold text-gray-900">{subject.title}</h3>
                <p className="text-gray-600 text-sm mt-2">{subject.desc}</p>

                {subject.unlocked ? (
                  <>
                    <p className="text-xs text-gray-500 mt-3 mb-4">Progress: {pct}%</p>
                    <button
                      onClick={() => router.push(subject.href!)}
                      className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full border border-blue-400 text-blue-600 font-medium text-sm hover:bg-blue-50 hover:text-blue-700 transition-all duration-200"
                    >
                      Open {subject.title}
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </>
                ) : (
                  <p className="mt-4 text-sm text-slate-500">Available in Full Launch</p>
                )}
              </div>
            );
          })}
        </div>

        {/* Quick Quizzes — 3 modules */}
        <div className="mt-10 rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900">Quick Quizzes</h3>
          <p className="mt-1 text-sm text-gray-600">
            Short practice to build confidence. Pick a subject to begin.
          </p>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Math module — navigates to /quiz/math */}
            <Link
              href="/quiz/math"
              className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-4 hover:bg-gray-50 transition"
            >
              <div>
                <div className="text-sm font-semibold text-gray-900">Mathematics</div>
                <div className="mt-0.5 text-xs text-gray-500">
                  {mathDoneCount === 2
                    ? "2/2 completed ✓"
                    : mathDoneCount === 1
                    ? "1/2 completed"
                    : "2 quizzes available"}
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-gray-400 shrink-0" />
            </Link>

            {/* English — locked */}
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 cursor-not-allowed opacity-60">
              <div className="text-sm font-semibold text-gray-500">English</div>
              <div className="mt-1 text-xs text-gray-400">Available in Full Launch</div>
            </div>

            {/* Science — locked */}
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 cursor-not-allowed opacity-60">
              <div className="text-sm font-semibold text-gray-500">Science</div>
              <div className="mt-1 text-xs text-gray-400">Available in Full Launch</div>
            </div>
          </div>

          <div className="mt-4 text-xs text-gray-500">Tip: finish one quiz daily. Small wins add up.</div>
        </div>

        {/* Progress Tracker */}
        <div className="mt-10 rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
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

          <p className="mt-4 text-sm font-semibold text-gray-700">{trackerDoneCount}/2 quizzes completed</p>
        </div>
      </div>
    </div>
  );
}
