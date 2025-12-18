import Link from "next/link";

function ParticleBackground() {
  const dots = [
    { left: "8%", top: "20%", dur: "18s", delay: "0.4s" },
    { left: "14%", top: "65%", dur: "22s", delay: "1.2s" },
    { left: "22%", top: "38%", dur: "16s", delay: "0.8s" },
    { left: "30%", top: "78%", dur: "26s", delay: "0.2s" },
    { left: "36%", top: "12%", dur: "20s", delay: "1.6s" },
    { left: "44%", top: "54%", dur: "24s", delay: "0.9s" },
    { left: "52%", top: "30%", dur: "19s", delay: "1.1s" },
    { left: "60%", top: "82%", dur: "27s", delay: "0.3s" },
    { left: "68%", top: "18%", dur: "21s", delay: "1.4s" },
    { left: "74%", top: "46%", dur: "25s", delay: "0.6s" },
    { left: "82%", top: "70%", dur: "23s", delay: "1.0s" },
    { left: "90%", top: "34%", dur: "17s", delay: "0.7s" },
  ];

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {dots.map((d, i) => (
        <span
          key={i}
          className="absolute h-2 w-2 rounded bg-white/10"
          style={{
            left: d.left,
            top: d.top,
            animationDuration: d.dur,
            animationDelay: d.delay,
            animationName: "floaty",
            animationTimingFunction: "linear",
            animationIterationCount: "infinite",
          }}
        />
      ))}
    </div>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      {/* Navbar */}
      <header className="sticky top-0 z-20 border-b border-white/10 bg-slate-950/70 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-500/90 font-bold">
              S
            </div>
            <div className="leading-tight">
              <div className="font-semibold">StudiesMate</div>
              <div className="text-xs text-slate-300">
                Learn calmly, one small step at a time.
              </div>
            </div>
          </div>

          {/* Nav */}
          <nav className="hidden items-center gap-8 text-sm text-slate-200 md:flex">
            <Link className="hover:text-white" href="/">Home</Link>

            <div className="group relative">
              <button className="flex items-center gap-1 hover:text-white" type="button">
                Courses <span className="text-slate-400">▼</span>
              </button>
              <div className="absolute left-0 mt-3 hidden w-56 rounded-xl border border-white/10 bg-slate-950/95 p-2 shadow-xl backdrop-blur group-hover:block">
                <Link className="block rounded-lg px-3 py-2 text-slate-200 hover:bg-white/5 hover:text-white" href="/subjects">
                  Explore subjects
                </Link>
                <Link className="block rounded-lg px-3 py-2 text-slate-200 hover:bg-white/5 hover:text-white" href="/parent">
                  Parent dashboard (beta)
                </Link>
              </div>
            </div>

            <a className="hover:text-white" href="#about">About us</a>
            <a className="hover:text-white" href="#vision">Vision</a>
          </nav>

          {/* Auth */}
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="rounded-full border border-white/15 px-5 py-2 text-sm hover:bg-white/5"
            >
              Log in
            </Link>
            <Link
              href="/login"
              className="rounded-full bg-blue-500 px-5 py-2 text-sm font-semibold hover:bg-blue-400"
            >
              Sign up
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative">
        {/* Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(900px_circle_at_50%_35%,rgba(59,130,246,0.18),transparent_55%)]" />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-950/95 to-slate-950" />
          <ParticleBackground />
        </div>

        <div className="relative mx-auto max-w-6xl px-6">
          <div className="min-h-[78vh] flex flex-col items-center justify-center text-center">
            <h1 className="text-4xl font-extrabold tracking-tight drop-shadow-sm md:text-6xl">
              Unlock Your Potential in
              <br />
              Learning and Confidence
            </h1>

            <p className="mt-5 max-w-2xl text-base text-slate-200/90 md:text-lg">
              Short lessons, smart practice, and a bilingual helper (English + Urdu) designed to
              build real understanding without stress.
            </p>

            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
              <Link
                href="/login"
                className="inline-flex items-center justify-center rounded-full bg-blue-500 px-7 py-3 font-semibold hover:bg-blue-400"
              >
                Get started
              </Link>

              <Link
                href="/subjects"
                className="inline-flex items-center justify-center rounded-full border border-white/20 px-7 py-3 font-semibold hover:bg-white/5"
              >
                Explore courses
              </Link>
            </div>

            <div className="mt-10 text-sm text-slate-300">
              Start with Classes 1–5, then expand step by step.
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
