"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";

import { QUIZZES, type Quiz } from "@/data/quizzes";

const PROGRESS_KEY = "studiesmate_progress_v1";
const LAST_ACTIVITY_KEY = "studiesmate_last_activity_v1";

const TRACKER_STEPS = [
  "Lesson 1 — Numbers & Place Value",
  "Quiz 1",
  "Lesson 2 — Reading & Writing Whole Numbers",
  "Quiz 2",
];

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

function normalizeTitle(s: string) {
  return s.trim().toLowerCase();
}

type SubjectProgress = Record<string, { completed: number; total: number }>;
type ProgressPayload = { weeklyCompleted: number; subjects: SubjectProgress };

export default function DashboardPage() {
  const router = useRouter();

  const [lastActivity, setLastActivity] = useState<string>("");
  const [subjectProgress, setSubjectProgress] = useState<SubjectProgress>({});

  useEffect(() => {
    const progress = safeParseJSON<ProgressPayload>(localStorage.getItem(PROGRESS_KEY), {
      weeklyCompleted: 0,
      subjects: {},
    });
    setSubjectProgress(progress.subjects || {});
    setLastActivity(localStorage.getItem(LAST_ACTIVITY_KEY) || "");

    const onStorage = (e: StorageEvent) => {
      if (e.key === PROGRESS_KEY) {
        const next = safeParseJSON<ProgressPayload>(e.newValue, { weeklyCompleted: 0, subjects: {} });
        setSubjectProgress(next.subjects || {});
      }
      if (e.key === LAST_ACTIVITY_KEY) {
        setLastActivity(e.newValue || "");
      }
    };

    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const dashboardQuizzes: Quiz[] = useMemo(() => {
    return (Array.isArray(QUIZZES) ? QUIZZES : [])
      .filter((q) => normalizeTitle(q.subjectTitle) === "mathematics")
      .slice(0, 9);
  }, []);

  const trackerCompleted = 0;

  return (
    <div className="min-h-screen bg-white px-6 py-10">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome 👋</h1>
        <p className="text-gray-600 mb-6">Your subjects are shown below.</p>

        {/* Focus + Activity */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900">Today's Focus</h3>
            <p className="mt-1 text-sm text-gray-600">
              {lastActivity ? `Continue: ${lastActivity}` : "Start a lesson to build momentum this week."}
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900">Last Activity</h3>
            <p className="mt-1 text-sm text-gray-600">{lastActivity || "No activity yet."}</p>
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
                  <p className="mt-4 text-sm text-slate-500">Available in Full Phase 1</p>
                )}
              </div>
            );
          })}
        </div>

        {/* Quick Quizzes */}
        <div className="mt-10 rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Quick Quizzes</h3>
              <p className="mt-1 text-sm text-gray-600">
                Short practice to build confidence. Pick any quiz and go.
              </p>
            </div>

            {dashboardQuizzes.length > 0 && (
              <div className="text-xs text-gray-500">
                Showing <span className="font-semibold text-gray-700">{dashboardQuizzes.length}</span> quizzes
              </div>
            )}
          </div>

          {dashboardQuizzes.length === 0 ? (
            <div className="mt-4 rounded-xl bg-gray-50 px-4 py-3 text-sm text-gray-600">
              Quizzes will appear here soon.
            </div>
          ) : (
            <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {dashboardQuizzes.map((q) => {
                const levelLabel = normalizeTitle(q.subjectTitle) === "mathematics" ? "Beta" : q.level;

                return (
                  <Link
                    key={q.id}
                    href={`/quiz/${q.id}`}
                    className="rounded-xl border border-gray-200 bg-white p-4 hover:bg-gray-50 transition"
                  >
                    <div className="text-sm font-semibold text-gray-900 line-clamp-2">{q.title}</div>

                    <div className="mt-2 text-xs text-gray-600">
                      <span className="font-semibold">{q.subjectTitle}</span>
                      {levelLabel ? <span> • {levelLabel}</span> : null}
                    </div>

                    <div className="mt-3 flex items-center justify-end">
                      <span className="text-xs font-semibold text-[#0B2B5A]">Start →</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}

          <div className="mt-4 text-xs text-gray-500">Tip: finish one quiz daily. Small wins add up.</div>
        </div>

        {/* Progress Tracker */}
        <div className="mt-10 rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900">Progress Tracker</h3>

          <div className="mt-5 flex gap-2">
            {TRACKER_STEPS.map((_, i) => (
              <div key={i} className="flex-1">
                <div
                  className={`h-3 rounded-full ${i < trackerCompleted ? "bg-[#0B2B5A]" : "bg-gray-200"}`}
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

          <p className="mt-4 text-sm font-semibold text-gray-700">{trackerCompleted}/4 completed</p>
        </div>
      </div>
    </div>
  );
}
