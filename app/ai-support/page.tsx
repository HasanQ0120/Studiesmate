"use client";

import PageEnter from "@/components/PageEnter";

export default function AISupportPage() {
  return (
    <PageEnter>
      <div className="bg-white">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <div className="mx-auto max-w-2xl rounded-2xl border border-slate-200 bg-white p-6 text-slate-900 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <h1 className="text-xl font-semibold tracking-tight">
                StudiesMate AI
              </h1>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                Beta
              </span>
            </div>

            <p className="mt-2 text-sm text-slate-600">
              AI is not available in the trial/testing phase. It will be enabled
              after beta feedback and fixes.
            </p>

            <div className="mt-6 rounded-xl bg-slate-50 p-4 text-sm text-slate-700">
              For now, please use lessons and quizzes for learning. If you face
              any issue, report it so we can improve the beta.
            </div>
          </div>
        </div>
      </div>
    </PageEnter>
  );
}
