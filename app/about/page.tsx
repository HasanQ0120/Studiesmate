import Link from "next/link";
import Reveal from "@/components/Reveal";

export default function AboutPrivacyPage() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      <div className="mx-auto max-w-4xl px-4 py-12">
        <Reveal>
          <h1 className="text-3xl font-semibold tracking-tight">
            About StudiesMate
          </h1>
        </Reveal>

        <Reveal delayMs={80}>
          <p className="mt-4 text-sm leading-6 text-slate-700">
            StudiesMate is built to make learning calm, focused, and easy to
            understand for school students. The goal is simple: reduce confusion,
            remove pressure, and help students build confidence through clear
            explanations and structured practice.
          </p>
        </Reveal>

        <Reveal delayMs={140}>
          <p className="mt-4 text-sm leading-6 text-slate-700">
            Many students struggle not because they lack ability, but because
            learning feels overwhelming. StudiesMate keeps lessons simple,
            progress visible, and the overall experience distraction-free.
          </p>
        </Reveal>

        <Reveal delayMs={200}>
          <p className="mt-4 text-sm leading-6 text-slate-700">
            StudiesMate follows a bilingual learning approach. Concepts are
            explained in English with Urdu support, so students can understand
            ideas clearly without feeling stuck because of language.
          </p>
        </Reveal>

        <Reveal delayMs={260}>
          <div className="mt-10 rounded-2xl border border-slate-200 bg-[#F1F7FF] p-6">
            <h2 className="text-lg font-semibold">Our Vision</h2>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-700">
              <li>Help students learn at their own pace without stress</li>
              <li>Support parents with clarity and transparency</li>
              <li>Encourage consistent learning habits, not cramming</li>
              <li>Use technology carefully, only where it adds real value</li>
            </ul>
          </div>
        </Reveal>

        <Reveal delayMs={320}>
          <div className="mt-10 rounded-2xl border border-slate-200 bg-slate-50 p-6">
            <h2 className="text-lg font-semibold">Privacy & Trust (Phase 1)</h2>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-700">
              <li>No advertisements or hidden distractions</li>
              <li>No selling or sharing of user data</li>
              <li>
                Only essential account and learning-related information is stored
                during Phase 1
              </li>
              <li>AI features are limited, guided, and education-focused</li>
            </ul>
          </div>
        </Reveal>

        <Reveal delayMs={380}>
          <p className="mt-6 text-sm leading-6 text-slate-600">
            StudiesMate is currently in its early phase. Features will grow
            gradually, with student well-being and learning quality kept as the
            top priority.
          </p>
        </Reveal>

        <Reveal delayMs={440}>
          <div className="mt-10">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-xl bg-[#0B2B5A] px-4 py-2 text-sm font-semibold text-white hover:bg-[#0A2550]"
            >
              ← Back to home
            </Link>
          </div>
        </Reveal>
      </div>
    </main>
  );
}
