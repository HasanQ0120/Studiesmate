"use client";

import Link from "next/link";
import { useState } from "react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!email.includes("@")) return;

    // Phase 1: no real email sent
    setSubmitted(true);
  }

  return (
    <div className="bg-white text-slate-900">
      <div className="mx-auto flex min-h-[calc(100vh-140px)] max-w-6xl items-center justify-center px-4 py-14">
        <div className="w-full max-w-xl rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <h1 className="text-center text-3xl font-semibold tracking-tight">
            Reset your password
          </h1>

          {!submitted ? (
            <>
              <p className="mt-2 text-center text-sm text-slate-600">
                Enter the parent email used during signup.
              </p>

              <form className="mt-8 space-y-5" onSubmit={onSubmit}>
                <div>
                  <label className="text-sm font-medium text-slate-700">
                    Parent email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="parent@example.com"
                    className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-400"
                  />
                </div>

                <button
                  type="submit"
                  disabled={!email.includes("@")}
                  className="mt-2 w-full rounded-xl bg-[#0B2B5A] px-5 py-3 text-sm font-semibold text-white hover:bg-[#0A2550] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Request password reset →
                </button>

                <div className="rounded-xl bg-slate-50 p-4 text-xs text-slate-600">
                  <div className="font-medium text-slate-800">How this works</div>
                  <ul className="mt-2 list-disc space-y-1 pl-5">
                    <li>
                      If an account exists, reset instructions will be sent to this
                      email
                    </li>
                    <li>Password reset via email will be enabled soon</li>
                    <li>For now, please contact the parent who created the account</li>
                  </ul>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <Link
                    href="/login"
                    className="text-[#0B2B5A] hover:underline"
                  >
                    ← Back to login
                  </Link>
                  <Link
                    href="/signup"
                    className="text-slate-700 hover:underline"
                  >
                    Create new profile
                  </Link>
                </div>
              </form>
            </>
          ) : (
            <>
              <p className="mt-6 text-center text-sm text-slate-700">
                If an account exists with this email, you’ll receive instructions to
                reset the password.
              </p>

              <p className="mt-3 text-center text-xs text-slate-500">
                Password reset via email will be fully enabled soon.
              </p>

              <div className="mt-8 flex justify-center">
                <Link
                  href="/login"
                  className="rounded-xl bg-[#0B2B5A] px-5 py-3 text-sm font-semibold text-white hover:bg-[#0A2550]"
                >
                  Back to login
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
