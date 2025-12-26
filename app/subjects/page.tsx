"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

const GRADES = [
  "Class 1",
  "Class 2",
  "Class 3",
  "Class 4",
  "Class 5",
  "Class 6",
  "Class 7",
  "Class 8",
];

const SUBJECTS = [
  {
    title: "Mathematics",
    desc: "Numbers, algebra, geometry, and problem solving.",
    icon: "➗",
  },
  {
    title: "English",
    desc: "Reading, writing, grammar, and vocabulary.",
    icon: "📘",
  },
  {
    title: "Science",
    desc: "Basics of physics, chemistry, and biology.",
    icon: "🧪",
  },
  {
    title: "Social Studies",
    desc: "People, places, maps, and how society works.",
    icon: "🌍",
  },
  {
    title: "Computer / ICT",
    desc: "Digital skills, typing, internet basics, and safety.",
    icon: "💻",
  },
  {
    title: "Geography",
    desc: "Maps, continents, climate, and environments.",
    icon: "🗺️",
  },
  {
    title: "History",
    desc: "Past events, timelines, and key stories of the world.",
    icon: "🏛️",
  },
  {
    title: "General Knowledge",
    desc: "Everyday facts, reasoning, and quick learning topics.",
    icon: "🧠",
  },
  {
    title: "Art",
    desc: "Drawing, creativity, colors, and basic design.",
    icon: "🎨",
  },
  {
    title: "Urdu (Support)",
    desc: "Helper explanations only (not a full course yet).",
    icon: "📝",
  },
];

function normalizeTitle(s: string) {
  return s.trim().toLowerCase();
}

export default function SubjectsPage() {
  const sp = useSearchParams();

  // selected class comes from query OR localStorage profile
  const selectedClass = useMemo(() => {
    const fromQuery = sp.get("class");
    if (fromQuery) return fromQuery;

    if (typeof window !== "undefined") {
      const raw = localStorage.getItem("studiesmate_profile");
      if (raw) {
        try {
          const p = JSON.parse(raw);
          if (p?.studentClass) return p.studentClass as string;
        } catch {}
      }
    }

    return "";
  }, [sp]);

  // selected subjects
  const [selected, setSelected] = useState<string[]>([]);

  // load previous selections
  useEffect(() => {
    try {
      const raw = localStorage.getItem("studiesmate_selected_subjects");
      if (!raw) return;
      const arr = JSON.parse(raw);
      if (Array.isArray(arr)) {
        setSelected(arr.map((x) => String(x)));
      }
    } catch {}
  }, []);

  // persist selections
  useEffect(() => {
    try {
      localStorage.setItem("studiesmate_selected_subjects", JSON.stringify(selected));
    } catch {}
  }, [selected]);

  function toggleSubject(title: string) {
    setSelected((prev) => {
      const key = normalizeTitle(title);
      const exists = prev.some((x) => normalizeTitle(x) === key);

      if (exists) return prev.filter((x) => normalizeTitle(x) !== key);
      return [...prev, title];
    });
  }

  function isSelected(title: string) {
    const key = normalizeTitle(title);
    return selected.some((x) => normalizeTitle(x) === key);
  }

  return (
    <main className="bg-white text-slate-900">
      <div className="mx-auto max-w-6xl px-4 py-12">
        {/* Header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">Subjects</h1>
            <p className="mt-2 text-sm text-slate-600">
              Select the subjects you want. You can change this anytime.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Link
              href="/auth"
              className="inline-flex w-fit items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-50"
            >
              Go to login / signup
            </Link>

            <Link
              href="/dashboard"
              className="inline-flex w-fit items-center justify-center rounded-xl bg-[#0B2B5A] px-4 py-2 text-sm font-semibold text-white hover:bg-[#0A2550]"
              title="Go back to dashboard"
            >
              Continue →
            </Link>
          </div>
        </div>

        {/* Grade reminder (read-only) */}
        <div className="mt-8">
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold text-slate-800">Grade</div>
            <div className="text-xs text-slate-500">
              {selectedClass ? `Selected: ${selectedClass}` : "Select class during login"}
            </div>
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            {GRADES.map((g) => {
              const active = selectedClass === g;
              return (
                <button
                  key={g}
                  type="button"
                  className={`cursor-default rounded-full border px-3 py-1 text-xs font-medium ${
                    active
                      ? "border-slate-300 bg-slate-100 text-slate-900"
                      : "border-slate-200 bg-white text-slate-600"
                  }`}
                  aria-disabled="true"
                  title="Class is selected during login"
                >
                  {g}
                </button>
              );
            })}
          </div>

          <div className="mt-2 text-xs text-slate-500">
            Class is chosen during login/signup. This is just a reminder.
          </div>
        </div>

        {/* Selected summary */}
        <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-5">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="text-sm font-semibold text-slate-900">Your selected subjects</div>
              <div className="mt-1 text-xs text-slate-600">
                Click a card to select. Selected subjects will show a tick.
              </div>
            </div>

            <div className="text-sm text-slate-700">
              Selected:{" "}
              <span className="font-semibold text-slate-900">{selected.length}</span>
            </div>
          </div>

          {selected.length > 0 ? (
            <div className="mt-3 flex flex-wrap gap-2">
              {selected.map((t) => (
                <span
                  key={t}
                  className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-800"
                >
                  {t}
                  <button
                    type="button"
                    onClick={() => toggleSubject(t)}
                    className="rounded-full bg-white px-2 py-0.5 text-[11px] font-semibold text-slate-700 hover:bg-slate-50"
                    title="Remove"
                  >
                    Remove
                  </button>
                </span>
              ))}
            </div>
          ) : (
            <div className="mt-3 text-sm text-slate-600">
              No subjects selected yet. Pick 2–4 to start.
            </div>
          )}
        </div>

        {/* Subjects grid */}
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {SUBJECTS.map((s) => {
            const chosen = isSelected(s.title);

            return (
              <button
                key={s.title}
                type="button"
                onClick={() => toggleSubject(s.title)}
                className={`relative text-left rounded-2xl border p-5 shadow-sm transition ${
                  chosen
                    ? "border-[#0B2B5A] bg-slate-50"
                    : "border-slate-200 bg-white hover:bg-slate-50"
                }`}
              >
                {/* Tick */}
                <div className="absolute right-4 top-4">
                  <div
                    className={`flex h-7 w-7 items-center justify-center rounded-full border text-sm font-bold ${
                      chosen
                        ? "border-[#0B2B5A] bg-[#0B2B5A] text-white"
                        : "border-slate-200 bg-white text-slate-300"
                    }`}
                    aria-hidden
                  >
                    ✓
                  </div>
                </div>

                <div className="flex items-start gap-3 pr-10">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 text-lg">
                    {s.icon}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-semibold">{s.title}</h3>
                      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-700">
                        Beta
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-slate-600">{s.desc}</p>
                  </div>
                </div>

                {/* Action hint */}
                <div className="mt-5 flex items-center justify-between">
                  <span className="text-xs text-slate-600">
                    {chosen ? "Selected" : "Click to select"}
                  </span>

                  <span
                    className={`rounded-xl px-3 py-2 text-xs font-semibold ${
                      chosen
                        ? "bg-[#0B2B5A] text-white"
                        : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {chosen ? "Selected ✓" : "Select"}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer note */}
        <div className="mt-10 rounded-2xl bg-slate-50 p-5 text-sm text-slate-600">
          <div className="font-semibold text-slate-800">Phase 1 note</div>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>Subjects can be selected now (saved locally in this browser)</li>
            <li>Grade is a reminder only (picked during login)</li>
            <li>In Phase 2, these will be saved to real accounts and admin reporting</li>
          </ul>
        </div>
      </div>
    </main>
  );
}
