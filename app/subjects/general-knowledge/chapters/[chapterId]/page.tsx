"use client";

import BackButton from "@/components/BackButton";
import { use } from "react";

const SUBJECT_TITLE = "General Knowledge";
const SUBJECT_ID = "general-knowledge";

const CHAPTER_META: Record<string, { title: string; desc: string }> = {
  "world-around-us": {
    title: "World Around Us",
    desc: "Countries, flags, landmarks, and basic world facts.",
  },
  "science-everyday": {
    title: "Everyday Science",
    desc: "Simple science in daily life, inventions, and discoveries.",
  },
  "space-planets": {
    title: "Space & Planets",
    desc: "Sun, moon, planets, and basic space knowledge.",
  },
  "history-heroes": {
    title: "History & Heroes",
    desc: "Famous people and major events (simple, age-appropriate).",
  },
  "maps-directions": {
    title: "Maps & Directions",
    desc: "Continents, oceans, directions, and reading simple maps.",
  },
  "nature-animals": {
    title: "Nature & Animals",
    desc: "Habitats, animals, plants, and caring for nature.",
  },
  "health-safety": {
    title: "Health & Safety",
    desc: "Hygiene, safety rules, and basic healthy habits.",
  },
  "current-awareness": {
    title: "Current Awareness",
    desc: "Important ideas about the world today (kept simple).",
  },
  "math-fun-facts": {
    title: "Math Fun Facts",
    desc: "Patterns, puzzles, and brain teasers (light practice).",
  },
};

export default function GeneralKnowledgeChapterPage({
  params,
}: {
  params: Promise<{ chapterId: string }>;
}) {
  // ✅ Fix: unwrap params (prevents the red error overlay)
  const { chapterId } = use(params);

  const meta = CHAPTER_META[chapterId] ?? {
    title: "Chapter",
    desc: "Lesson content will be added soon.",
  };

  return (
    <main className="min-h-screen bg-white text-slate-900">
      <div className="mx-auto max-w-5xl px-4 py-12">
        <BackButton href={`/subjects/${SUBJECT_ID}/chapters`} label="Back to Chapters" />

        <h1 className="mt-6 text-3xl font-semibold tracking-tight">
          {SUBJECT_TITLE} • {meta.title}
        </h1>
        <p className="mt-2 text-sm text-slate-700">{meta.desc}</p>

        <div className="mt-10 rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="text-base font-semibold">Lesson coming soon</h2>
          <p className="mt-2 text-sm text-slate-700">
            We’ll add a full lesson, examples, and a quick quiz here.
          </p>
        </div>
      </div>
    </main>
  );
}
