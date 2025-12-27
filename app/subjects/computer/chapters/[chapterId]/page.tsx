"use client";

import { useParams } from "next/navigation";
import BackButton from "@/components/BackButton";

const SUBJECT_TITLE = "Computer / ICT";
const SUBJECT_ID = "computer";

export default function ComputerChapterDetailPage() {
  const params = useParams();
  const chapterId = (params?.chapterId as string) || "chapter";

  const prettyTitle = chapterId
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  return (
    <main className="min-h-screen bg-white text-slate-900">
      <div className="mx-auto max-w-4xl px-4 py-12">
        <BackButton
          href={`/subjects/${SUBJECT_ID}/chapters`}
          label="Back to Chapters"
        />

        <h1 className="mt-6 text-3xl font-semibold tracking-tight">
          {prettyTitle}
        </h1>
        <p className="mt-2 text-sm text-slate-700">
          Phase 1: universal foundations for {SUBJECT_TITLE}. Lessons will be
          added gradually.
        </p>

        <div className="mt-8 rounded-2xl border border-slate-200 bg-[#F1F7FF] p-6">
          <h2 className="text-base font-semibold">Lessons (coming soon)</h2>
          <ul className="mt-3 list-disc pl-5 text-sm text-slate-700 space-y-2">
            <li>Concept explanation block (placeholder)</li>
            <li>Example block (placeholder)</li>
            <li>Practice block (placeholder)</li>
          </ul>
        </div>
      </div>
    </main>
  );
}
