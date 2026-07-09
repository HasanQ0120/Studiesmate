"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Copy, Eye, EyeOff } from "lucide-react";
import { supabase } from "@/lib/auth";

export default function ConnectCodePage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [connectCode, setConnectCode] = useState<string | null>(null);
  const [codeVisible, setCodeVisible] = useState(false);
  const [codeCopied, setCodeCopied] = useState(false);

  useEffect(() => {
    async function init() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.replace("/"); return; }

      const { data } = await supabase
        .from("profiles")
        .select("connect_code")
        .eq("id", user.id)
        .maybeSingle();

      setConnectCode(data?.connect_code ?? null);
      setLoading(false);
    }
    init();
  }, [router]);

  function handleCopyCode() {
    if (!connectCode) return;
    navigator.clipboard.writeText(connectCode);
    setCodeCopied(true);
    setTimeout(() => setCodeCopied(false), 1500);
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F9FAFB] px-6 py-8 pb-24 md:pb-12">
        <div className="mx-auto max-w-2xl">
          <div className="skeleton mb-2" style={{ height: 28, width: 200 }} />
          <div className="skeleton mb-8" style={{ height: 16, width: 300 }} />
          <div className="rounded-2xl bg-white shadow-sm mb-6 overflow-hidden">
            <div className="px-6 py-4 border-b border-[#F3F4F6]">
              <div className="skeleton" style={{ height: 14, width: 100 }} />
            </div>
            <div className="px-6 py-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="skeleton flex-1" style={{ height: 52, borderRadius: 12 }} />
                <div className="skeleton" style={{ height: 44, width: 44, borderRadius: 12 }} />
                <div className="skeleton" style={{ height: 44, width: 44, borderRadius: 12 }} />
              </div>
              <div className="skeleton" style={{ height: 12, width: "80%" }} />
            </div>
          </div>
          <div className="rounded-2xl bg-white shadow-sm mb-6 overflow-hidden">
            <div className="px-6 py-5">
              <div className="skeleton mb-4" style={{ height: 52, borderRadius: 8 }} />
              <div className="skeleton" style={{ height: 44, borderRadius: 12 }} />
            </div>
          </div>
          <div className="skeleton" style={{ height: 44, borderRadius: 12 }} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB] px-6 py-8 pb-24 md:pb-12">
      <div className="mx-auto max-w-2xl">

        <h1 className="text-2xl font-bold text-[#0B2B5A] mb-1">Your Connect Code</h1>
        <p className="text-sm text-[#6B7280] mb-8">
          Connect your parent dashboard using this code to track your child&apos;s progress, quiz scores, and learning journey, all in one place. Full parent dashboard launching with Grade 4.
        </p>

        {/* Code card */}
        <section className="rounded-2xl bg-white shadow-sm mb-6 overflow-hidden premium-card-hover">
          <div className="px-6 py-4 border-b border-[#F3F4F6]">
            <h2 className="text-sm font-bold text-[#111827]">Connect Code</h2>
          </div>
          <div className="px-6 py-5">
            {connectCode ? (
              <>
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex-1 rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] px-4 py-3 font-mono text-xl font-bold tracking-widest text-[#111827]">
                    {codeVisible ? connectCode : connectCode.replace(/-.+$/, "-••••")}
                  </div>
                  <button
                    type="button"
                    onClick={() => setCodeVisible((v) => !v)}
                    title={codeVisible ? "Hide code" : "Show code"}
                    className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] text-[#6B7280] hover:text-[#111827] transition-colors"
                  >
                    <span key={codeVisible ? "eye-off" : "eye"} style={{ animation: "fadeIn 0.15s ease-out", display: "flex" }}>
                      {codeVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={handleCopyCode}
                    title="Copy connect code"
                    className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] transition-colors"
                    style={{ color: codeCopied ? "#22C55E" : "#6B7280", transition: "color 0.15s ease-out" }}
                  >
                    <span key={codeCopied ? "check" : "copy"} style={{ animation: "fadeIn 0.15s ease-out", display: "flex" }}>
                      {codeCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </span>
                  </button>
                </div>
                <p className="text-xs text-[#9CA3AF] leading-relaxed">
                  ⚠️ Only share this code with your parent or guardian. Anyone with this code can view your full learning progress.
                </p>
              </>
            ) : (
              <p className="text-sm text-[#9CA3AF]">No connect code found. Please contact support.</p>
            )}
          </div>
        </section>

        {/* Connect Parent Dashboard */}
        <section className="rounded-2xl bg-white shadow-sm mb-6 overflow-hidden premium-card-hover">
          <div className="px-6 py-5">
            <p className="text-sm text-[#6B7280] mb-4 leading-relaxed">
              Connect your parent dashboard using this code to track your child&apos;s progress, quiz scores, and learning journey, all in one place. Full parent dashboard launching with Grade 4.
            </p>
            <button
              type="button"
              onClick={() => router.push("/parent")}
              className="w-full flex items-center justify-center gap-2 rounded-xl py-3 px-4 text-sm font-semibold text-white transition-colors"
              style={{ background: "#22C55E" }}
            >
              Connect Parent Dashboard →
            </button>
          </div>
        </section>

        {/* Back to Dashboard */}
        <button
          type="button"
          onClick={() => { try { localStorage.removeItem("last_selected_subject"); } catch {} router.push("/dashboard"); }}
          className="w-full flex items-center justify-center rounded-xl py-3 px-4 text-sm font-medium text-[#111827] bg-white border border-[#E5E7EB] hover:bg-[#F9FAFB] hover:border-[#D1D5DB] transition-colors"
        >
          ← Dashboard
        </button>

      </div>
    </div>
  );
}
