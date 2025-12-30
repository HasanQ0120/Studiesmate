"use client";

import BackButton from "@/components/BackButton";
import { useParams } from "next/navigation";

const SUBJECT_TITLE = "Maths";

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

  const meta =
    CHAPTER_META[chapterId] ?? {
      title: "Chapter",
      desc: "This chapter will be added soon.",
    };

  return (
    <main className="min-h-screen bg-white text-slate-900">
      <div className="mx-auto max-w-4xl px-6 py-10">
        <BackButton href="/subjects/maths/chapters" label="Back to Chapters" />

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
