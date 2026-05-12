"use client";

import BackButton from "@/components/BackButton";
import { Suspense } from "react";
import PageEnter from "@/components/PageEnter";

const BETA_SUBJECT = "Mathematics";

const SUBJECTS = [
  { title: "Mathematics", desc: "Numbers, algebra, geometry, and problem solving.", icon: "➗" },
  { title: "English", desc: "Reading, writing, grammar, and vocabulary.", icon: "📘" },
  { title: "Science", desc: "Basics of physics, chemistry, and biology.", icon: "🧪" },
  { title: "Social Studies", desc: "People, places, maps, and how society works.", icon: "🌍" },
  { title: "Computer / ICT", desc: "Digital skills, typing, internet basics, and safety.", icon: "💻" },
  { title: "Geography", desc: "Maps, continents, climate, and environments.", icon: "🗺️" },
  { title: "History", desc: "Past events, timelines, and key stories of the world.", icon: "🏛️" },
  { title: "General Knowledge", desc: "Everyday facts, reasoning, and quick learning topics.", icon: "🧠" },
  { title: "Islamiat", desc: "Beliefs, worship, Seerah, and Islamic manners.", icon: "🕌" },
];

function normalizeTitle(s: string) {
  return s.trim().toLowerCase();
}

export default function SubjectsPage() {
  return (
    <PageEnter>
      <Suspense fallback={<div className="p-6 text-slate-600">Loading subjects…</div>}>
        <SubjectsPageInner />
      </Suspense>
    </PageEnter>
  );
}

function SubjectsPageInner() {
  return (
    <main className="bg-white text-slate-900">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <BackButton href="/" label="Back to Home" />

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">Subjects</h1>
            <p className="mt-2 text-sm text-slate-600">
              Select the subjects you want. You can change this anytime.
            </p>

            <p className="mt-3 text-sm text-slate-600">
              <span className="font-semibold">Phase 1 note:</span> Each subject includes 2 core
              chapters with 2 quizzes. More chapters will be added on the launch of phase 1.
            </p>
          </div>
        </div>

        <div className="mt-8">
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
            Beta — Math only unlocked
          </span>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {SUBJECTS.map((s) => {
            const unlocked = normalizeTitle(s.title) === normalizeTitle(BETA_SUBJECT);
            const locked = !unlocked;

            return (
              <div
                key={s.title}
                className={`relative rounded-2xl border p-5 text-left shadow-sm ${
                  unlocked
                    ? "border-[#0B2B5A] bg-slate-50"
                    : "border-slate-200 bg-white"
                } ${locked ? "opacity-60" : ""}`}
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 text-lg">
                    {s.icon}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-semibold">{s.title}</h3>

                      {locked ? (
                        <span className="rounded-full bg-slate-200 px-2 py-0.5 text-[11px] font-semibold text-slate-700">
                          Locked
                        </span>
                      ) : (
                        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-700">
                          Beta
                        </span>
                      )}
                    </div>

                    <p className="mt-1 text-sm text-slate-600">{s.desc}</p>

                    {locked && (
                      <p className="mt-2 text-xs text-slate-500">
                        Available in Full Phase 1.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
