import Link from "next/link";

export default function EnglishSubjectPage() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      <div className="mx-auto max-w-4xl px-4 py-12">
        <h1 className="text-3xl font-semibold tracking-tight">English</h1>
        <p className="mt-2 text-sm text-slate-700">
          Placeholder page for Phase 1. Lessons and quizzes will be added later.
        </p>

        <div className="mt-8 rounded-2xl border border-slate-200 bg-[#F1F7FF] p-6">
          <h2 className="text-base font-semibold">Coming next</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-700">
            <li>Short reading help</li>
            <li>Writing practice prompts</li>
            <li>Basic progress tracking</li>
          </ul>
        </div>

        <div className="mt-10 flex gap-3">
          <Link
            href="/subjects"
            className="inline-flex items-center gap-2 rounded-xl bg-[#0B2B5A] px-4 py-2 text-sm font-semibold text-white hover:bg-[#0A2550]"
          >
            ← Subjects
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl bg-[#0B2B5A] px-4 py-2 text-sm font-semibold text-white hover:bg-[#0A2550]"
          >
            Home
          </Link>
        </div>
      </div>
    </main>
  );
}
