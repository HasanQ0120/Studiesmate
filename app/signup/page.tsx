"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

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

  const canContinue = useMemo(() => {
    return (
      studentName.trim().length >= 2 &&
      studentClass.trim().length > 0 &&
      isValidEmail(parentEmail) &&
      password.trim().length >= 6
    );
  }, [studentName, studentClass, parentEmail, password]);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!canContinue) return;

    const profile = {
      studentName: studentName.trim(),
      studentClass: studentClass.trim(),
      parentEmail: parentEmail.trim(),
      password: password.trim(), // Phase 1 local only (replace with DB later)
      createdAt: new Date().toISOString(),
    };

    localStorage.setItem("studiesmate_profile", JSON.stringify(profile));

    router.push(
      `/dashboard?name=${encodeURIComponent(profile.studentName)}&class=${encodeURIComponent(
        profile.studentClass
      )}`
    );
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
            {/* Student name */}
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

            {/* Class */}
            <div>
              <label className="text-sm font-medium text-slate-700">Class</label>
              <select
                value={studentClass}
                onChange={(e) => setStudentClass(e.target.value)}
                className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-400"
              >
                <option value="">Select class</option>
                {CLASSES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* Parent email */}
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

            {/* Set password */}
            <div>
              <label className="text-sm font-medium text-slate-700">
                Set password
              </label>
              <input
                type="password"
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-400"
              />
              <p className="mt-1 text-xs text-slate-500">At least 6 characters</p>

              {/* Continue with Google (coming soon) - placed under password */}
              <button
                type="button"
                disabled
                className="mt-4 w-full rounded-xl border border-slate-200 bg-slate-50 px-5 py-3 text-sm font-semibold text-slate-500"
                title="Coming soon"
              >
                Continue with Google (coming soon)
              </button>
              <p className="mt-2 text-center text-xs text-slate-500">
              </p>
            </div>

            <button
              type="submit"
              disabled={!canContinue}
              className="mt-2 w-full rounded-xl bg-[#0B2B5A] px-5 py-3 text-sm font-semibold text-white hover:bg-[#0A2550] disabled:cursor-not-allowed disabled:opacity-50"
            >
              Create profile →
            </button>

            {/* Note */}
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
