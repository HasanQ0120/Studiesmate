"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/auth";

const GRADES = [
  { name: "Beta",    desc: "2 Math lessons + 2 quizzes. Free forever.",        price: "Free",            blurPrice: false, isBeta: true,  status: null },
  { name: "Grade 1", desc: "Full syllabus included. Math, English & Science.", price: "Rs. 800/month",   blurPrice: true,  isBeta: false, status: "coming-soon" },
  { name: "Grade 2", desc: "Full syllabus included. Math, English & Science.", price: "Rs. 1,000/month", blurPrice: true,  isBeta: false, status: "coming-soon" },
  { name: "Grade 3", desc: "Full syllabus included. Math, English & Science.", price: "Rs. 1,200/month", blurPrice: true,  isBeta: false, status: "coming-soon" },
  { name: "Grade 4", desc: "Full syllabus included. Math, English & Science.", price: "Rs. 1,500/month", blurPrice: false, isBeta: false, status: "in-progress" },
  { name: "Grade 5", desc: "Full syllabus included. Math, English & Science.", price: "Rs. 2,000/month", blurPrice: true,  isBeta: false, status: "coming-soon" },
  { name: "Grade 6", desc: "Full syllabus included. Math, English & Science.", price: "Rs. 2,500/month", blurPrice: true,  isBeta: false, status: "coming-soon" },
  { name: "Grade 7", desc: "Full syllabus included. Math, English & Science.", price: "Rs. 3,000/month", blurPrice: true,  isBeta: false, status: "coming-soon" },
  { name: "Grade 8", desc: "Full syllabus included. Math, English & Science.", price: "Rs. 3,500/month", blurPrice: true,  isBeta: false, status: "coming-soon" },
];

export default function GradesPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setIsLoggedIn(!!data.session);
    });
  }, []);

  return (
    <main className="min-h-screen bg-white text-slate-900">
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
          {GRADES.map((g) => (
            <div
              key={g.name}
              className={`rounded-2xl border border-slate-200 bg-white p-6 shadow-sm ${g.status === "in-progress" ? "border-t-[3px] border-t-[#0B2B5A]" : ""}`}
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
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
