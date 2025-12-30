"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { Eye, EyeOff } from "lucide-react";

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

const PROFILE_KEY = "studiesmate_profile";
const SESSION_KEY = "studiesmate_session";

function safeParseJSON<T>(raw: string | null): T | null {
  try {
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

type StoredProfile = {
  studentName?: string;
  studentClass?: string;
  className?: string; // old key support
  password?: string;
  parentEmail?: string;
};

export default function LoginPage() {
  const router = useRouter();

  const [studentName, setStudentName] = useState("");
  const [studentClass, setStudentClass] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const canContinue = useMemo(() => {
    return (
      studentName.trim().length >= 2 &&
      studentClass.trim().length > 0 &&
      password.trim().length >= 6
    );
  }, [studentName, studentClass, password]);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    const profile = safeParseJSON<StoredProfile>(localStorage.getItem(PROFILE_KEY));
    if (!profile) {
      setError("No profile found. Please sign up first.");
      return;
    }

    const storedName = (profile.studentName || "").trim();
    const storedClass = (profile.studentClass || profile.className || "").trim();
    const storedPassword = (profile.password || "").trim();

    if (!storedPassword) {
      setError("This profile is missing a password. Please create a new profile.");
      return;
    }

    const nameMatch = storedName.toLowerCase() === studentName.trim().toLowerCase();
    const classMatch = storedClass === studentClass;
    const passwordMatch = storedPassword === password.trim();

    if (!nameMatch || !classMatch || !passwordMatch) {
      setError("Incorrect name, class, or password.");
      return;
    }

    const session = {
      studentName: storedName,
      studentClass: storedClass,
      parentEmail: (profile.parentEmail || "").trim(),
      loggedInAt: new Date().toISOString(),
    };
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));

    // Tell Header to refresh immediately
    window.dispatchEvent(new Event("studiesmate_auth_changed"));

    router.push("/dashboard");
  }

  return (
    <div className="bg-white text-slate-900">
      <div className="mx-auto flex min-h-[calc(100vh-140px)] max-w-6xl items-center justify-center px-4 py-14">
        <div className="w-full max-w-xl rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <h1 className="text-center text-3xl font-semibold tracking-tight">
            Welcome back
          </h1>
          <p className="mt-2 text-center text-sm text-slate-600">
            Log in to continue learning.
          </p>

          <form className="mt-8 space-y-5" onSubmit={onSubmit}>
            <div>
              <label className="text-sm font-medium text-slate-700">
                Student name
              </label>
              <input
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                placeholder="Same name used during signup"
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
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
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
              <Link href="/forgot-password" className="text-slate-600 hover:underline">
                Forgot password?
              </Link>
              <Link href="/signup" className="text-[#0B2B5A] hover:underline">
                Create new profile
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
