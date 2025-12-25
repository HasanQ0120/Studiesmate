import Link from "next/link";

export default function AboutPrivacyPage() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      <div className="mx-auto max-w-4xl px-4 py-12">
        <h1 className="text-3xl font-semibold tracking-tight">About StudiesMate</h1>
        <p className="mt-4 text-sm leading-6 text-slate-700">
          StudiesMate is built to help students learn calmly with clear explanations
          and simple practice. Phase 1 focuses on trust, clarity, and a parent-friendly experience.
        </p>

        <div className="mt-10 rounded-2xl border border-slate-200 bg-[#F1F7FF] p-6">
          <h2 className="text-lg font-semibold">Privacy (Phase 1)</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-700">
            <li>No ads or distractions</li>
            <li>No selling of user data</li>
            <li>Only essential data is collected</li>
            <li>AI usage is limited and guided</li>
          </ul>
        </div>

        <div className="mt-10">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl bg-[#0B2B5A] px-4 py-2 text-sm font-semibold text-white hover:bg-[#0A2550]"
          >
            ← Back to home
          </Link>
        </div>
      </div>
    </main>
  );
}
