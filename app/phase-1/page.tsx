"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/auth";
import AuthModal from "@/components/AuthModal";
import PageFade from "@/components/PageFade";

const GRADES = [
  { name: "Beta",    isBeta: true,  price: undefined },
  { name: "Grade 1", isBeta: false, price: undefined },
  { name: "Grade 2", isBeta: false, price: undefined },
  { name: "Grade 3", isBeta: false, price: undefined },
  { name: "Grade 4", isBeta: false, price: "Rs. 1,500/mo" },
  { name: "Grade 5", isBeta: false, price: undefined },
  { name: "Grade 6", isBeta: false, price: undefined },
  { name: "Grade 7", isBeta: false, price: undefined },
  { name: "Grade 8", isBeta: false, price: undefined },
];

export default function GradesPage() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());
  const [authModalOpen, setAuthModalOpen] = useState(false);

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
    <PageFade>
    <main className="min-h-screen bg-[#F9FAFB] pb-16">
      <div className="mx-auto max-w-6xl px-4 py-12">

        <h1 className="text-3xl font-bold text-[#111827] md:text-4xl">All Grade Tracks</h1>
        <p className="mt-2 text-base font-medium text-[#22C55E]">
          From Beta to Grade 8, your complete learning journey
        </p>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {GRADES.map((g) => {
            const isExpanded = expandedCards.has(g.name);
            return (
              <div key={g.name} className="flex flex-col rounded-xl border border-[#E5E7EB] bg-white p-6 shadow-sm premium-card-hover">

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
                {g.price && (
                  <p style={{
                    fontSize: "14px",
                    fontWeight: 500,
                    color: "#9CA3AF",
                    marginTop: "8px",
                    marginBottom: "8px",
                  }}>
                    Price coming soon
                  </p>
                )}

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
                    <button
                      type="button"
                      onClick={() => {
                        if (isLoggedIn) { try { localStorage.removeItem("last_selected_subject"); } catch {} router.push("/dashboard"); }
                        else setAuthModalOpen(true);
                      }}
                      className="flex w-full items-center justify-center rounded-xl bg-[#22C55E] py-3 text-sm font-semibold text-white hover:bg-[#16A34A] transition-colors"
                    >
                      Start Free →
                    </button>
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

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode="signup"
      />
    </main>
    </PageFade>
  );
}
