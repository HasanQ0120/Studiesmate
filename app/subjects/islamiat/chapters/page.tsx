"use client";

import Link from "next/link";
import BackButton from "@/components/BackButton";

const SUBJECT_TITLE = "Islamiat";
const SUBJECT_ID = "islamiat";

const CHAPTERS = [
  {
    id: "pillars-of-islam",
    title: "Five Pillars of Islam",
    desc: "Shahadah, Salah, Zakah, Sawm, and Hajj (basic meaning and importance).",
  },
  {
    id: "beliefs-imaan",
    title: "Beliefs (Imaan)",
    desc: "Allah, Angels, Books, Prophets, Day of Judgment, and Qadr (simple overview).",
  },
  {
    id: "seerah",
    title: "Life of Prophet Muhammad ﷺ",
    desc: "Key events, character, and lessons from the Seerah (age-appropriate).",
  },
  {
    id: "quran-teachings",
    title: "Teachings of the Qur’an",
    desc: "Core values: truthfulness, kindness, justice, patience, and respect.",
  },
  {
    id: "hadith-sunnah",
    title: "Hadith & Sunnah",
    desc: "What they are, why they matter, and simple examples in daily life.",
  },
  {
    id: "ibadah-duas",
    title: "Ibadah & Duas",
    desc: "Daily worship habits, basic duas, and manners of making dua.",
  },
  {
    id: "akhlaq-adab",
    title: "Akhlaq & Adab",
    desc: "Good manners: honesty, respect, helping others, and good character.",
  },
  {
    id: "islamic-history-basics",
    title: "Islamic History Basics",
    desc: "Early Islam, Khulafaa-e-Rashideen (high-level, simple timeline).",
  },
  {
    id: "islam-in-daily-life",
    title: "Islam in Daily Life",
    desc: "Cleanliness, halal/haram basics, rights of others, and responsibility.",
  },
];

export default function IslamiatChaptersPage() {
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
