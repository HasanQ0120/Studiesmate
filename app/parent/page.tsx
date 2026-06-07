"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/auth";

const PARENT_CODE_KEY = "parent_connected_code";

const benefits = [
  "View your child's quiz scores and lesson progress",
  "See which topics have been completed",
  "Get a weekly learning summary",
  "Know exactly where your child needs help",
  "More features launching with Grade 4",
];

export default function ParentPage() {
  const [inputCode, setInputCode] = useState("");
  const [connecting, setConnecting] = useState(false);
  const [connectedCode, setConnectedCode] = useState<string | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    try {
      const saved = localStorage.getItem(PARENT_CODE_KEY);
      if (saved) setConnectedCode(saved);
    } catch {}
  }, []);

  async function handleConnect() {
    const code = inputCode.trim().toUpperCase();
    if (!code) return;

    setConnecting(true);
    setError("");

    try {
      const { data, error: queryError } = await supabase
        .from("profiles")
        .select("connect_code")
        .eq("connect_code", code)
        .single();

      if (queryError || !data) {
        setError("Invalid code. Please enter the correct Connect Code.");
      } else {
        try {
          localStorage.setItem(PARENT_CODE_KEY, code);
        } catch {}
        setConnectedCode(code);
      }
    } catch {
      setError("Invalid code. Please enter the correct Connect Code.");
    } finally {
      setConnecting(false);
    }
  }

  function handleDisconnect() {
    try {
      localStorage.removeItem(PARENT_CODE_KEY);
    } catch {}
    setConnectedCode(null);
    setInputCode("");
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A]">
      <div className="mx-auto max-w-lg px-6 py-16">

        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-[#0B2B5A]">Connect Parent Dashboard</h1>
          <p className="mt-2 text-sm text-[#475569]">
            Parent Dashboard is launching with Grade 4. Connect now to be ready.
          </p>
        </div>

        {/* Connected state */}
        {connectedCode ? (
          <div className="rounded-2xl border border-[#D1FAE5] bg-[#F0FDF4] p-6 text-center shadow-sm">
            <div className="text-4xl mb-3">✅</div>
            <p className="text-base font-bold text-[#0F172A]">Connected!</p>
            <p className="mt-1 text-sm text-[#475569]">You are connected to student code:</p>
            <p className="mt-3 text-2xl font-bold tracking-widest text-[#0B2B5A]">{connectedCode}</p>
            <p className="mt-3 text-xs text-[#64748B]">
              Parent Dashboard features will be available when Grade 4 launches.
            </p>
            <button
              type="button"
              onClick={handleDisconnect}
              className="mt-5 text-xs text-[#94A3B8] underline hover:text-[#475569] transition-colors"
            >
              Disconnect
            </button>
          </div>
        ) : (
          /* Connect form */
          <div className="rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-sm">
            <label className="block text-sm font-semibold text-[#0F172A]">
              Enter your child&apos;s Connect Code
            </label>
            <input
              type="text"
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value.toUpperCase())}
              onKeyDown={(e) => { if (e.key === "Enter") handleConnect(); }}
              placeholder="e.g. SM-4829"
              maxLength={7}
              className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm font-mono tracking-widest outline-none focus:border-[#0B2B5A] transition-colors"
            />
            <p className="mt-1 text-xs text-[#94A3B8]">
              The Connect Code is shown on your child&apos;s dashboard after they sign up.
            </p>

            {error && (
              <div className="mt-3 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <button
              type="button"
              onClick={handleConnect}
              disabled={inputCode.trim().length < 4 || connecting}
              className="mt-4 w-full rounded-xl bg-[#0B2B5A] px-5 py-3 text-sm font-semibold text-white hover:bg-[#0A2550] disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
            >
              {connecting ? "Connecting..." : "Connect →"}
            </button>

            <div className="mt-4 text-center text-sm text-[#475569]">
              No code yet?{" "}
              <Link href="/signup" className="font-semibold text-[#0B2B5A] hover:underline">
                Sign up as a Student first
              </Link>
            </div>
          </div>
        )}

        {/* Benefits section */}
        <div className="mt-10">
          <h2 className="text-base font-bold text-[#0F172A] mb-4">What you&apos;ll get with Parent Dashboard</h2>
          <ul className="space-y-3">
            {benefits.map((benefit, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-[#475569]">
                <span className="mt-0.5 font-bold text-[#10B981] shrink-0">✓</span>
                {benefit}
              </li>
            ))}
          </ul>
        </div>

        {/* Back link */}
        <div className="mt-10 text-center">
          <Link href="/" className="text-sm text-[#0B2B5A] hover:underline">
            ← Back to home
          </Link>
        </div>

      </div>
    </div>
  );
}
