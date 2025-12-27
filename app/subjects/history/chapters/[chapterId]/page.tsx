"use client";

import BackButton from "@/components/BackButton";
import { use } from "react";

const SUBJECT_TITLE = "History";
const SUBJECT_ID = "history";

const CHAPTER_META: Record<string, { title: string; desc: string }> = {
  "early-civilizations": {
    title: "Early Civilizations",
    desc: "How early humans lived and formed civilizations.",
  },
  "ancient-egypt": {
    title: "Ancient Egypt",
    desc: "Pharaohs, pyramids, and daily life in Egypt.",
  },
  "ancient-indus": {
    title: "Indus Valley Civilization",
    desc: "Harappa, Mohenjo-daro, and early planning.",
  },
  "ancient-greece": {
    title: "Ancient Greece",
    desc: "Democracy, philosophy, and Greek culture.",
  },
  "ancient-rome": {
    title: "Ancient Rome",
    desc: "Roman Empire, laws, and architecture.",
  },
  "medieval-period": {
    title: "Medieval Period",
    desc: "Castles, kings, and everyday life in medieval times.",
  },
  "islamic-golden-age": {
    title: "Islamic Golden Age",
    desc: "Science, learning, and culture in early Islamic history.",
  },
  "subcontinent-history": {
    title: "History of the Subcontinent",
    desc: "Key events and empires of South Asia.",
  },
};

export default function HistoryChapterPage({
  params,
}: {
  params: Promise<{ chapterId: string }>;
}) {
  const { chapterId } = use(params);

  const meta = CHAPTER_META[chapterId] ?? {
    title: "Chapter",
    desc: "Lesson content will be added soon.",
  };

  return (
    <main className="min-h-screen bg-white text-slate-900">
      <div className="mx-auto max-w-5xl px-4 py-12">
        <BackButton
          href={`/subjects/${SUBJECT_ID}`}
          label="Back to Chapters"
        />

        <h1 className="mt-6 text-3xl font-semibold tracking-tight">
          {SUBJECT_TITLE} • {meta.title}
        </h1>
        <p className="mt-2 text-sm text-slate-700">{meta.desc}</p>

        <div className="mt-10 rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="text-base font-semibold">Lesson coming soon</h2>
          <p className="mt-2 text-sm text-slate-700">
            A full lesson, examples, and a quick quiz will be added here.
          </p>
        </div>
      </div>
    </main>
  );
}
