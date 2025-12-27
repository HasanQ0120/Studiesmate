"use client";

import Link from "next/link";
import BackButton from "@/components/BackButton";

const SUBJECT_TITLE = "Social Studies";
const SUBJECT_ID = "social-studies";

const CHAPTERS = [
  { id: "myself-family-community", title: "Myself, Family & Community", desc: "Roles at home, helping others, and community life." },
  { id: "citizenship-responsibility", title: "Citizenship & Responsibility", desc: "Rules, rights, duties, and being a good citizen." },
  { id: "culture-traditions", title: "Culture & Traditions", desc: "Festivals, traditions, values, and respecting differences." },
  { id: "maps-directions", title: "Maps & Directions", desc: "Maps, symbols, simple directions, and places around us." },
{ id: "environment-caring-earth", title: "Environment & Caring for Earth", desc: "Cleanliness, recycling, resources, and protecting nature." },
  { id: "basic-economics", title: "Basic Economics", desc: "Needs vs wants, money basics, saving, and simple trade." },
  { id: "history-around-us", title: "History Around Us", desc: "Past vs present, timelines, and local history basics." },
  { id: "government-services", title: "Government & Services", desc: "What governments do and services in a community." },
];

export default function SocialStudiesChaptersPage() {
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
