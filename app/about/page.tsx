import Link from "next/link";
import PageFade from "@/components/PageFade";

export default function AboutPage() {
  return (
    <PageFade>
    <main>

      {/* Hero */}
      <section className="bg-[#0F172A] px-4 py-20 text-center">
        <h1 className="text-4xl font-bold text-white md:text-5xl">About StudiesMate</h1>
        <p className="mx-auto mt-4 max-w-xl text-base text-[#9CA3AF]">
          Built for Pakistani students. Honest, bilingual, and distraction-free.
        </p>
      </section>

      {/* Section 1 — Mission + Stats */}
      <section className="bg-white px-4 py-16">
        <div className="mx-auto grid max-w-5xl gap-12 md:grid-cols-2 md:items-center">
          <div>
            <div className="text-5xl">🎯</div>
            <h2 className="mt-4 text-2xl font-bold text-[#111827]">Our Mission</h2>
            <p className="mt-4 text-base leading-7 text-[#374151]">
              Affordable, bilingual, personalized quality education for all Pakistani students. We believe every child deserves to understand — not just memorize.
            </p>
          </div>
          <div className="flex flex-col gap-4">
            <div className="rounded-xl border border-[#DCFCE7] bg-[#F0FDF4] px-5 py-4 text-center">
              <p className="text-2xl font-bold text-[#22C55E]">3 Subjects</p>
            </div>
            <div className="rounded-xl border border-[#DCFCE7] bg-[#F0FDF4] px-5 py-4 text-center">
              <p className="text-2xl font-bold text-[#22C55E]">2 Languages</p>
            </div>
            <div className="rounded-xl border border-[#DCFCE7] bg-[#F0FDF4] px-5 py-4 text-center">
              <p className="text-2xl font-bold text-[#22C55E]">Grades 1–8</p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 1b — Vision */}
      <section className="bg-[#F9FAFB] px-4 py-16 text-center">
        <div className="mx-auto max-w-5xl">
          <div className="text-5xl" style={{ margin: "0 auto" }}>🌍</div>
          <h2 className="mt-4 text-2xl font-bold text-[#111827]">Our Vision</h2>
          <p className="mt-4 text-base leading-7 text-[#374151]" style={{ maxWidth: "700px", margin: "16px auto 0" }}>
            We believe every Pakistani student deserves to actually understand what they&apos;re learning — not just memorize it for an exam. StudiesMate is built on a simple idea: teach clearly, in the language students think in, and never overwhelm them with more than they need. No gimmicks, no pressure — just honest lessons that respect how kids really learn.
          </p>
        </div>
      </section>

      {/* Section 2 — What We Offer */}
      <section className="bg-[#F9FAFB] px-4 py-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-center text-2xl font-bold text-[#111827]">What We Offer</h2>
          <div className="mt-10 grid gap-5 md:grid-cols-3">

            <div className="rounded-xl border border-[#E5E7EB] bg-white p-6 shadow-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#DCFCE7]">
                <svg className="h-5 w-5 text-[#22C55E]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.069A1 1 0 0121 8.882v6.236a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" />
                </svg>
              </div>
              <h3 className="mt-4 text-base font-bold text-[#111827]">Bilingual Video Lessons</h3>
              <p className="mt-2 text-sm text-[#6B7280]">English explanation with Urdu support — same video, switch anytime</p>
            </div>

            <div className="rounded-xl border border-[#E5E7EB] bg-white p-6 shadow-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#DBEAFE]">
                <svg className="h-5 w-5 text-[#3B82F6]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <circle cx="12" cy="12" r="9" />
                  <path strokeLinecap="round" d="M12 8v4m0 4h.01" />
                </svg>
              </div>
              <h3 className="mt-4 text-base font-bold text-[#111827]">Quizzes After Every Lesson</h3>
              <p className="mt-2 text-sm text-[#6B7280]">Instant feedback so students know exactly what to review</p>
            </div>

            <div className="rounded-xl border border-[#E5E7EB] bg-white p-6 shadow-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FEF3C7]">
                <svg className="h-5 w-5 text-[#F59E0B]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="mt-4 text-base font-bold text-[#111827]">Printable Worksheets</h3>
              <p className="mt-2 text-sm text-[#6B7280]">Take learning offline. Practice on paper, track results with parents</p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3 — Founder Note */}
      <section className="bg-white px-4 py-16">
        <div className="mx-auto max-w-2xl">
          <div className="rounded-2xl border border-[#E5E7EB] bg-white p-8 shadow-sm">
            <div className="text-center"><img src="/favicon.png" alt="StudiesMate" width={48} height={48} style={{ objectFit: "contain", display: "inline-block" }} /></div>
            <h2 className="mt-4 text-center text-lg font-bold text-[#111827]">A note from the founders</h2>
            <p className="mt-5 text-sm leading-7 text-[#374151]">
              We started StudiesMate because we watched students in Pakistan struggle — not because they were not smart, but because the teaching was not reaching them. Lessons in English that students do not fully understand. Tutors that cost more than families can afford. Pressure without clarity.
            </p>
            <p className="mt-4 text-sm leading-7 text-[#374151]">
              We believe every child deserves to truly understand what they are learning. Not just pass the exam — but actually get it. So we built StudiesMate: bilingual video lessons, aligned quizzes, printable worksheets, and a calm learning environment that works for Pakistani students from Grade 1 to Grade 8.
            </p>
            <p className="mt-4 text-sm leading-7 text-[#374151]">
              We are just two people with a mission. No big team. No investors. Just a belief that this matters — and that it is possible to do it right.
            </p>
            <p className="mt-6 text-sm font-semibold text-[#111827]">
              — Muhammad Hasan &amp; Muhammad Umer, Founders of StudiesMate
            </p>
          </div>
        </div>
      </section>

      {/* Section 4 — CTA */}
      <section className="bg-[#0F172A] px-4 py-16 text-center">
        <h2 className="text-3xl font-bold text-white">Ready to start learning?</h2>
        <p className="mt-3 text-base text-[#9CA3AF]">Join the beta — completely free.</p>
        <Link
          href="/"
          className="mt-8 inline-flex items-center justify-center rounded-full bg-[#22C55E] px-8 py-3.5 text-base font-semibold text-white transition-colors hover:bg-[#16A34A]"
        >
          Start Free Beta →
        </Link>
      </section>

    </main>
    </PageFade>
  );
}
