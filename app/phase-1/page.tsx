"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/auth";

const betaFeatures = [
  "1 Math video lesson",
  "1 English video lesson",
  "1 Science video lesson",
  "3 aligned quizzes (one per subject)",
  "Bilingual Slider (English + Urdu)",
  "Free forever",
  "📄 Worksheets 🔒 Available in paid grades",
];

const grade4Features = [
  "Full Math course",
  "Full English course",
  "Full Science course",
  "Bilingual video lessons",
  "Quizzes aligned to every lesson",
  "Downloadable worksheets",
  "Bilingual Slider on every video",
  "Parent progress tracking",
];

const otherFeatures = [
  "Full Math, English & Science course",
  "Bilingual video lessons",
  "Quizzes aligned to every lesson",
  "Downloadable worksheets",
  "Bilingual Slider",
  "Parent progress tracking",
  "Coming Soon",
];

const GRADES = [
  { name: "Beta",    desc: "2 Math lessons + 2 quizzes. Free forever.",        price: "Free",            blurPrice: false, isBeta: true,  status: null,           features: betaFeatures },
  { name: "Grade 1", desc: "Full syllabus included. Math, English & Science.", price: "Rs. 800/month",   blurPrice: true,  isBeta: false, status: "coming-soon",  features: otherFeatures },
  { name: "Grade 2", desc: "Full syllabus included. Math, English & Science.", price: "Rs. 1,000/month", blurPrice: true,  isBeta: false, status: "coming-soon",  features: otherFeatures },
  { name: "Grade 3", desc: "Full syllabus included. Math, English & Science.", price: "Rs. 1,200/month", blurPrice: true,  isBeta: false, status: "coming-soon",  features: otherFeatures },
  { name: "Grade 4", desc: "Full syllabus included. Math, English & Science.", price: "Rs. 1,500/month", blurPrice: true,  isBeta: false, status: "in-progress",  features: grade4Features },
  { name: "Grade 5", desc: "Full syllabus included. Math, English & Science.", price: "Rs. 2,000/month", blurPrice: true,  isBeta: false, status: "coming-soon",  features: otherFeatures },
  { name: "Grade 6", desc: "Full syllabus included. Math, English & Science.", price: "Rs. 2,500/month", blurPrice: true,  isBeta: false, status: "coming-soon",  features: otherFeatures },
  { name: "Grade 7", desc: "Full syllabus included. Math, English & Science.", price: "Rs. 3,000/month", blurPrice: true,  isBeta: false, status: "coming-soon",  features: otherFeatures },
  { name: "Grade 8", desc: "Full syllabus included. Math, English & Science.", price: "Rs. 3,500/month", blurPrice: true,  isBeta: false, status: "coming-soon",  features: otherFeatures },
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
    <main className="min-h-screen bg-white text-slate-900 pb-16">
      <div className="mx-auto max-w-6xl px-4 py-14">
        <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
          Choose Your Grade
        </h1>
        <p className="mt-3 text-base text-slate-600">
          Start free with Beta or unlock full access for your child's grade.
        </p>
        <p className="mt-2 text-sm italic text-slate-400">
          All grades include Urdu as a support language for better understanding, not as a separate subject.
        </p>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {GRADES.map((g) => {
            const isExpanded = expandedCards.has(g.name);
            return (
              <div
                key={g.name}
                className={`rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(15,31,61,0.12)] hover:border-[#0F1F3D] ${g.status === "in-progress" ? "border-t-[3px] border-t-[#0B2B5A]" : ""}`}
              >
                <h2 className="text-lg font-semibold text-slate-900">
                  {g.name}
                </h2>
                <p className="mt-2 text-sm text-slate-600">{g.desc}</p>

                <div className={`mt-4 text-2xl font-bold text-slate-900 ${g.blurPrice ? "blur-sm select-none" : ""}`}>
                  {g.price}
                </div>

                <div className="mt-5 flex flex-col gap-2">
                  {g.isBeta ? (
                    <Link
                      href={isLoggedIn ? "/dashboard" : "/signup"}
                      className="inline-flex items-center justify-center rounded-xl bg-[#0B2B5A] px-4 py-2 text-sm font-semibold text-white hover:bg-[#0A2550]"
                    >
                      Start Free
                    </Link>
                  ) : g.status === "in-progress" ? (
                    <span className="inline-flex items-center justify-center rounded-xl bg-[#0B2B5A] px-4 py-2 text-sm font-semibold text-white">
                      In Progress
                    </span>
                  ) : (
                    <span className="inline-flex items-center justify-center rounded-xl bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-500">
                      Coming Soon
                    </span>
                  )}
                </div>

                <div className="mt-4 border-t border-slate-100 pt-4">
                  <button
                    type="button"
                    onClick={() => toggleExpand(g.name)}
                    style={{
                      border: "1px solid #E2E8F0",
                      borderRadius: "6px",
                      padding: "6px 12px",
                      background: "transparent",
                      fontSize: "13px",
                      fontWeight: 600,
                      color: "#0F1F3D",
                      display: "inline-block",
                      cursor: "pointer",
                    }}
                  >
                    {isExpanded ? "What's included ↑" : "What's included ↓"}
                  </button>

                  {isExpanded && (
                    <ul className="mt-3 space-y-1.5">
                      {g.features.map((f) => (
                        <li key={f} className="flex items-start gap-2 text-sm text-slate-600">
                          <span className="mt-0.5 text-[#0B2B5A]">✓</span>
                          {f}
                        </li>
                      ))}
                    </ul>
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
