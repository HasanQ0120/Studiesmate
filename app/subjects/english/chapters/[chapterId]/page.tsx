"use client";

import BackButton from "@/components/BackButton";
import { useParams } from "next/navigation";

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
    return <div className="min-h-screen flex items-center justify-center text-gray-600">Chapter not found</div>;
  }

  return (
    <div className="min-h-screen bg-white px-6 py-10">
      <div className="max-w-4xl mx-auto">
        <BackButton href="/subjects/english/chapters" label="Back to Chapters" />

        <h1 className="mt-6 text-3xl font-bold text-gray-900">{meta.title}</h1>
        <p className="mt-2 text-gray-600">{meta.desc}</p>

        <div className="mt-10 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">Lessons</h2>
          <p className="mt-1 text-sm text-gray-600">
            Lessons will be added gradually. For Phase 1, this is a placeholder.
          </p>

          <ul className="mt-4 space-y-3 text-sm text-gray-700">
            <li className="flex items-center justify-between border rounded-xl p-4">
              <span>Lesson 1 (coming soon)</span>
              <span className="text-gray-400">Locked</span>
            </li>
            <li className="flex items-center justify-between border rounded-xl p-4">
              <span>Lesson 2 (coming soon)</span>
              <span className="text-gray-400">Locked</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
