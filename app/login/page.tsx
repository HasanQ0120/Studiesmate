// app/login/page.tsx
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { signInParentAccount } from "@/lib/auth";

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
    <div className="flex min-h-screen text-[#111827]">

      {/* Left panel */}
      <div className="hidden md:flex md:w-2/5 flex-col items-center justify-center gap-8 bg-[#0F172A] px-10 py-16 text-white">
        <img src="/logo.png" alt="StudiesMate" width={120} height={36} style={{ objectFit: "contain" }} />
        <p className="max-w-xs text-center text-xl font-semibold leading-snug">
          Welcome back. Your learning continues here.
        </p>
        <div className="w-full max-w-xs rounded-xl bg-[#1E293B] px-5 py-4 text-center">
          <p className="text-sm font-semibold text-[#22C55E]">
            3 Subjects · 2 Languages · 8 Grades · Beta Always Free
          </p>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex w-full flex-col items-center justify-center bg-white px-4 py-14 md:w-3/5">
        {/* Mobile logo */}
        <div className="mb-6 md:hidden">
          <img src="/logo.png" alt="StudiesMate" width={120} height={36} style={{ objectFit: "contain" }} className="mx-auto" />
        </div>

        <div className="w-full max-w-md">
          <h1 className="text-3xl font-bold text-[#111827]">Welcome back</h1>
          <p className="mt-2 text-sm text-[#6B7280]">Log in to continue learning.</p>

          {/* Tabs */}
          <div className="mt-6 flex overflow-hidden rounded-xl border border-[#E5E7EB]">
            <button
              type="button"
              onClick={() => setTab("student")}
              className={`flex-1 py-2.5 text-sm font-semibold transition-colors ${
                tab === "student"
                  ? "bg-[#0F172A] text-white"
                  : "bg-white text-[#9CA3AF] hover:bg-[#F9FAFB]"
              }`}
            >
              Student
            </button>
            <button
              type="button"
              onClick={() => setTab("parent")}
              className={`flex-1 py-2.5 text-sm font-semibold transition-colors ${
                tab === "parent"
                  ? "bg-[#0F172A] text-white"
                  : "bg-white text-[#9CA3AF] hover:bg-[#F9FAFB]"
              }`}
            >
              Parent
            </button>
          </div>

          {/* Student form */}
          {tab === "student" && (
            <form className="mt-8 space-y-5" onSubmit={onSubmit}>
              <div>
                <label className="text-sm font-medium text-[#374151]">Parent email</label>
                <input
                  type="email"
                  value={parentEmail}
                  onChange={(e) => setParentEmail(e.target.value)}
                  placeholder="Same email used during signup"
                  className="mt-1.5 w-full rounded-lg border border-[#E5E7EB] px-4 py-3 text-sm outline-none transition-colors focus:border-[#22C55E] focus:ring-2 focus:ring-[#22C55E]/20"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-[#374151]">Password</label>
                <div className="relative mt-1.5">
                  <input
                    type={showPassword ? "text" : "password"}
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full rounded-lg border border-[#E5E7EB] px-4 py-3 pr-12 text-sm outline-none transition-colors focus:border-[#22C55E] focus:ring-2 focus:ring-[#22C55E]/20"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-2 text-[#6B7280] hover:bg-[#F9FAFB]"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                <p className="mt-1 text-xs text-[#9CA3AF]">
                  Enter the password you set during signup (at least 6 characters)
                </p>
              </div>

              {error && (
                <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
              )}

              <button
                type="submit"
                disabled={!canContinue}
                className="mt-2 w-full rounded-xl bg-[#22C55E] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#16A34A] disabled:cursor-not-allowed disabled:opacity-50"
              >
                Log in →
              </button>

              <div className="flex items-center justify-between text-sm">
                <Link href="/forgot-password" className="text-[#6B7280] hover:text-[#374151]">
                  Forgot password?
                </Link>
                <Link href="/signup" className="text-[#6B7280] hover:text-[#374151]">
                  Create new profile
                </Link>
              </div>
            </form>
          )}

          {/* Parent tab */}
          {tab === "parent" && (
            <div className="mt-8 rounded-2xl border border-[#E5E7EB] bg-[#F9FAFB] p-6 text-center">
              <p className="text-sm leading-6 text-[#374151]">
                Parent dashboard is coming with the Grade 4 launch.
                <br />
                Track your child's lessons, quiz scores, and weekly progress — all in one place.
                <br />
                Sign up as a student now to get started.
              </p>
              <button
                type="button"
                onClick={() => setTab("student")}
                className="mt-5 inline-flex items-center justify-center rounded-xl bg-[#0F172A] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#1E293B]"
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
