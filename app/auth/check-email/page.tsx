"use client";

import Link from "next/link";
import { Suspense, useMemo } from "react";
import { useSearchParams } from "next/navigation";

function maskEmail(email: string) {
  const e = email.trim();
  const at = e.indexOf("@");
  if (at <= 1) return e;

  const name = e.slice(0, at);
  const domain = e.slice(at + 1);

  const visibleStart = name.slice(0, 2);
  const masked = "*".repeat(Math.max(1, name.length - 2));
  return `${visibleStart}${masked}@${domain}`;
}

function CheckEmailContent() {
  const params = useSearchParams();
  const email = (params.get("email") || "").trim();

  const displayEmail = useMemo(() => {
    if (!email) return "";
    return maskEmail(email);
  }, [email]);

  return (
    <div className="bg-white text-slate-900">
      <div className="mx-auto flex min-h-[calc(100vh-140px)] max-w-6xl items-center justify-center px-4 py-14">
        <div className="w-full max-w-2xl rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="text-center">
            <div className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0B2B5A]/10 text-[#0B2B5A]">
              ✓
            </div>

            <h1 className="mt-4 text-3xl font-semibold tracking-tight">
              Confirm your email
            </h1>

            <p className="mt-2 text-sm text-slate-600">
              We’ve sent a confirmation email{" "}
              {email ? (
                <>
                  to{" "}
                  <span className="font-semibold text-slate-800">
                    {displayEmail}
                  </span>
                  .
                </>
              ) : (
                <>to your email address.</>
              )}
            </p>

            <div className="mt-6 rounded-2xl bg-slate-50 p-4 text-left text-sm text-slate-700">
              <div className="font-semibold text-slate-900">What to do now</div>
              <ul className="mt-2 list-disc space-y-1 pl-5">
                <li>Open your inbox</li>
                <li>
                  Find the email from{" "}
                  <span className="font-semibold">StudiesMate</span>
                </li>
                <li>
                  Click <span className="font-semibold">Confirm my email</span>
                </li>
                <li>After confirming, come back and log in</li>
              </ul>

              <div className="mt-3 text-xs text-slate-500">
                If you don’t see it, check Spam/Promotions and wait 1–2 minutes.
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/login"
              className="inline-flex items-center justify-center rounded-xl bg-[#0B2B5A] px-5 py-3 text-sm font-semibold text-white hover:bg-[#0A2550]"
            >
              Go to login →
            </Link>

            <Link
              href="/signup"
              className="inline-flex items-center justify-center rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-800 hover:bg-slate-50"
            >
              Use a different email
            </Link>
          </div>

          <div className="mt-6 text-center text-xs text-slate-500">
            <Link href="/" className="text-[#0B2B5A] hover:underline">
              ← Back to home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto flex min-h-[calc(100vh-140px)] max-w-6xl items-center justify-center px-4 py-14">
          <div className="w-full max-w-2xl rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <div className="text-center text-sm text-slate-600">
              Loading...
            </div>
          </div>
        </div>
      }
    >
      <CheckEmailContent />
    </Suspense>
  );
}
