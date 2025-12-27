"use client";

import Link from "next/link";
import BackButton from "@/components/BackButton";

const SUBJECT_TITLE = "Computer / ICT";
const SUBJECT_ID = "computer";

const CHAPTERS = [
  { id: "computer-basics", title: "Computer Basics", desc: "What a computer is, how it works, and common types of devices." },
  { id: "using-software", title: "Using Software", desc: "Documents, presentations, and spreadsheets at a beginner level." },
  { id: "internet-safety", title: "Internet & Online Safety", desc: "Safe browsing, passwords, privacy, and responsible use." },
  { id: "data-file-management", title: "Data & File Management", desc: "Folders, files, storage, and how to organize work." },
  { id: "digital-communication", title: "Digital Communication", desc: "Email basics, messages, and online etiquette." },
  { id: "intro-to-coding", title: "Introduction to Coding", desc: "Basic logic, sequences, and beginner coding concepts." },
  { id: "hardware-devices", title: "Hardware & Devices", desc: "Parts of a computer, input/output devices, and peripherals." },
  { id: "problem-solving-logic", title: "Problem Solving & Logic", desc: "Patterns, steps, and thinking like a problem solver." },
];

export default function ComputerChaptersPage() {
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
