import Link from "next/link";
import Image from "next/image";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      {/* HERO (Blue) */}
      <section className="bg-[#0B2B5A] text-white">
        <div className="mx-auto max-w-6xl px-4 py-16 md:py-20">
          <div className="max-w-3xl">
            <p className="text-sm font-medium text-white/80">
              Learn calmly, one small step at a time.
            </p>

            <h1 className="mt-4 text-4xl font-semibold leading-tight tracking-tight md:text-5xl">
              Smart learning for school students,
              <br className="hidden md:block" />
              without stress.
            </h1>

            <p className="mt-5 text-base leading-7 text-white/85 md:text-lg">
              StudiesMate helps students practice daily with simple, bilingual
              lessons while parents stay informed and confident.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="/signup"
                className="rounded-xl bg-white px-5 py-3 text-sm font-semibold text-[#0B2B5A] hover:bg-white/95"
              >
                Start with Phase 1
              </Link>
              <Link
                href="/subjects"
                className="rounded-xl border border-white/30 px-5 py-3 text-sm font-semibold text-white hover:bg-white/10"
              >
                View subjects
              </Link>
            </div>

            <div className="mt-6 inline-flex rounded-lg bg-white/10 px-3 py-2 text-xs text-white/80">
              No ads • Calm experience • Guided learning
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS (White) */}
      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-4 py-14">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="text-xl font-semibold">How it works</h2>
              <p className="mt-2 max-w-2xl text-sm text-slate-700">
                A simple routine students can follow daily. Clear steps, small
                effort, steady progress.
              </p>
            </div>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-6">
              <div className="text-sm font-medium text-slate-600">Step 1</div>
              <div className="mt-2 text-lg font-semibold tracking-tight">
                Choose a subject
              </div>
              <p className="mt-2 text-sm leading-6 text-slate-700">
                Start with what feels difficult today. Keep it focused and
                manageable.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6">
              <div className="text-sm font-medium text-slate-600">Step 2</div>
              <div className="mt-2 text-lg font-semibold tracking-tight">
                Learn in small steps
              </div>
              <p className="mt-2 text-sm leading-6 text-slate-700">
                Short explanations designed for understanding, not memorizing.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6">
              <div className="text-sm font-medium text-slate-600">Step 3</div>
              <div className="mt-2 text-lg font-semibold tracking-tight">
                Practice and improve
              </div>
              <p className="mt-2 text-sm leading-6 text-slate-700">
                Quick checks build confidence and make progress visible over
                time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* VISION (MERGED) */}
      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-4 py-14">
          <div className="max-w-3xl rounded-2xl border border-slate-200 bg-white p-7">
            <h2 className="text-lg font-semibold">Our vision</h2>
            <p className="mt-3 text-sm leading-6 text-slate-700">
              StudiesMate is built to make learning clear, calm, and consistent.
              Students understand concepts, practice briefly, and build
              confidence without stress. The experience stays safe, focused, and
              parent-friendly from day one.
            </p>
          </div>
        </div>
      </section>

      {/* FOCUS (Blue section + image on right) */}
      <section className="bg-[#0B2B5A] text-white">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <div className="grid items-start gap-10 md:grid-cols-2">
            <div>
              <h3 className="text-2xl font-semibold tracking-tight md:text-3xl">
                What StudiesMate focuses on
              </h3>
              <p className="mt-3 max-w-xl text-base leading-7 text-white/80 md:text-lg">
                Simple learning that works daily. No clutter, no pressure.
              </p>

              <div className="mt-8 space-y-4">
                <div className="rounded-2xl border border-white/15 bg-white/10 p-6">
                  <h4 className="text-lg font-semibold md:text-xl">
                    Clarity first
                  </h4>
                  <p className="mt-2 text-sm leading-6 text-white/80 md:text-base">
                    Short explanations that focus on understanding, not
                    memorizing.
                  </p>
                </div>

                <div className="rounded-2xl border border-white/15 bg-white/10 p-6">
                  <h4 className="text-lg font-semibold md:text-xl">
                    Practice that builds confidence
                  </h4>
                  <p className="mt-2 text-sm leading-6 text-white/80 md:text-base">
                    Small checks that reinforce learning without overwhelming
                    students.
                  </p>
                </div>

                <div className="rounded-2xl border border-white/15 bg-white/10 p-6">
                  <h4 className="text-lg font-semibold md:text-xl">
                    Bilingual support
                  </h4>
                  <p className="mt-2 text-sm leading-6 text-white/80 md:text-base">
                    Help in Urdu and English so students don’t get stuck because
                    of language. Urdu is support language here, not a separate
                    subject.
                  </p>
                </div>
              </div>
            </div>

            <div className="relative mt-6 md:mt-16">
              <div className="mt-12 overflow-hidden rounded-2xl border border-white/15 bg-white/5 shadow-lg">
                <Image
                  src="/images/picture.png"
                  alt="Student learning"
                  width={1200}
                  height={900}
                  className="h-auto w-full object-cover"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* IMPACT / NUMBERS (White) */}
      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-4 py-14">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <h3 className="text-xl font-semibold">Phase 1 (Foundation)</h3>
              <p className="mt-2 max-w-2xl text-sm text-slate-700">
                We are building trust first. Everything stays controlled and
                simple.
              </p>
            </div>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-3">
            <Stat
              label="Core subjects"
              value="10"
              note="Math, English, Science & more"
            />
            <Stat
              label="Learning style"
              value="Short"
              note="Daily-friendly lessons"
            />
            <Stat label="AI usage" value="Limited" note="Guided, not unlimited" />
          </div>
        </div>
      </section>

      {/* WHY DIFFERENT (Blue) */}
      <section className="bg-[#0B2B5A] text-white">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <h3 className="text-2xl font-semibold tracking-tight md:text-3xl">
            Why StudiesMate feels different
          </h3>
          <p className="mt-3 max-w-2xl text-base leading-7 text-white/80 md:text-lg">
            Calm design, clear structure, and controlled learning. No noise.
          </p>

          <div className="mt-10 grid gap-5 md:grid-cols-2">
            <div className="rounded-2xl border border-white/15 bg-white/10 p-6">
              <h4 className="text-lg font-semibold md:text-xl">Built for trust</h4>
              <p className="mt-2 text-sm leading-6 text-white/80 md:text-base">
                Parent-friendly layout, calm tone, and clear expectations.
              </p>
            </div>

            <div className="rounded-2xl border border-white/15 bg-white/10 p-6">
              <h4 className="text-lg font-semibold md:text-xl">
                No ads, no distractions
              </h4>
              <p className="mt-2 text-sm leading-6 text-white/80 md:text-base">
                A clean experience that helps students focus on learning.
              </p>
            </div>

            {/* Card 3 - centered under the first two (no other layout changes) */}
            <div className="md:col-span-2 flex justify-center">
              <div className="w-full max-w-3xl rounded-2xl border border-white/15 bg-white/10 p-6">
                <h4 className="text-lg font-semibold md:text-xl">
                  Bilingual support
                </h4>
                <p className="mt-2 text-sm leading-6 text-white/80 md:text-base">
                  Help is available in English and Urdu so language doesn’t block
                  learning. Urdu is support language, not a subject track.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SUBJECTS AREA (White) */}
      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-4 py-14">
          <div className="flex items-end justify-between gap-6">
            <div>
              <h3 className="text-xl font-semibold">Subjects</h3>
              <p className="mt-2 text-sm text-slate-700">
                Start with the basics. Build consistency first.
              </p>
            </div>
            <Link
              href="/subjects"
              className="hidden rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-50 md:inline-flex"
            >
              View all
            </Link>
          </div>

          <div className="mt-8">
            <div className="rounded-2xl border border-white/15 bg-[#0B2B5A] p-7 text-white md:flex md:items-center md:justify-between">
              <div className="max-w-2xl">
                <h3 className="text-xl font-semibold">
                  Start with calm, consistent learning
                </h3>
                <p className="mt-2 text-sm leading-6 text-white/80">
                  Try Phase 1 and help us spot confusion. We’re building trust
                  and clarity first.
                </p>
              </div>
              <div className="mt-5 flex flex-wrap gap-3 md:mt-0">
                <Link
                  href="/signup"
                  className="inline-flex rounded-xl bg-white px-5 py-3 text-sm font-semibold text-[#0B2B5A] hover:bg-white/95"
                >
                  Start with Phase 1
                </Link>
                <Link
                  href="/subjects"
                  className="inline-flex rounded-xl border border-white/30 px-5 py-3 text-sm font-semibold text-white hover:bg-white/10"
                >
                  See subjects
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PARENT SECTION (White) */}
      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-4 py-14">
          <div className="rounded-2xl border border-slate-200 bg-white p-7 md:flex md:items-center md:justify-between">
            <div className="max-w-2xl">
              <h3 className="text-xl font-semibold">For Parents (Beta)</h3>
              <p className="mt-2 text-sm leading-6 text-slate-700">
                A simple preview to help parents understand progress and support
                daily learning. This expands after Phase 1 stabilizes.
              </p>
            </div>
            <div className="mt-5 md:mt-0">
              <Link
                href="/parent"
                className="inline-flex rounded-xl bg-[#0B2B5A] px-5 py-3 text-sm font-semibold text-white hover:bg-[#0A2550]"
              >
                Open Parent View
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function Stat({
  label,
  value,
  note,
}: {
  label: string;
  value: string;
  note: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6">
      <div className="text-sm font-medium text-slate-600">{label}</div>
      <div className="mt-2 text-3xl font-semibold tracking-tight">{value}</div>
      <div className="mt-2 text-sm text-slate-700">{note}</div>
    </div>
  );
}
