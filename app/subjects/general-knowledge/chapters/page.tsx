"use client";

import Link from "next/link";
import BackButton from "@/components/BackButton";

const SUBJECT_TITLE = "General Knowledge";
const SUBJECT_ID = "general-knowledge";

const CHAPTERS = [
  { id: "world-around-us", title: "World Around Us", desc: "Countries, flags, landmarks, and basic world facts." },
  { id: "science-everyday", title: "Everyday Science", desc: "Simple science in daily life, inventions, and discoveries." },
  { id: "space-planets", title: "Space & Planets", desc: "Sun, moon, planets, and basic space knowledge." },
  { id: "history-heroes", title: "History & Heroes", desc: "Famous people and major events (simple, age-appropriate)." },
  { id: "maps-directions", title: "Maps & Directions", desc: "Continents, oceans, directions, and reading simple maps." },
  { id: "nature-animals", title: "Nature & Animals", desc: "Habitats, animals, plants, and caring for nature." },
  { id: "health-safety", title: "Health & Safety", desc: "Hygiene, safety rules, and basic healthy habits." },
  { id: "current-awareness", title: "Current Awareness", desc: "Important ideas about the world today (kept simple)." },
  { id: "math-fun-facts", title: "Math Fun Facts", desc: "Patterns, puzzles, and brain teasers (light practice)." },
];

export default function GeneralKnowledgeChaptersPage() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      <div className="mx-auto max-w-5xl px-4 py-12">
        <BackButton href="/dashboard" label="Back to Dashboard" />

        <h1 className="mt-6 text-3xl font-semibold tracking-tight">{SUBJECT_TITLE}</h1>
        <p className="mt-2 text-sm text-slate-700">
          Choose a chapter to start learning. Content is designed for clarity and basics.
        </p>

        <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-3">
          {CHAPTERS.map((c) => (
            <div key={c.id} className="rounded-2xl border border-slate-200 bg-white p-6">
              <h2 className="text-base font-semibold">{c.title}</h2>
              <p className="mt-2 text-sm text-slate-700">{c.desc}</p>

              <Link
                href={`/subjects/${SUBJECT_ID}/chapters/${c.id}`}
                className="mt-5 inline-flex items-center justify-center rounded-xl bg-[#0B2B5A] px-4 py-2 text-sm font-semibold text-white hover:bg-[#0A2550]"
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
