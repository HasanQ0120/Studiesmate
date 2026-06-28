"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/auth";

const GRADES = [
  { name: "Beta",    isBeta: true },
  { name: "Grade 1", isBeta: false },
  { name: "Grade 2", isBeta: false },
  { name: "Grade 3", isBeta: false },
  { name: "Grade 4", isBeta: false },
  { name: "Grade 5", isBeta: false },
  { name: "Grade 6", isBeta: false },
  { name: "Grade 7", isBeta: false },
  { name: "Grade 8", isBeta: false },
];

export default function GradesPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setIsLoggedIn(!!data.session);
    }).catch(() => {});
  }, []);

  function toggleExpand(name: string) {
    setExpandedCards((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  }

  return (
    <main className="min-h-screen bg-[#F9FAFB] pb-16">
      <div className="mx-auto max-w-6xl px-4 py-12">

        <h1 className="text-3xl font-bold text-[#111827] md:text-4xl">All Grade Tracks</h1>
        <p className="mt-2 text-base font-medium text-[#22C55E]">
          From Beta to Grade 8 — your complete learning journey
        </p>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {GRADES.map((g) => {
            const isExpanded = expandedCards.has(g.name);
            return (
              <div key={g.name} className="flex flex-col rounded-xl border border-[#E5E7EB] bg-white p-6 shadow-sm">

                {/* Badge row */}
                <div className="flex items-center justify-between">
                  {g.isBeta ? (
                    <span className="rounded-full bg-[#DCFCE7] px-3 py-1 text-xs font-bold text-[#16A34A]">Free</span>
                  ) : (
                    <span className="rounded-full bg-[#F3F4F6] px-3 py-1 text-xs font-bold text-[#9CA3AF]">Coming Soon</span>
                  )}
                  {g.isBeta ? (
                    <span className="text-sm font-bold text-[#22C55E]">Free</span>
                  ) : (
                    <span className="text-sm font-bold text-[#9CA3AF]">Coming Soon</span>
                  )}
                </div>

                {/* Grade name */}
                <h2 className="mt-4 text-xl font-bold text-[#111827]">{g.name}</h2>

                {/* Expandable */}
                <button
                  type="button"
                  onClick={() => toggleExpand(g.name)}
                  className="mt-2 w-fit text-xs text-[#9CA3AF] hover:text-[#6B7280] transition-colors"
                >
                  {isExpanded ? "What's included ↑" : "What's included ↓"}
                </button>
                {isExpanded && (
                  <p className="mt-2 text-xs leading-5 text-[#6B7280]">
                    1 lesson per subject · Math, English &amp; Science · Bilingual (English &amp; اردو) · Quiz + Worksheet included
                  </p>
                )}

                {/* Button */}
                <div className="mt-5 flex-1 flex items-end">
                  {g.isBeta ? (
                    <Link
                      href={isLoggedIn ? "/dashboard" : "/signup"}
                      className="flex w-full items-center justify-center rounded-xl bg-[#22C55E] py-3 text-sm font-semibold text-white hover:bg-[#16A34A] transition-colors"
                    >
                      Start Free →
                    </Link>
                  ) : (
                    <button
                      type="button"
                      disabled
                      className="flex w-full items-center justify-center rounded-xl bg-[#F3F4F6] py-3 text-sm font-semibold text-[#9CA3AF] cursor-default"
                    >
                      Coming Soon
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
