"use client";

import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";

const CHAPTERS = [
  {
    id: "numbers",
    title: "Numbers & Place Value",
    desc: "Understanding numbers, counting, and place value.",
  },
  {
    id: "addition-subtraction",
    title: "Addition & Subtraction",
    desc: "Basic operations with real-life examples.",
  },
  {
    id: "multiplication-division",
    title: "Multiplication & Division",
    desc: "Repeated addition, sharing, and grouping.",
  },
  {
    id: "fractions",
    title: "Fractions",
    desc: "Parts of a whole using simple visuals.",
  },
  {
    id: "decimals",
    title: "Decimals",
    desc: "Introduction to decimal numbers.",
  },
  {
    id: "measurement",
    title: "Measurement",
    desc: "Length, mass, and time basics.",
  },
  {
    id: "geometry",
    title: "Geometry",
    desc: "Shapes, angles, and spatial understanding.",
  },
  {
    id: "data-handling",
    title: "Data Handling",
    desc: "Simple graphs, tables, and charts.",
  },
  {
    id: "patterns",
    title: "Patterns & Sequences",
    desc: "Finding patterns and logical sequences.",
  },
  {
    id: "word-problems",
    title: "Word Problems",
    desc: "Applying maths to daily life situations.",
  },
];

export default function MathsChaptersPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-white px-6 py-10">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Mathematics
        </h1>
        <p className="text-gray-600 mb-10">
          Choose a chapter to start learning. Content is designed for clarity and basics.
        </p>

        {/* Chapters Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {CHAPTERS.map((chapter) => (
            <div
              key={chapter.id}
              className="bg-white border border-gray-200 rounded-xl p-6 
              shadow-sm hover:shadow-md transition-all"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {chapter.title}
              </h3>

              <p className="text-sm text-gray-600 mb-6">
                {chapter.desc}
              </p>

              <button
                onClick={() =>
                  router.push(`/subjects/maths/chapters/${chapter.id}`)
                }
                className="
                  inline-flex items-center gap-2
                  px-4 py-2 rounded-full
                  border border-blue-400
                  text-blue-600 text-sm font-medium
                  hover:bg-blue-50 transition
                "
              >
                Open Chapter
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        {/* Note */}
        <div className="mt-12 bg-slate-50 border border-slate-200 rounded-xl p-6 text-sm text-slate-600">
          <strong>Note:</strong> Lessons and exercises will be added gradually.
          This structure ensures consistency across all grades.
        </div>
      </div>
    </div>
  );
}
