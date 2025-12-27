"use client";

import Link from "next/link";
import BackButton from "@/components/BackButton";

const SUBJECT_TITLE = "Science";
const SUBJECT_ID = "science";

const CHAPTERS = [
  { id: "scientific-skills-safety", title: "Scientific Skills & Safety", desc: "Observation, experiments, tools, and lab safety basics." },
  { id: "living-things", title: "Living Things", desc: "Plants, animals, habitats, and life processes." },
  { id: "materials-matter", title: "Materials & States of Matter", desc: "Solids, liquids, gases, and material properties." },
  { id: "forces-motion", title: "Forces & Motion", desc: "Pushes, pulls, speed, and simple forces." },
  { id: "energy-heat", title: "Energy & Heat", desc: "Forms of energy, transfer, and temperature." },
  { id: "light-sound", title: "Light & Sound", desc: "Reflection, shadows, vibration, and sound basics." },
  { id: "electricity-magnetism", title: "Electricity & Magnetism", desc: "Simple circuits, components, and magnets." },
  { id: "earth-space", title: "Earth & Space", desc: "Earth, sun, moon, seasons, and space basics." },
];

export default function ScienceChaptersPage() {
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
