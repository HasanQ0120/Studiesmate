import Link from "next/link";
import Reveal from "@/components/Reveal";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      <div className="mx-auto max-w-4xl px-4 py-12">

        <Reveal>
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-50"
          >
            ← Back to Home
          </Link>
        </Reveal>

        <Reveal delayMs={80}>
          <h1 className="mt-8 text-3xl font-semibold tracking-tight">
            About StudiesMate
          </h1>
        </Reveal>

        <Reveal delayMs={140}>
          <p className="mt-4 text-sm leading-6 text-slate-700">
            StudiesMate is a bilingual learning platform built for school students in Pakistan. We make concepts clear, learning calm, and progress visible — in both English and Urdu.
          </p>
        </Reveal>

        <Reveal delayMs={200}>
          <div className="mt-10 rounded-2xl border border-slate-200 bg-[#F1F7FF] p-6">
            <h2 className="text-lg font-semibold">Our Vision</h2>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-700">
              <li>Help students understand concepts, not just memorize them</li>
              <li>Support parents with transparency and progress tracking</li>
              <li>Build consistent learning habits without pressure</li>
              <li>Use technology only where it adds real value</li>
            </ul>
          </div>
        </Reveal>

        <Reveal delayMs={260}>
          <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-6">
            <h2 className="text-lg font-semibold">What We Offer</h2>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-700">
              <li>Bilingual video lessons — English explanation, Urdu support</li>
              <li>Quizzes aligned exactly to each lesson</li>
              <li>Parent progress tracking</li>
              <li>Clean, ad-free experience</li>
              <li>Grades 1–8 (starting with Beta Math)</li>
            </ul>
          </div>
        </Reveal>

        <Reveal delayMs={320}>
          <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6">
            <h2 className="text-lg font-semibold">Our Team</h2>
            <p className="mt-3 text-sm leading-6 text-slate-700">
              StudiesMate is built by a small team passionate about education in Pakistan. We are students and builders who believe every child deserves clarity in learning.
            </p>
          </div>
        </Reveal>

      </div>
    </main>
  );
}
