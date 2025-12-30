"use client";

import BackButton from "@/components/BackButton";
import { useParams } from "next/navigation";

const SUBJECT_TITLE = "English";

const CHAPTER_META: Record<string, { title: string; desc: string }> = {
  reading: { title: "Reading", desc: "Improve comprehension, fluency, and understanding of texts." },
  grammar: { title: "Grammar", desc: "Learn sentence structure, tenses, punctuation, and rules." },
  vocabulary: { title: "Vocabulary", desc: "Build strong word knowledge and spelling skills." },
  writing: { title: "Writing", desc: "Practice paragraphs, emails, stories, and clear expression." },
  "speaking-listening": { title: "Speaking & Listening", desc: "Develop pronunciation, listening, and confident speaking." },
};

export default function EnglishChapterPage() {
  const params = useParams();
  const chapterId = params.chapterId as string;

  const meta = CHAPTER_META[chapterId];

  if (!meta) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-600">
        Chapter not found
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-white text-slate-900">
      <div className="mx-auto max-w-4xl px-6 py-10">
        <BackButton href="/subjects/english/chapters" label="Back to Chapters" />

        <h1 className="mt-6 text-3xl font-semibold tracking-tight">
          {SUBJECT_TITLE} • {meta.title}
        </h1>
        <p className="mt-2 text-sm text-slate-700">{meta.desc}</p>

        <div className="mt-10 rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="text-base font-semibold">Lessons</h2>
          <p className="mt-2 text-sm text-slate-700">
            Lessons will be added gradually. For Phase 1, this is a placeholder.
          </p>
        </div>
      </div>
    </main>
  );
}
