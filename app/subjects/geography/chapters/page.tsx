"use client";

import Link from "next/link";
import BackButton from "@/components/BackButton";

const SUBJECT_TITLE = "Geography";
const SUBJECT_ID = "geography";

const CHAPTERS = [
  { id: "maps-globes", title: "Maps & Globes", desc: "Directions, symbols, scale, globes, and basic map reading." },
  { id: "continents-oceans", title: "Continents & Oceans", desc: "Where places are on Earth and how to locate them." },
  { id: "weather-climate", title: "Weather & Climate", desc: "Weather vs climate, seasons, rainfall, and temperature." },
  { id: "landforms", title: "Landforms", desc: "Mountains, plains, rivers, deserts, and how land changes." },
  { id: "water-world", title: "Water on Earth", desc: "Rivers, lakes, oceans, water cycle, and water use." },
  { id: "natural-resources", title: "Natural Resources", desc: "Types of resources, conservation, and responsible use." },
  { id: "population-settlements", title: "People & Settlements", desc: "Where people live, cities vs villages, and basic population ideas." },
  { id: "environment", title: "Environment & Care for Earth", desc: "Pollution, recycling, and protecting nature." },
];

export default function GeographyChaptersPage() {
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
