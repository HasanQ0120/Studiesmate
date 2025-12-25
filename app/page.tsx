import Link from "next/link";
import Image from "next/image";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      {/* Top Nav */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0B2B5A] text-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-lg font-semibold tracking-tight">StudiesMate</span>
          </Link>

          <nav className="hidden items-center gap-6 text-sm md:flex">
            <Link href="/" className="opacity-95 hover:opacity-100">
              Home
            </Link>

            <div className="group relative">
              <button
                type="button"
                className="flex items-center opacity-95 hover:opacity-100"
                aria-label="Courses menu"
              >
                Courses
              </button>

              <div className="invisible absolute left-0 mt-3 w-56 rounded-xl border border-white/15 bg-white/95 p-2 text-slate-900 shadow-lg opacity-0 backdrop-blur transition group-hover:visible group-hover:opacity-100">
                <Link
                  href="/subjects"
                  className="block rounded-lg px-3 py-2 text-sm hover:bg-slate-100"
                >
                  Explore subjects
                </Link>
                <Link
                  href="/parent"
                  className="block rounded-lg px-3 py-2 text-sm hover:bg-slate-100"
                >
                  Parent dashboard (beta)
                </Link>
              </div>
            </div>

            <Link href="/about" className="opacity-95 hover:opacity-100">
              About us
            </Link>

            <Link href="/subjects" className="opacity-95 hover:opacity-100">
              StudiesMate
            </Link>

            <Link href="/parent" className="opacity-95 hover:opacity-100">
              Parent dashboard
            </Link>
          </nav>

          <div className="flex items-center gap-2">
            <Link
              href="/login"
              className="rounded-lg px-3 py-2 text-sm font-medium text-white/90 hover:text-white"
            >
              Log in
            </Link>
            <Link
              href="/signup"
              className="rounded-lg bg-white px-3 py-2 text-sm font-semibold text-[#0B2B5A] hover:bg-white/95"
            >
              Sign up
            </Link>
          </div>
        </div>
      </header>

      {/* HERO (Blue) */}
      <section className="bg-[#0B2B5A] text-white">
        <div className="mx-auto max-w-6xl px-4 py-16 md:py-20">
          <div className="max-w-3xl">
            <p className="text-sm font-medium text-white/80">
              Learn calmly, one small step at a time.
            </p>

            <h1 className="mt-4 text-4xl font-semibold leading-tight tracking-tight md:text-5xl">
              Unlock Your Potential in <br className="hidden md:block" />
              Learning and Confidence
            </h1>

            <p className="mt-5 text-base leading-7 text-white/85 md:text-lg">
              Short lessons, smart practice, and bilingual support (English + Urdu)
              designed to build real understanding without stress.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="/signup"
                className="rounded-xl bg-white px-5 py-3 text-sm font-semibold text-[#0B2B5A] hover:bg-white/95"
              >
                Get started
              </Link>
              <Link
                href="/subjects"
                className="rounded-xl border border-white/30 px-5 py-3 text-sm font-semibold text-white hover:bg-white/10"
              >
                Explore subjects
              </Link>
            </div>

            <div className="mt-6 inline-flex rounded-lg bg-white/10 px-3 py-2 text-xs text-white/80">
              No ads • Calm experience • Guided learning
            </div>
          </div>
        </div>
      </section>

      {/* VISION + MISSION (White) - STACKED */}
      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-4 py-14">
          <div className="space-y-6">
            <div className="rounded-2xl border border-slate-200 p-6">
              <h2 className="text-lg font-semibold">StudiesMate Vision</h2>
              <p className="mt-3 text-sm leading-6 text-slate-700">
                Make learning feel clear, calm, and consistent for every student, so
                progress becomes a habit, not a struggle.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 p-6">
              <h2 className="text-lg font-semibold">Our Mission</h2>
              <p className="mt-3 text-sm leading-6 text-slate-700">
                Give students a simple path: understand the concept, practice it
                briefly, and build confidence. Keep the experience safe and
                parent-friendly from day one.
              </p>
            </div>
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
                  <h4 className="text-lg font-semibold md:text-xl">Clarity first</h4>
                  <p className="mt-2 text-sm leading-6 text-white/80 md:text-base">
                    Short explanations that focus on understanding, not memorizing.
                  </p>
                </div>

                <div className="rounded-2xl border border-white/15 bg-white/10 p-6">
                  <h4 className="text-lg font-semibold md:text-xl">
                    Practice that builds confidence
                  </h4>
                  <p className="mt-2 text-sm leading-6 text-white/80 md:text-base">
                    Small checks that reinforce learning without overwhelming students.
                  </p>
                </div>

                <div className="rounded-2xl border border-white/15 bg-white/10 p-6">
                  <h4 className="text-lg font-semibold md:text-xl">Bilingual support</h4>
                  <p className="mt-2 text-sm leading-6 text-white/80 md:text-base">
                    Help in Urdu and English so students don’t get stuck because of language.
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
                We are building trust first. Everything stays controlled and simple.
              </p>
            </div>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-3">
            <Stat label="Core subjects" value="3" note="Math, English, Urdu" />
            <Stat label="Learning style" value="Short" note="Daily-friendly lessons" />
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
              <h4 className="text-lg font-semibold md:text-xl">No noise</h4>
              <p className="mt-2 text-sm leading-6 text-white/80 md:text-base">
                No flashy distractions. Students focus on learning.
              </p>
            </div>

            <div className="rounded-2xl border border-white/15 bg-white/10 p-6">
              <h4 className="text-lg font-semibold md:text-xl">Step-by-step progress</h4>
              <p className="mt-2 text-sm leading-6 text-white/80 md:text-base">
                Understand → practice → improve, consistently.
              </p>
            </div>

            <div className="rounded-2xl border border-white/15 bg-white/10 p-6">
              <h4 className="text-lg font-semibold md:text-xl">Controlled AI</h4>
              <p className="mt-2 text-sm leading-6 text-white/80 md:text-base">
                AI supports learning. It does not replace thinking.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SUBJECTS GRID (White) */}
      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-4 py-14">
          <div className="flex items-end justify-between gap-6">
            <div>
              <h3 className="text-xl font-semibold">Explore subjects</h3>
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

          <div className="mt-8 grid gap-5 md:grid-cols-3">
            <SubjectCard
              title="Math"
              desc="Clear steps and practice to strengthen fundamentals."
              href="/subjects/math"
              cta="Start Math"
            />
            <SubjectCard
              title="English"
              desc="Improve reading and writing with simple explanations."
              href="/subjects/english"
              cta="Start English"
            />
            <SubjectCard
              title="Urdu"
              desc="Learn with bilingual support for confidence and clarity."
              href="/subjects/urdu"
              cta="Start Urdu"
            />
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

      {/* FOOTER (Blue) */}
      <footer className="bg-[#0B2B5A] text-white">
        <div className="mx-auto max-w-6xl px-4 py-10">
          <div className="grid gap-8 md:grid-cols-3">
            <div>
              <div className="text-lg font-semibold">StudiesMate</div>
              <p className="mt-2 text-sm text-white/80">Calm learning. Clear progress.</p>
              <p className="mt-4 text-xs text-white/65">
                Phase 1 focuses on trust and clarity, not hype.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <Link href="/about" className="text-white/85 hover:text-white">
                About & Privacy
              </Link>
              <Link href="/vision" className="text-white/85 hover:text-white">
                Vision
              </Link>
              <Link href="/subjects" className="text-white/85 hover:text-white">
                Subjects
              </Link>
              <Link href="/parent" className="text-white/85 hover:text-white">
                Parent
              </Link>
              <Link href="/login" className="text-white/85 hover:text-white">
                Login
              </Link>
              <Link href="/signup" className="text-white/85 hover:text-white">
                Sign up
              </Link>
            </div>

            <div>
              <div className="text-sm font-semibold">Contact</div>
              <p className="mt-2 text-sm text-white/80">
                If you’re testing Phase 1 and spot confusion, send feedback.
              </p>
              <p className="mt-3 text-xs text-white/65">
                (Use your preferred contact route later.Keep it simple for now.)
              </p>
            </div>
          </div>

          <div className="mt-10 border-t border-white/15 pt-6 text-xs text-white/65">
            © {new Date().getFullYear()} StudiesMate. All rights reserved.
          </div>
        </div>
      </footer>
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

function SubjectCard({
  title,
  desc,
  href,
  cta,
}: {
  title: string;
  desc: string;
  href: string;
  cta: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6">
      <h4 className="text-base font-semibold">{title}</h4>
      <p className="mt-2 text-sm leading-6 text-slate-700">{desc}</p>
      <Link
        href={href}
        className="mt-5 inline-flex w-fit rounded-xl bg-[#0B2B5A] px-4 py-2 text-sm font-semibold text-white hover:bg-[#0A2550]"
      >
        {cta}
      </Link>
    </div>
  );
}
