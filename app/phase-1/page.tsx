"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Reveal from "@/components/Reveal";

export default function Phase1Page() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setReady(true));
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <main
      className={[
        "min-h-screen bg-white text-slate-900",
        "transition-opacity duration-500 ease-out",
        ready ? "opacity-100" : "opacity-0",
      ].join(" ")}
    >
      {/* Top header area */}
      <section className="bg-[#0B2B5A] text-white">
        <div className="mx-auto max-w-6xl px-4 py-14">
          <Reveal className="max-w-3xl">
            <p className="text-sm font-medium text-white/80">
              Early Access (Beta)
            </p>

            <h1 className="mt-4 text-3xl font-semibold md:text-4xl">
              Phase 1 (Free Beta)
            </h1>

            <p className="mt-4 text-base leading-7 text-white/85 md:text-lg">
              Phase 1 beta is free for early users. Try the experience, practice
              with real lessons, and share feedback before the full Phase 1 paid
              launch.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href="/signup"
                className="rounded-xl bg-white px-5 py-3 text-sm font-semibold text-[#0B2B5A] hover:bg-white/95 hover:-translate-y-0.5"
              >
                Start Phase 1 (Free Beta)
              </Link>

              <Link
                href="/"
                className="rounded-xl border border-white/30 px-5 py-3 text-sm font-semibold text-white hover:bg-white/10 hover:-translate-y-0.5"
              >
                Back to Home
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Cards */}
      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-4 py-14">
          <Reveal>
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
              {/* Card 1 */}
              <Reveal>
                <div className="rounded-2xl border border-slate-200 p-6 hover:-translate-y-1 hover:shadow-lg transition-all duration-200">
                  <h2 className="text-lg font-semibold">What is Phase 1</h2>
                  <p className="mt-2 text-sm leading-6 text-slate-700">
                    Phase 1 is the complete Classes 1–8 learning system with
                    lessons and quizzes. The beta gives early access to a small
                    part of Phase 1 before full launch.
                  </p>
                </div>
              </Reveal>

              {/* Card 2 */}
              <Reveal delayMs={80}>
                <div className="rounded-2xl border border-slate-200 p-6 hover:-translate-y-1 hover:shadow-lg transition-all duration-200">
                  <h2 className="text-lg font-semibold">
                    What the Free Beta includes
                  </h2>
                  <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-700">
                    <li>• Class 4 Math only</li>
                    <li>• Core math lessons</li>
                    <li>• Practice quizzes for understanding</li>
                    <li>• Urdu + English support</li>
                    <li>• Feedback submission</li>
                  </ul>
                </div>
              </Reveal>

              {/* Card 3 */}
              <Reveal delayMs={160}>
                <div className="rounded-2xl border border-slate-200 p-6 hover:-translate-y-1 hover:shadow-lg transition-all duration-200">
                  <h2 className="text-lg font-semibold">
                    What Full Phase 1 will include
                  </h2>
                  <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-700">
                    <li>• All Class 1–8 subjects</li>
                    <li>• Full lessons and quizzes</li>
                    <li>• Bilingual explanations</li>
                    <li>• Parent progress tracking</li>
                  </ul>
                </div>
              </Reveal>

              {/* Card 4 */}
              <Reveal delayMs={240}>
                <div className="rounded-2xl border border-slate-200 p-6 hover:-translate-y-1 hover:shadow-lg transition-all duration-200">
                  <h2 className="text-lg font-semibold">Pricing</h2>
                  <p className="mt-2 text-sm leading-6 text-slate-700">
                    Phase 1 beta is free. Full Phase 1 will be paid after beta
                    stabilizes. No ads.
                  </p>
                </div>
              </Reveal>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
