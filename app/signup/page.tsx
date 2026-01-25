// app/signup/page.tsx
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { signUpParentAccount } from "@/lib/auth";

const CLASSES = [
  "Class 1",
  "Class 2",
  "Class 3",
  "Class 4",
  "Class 5",
  "Class 6",
  "Class 7",
  "Class 8",
];

const BETA_CLASS = "Class 4";

function isValidEmail(email: string) {
  const e = email.trim().toLowerCase();
  return e.includes("@") && e.includes(".") && e.length >= 6;
}

export default function SignupPage() {
  const router = useRouter();

  const [studentName, setStudentName] = useState("");
  const [studentClass, setStudentClass] = useState("");
  const [parentEmail, setParentEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const canContinue = useMemo(() => {
    return (
      studentName.trim().length >= 2 &&
      studentClass.trim().length > 0 &&
      isValidEmail(parentEmail) &&
      password.trim().length >= 6
    );
  }, [studentName, studentClass, parentEmail, password]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!canContinue || submitting) return;

    setError("");
    setSubmitting(true);

    const cleanEmail = parentEmail.trim().toLowerCase();

    const { error: supaError } = await signUpParentAccount({
      parentEmail: cleanEmail,
      password,
      studentName,
      studentClass,
    });

    setSubmitting(false);

    if (supaError) {
      setError(supaError.message || "Signup failed. Please try again.");
      return;
    }

    router.push(`/auth/check-email?email=${encodeURIComponent(cleanEmail)}`);
  }

  return (
    <div className="bg-white text-slate-900">
      <div className="mx-auto flex min-h-[calc(100vh-140px)] max-w-6xl items-center justify-center px-4 py-14">
        <div className="w-full max-w-xl rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <h1 className="text-center text-3xl font-semibold tracking-tight">
            Create student profile
          </h1>
          <p className="mt-2 text-center text-sm text-slate-600">
            Parent sets access. Student learns calmly.
          </p>

          <form className="mt-8 space-y-5" onSubmit={onSubmit}>
            <div>
              <label className="text-sm font-medium text-slate-700">
                Student name
              </label>
              <input
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                placeholder="Ali, Ayesha, Hassan..."
                className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-400"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700">Class</label>
              <select
                value={studentClass}
                onChange={(e) => setStudentClass(e.target.value)}
                className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-400"
              >
                <option value="">Select class</option>
                {CLASSES.map((c) => (
                  <option key={c} value={c} disabled={c !== BETA_CLASS}>
                    {c}
                  </option>
                ))}
              </select>

              <p className="mt-2 text-xs text-slate-500">
                Phase 1 Beta: Only Class 4 is available. All classes will be
                unlocked on the launch of full Phase 1.
              </p>
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700">
                Parent email
              </label>
              <input
                type="email"
                value={parentEmail}
                onChange={(e) => setParentEmail(e.target.value)}
                placeholder="parent@example.com"
                className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-400"
              />
              <p className="mt-2 text-xs text-slate-500">
                Used for recovery and future parent dashboard.
              </p>
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700">
                Set password
              </label>

              <div className="relative mt-2">
                <input
                  type={showPassword ? "text" : "password"}
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
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

              <p className="mt-1 text-xs text-slate-500">At least 6 characters</p>
            </div>

            {error && (
              <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={!canContinue || submitting}
              className="mt-2 w-full rounded-xl bg-[#0B2B5A] px-5 py-3 text-sm font-semibold text-white hover:bg-[#0A2550] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting ? "Creating..." : "Create profile →"}
            </button>

            <div className="rounded-xl bg-slate-50 p-4 text-xs text-slate-600">
              <div className="font-medium text-slate-800">Important</div>
              <ul className="mt-2 list-disc space-y-1 pl-5">
                <li>Set password helps the student log in quickly next time</li>
                <li>Parent email is used for recovery if password is forgotten</li>
                <li>In Phase 2 we’ll add proper accounts and Google sign-in</li>
              </ul>
            </div>

            <div className="flex items-center justify-between text-sm">
              <Link href="/" className="text-[#0B2B5A] hover:underline">
                ← Back to home
              </Link>
              <Link href="/login" className="text-slate-700 hover:underline">
                Already have an account? Log in
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
