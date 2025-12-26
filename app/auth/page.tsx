"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AuthPage() {
  const router = useRouter();

  return (
    <div className="bg-white text-slate-900">
      <div className="mx-auto flex min-h-[calc(100vh-140px)] max-w-6xl items-center justify-center px-4 py-14">
        <div className="w-full max-w-xl rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <h1 className="text-center text-3xl font-semibold tracking-tight">
            Continue to StudiesMate
          </h1>
          <p className="mt-2 text-center text-sm text-slate-600">
            Choose who is using the app.
          </p>

          {/* Role cards */}
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Student */}
            <button
              type="button"
              onClick={() => router.push("/login")}
              className="group rounded-2xl border border-slate-200 bg-white p-5 text-left transition hover:border-slate-300 hover:bg-slate-50"
            >
              <div className="flex items-center justify-between">
                <div className="text-base font-semibold">Student</div>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                  Available
                </span>
              </div>
              <p className="mt-2 text-sm text-slate-600">
                Log in and start learning (name, class, password).
              </p>
              <div className="mt-4 text-sm font-semibold text-[#0B2B5A] group-hover:underline">
                Continue as Student →
              </div>
            </button>

            {/* Parent */}
            <button
              type="button"
              disabled
              className="cursor-not-allowed rounded-2xl border border-slate-200 bg-white p-5 text-left opacity-70"
            >
              <div className="flex items-center justify-between">
                <div className="text-base font-semibold">Parent</div>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                  Coming soon
                </span>
              </div>
              <p className="mt-2 text-sm text-slate-600">
                Track progress, goals, and learning activity.
              </p>
              <div className="mt-4 text-sm font-semibold text-slate-500">
                Parent dashboard →
              </div>
            </button>
          </div>

          {/* Actions */}
          <div className="mt-8 space-y-3">
            <button
              type="button"
              onClick={() => router.push("/login")}
              className="w-full rounded-xl bg-[#0B2B5A] px-5 py-3 text-sm font-semibold text-white hover:bg-[#0A2550]"
            >
              Log in
            </button>

            <button
              type="button"
              onClick={() => router.push("/signup")}
              className="w-full rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-800 hover:bg-slate-50"
            >
              Create account
            </button>
          </div>

          {/* Helpful links */}
          <div className="mt-6 flex items-center justify-between text-sm">
            <Link href="/" className="text-[#0B2B5A] hover:underline">
              ← Back to home
            </Link>

            <Link href="/forgot-password" className="text-slate-700 hover:underline">
              Forgot password?
            </Link>
          </div>

          {/* Note */}
          <div className="mt-6 rounded-xl bg-slate-50 p-4 text-xs text-slate-600">
            <div className="font-medium text-slate-800">Note</div>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>Student login works now (basic Phase 1).</li>
              <li>Parent dashboard is UI-only for now.</li>
              <li>We will connect real accounts and admin reporting in Phase 2.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
