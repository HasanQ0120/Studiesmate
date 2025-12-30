"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";

import { QUIZZES, type Quiz } from "@/data/quizzes";

const STORAGE_KEY = "studiesmate_selected_subjects";

// Phase 1 dashboard keys
const WEEKLY_GOAL = 5;
const PROGRESS_KEY = "studiesmate_progress_v1";
const LAST_ACTIVITY_KEY = "studiesmate_last_activity_v1";

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

const ALL_SUBJECTS = [
  { title: "Mathematics", desc: "Numbers, algebra, geometry, and problem solving.", href: "/subjects/maths/chapters" },
  { title: "English", desc: "Reading, writing, grammar, and vocabulary.", href: "/subjects/english/chapters" },
  { title: "Science", desc: "Basics of physics, chemistry, and biology.", href: "/subjects/science/chapters" },
  { title: "Social Studies", desc: "People, places, maps, and how society works.", href: "/subjects/social-studies/chapters" },
  { title: "Computer / ICT", desc: "Digital skills, typing, internet basics, and safety.", href: "/subjects/computer/chapters" },
  { title: "Geography", desc: "Maps, continents, climate, and environments.", href: "/subjects/geography/chapters" },
  { title: "History", desc: "Past events, timelines, and key stories of the world.", href: "/subjects/history/chapters" },
  { title: "General Knowledge", desc: "Everyday facts, reasoning, and quick learning topics.", href: "/subjects/general-knowledge/chapters" },
  { title: "Islamiat", desc: "Beliefs, worship, Seerah, and Islamic manners.", href: "/subjects/islamiat/chapters" },
];

type SubjectProgress = Record<string, { completed: number; total: number }>;
type ProgressPayload = {
  weeklyCompleted: number;
  subjects: SubjectProgress;
};

export default function DashboardPage() {
  const router = useRouter();

  const [selectedTitles, setSelectedTitles] = useState<string[]>([]);
  const [weeklyCompleted, setWeeklyCompleted] = useState<number>(0);
  const [lastActivity, setLastActivity] = useState<string>("");
  const [subjectProgress, setSubjectProgress] = useState<SubjectProgress>({});

  // confirm remove modal state
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingRemoveTitle, setPendingRemoveTitle] = useState<string>("");

  useEffect(() => {
    // read selected subjects
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      setSelectedTitles(Array.isArray(parsed) ? parsed : []);
    } catch {
      setSelectedTitles([]);
    }

    // read progress (Phase 1)
    const progress = safeParseJSON<ProgressPayload>(localStorage.getItem(PROGRESS_KEY), {
      weeklyCompleted: 0,
      subjects: {},
    });
    setWeeklyCompleted(typeof progress.weeklyCompleted === "number" ? progress.weeklyCompleted : 0);
    setSubjectProgress(progress.subjects || {});

    // read last activity (Phase 1)
    const last = localStorage.getItem(LAST_ACTIVITY_KEY) || "";
    setLastActivity(last);

    // auto-update if localStorage changes (another tab)
    const onStorage = (e: StorageEvent) => {
      if (!e.key) return;

      if (e.key === STORAGE_KEY) {
        try {
          const parsed = e.newValue ? JSON.parse(e.newValue) : [];
          setSelectedTitles(Array.isArray(parsed) ? parsed : []);
        } catch {
          setSelectedTitles([]);
        }
      }

      if (e.key === PROGRESS_KEY) {
        const next = safeParseJSON<ProgressPayload>(e.newValue, { weeklyCompleted: 0, subjects: {} });
        setWeeklyCompleted(typeof next.weeklyCompleted === "number" ? next.weeklyCompleted : 0);
        setSubjectProgress(next.subjects || {});
      }

      if (e.key === LAST_ACTIVITY_KEY) {
        setLastActivity(e.newValue || "");
      }
    };

    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const selectedSubjects = useMemo(() => {
    const selectedSet = new Set(selectedTitles.map(normalizeTitle));
    return ALL_SUBJECTS.filter((s) => selectedSet.has(normalizeTitle(s.title)));
  }, [selectedTitles]);

  const weeklyPct = Math.min(100, (Math.min(weeklyCompleted, WEEKLY_GOAL) / WEEKLY_GOAL) * 100);

  function openRemoveConfirm(title: string) {
    setPendingRemoveTitle(title);
    setConfirmOpen(true);
  }

  function closeRemoveConfirm() {
    setConfirmOpen(false);
    setPendingRemoveTitle("");
  }

  function removeSubjectNow(title: string) {
    const key = normalizeTitle(title);

    const next = selectedTitles.filter((t) => normalizeTitle(t) !== key);
    setSelectedTitles(next);

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {}

    closeRemoveConfirm();
  }

  // ✅ FIX: show quizzes ONLY for selected subjects, then take up to 8
  const dashboardQuizzes: Quiz[] = useMemo(() => {
    const selectedSet = new Set(selectedTitles.map(normalizeTitle));

    const filtered = (Array.isArray(QUIZZES) ? QUIZZES : []).filter((q) =>
      selectedSet.has(normalizeTitle(q.subjectTitle))
    );

    return filtered.slice(0, 9);
  }, [selectedTitles]);

  return (
    <div className="min-h-screen bg-white px-6 py-10">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome 👋</h1>
        <p className="text-gray-600 mb-6">
          Your selected subjects are shown below. You can add more anytime from the Subjects page.
        </p>

        {/* Focus + Activity */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900">Today’s Focus</h3>
            <p className="mt-1 text-sm text-gray-600">
              {lastActivity ? `Continue: ${lastActivity}` : "Start a lesson to build momentum this week."}
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900">Last Activity</h3>
            <p className="mt-1 text-sm text-gray-600">{lastActivity ? lastActivity : "No activity yet."}</p>
          </div>
        </div>

        {/* Buttons row */}
        {selectedSubjects.length > 0 && (
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-50"
            >
              ← Back to Home
            </Link>

            <Link
              href="/subjects"
              className="inline-flex items-center justify-center rounded-xl bg-[#0B2B5A] px-4 py-2 text-sm font-semibold text-white hover:bg-[#0A2550]"
            >
              Add more subjects <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        )}

        {selectedSubjects.length === 0 ? (
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900">No subjects selected yet</h3>
            <p className="mt-1 text-sm text-gray-600">
              Go to Subjects and pick what you want to study. Then you’ll see them here.
            </p>

            <Link
              href="/subjects"
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#0B2B5A] px-4 py-2 text-sm font-semibold text-white"
            >
              Select subjects <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {selectedSubjects.map((subject) => {
              const p = subjectProgress[subject.title];
              const pct = p && p.total > 0 ? Math.round((p.completed / p.total) * 100) : 0;

              return (
                <div
                  key={subject.title}
                  className="relative bg-white border border-gray-200 rounded-xl shadow-sm p-6 hover:shadow-md hover:-translate-y-1 transition-all duration-200"
                >
                  <button
                    type="button"
                    onClick={() => openRemoveConfirm(subject.title)}
                    className="absolute right-4 top-4 rounded-lg border border-gray-200 bg-white px-3 py-1 text-xs font-semibold text-gray-700 hover:bg-gray-50"
                  >
                    Remove
                  </button>

                  <h3 className="text-lg font-semibold text-gray-900 pr-20">{subject.title}</h3>
                  <p className="text-gray-600 text-sm mt-2">{subject.desc}</p>

                  <p className="text-xs text-gray-500 mt-3 mb-4">Progress: {pct}%</p>

                  <button
                    onClick={() => router.push(subject.href)}
                    className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full border border-blue-400 text-blue-600 font-medium text-sm hover:bg-blue-50 hover:text-blue-700 transition-all duration-200"
                  >
                    Open {subject.title}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>
        )}

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
                const questionsCount = Array.isArray(q.questions) ? q.questions.length : 0;

                return (
                  <Link
                    key={q.id}
                    href={`/quiz/${q.id}`}
                    className="rounded-xl border border-gray-200 bg-white p-4 hover:bg-gray-50 transition"
                  >
                    <div className="text-sm font-semibold text-gray-900 line-clamp-2">{q.title}</div>

                    <div className="mt-2 text-xs text-gray-600">
                      <span className="font-semibold">{q.subjectTitle}</span>
                      {q.level ? <span> • {q.level}</span> : null}
                    </div>

                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-xs text-gray-500">{questionsCount} questions</span>
                      <span className="text-xs font-semibold text-[#0B2B5A]">Start →</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}

          <div className="mt-4 text-xs text-gray-500">Tip: finish one quiz daily. Small wins add up.</div>
        </div>

        {/* Weekly Goal */}
        <div className="mt-10 bg-blue-50 border border-blue-100 rounded-2xl p-8">
          <h3 className="text-lg font-semibold text-blue-900">Weekly Goal</h3>
          <p className="text-blue-800 text-sm mb-3">
            {Math.min(weeklyCompleted, WEEKLY_GOAL)}/{WEEKLY_GOAL} lessons completed this week
          </p>

          <div className="w-full h-3 bg-white rounded-full overflow-hidden">
            <div className="h-full bg-blue-500 rounded-full transition-all duration-300" style={{ width: `${weeklyPct}%` }} />
          </div>

          <p className="mt-3 text-xs text-blue-800/80">
            Phase 1: progress is stored locally and becomes real once lessons exist.
          </p>
        </div>
      </div>

      {/* Confirm Modal */}
      {confirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <h3 className="text-lg font-semibold text-gray-900">Remove subject?</h3>
            <p className="mt-2 text-sm text-gray-600">
              Are you sure you want to remove{" "}
              <span className="font-semibold text-gray-900">“{pendingRemoveTitle}”</span> from your dashboard?
            </p>

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={closeRemoveConfirm}
                className="inline-flex items-center justify-center rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-50"
              >
                Keep it
              </button>

              <button
                type="button"
                onClick={() => removeSubjectNow(pendingRemoveTitle)}
                className="inline-flex items-center justify-center rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
              >
                Delete “{pendingRemoveTitle}”
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
