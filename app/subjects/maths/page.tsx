"use client";

import Link from "next/link";
import BackButton from "@/components/BackButton";

export default function MathSubjectPage() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      <div className="mx-auto max-w-4xl px-4 py-12">
        <BackButton href="/subjects" label="Back to Subjects" />

        <h1 className="mt-6 text-3xl font-semibold tracking-tight">Mathematics</h1>
        <p className="mt-2 text-sm text-slate-700">
          Phase 1: universal foundations. Chapters are the same for everyone for now.
        </p>

        <div className="mt-8 rounded-2xl border border-slate-200 bg-[#F1F7FF] p-6">
          <h2 className="text-base font-semibold">Start here</h2>
          <p className="mt-2 text-sm text-slate-700">
            Go to chapters and pick one. Lessons will be added gradually.
          </p>

          <Link
            href="/subjects/maths/chapters"
            className="mt-5 inline-flex items-center justify-center rounded-xl bg-[#0B2B5A] px-4 py-2 text-sm font-semibold text-white hover:bg-[#0A2550]"
          >
            Open Maths Chapters →
          </Link>
        </div>
      </div>
    </main>
  );
}
