"use client";

import Link from "next/link";
import BackButton from "@/components/BackButton";

const SUBJECT_TITLE = "History";
const SUBJECT_ID = "history";

const CHAPTERS = [
  {
    id: "early-civilizations",
    title: "Early Civilizations",
    desc: "How early humans lived and formed civilizations.",
  },
  {
    id: "ancient-egypt",
    title: "Ancient Egypt",
    desc: "Pharaohs, pyramids, and daily life in Egypt.",
  },
  {
    id: "ancient-indus",
    title: "Indus Valley Civilization",
    desc: "Harappa, Mohenjo-daro, and early planning.",
  },
  {
    id: "ancient-greece",
    title: "Ancient Greece",
    desc: "Democracy, philosophy, and Greek culture.",
  },
  {
    id: "ancient-rome",
    title: "Ancient Rome",
    desc: "Roman Empire, laws, and architecture.",
  },
  {
    id: "medieval-period",
    title: "Medieval Period",
    desc: "Castles, kings, and everyday life in medieval times.",
  },
  {
    id: "islamic-golden-age",
    title: "Islamic Golden Age",
    desc: "Science, learning, and culture in early Islamic history.",
  },
  {
    id: "subcontinent-history",
    title: "History of the Subcontinent",
    desc: "Key events and empires of South Asia.",
  },
];

export default function HistoryPage() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      <div className="mx-auto max-w-5xl px-4 py-12">
        <BackButton href="/dashboard" label="Back to Dashboard" />

        <h1 className="mt-6 text-3xl font-semibold tracking-tight">
          {SUBJECT_TITLE}
        </h1>
        <p className="mt-2 text-sm text-slate-700">
          Choose a chapter to start learning. Content is designed for clarity and basics.
        </p>

        <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-3">
          {CHAPTERS.map((c) => (
            <div
              key={c.id}
              className="rounded-2xl border border-slate-200 bg-white p-6"
            >
              <h2 className="text-base font-semibold">{c.title}</h2>
              <p className="mt-2 text-sm text-slate-700">{c.desc}</p>

              <Link
                href={`/subjects/${SUBJECT_ID}/chapters/${c.id}`}
                className="mt-4 inline-flex items-center rounded-xl bg-[#0B2B5A] px-4 py-2 text-sm font-semibold text-white hover:bg-[#0A2550]"
              >
                Open Chapter →
              </Link>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
