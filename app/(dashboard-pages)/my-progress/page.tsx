"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { CURRICULUM } from "@/lib/curriculum";
import { supabase } from "@/lib/auth";

// ── Subject config ──
const SUBJECT_COLOR: Record<string, string> = {
  mathematics: "#22C55E",
  english:     "#3B82F6",
  science:     "#F97316",
};

const SUBJECT_EMOJI: Record<string, string> = {
  mathematics: "🧮",
  english:     "📚",
  science:     "🔬",
};

// ── Topic → localStorage key mappings ──
const LESSON_KEY: Record<string, string> = {
  "intro-to-place-value": "numbers",
  "simple-sentences":     "english-intro",
  "habitats":             "science-intro",
};

const QUIZ_KEY: Record<string, string> = {
  "intro-to-place-value": "math-npv",
  "simple-sentences":     "english-intro",
  "habitats":             "science-intro",
};

// Which quiz must be passed to unlock each locked-until-quiz topic
const UNLOCK_REQUIRES: Record<string, string> = {
  "reading-writing-whole-numbers": "math-npv",
  "compound-sentences":            "english-intro",
  "food-chains":                   "science-intro",
};

// Beta-accessible topics (unlocked + locked-until-quiz) per subject — 6 total
const SUBJECT_BETA_TOPICS: Record<string, string[]> = {
  mathematics: ["intro-to-place-value", "reading-writing-whole-numbers"],
  english:     ["simple-sentences",     "compound-sentences"],
  science:     ["habitats",             "food-chains"],
};

// ── Pure helpers ──
function getTopicPct(
  topicId: string,
  lessonCompletions: Record<string, string>,
  quizCompletions: Record<string, boolean>
): number {
  const lKey = LESSON_KEY[topicId];
  const qKey = QUIZ_KEY[topicId];
  return (lKey && !!lessonCompletions[lKey] ? 50 : 0) + (qKey && !!quizCompletions[qKey] ? 50 : 0);
}

function getIsUnlocked(
  topicStatus: string,
  topicId: string,
  quizCompletions: Record<string, boolean>
): boolean {
  if (topicStatus === "unlocked") return true;
  if (topicStatus === "locked-until-quiz") {
    const req = UNLOCK_REQUIRES[topicId];
    return req ? !!quizCompletions[req] : false;
  }
  return false;
}

type StatusKind = "completed" | "in-progress" | "not-started" | "locked";

function getStatusKind(
  topicId: string,
  topicStatus: string,
  lessonCompletions: Record<string, string>,
  quizCompletions: Record<string, boolean>
): StatusKind {
  if (!getIsUnlocked(topicStatus, topicId, quizCompletions)) return "locked";
  const pct = getTopicPct(topicId, lessonCompletions, quizCompletions);
  if (pct === 100) return "completed";
  if (pct > 0)    return "in-progress";
  return "not-started";
}

const BADGE: Record<StatusKind, { bg: string; color: string; label: string }> = {
  completed:    { bg: "#DCFCE7", color: "#16A34A", label: "✓ Completed"  },
  "in-progress":{ bg: "#FEF3C7", color: "#92400E", label: "⏳ In Progress" },
  "not-started":{ bg: "#F3F4F6", color: "#6B7280", label: "Not Started"  },
  locked:       { bg: "#F3F4F6", color: "#9CA3AF", label: "🔒 Locked"    },
};

// ── Circular progress ring ──
function CircleRing({
  pct,
  size = 80,
  strokeWidth = 8,
  color = "#22C55E",
  fontSize = 18,
}: {
  pct: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  fontSize?: number;
}) {
  const r = (size - strokeWidth) / 2;
  const circ = 2 * Math.PI * r;
  const filled = Math.max(0, Math.min(1, pct / 100)) * circ;
  const cx = size / 2;
  const cy = size / 2;
  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      style={{ flexShrink: 0, display: "block" }}
    >
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#E5E7EB" strokeWidth={strokeWidth} />
      <circle
        cx={cx}
        cy={cy}
        r={r}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeDasharray={`${filled} ${circ - filled}`}
        strokeLinecap="round"
        transform={`rotate(-90 ${cx} ${cy})`}
        style={{ transition: "stroke-dasharray 0.6s ease" }}
      />
      <text
        x={cx}
        y={cy}
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={fontSize}
        fontWeight="700"
        fill="#111827"
      >
        {Math.round(pct)}%
      </text>
    </svg>
  );
}

// ── Page ──
export default function MyProgressPage() {
  const router = useRouter();
  const [lessonCompletions, setLessonCompletions] = useState<Record<string, string>>({});
  const [quizCompletions, setQuizCompletions] = useState<Record<string, boolean>>({});
  const [expandedSubjects, setExpandedSubjects] = useState<Set<string>>(new Set());

  function toggleSubject(subjectKey: string) {
    setExpandedSubjects((prev) => {
      const next = new Set(prev);
      if (next.has(subjectKey)) next.delete(subjectKey);
      else next.add(subjectKey);
      return next;
    });
  }

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) router.replace("/");
    });
  }, [router]);

  useEffect(() => {
    try {
      setLessonCompletions(JSON.parse(localStorage.getItem("studiesmate_lesson_completions") || "{}"));
      setQuizCompletions(JSON.parse(localStorage.getItem("studiesmate_quiz_completions") || "{}"));
    } catch {}
    function onStorage(e: StorageEvent) {
      if (e.key === "studiesmate_lesson_completions") {
        try { setLessonCompletions(JSON.parse(e.newValue || "{}")); } catch {}
      }
      if (e.key === "studiesmate_quiz_completions") {
        try { setQuizCompletions(JSON.parse(e.newValue || "{}")); } catch {}
      }
    }
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const allBetaTopicIds = Object.values(SUBJECT_BETA_TOPICS).flat();
  const totalBetaTopics = allBetaTopicIds.length;

  const overallPctSum = allBetaTopicIds.reduce(
    (sum, id) => sum + getTopicPct(id, lessonCompletions, quizCompletions),
    0
  );
  const overallPct = totalBetaTopics > 0 ? overallPctSum / totalBetaTopics : 0;
  const completedCount = allBetaTopicIds.filter(
    (id) => getTopicPct(id, lessonCompletions, quizCompletions) === 100
  ).length;

  return (
    <div className="min-h-screen bg-[#F9FAFB] px-6 py-8 pb-24 md:pb-12">
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0);    }
        }
      `}</style>
      <div className="mx-auto max-w-2xl">

        <h1 className="text-2xl font-bold text-[#111827] mb-1">My Progress</h1>
        <p className="text-sm text-[#6B7280] mb-8">Track your learning across all subjects.</p>

        {/* ── Overall summary ── */}
        <section
          className="rounded-2xl bg-white shadow-sm mb-6 overflow-hidden premium-card-hover"
          style={{ animation: "fadeInUp 0.3s ease-out" }}
        >
          <div className="px-6 py-4 border-b border-[#F3F4F6]">
            <h2 className="text-sm font-bold text-[#111827]">Your Learning Summary</h2>
          </div>
          <div className="px-6 py-8 flex flex-col items-center gap-5">
            <CircleRing pct={overallPct} size={140} strokeWidth={12} color="#22C55E" fontSize={28} />
            <p className="text-sm text-[#6B7280] text-center max-w-xs leading-relaxed">
              {"You've completed "}
              <span className="font-bold text-[#111827]">{completedCount}</span>
              {" out of "}
              <span className="font-bold text-[#111827]">{totalBetaTopics}</span>
              {" topics across all subjects"}
            </p>
          </div>
        </section>
      </div>

      {/* ── Per-subject cards: single column on mobile, 3-column grid on desktop ── */}
      <div className="mx-auto max-w-2xl md:max-w-6xl md:grid md:grid-cols-3 md:gap-6 md:items-start mb-6">
        {(["mathematics", "english", "science"] as const).map((subjectKey, idx) => {
          const subjectData = CURRICULUM[subjectKey];
          const color = SUBJECT_COLOR[subjectKey];
          const emoji = SUBJECT_EMOJI[subjectKey];
          const betaTopicIds = SUBJECT_BETA_TOPICS[subjectKey];

          const subjectPctSum = betaTopicIds.reduce(
            (sum, id) => sum + getTopicPct(id, lessonCompletions, quizCompletions),
            0
          );
          const subjectPct = betaTopicIds.length > 0 ? subjectPctSum / betaTopicIds.length : 0;
          const subjectCompleted = betaTopicIds.filter(
            (id) => getTopicPct(id, lessonCompletions, quizCompletions) === 100
          ).length;

          const isExpanded = expandedSubjects.has(subjectKey);

          return (
            <section
              key={subjectKey}
              className="rounded-2xl bg-white shadow-sm mb-6 md:mb-0 overflow-hidden premium-card-hover"
              style={{ animation: `fadeInUp 0.3s ease-out ${(idx + 1) * 0.08}s both` }}
            >
              {/* Subject header — tap to expand/collapse on mobile; always expanded on desktop */}
              <button
                type="button"
                onClick={() => toggleSubject(subjectKey)}
                className="w-full text-left px-6 py-4 border-b border-[#F3F4F6] md:cursor-default"
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <span className="text-2xl leading-none flex-shrink-0">{emoji}</span>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-[#111827]">{subjectData.name}</p>
                      <p
                        className={`text-xs text-[#9CA3AF] mt-0.5 md:block ${isExpanded ? "block" : "hidden"}`}
                      >
                        {subjectCompleted} of {betaTopicIds.length} beta topics complete
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span
                      className={`text-sm font-bold md:hidden ${isExpanded ? "hidden" : "inline"}`}
                      style={{ color }}
                    >
                      {Math.round(subjectPct)}%
                    </span>
                    <div className={`md:block ${isExpanded ? "block" : "hidden"}`}>
                      <CircleRing pct={subjectPct} size={72} strokeWidth={7} color={color} fontSize={14} />
                    </div>
                    <ChevronDown
                      className={`h-4 w-4 text-[#9CA3AF] transition-transform duration-200 flex-shrink-0 md:hidden ${
                        isExpanded ? "rotate-180" : ""
                      }`}
                    />
                  </div>
                </div>
              </button>

              {/* Topics grouped by unit — collapsible on mobile, always visible on desktop */}
              <div
                className={`overflow-hidden transition-[max-height,opacity] duration-300 ease-out md:max-h-none md:opacity-100 ${
                  isExpanded ? "max-h-[3000px] opacity-100" : "max-h-0 opacity-0"
                }`}
              >
              {subjectData.units.map((unit) => (
                <div key={unit.id}>
                  <div className="px-6 py-2 bg-[#F9FAFB]">
                    <p className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-wider leading-tight">
                      {unit.name}
                    </p>
                  </div>
                  {unit.topics.map((topic) => {
                    const status = getStatusKind(
                      topic.id,
                      topic.status,
                      lessonCompletions,
                      quizCompletions
                    );
                    const badge = BADGE[status];
                    const isLocked = status === "locked";
                    return (
                      <div
                        key={topic.id}
                        className="flex items-center justify-between gap-3 px-6 py-3 border-b border-[#F9FAFB] last:border-0"
                        style={{ opacity: isLocked ? 0.5 : 1 }}
                      >
                        <p
                          className="text-sm font-medium flex-1 leading-tight"
                          style={{ color: isLocked ? "#9CA3AF" : "#111827" }}
                        >
                          {topic.name}
                        </p>
                        <span
                          className="inline-flex items-center flex-shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold"
                          style={{ background: badge.bg, color: badge.color }}
                        >
                          {badge.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              ))}
              </div>
            </section>
          );
        })}
      </div>

    </div>
  );
}
