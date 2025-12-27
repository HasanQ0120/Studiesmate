"use client";

import { useParams } from "next/navigation";
import BackButton from "@/components/BackButton";

const SUBJECT_TITLE = "Islamiat";
const SUBJECT_ID = "islamiat";

const CHAPTER_META: Record<string, { title: string; desc: string }> = {
  "pillars-of-islam": {
    title: "Five Pillars of Islam",
    desc: "Shahadah, Salah, Zakah, Sawm, and Hajj (basic meaning and importance).",
  },
  "beliefs-imaan": {
    title: "Beliefs (Imaan)",
    desc: "Allah, Angels, Books, Prophets, Day of Judgment, and Qadr (simple overview).",
  },
  seerah: {
    title: "Life of Prophet Muhammad ﷺ",
    desc: "Key events, character, and lessons from the Seerah (age-appropriate).",
  },
  "quran-teachings": {
    title: "Teachings of the Qur’an",
    desc: "Core values: truthfulness, kindness, justice, patience, and respect.",
  },
  "hadith-sunnah": {
    title: "Hadith & Sunnah",
    desc: "What they are, why they matter, and simple examples in daily life.",
  },
  "ibadah-duas": {
    title: "Ibadah & Duas",
    desc: "Daily worship habits, basic duas, and manners of making dua.",
  },
  "akhlaq-adab": {
    title: "Akhlaq & Adab",
    desc: "Good manners: honesty, respect, helping others, and good character.",
  },
  "islamic-history-basics": {
    title: "Islamic History Basics",
    desc: "Early Islam, Khulafaa-e-Rashideen (high-level, simple timeline).",
  },
  "islam-in-daily-life": {
    title: "Islam in Daily Life",
    desc: "Cleanliness, halal/haram basics, rights of others, and responsibility.",
  },
};

export default function IslamiatChapterPage() {
  const params = useParams<{ chapterId?: string }>();
  const chapterId = decodeURIComponent(params?.chapterId ?? "");

  const meta = CHAPTER_META[chapterId];
  const title = meta?.title ?? `Unknown chapter: ${chapterId || "(empty)"}`;
  const desc =
    meta?.desc ??
    "This chapter id does not exist in CHAPTER_META. Fix the id mapping.";

  return (
    <main className="min-h-screen bg-white text-slate-900">
      <div className="mx-auto max-w-5xl px-4 py-12">
        {/* ✅ SINGLE back button only */}
        <BackButton
          href={`/subjects/${SUBJECT_ID}/chapters`}
          label="Back to Chapters"
        />

        <h1 className="mt-6 text-3xl font-semibold tracking-tight">
          {SUBJECT_TITLE} • {title}
        </h1>
        <p className="mt-2 text-sm text-slate-700">{desc}</p>

        <div className="mt-10 rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="text-base font-semibold">Lesson coming soon</h2>
          <p className="mt-2 text-sm text-slate-700">
            We’ll add the full lesson + examples + quiz here.
          </p>
        </div>
      </div>
    </main>
  );
}
