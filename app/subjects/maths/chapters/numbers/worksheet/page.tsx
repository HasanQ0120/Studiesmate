"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/DashboardLayout";

export default function NumbersWorksheetPage() {
  const router = useRouter();
  const [unlocked, setUnlocked] = useState<boolean | null>(null);

  useEffect(() => {
    try {
      const isUnlocked = localStorage.getItem("worksheet_unlocked_place_value") === "true";
      if (!isUnlocked) {
        router.replace("/subjects/maths/chapters/numbers/quiz");
        return;
      }
      setUnlocked(true);
      localStorage.setItem("studiesmate_last_activity_v2", JSON.stringify({
        action: "Opened Numbers & Place Value Worksheet",
        href: "/subjects/maths/chapters/numbers/worksheet",
        timestamp: new Date().toISOString(),
      }));
    } catch {
      setUnlocked(false);
    }
  }, [router]);

  if (!unlocked) return null;

  return (
    <DashboardLayout>
      <main className="min-h-screen bg-white text-[#0F172A] pb-20 md:pb-16">
        <div className="mx-auto max-w-4xl px-6 py-10">
          <button
            type="button"
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 rounded-xl bg-[#0B2B5A] px-4 py-2 text-sm font-semibold text-white hover:bg-[#0A2550] transition"
          >
            <span className="text-base leading-none">←</span>
            <span>Back</span>
          </button>
          <div className="mt-6 flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight">Maths • Numbers & Place Value — Worksheet</h1>
              <p className="mt-2 text-sm text-[#475569]">Extra practice problems to reinforce your learning.</p>
            </div>
            <a
              href="/worksheet_place_value.pdf"
              download="worksheet_place_value.pdf"
              className="inline-flex items-center gap-2 rounded-xl bg-[#0B2B5A] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#0A2550] transition-colors shrink-0"
            >
              ↓ Download PDF
            </a>
          </div>
          <div className="mt-8 rounded-xl overflow-hidden border border-[#E2E8F0]">
            <iframe
              src="/worksheet_place_value.pdf"
              width="100%"
              height="800px"
              style={{ border: "none", display: "block" }}
              title="Numbers & Place Value Worksheet"
            />
          </div>
        </div>
      </main>
    </DashboardLayout>
  );
}
