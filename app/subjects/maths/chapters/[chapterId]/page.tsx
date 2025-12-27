"use client";

import BackButton from "@/components/BackButton";
import { useParams } from "next/navigation";

const CHAPTER_META: Record<string, { title: string; desc: string }> = {
  numbers: { title: "Numbers & Place Value", desc: "Understanding numbers, counting, and place value." },
  "addition-subtraction": { title: "Addition & Subtraction", desc: "Basic operations with real-life examples." },
  "multiplication-division": { title: "Multiplication & Division", desc: "Repeated addition, sharing, and grouping." },
  fractions: { title: "Fractions", desc: "Parts of a whole using simple visuals." },
  decimals: { title: "Decimals", desc: "Introduction to decimal numbers." },
  measurement: { title: "Measurement", desc: "Length, mass, and time basics." },
  geometry: { title: "Geometry", desc: "Shapes, angles, and spatial understanding." },
  "data-handling": { title: "Data Handling", desc: "Simple graphs, tables, and charts." },
  patterns: { title: "Patterns & Sequences", desc: "Finding patterns and logical sequences." },
  "word-problems": { title: "Word Problems", desc: "Applying maths to daily life situations." },
};

export default function ChapterPage() {
  const params = useParams<{ chapterId: string }>();
  const chapterId = params.chapterId;

  const meta = CHAPTER_META[chapterId] ?? { title: "Chapter", desc: "This chapter will be added soon." };

  return (
    <div className="min-h-screen bg-white px-6 py-10">
      <div className="max-w-4xl mx-auto">
        <BackButton href="/subjects/maths/chapters" label="Back to Chapters" />

        <h1 className="mt-6 text-3xl font-bold text-gray-900">{meta.title}</h1>
        <p className="mt-2 text-gray-600">{meta.desc}</p>

        <div className="mt-10 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">Lessons</h2>
          <p className="text-sm text-gray-600 mt-1">
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
