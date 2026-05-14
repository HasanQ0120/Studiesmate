import Link from "next/link";
import BackButton from "@/components/BackButton";

const QUIZZES = [
  {
    id: "math-npv",
    title: "Numbers & Place Value",
    desc: "Place value, expanded form, and digit values.",
    href: "/quiz/math/place-value",
  },
  {
    id: "math-rwn",
    title: "Reading & Writing Whole Numbers",
    desc: "Reading, writing, and converting whole numbers.",
    href: "/quiz/math/3-forms",
  },
];

export default function MathQuizzesPage() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      <div className="mx-auto max-w-4xl px-4 py-12">
        <BackButton href="/dashboard" label="Back to Dashboard" />

        <h1 className="mt-6 text-3xl font-semibold tracking-tight">Mathematics Quizzes</h1>
        <p className="mt-2 text-sm text-slate-600">
          Choose a topic to start your quiz. 8 questions each.
        </p>

        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          {QUIZZES.map((q) => (
            <div
              key={q.id}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-200 hover:shadow-md"
            >
              <h2 className="text-lg font-semibold">{q.title}</h2>
              <p className="mt-2 text-sm text-slate-600">{q.desc}</p>
              <p className="mt-3 text-xs text-slate-400">8 questions · Multiple choice & fill in the blank</p>
              <Link
                href={q.href}
                className="mt-5 inline-flex items-center justify-center rounded-xl bg-[#0B2B5A] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#0A2550] transition-colors"
              >
                Start Quiz →
              </Link>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
