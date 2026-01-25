"use client";

import React, { useMemo, useState } from "react";

type Props = {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
};

export default function FeedbackAdminGate({
  children,
  title = "Admin access",
  subtitle = "Enter the password to continue.",
}: Props) {
  const [password, setPassword] = useState("");
  const [adminPassword, setAdminPassword] = useState(""); // ✅ stored only in memory
  const [unlocked, setUnlocked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [show, setShow] = useState(false);

  const canSubmit = useMemo(
    () => password.trim().length > 0 && !loading,
    [password, loading]
  );

  async function handleUnlock(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/feedback-admin/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (!res.ok) {
        setError("Incorrect password.");
        setLoading(false);
        return;
      }

      // ✅ keep password only in memory, so refresh asks again
      setAdminPassword(password);
      setUnlocked(true);
      setPassword("");
      setLoading(false);
    } catch {
      setError("Something went wrong. Try again.");
      setLoading(false);
    }
  }

  if (unlocked) {
    // ✅ pass adminPassword to the child page (no storage)
    if (React.isValidElement(children)) {
      return React.cloneElement(children as React.ReactElement<any>, {
        adminPassword,
      });
    }
    return <>{children}</>;
  }

  return (
    <main className="min-h-screen bg-white text-slate-900">
      <section className="mx-auto max-w-md px-4 py-16">
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        <p className="mt-2 text-sm text-slate-600">{subtitle}</p>

        <form
          onSubmit={handleUnlock}
          className="mt-8 rounded-2xl border border-slate-200 bg-white p-5"
        >
          <label className="text-sm font-semibold text-slate-800">Password</label>

          <div className="mt-2 flex items-center gap-2">
            <input
              type={show ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-300"
              placeholder="Enter password"
              autoFocus
            />

            <button
              type="button"
              onClick={() => setShow((v) => !v)}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700"
              aria-label={show ? "Hide password" : "Show password"}
            >
              {show ? "Hide" : "Show"}
            </button>
          </div>

          {error ? <div className="mt-3 text-sm text-red-600">{error}</div> : null}

          <button
            type="submit"
            disabled={!canSubmit}
            className="mt-5 inline-flex w-full items-center justify-center rounded-xl bg-[#0B2B5A] px-4 py-2 text-sm font-semibold text-white hover:bg-[#0A2550] disabled:opacity-60"
          >
            {loading ? "Checking..." : "Continue →"}
          </button>

          <div className="mt-3 text-xs text-slate-500">
            This will ask again on refresh or next visit.
          </div>
        </form>
      </section>
    </main>
  );
}
