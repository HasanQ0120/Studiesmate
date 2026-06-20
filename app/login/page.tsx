// app/login/page.tsx
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { signInParentAccount } from "@/lib/auth";
import HeroStatCard from "@/components/HeroStatCard";

export default function LoginPage() {
  const router = useRouter();

  const [tab, setTab] = useState<"student" | "parent">("student");

  const [parentEmail, setParentEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const canContinue = useMemo(() => {
    return (
      parentEmail.trim().length >= 6 &&
      parentEmail.includes("@") &&
      password.trim().length >= 6
    );
  }, [parentEmail, password]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    const { error: signInError } = await signInParentAccount({
      parentEmail,
      password,
    });

    if (signInError) {
      setError(signInError.message || "Login failed.");
      return;
    }

    router.push("/dashboard");
  }

  return (
    <div className="flex min-h-screen text-slate-900">
      {/* Left panel — desktop only */}
      <div className="hidden md:flex md:w-1/2 flex-col items-center justify-center gap-8 bg-[#0B2B5A] px-12 py-16 text-white">
        <img src="/logo.png" alt="StudiesMate" className="h-16 w-auto animate-float" />
        <p className="max-w-xs text-center text-xl font-semibold leading-snug">
          Welcome back. Your learning continues here.
        </p>
        <HeroStatCard />
      </div>

      {/* Right panel */}
      <div className="flex w-full flex-col items-center justify-center bg-white px-4 py-14 md:w-1/2">
        {/* Mobile-only logo */}
        <div className="mb-6 md:hidden">
          <img src="/logo.png" alt="StudiesMate" className="mx-auto h-12 w-auto animate-float" />
        </div>

        <div className="w-full max-w-xl rounded-3xl border border-slate-200 border-t-2 border-t-[#F97316] bg-white p-8 shadow-sm">
          <h1 className="text-center text-3xl font-semibold tracking-tight">
            Welcome back
          </h1>
          <p className="mt-2 text-center text-sm text-slate-600">
            Log in to continue learning.
          </p>

          {/* Tabs */}
          <div className="mt-6 flex overflow-hidden rounded-xl border border-slate-200">
            <button
              type="button"
              onClick={() => setTab("student")}
              className={`flex-1 py-2.5 text-sm font-semibold transition-colors ${
                tab === "student"
                  ? "bg-[#0B2B5A] text-white"
                  : "bg-white text-slate-500 hover:bg-slate-50"
              }`}
            >
              Student
            </button>
            <button
              type="button"
              onClick={() => setTab("parent")}
              className={`flex-1 py-2.5 text-sm font-semibold transition-colors ${
                tab === "parent"
                  ? "bg-[#0B2B5A] text-white"
                  : "bg-white text-slate-500 hover:bg-slate-50"
              }`}
            >
              Parent
            </button>
          </div>

          {/* Student form */}
          {tab === "student" && (
            <form className="mt-8 space-y-5" onSubmit={onSubmit}>
              <div>
                <label className="text-sm font-medium text-slate-700">
                  Parent email
                </label>
                <input
                  type="email"
                  value={parentEmail}
                  onChange={(e) => setParentEmail(e.target.value)}
                  placeholder="Same email used during signup"
                  className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-400"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700">
                  Password
                </label>

                <div className="relative mt-2">
                  <input
                    type={showPassword ? "text" : "password"}
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 pr-12 text-sm outline-none focus:border-slate-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-2 text-slate-600 hover:bg-slate-100"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>

                <p className="mt-1 text-xs text-slate-500">
                  Enter the password you set during signup (at least 6 characters)
                </p>
              </div>

              {error && (
                <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={!canContinue}
                className="mt-2 w-full rounded-xl bg-[#0B2B5A] px-5 py-3 text-sm font-semibold text-white hover:bg-[#0A2550] disabled:cursor-not-allowed disabled:opacity-50"
              >
                Log in →
              </button>

              <div className="flex items-center justify-between text-sm">
                <Link
                  href="/forgot-password"
                  className="text-slate-600 hover:underline"
                >
                  Forgot password?
                </Link>
                <Link href="/signup" className="text-[#0B2B5A] hover:underline">
                  Create new profile
                </Link>
              </div>
            </form>
          )}

          {/* Parent tab */}
          {tab === "parent" && (
            <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-6 text-center">
              <p className="text-sm leading-6 text-slate-700">
                Parent dashboard is coming with the Grade 4 launch.
                <br />
                Track your child's lessons, quiz scores, and weekly progress — all in one place.
                <br />
                Sign up as a student now to get started.
              </p>
              <button
                type="button"
                onClick={() => setTab("student")}
                className="mt-5 inline-flex items-center justify-center rounded-xl bg-[#0B2B5A] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#0A2550]"
              >
                Sign up as Student
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
