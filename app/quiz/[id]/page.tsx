"use client";

import { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { getQuizById } from "@/data/quizzes";

function normalizeTitle(s: string) {
  return s.trim().toLowerCase();
}

// Temporary syllabus map (you can expand anytime)
const SYLLABUS: Record<string, { title: string; topics: string[] }> = {
  mathematics: {
    title: "Mathematics Syllabus",
    topics: [
      "Numbers & Place Value",
      "Fractions & Decimals",
      "Percentages",
      "Ratio & Proportion",
      "Basic Algebra",
      "Geometry Basics",
      "Perimeter & Area",
      "Data Handling",
      "Probability Basics",
      "Word Problems",
    ],
  },
  english: {
    title: "English Syllabus",
    topics: [
      "Grammar Basics",
      "Tenses",
      "Parts of Speech",
      "Sentence Structure",
      "Reading Comprehension",
      "Vocabulary Building",
      "Writing Paragraphs",
      "Letter / Email Writing",
      "Punctuation",
      "Story Writing",
    ],
  },
  science: {
    title: "Science Syllabus",
    topics: [
      "Living Things",
      "Human Body Basics",
      "Plants & Photosynthesis",
      "States of Matter",
      "Forces & Motion",
      "Heat & Temperature",
      "Light & Sound",
      "Simple Electricity",
      "Earth & Space",
      "Scientific Method",
    ],
  },
  "social studies": {
    title: "Social Studies Syllabus",
    topics: [
      "Community & Society",
      "Citizenship",
      "Rules & Responsibilities",
      "Maps & Directions",
      "Public Services",
      "Culture & Traditions",
      "Basic Economics",
      "Governance Basics",
      "Environment & People",
      "Current Affairs Basics",
    ],
  },
  "computer / ict": {
    title: "Computer / ICT Syllabus",
    topics: [
      "Computer Basics",
      "Hardware vs Software",
      "Input / Output Devices",
      "Typing Practice",
      "Internet Basics",
      "Online Safety",
      "Files & Folders",
      "Basic MS Office",
      "Email Basics",
      "Strong Passwords",
    ],
  },
  geography: {
    title: "Geography Syllabus",
    topics: [
      "Continents & Oceans",
      "Maps & Scale",
      "Directions & Compass",
      "Landforms",
      "Weather vs Climate",
      "Natural Resources",
      "Population",
      "Environment & Pollution",
      "Earth Movements",
      "Pakistan Geography Basics",
    ],
  },
  history: {
    title: "History Syllabus",
    topics: [
      "What is History?",
      "Timelines",
      "Primary vs Secondary Sources",
      "Ancient Civilizations",
      "Important Empires",
      "Famous Leaders",
      "Key Inventions",
      "Local History Basics",
      "Cause & Effect",
      "Learning from the Past",
    ],
  },
  "general knowledge": {
    title: "General Knowledge Syllabus",
    topics: [
      "World Facts",
      "Countries & Capitals",
      "Science Facts",
      "Famous Places",
      "Important Days",
      "Basic Islam & Ethics",
      "Sports Basics",
      "Current Affairs Basics",
      "Everyday Reasoning",
      "Quick Quiz Mix",
    ],
  },
  islamiat: {
    title: "Islamiat Syllabus",
    topics: [
      "Beliefs (Iman)",
      "Worship (Ibadah)",
      "Seerah Basics",
      "Good Manners (Akhlaq)",
      "Qur’an Basics",
      "Hadith Basics",
      "Pillars of Islam",
      "Islamic History Basics",
      "Duas & Daily Life",
      "Respect & Rights",
    ],
  },
};

export default function QuizSyllabusPage() {
  const params = useParams<{ id: string }>();
  const [selectedTopic, setSelectedTopic] = useState<string>("");
  const [showNotReady, setShowNotReady] = useState(false);

  const quiz = useMemo(() => {
    const id = params?.id ? String(params.id) : "";
    return id ? getQuizById(id) : null;
  }, [params]);

  if (!quiz) {
    return (
      <main className="min-h-screen bg-white text-slate-900">
        <div className="mx-auto max-w-4xl px-4 py-12">
          <h1 className="text-2xl font-semibold">Quiz not found</h1>
          <p className="mt-2 text-sm text-slate-600">
            This quiz link is invalid or the quiz was removed.
          </p>
          <Link
            href="/dashboard"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#0B2B5A] px-4 py-2 text-sm font-semibold text-white hover:bg-[#0A2550]"
          >
            ← Back to dashboard
          </Link>
        </div>
      </main>
    );
  }

  const subjectKey = normalizeTitle(quiz.subjectTitle);
  const syllabus = SYLLABUS[subjectKey];

  return (
    <main className="min-h-screen bg-white text-slate-900">
      <div className="mx-auto max-w-4xl px-4 py-12">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold">{quiz.subjectTitle}</h1>
            <p className="mt-1 text-sm text-slate-600">
              {quiz.level ? `${quiz.level} • ` : ""}
              Select a topic to start a quiz.
            </p>
          </div>

          <div className="flex gap-2">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-50"
            >
              ← Dashboard
            </Link>
            <Link
              href="/quizzes"
              className="inline-flex items-center gap-2 rounded-xl bg-[#0B2B5A] px-4 py-2 text-sm font-semibold text-white hover:bg-[#0A2550]"
            >
              More quizzes →
            </Link>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold">
            {syllabus?.title || "Syllabus"}
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            Tap any topic. For now, it will show “Quiz is not generated yet”.
          </p>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {(syllabus?.topics || []).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => {
                  setSelectedTopic(t);
                  setShowNotReady(true);
                }}
                className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-left text-sm font-semibold text-slate-900 hover:bg-slate-50"
              >
                {t}
              </button>
            ))}
          </div>

          {showNotReady && (
            <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div className="text-sm font-semibold text-slate-900">
                {selectedTopic}
              </div>
              <div className="mt-1 text-sm text-slate-600">
                Quiz is not generated yet.
              </div>

              <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                <button
                  type="button"
                  onClick={() => setShowNotReady(false)}
                  className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-50"
                >
                  Continue browsing topics
                </button>

                <Link
                  href="/dashboard"
                  className="inline-flex items-center justify-center rounded-xl bg-[#0B2B5A] px-4 py-2 text-sm font-semibold text-white hover:bg-[#0A2550]"
                >
                  Go to dashboard
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
