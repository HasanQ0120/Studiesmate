"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";

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
  {
    title: "Mathematics",
    desc: "Numbers, algebra, geometry, and problem solving.",
    href: "/subjects/maths/chapters",
  },
  {
    title: "English",
    desc: "Reading, writing, grammar, and vocabulary.",
    href: "/subjects/english/chapters",
  },
  {
    title: "Science",
    desc: "Basics of physics, chemistry, and biology.",
    href: "/subjects/science/chapters",
  },
  {
    title: "Social Studies",
    desc: "People, places, maps, and how society works.",
    href: "/subjects/social-studies/chapters",
  },
  {
    title: "Computer / ICT",
    desc: "Digital skills, typing, internet basics, and safety.",
    href: "/subjects/computer/chapters",
  },
  {
    title: "Geography",
    desc: "Maps, continents, climate, and environments.",
    href: "/subjects/geography/chapters",
  },
  {
    title: "History",
    desc: "Past events, timelines, and key stories of the world.",
    href: "/subjects/history/chapters",
  },
  {
    title: "General Knowledge",
    desc: "Everyday facts, reasoning, and quick learning topics.",
    href: "/subjects/general-knowledge/chapters",
  },

  // ✅ Added Islamiat (so dashboard recognizes the selection)
  {
    title: "Islamiat",
    desc: "Beliefs, worship, Seerah, and Islamic manners.",
    href: "/subjects/islamiat/chapters",
  },

  // Keep these if you still want them visible as optional
  {
    title: "Art",
    desc: "Drawing, creativity, colors, and basic design.",
    href: "/subjects/art/chapters",
  },
  {
    title: "Urdu (Support)",
    desc: "Helper explanations only (not a full course yet).",
    href: "/subjects/urdu-support/chapters",
  },
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

  return (
    <div className="min-h-screen bg-white px-6 py-10">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome 👋</h1>
        <p className="text-gray-600 mb-6">
          Your selected subjects are shown below. You can add more anytime from the Subjects page.
        </p>

        {/* Focus + Activity (Phase 1 safe) */}
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
                  className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 hover:shadow-md hover:-translate-y-1 transition-all duration-200"
                >
                  <h3 className="text-lg font-semibold text-gray-900">{subject.title}</h3>
                  <p className="text-gray-600 text-sm mt-2">{subject.desc}</p>

                  {/* Subject progress (Phase 1 light) */}
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

        {/* Weekly Goal (Phase 1) */}
        <div className="mt-10 bg-blue-50 border border-blue-100 rounded-2xl p-8">
          <h3 className="text-lg font-semibold text-blue-900">Weekly Goal</h3>
          <p className="text-blue-800 text-sm mb-3">
            {Math.min(weeklyCompleted, WEEKLY_GOAL)}/{WEEKLY_GOAL} lessons completed this week
          </p>

          <div className="w-full h-3 bg-white rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 rounded-full transition-all duration-300"
              style={{ width: `${weeklyPct}%` }}
            />
          </div>

          <p className="mt-3 text-xs text-blue-800/80">
            Phase 1: progress is stored locally and becomes real once lessons exist.
          </p>
        </div>
      </div>
    </div>
  );
}
