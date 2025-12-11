// app/login/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [studentName, setStudentName] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [error, setError] = useState("");

  const handleContinue = () => {
    if (!studentName.trim() || !selectedClass) {
      setError("Please enter your name and select a class.");
      return;
    }

    setError("");

    // You can adjust the query params if you’re reading them differently
    const params = new URLSearchParams({
      name: studentName.trim(),
      class: selectedClass,
    });

    router.push(`/dashboard?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl shadow-slate-200/70 border border-slate-100 p-8 sm:p-10">
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900">
            Welcome back <span className="inline-block">👋</span>
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Enter your name and class to continue.
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1.5">
              Student name
            </label>
            <input
              type="text"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              placeholder="Ali, Ayesha, Hassan..."
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/70 focus:border-blue-500 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1.5">
              Class
            </label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/70 focus:border-blue-500 transition bg-white"
            >
              {/* REAL placeholder – has empty value */}
              <option value="">Select class</option>

              {/* All classes, including Class 1, have real values */}
              <option value="Class 1">Class 1</option>
              <option value="Class 2">Class 2</option>
              <option value="Class 3">Class 3</option>
              <option value="Class 4">Class 4</option>
              <option value="Class 5">Class 5</option>
            </select>
          </div>

          {error && (
            <p className="text-xs text-red-500 mt-1">
              {error}
            </p>
          )}

          <button
            onClick={handleContinue}
            className="mt-4 w-full inline-flex items-center justify-center rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-3 shadow-lg shadow-blue-500/30 transition-transform duration-150 hover:-translate-y-0.5 active:translate-y-0"
          >
            Continue to dashboard →
          </button>
        </div>
      </div>
    </div>
  );
}
