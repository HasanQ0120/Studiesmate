"use client";

import { useRouter } from "next/navigation";
import BackButton from "@/components/BackButton";
import { ArrowRight } from "lucide-react";

export default function IslamiatPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-white text-slate-900">
      <div className="mx-auto max-w-5xl px-4 py-12">
        <BackButton href="/dashboard" label="Back to Dashboard" />

        <h1 className="mt-6 text-3xl font-semibold tracking-tight">Islamiat</h1>
        <p className="mt-2 text-sm text-slate-700">
          Choose a chapter to start learning. Content is designed for clarity and basics.
        </p>

        <div className="mt-10 rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="text-base font-semibold">Start here</h2>
          <p className="mt-2 text-sm text-slate-700">
            Go to chapters and pick one. Lessons will be added gradually.
          </p>

          <button
            onClick={() => router.push("/subjects/islamiyat/chapters")}
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#0B2B5A] px-4 py-2 text-sm font-semibold text-white hover:bg-[#0A2550]"
          >
            Open Islamiat Chapters <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </main>
  );
}
