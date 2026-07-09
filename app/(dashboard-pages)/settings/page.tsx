"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Check } from "lucide-react";
import { supabase } from "@/lib/auth";

type Profile = {
  student_name: string | null;
  current_streak: number | null;
  created_at: string | null;
};

export default function SettingsPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [email, setEmail] = useState("");
  const [userId, setUserId] = useState("");

  // Name edit
  const [nameInput, setNameInput] = useState("");
  const [nameSaving, setNameSaving] = useState(false);
  const [nameSaved, setNameSaved] = useState(false);
  const [nameError, setNameError] = useState("");
  const nameRef = useRef<HTMLInputElement>(null);

  // Notifications
  const [emailNotifications, setEmailNotifications] = useState(true);

  useEffect(() => {
    async function init() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.replace("/"); return; }

      setUserId(user.id);
      setEmail(user.email || "");

      const { data } = await supabase
        .from("profiles")
        .select("student_name, current_streak, created_at")
        .eq("id", user.id)
        .maybeSingle();

      const prof = data as Profile | null;
      setProfile(prof);

      const metaName = (user.user_metadata?.studentName as string | undefined || "").trim();
      const dbName = prof?.student_name?.trim() || "";
      setNameInput(dbName || metaName);

      setLoading(false);
    }
    init();
  }, [router]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("sm_email_notifications");
      if (stored !== null) setEmailNotifications(stored === "true");
    } catch {}
  }, []);

  async function saveName() {
    const trimmed = nameInput.trim();
    if (!trimmed) { setNameError("Name cannot be empty."); return; }
    if (nameSaving) return;

    setNameSaving(true);
    setNameError("");

    const { error: dbErr } = await supabase
      .from("profiles")
      .update({ student_name: trimmed })
      .eq("id", userId);

    if (dbErr) {
      setNameError("Failed to save. Please try again.");
      setNameSaving(false);
      return;
    }

    await supabase.auth.updateUser({ data: { studentName: trimmed } });

    setProfile((p) => p ? { ...p, student_name: trimmed } : p);
    setNameSaving(false);
    setNameSaved(true);
    setTimeout(() => setNameSaved(false), 2500);
  }

  function toggleEmailNotifications() {
    const next = !emailNotifications;
    setEmailNotifications(next);
    try { localStorage.setItem("sm_email_notifications", String(next)); } catch {}
  }

  function formatDate(iso: string | null) {
    if (!iso) return "—";
    return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F9FAFB] px-6 py-8 pb-24 md:pb-12">
        <div className="mx-auto max-w-2xl">
          <div className="skeleton mb-2" style={{ height: 28, width: 120 }} />
          <div className="skeleton mb-8" style={{ height: 16, width: 240 }} />
          <div className="rounded-2xl bg-white shadow-sm mb-6 overflow-hidden">
            <div className="px-6 py-4 border-b border-[#F3F4F6]">
              <div className="skeleton" style={{ height: 14, width: 56 }} />
            </div>
            <div className="px-6 py-5 space-y-5">
              <div>
                <div className="skeleton mb-2" style={{ height: 12, width: 96 }} />
                <div className="skeleton" style={{ height: 42, borderRadius: 12 }} />
              </div>
              <div>
                <div className="skeleton mb-2" style={{ height: 12, width: 140 }} />
                <div className="skeleton" style={{ height: 42, borderRadius: 12 }} />
              </div>
            </div>
          </div>
          <div className="rounded-2xl bg-white shadow-sm mb-6 overflow-hidden">
            <div className="px-6 py-4 border-b border-[#F3F4F6]">
              <div className="skeleton" style={{ height: 14, width: 120 }} />
            </div>
            <div className="px-6 py-5 flex gap-8">
              <div>
                <div className="skeleton mb-2" style={{ height: 28, width: 48 }} />
                <div className="skeleton" style={{ height: 12, width: 64 }} />
              </div>
              <div>
                <div className="skeleton mb-2" style={{ height: 28, width: 48 }} />
                <div className="skeleton" style={{ height: 12, width: 80 }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB] px-6 py-8 pb-24 md:pb-12">
      <div className="mx-auto max-w-2xl">

        <h1 className="text-2xl font-bold text-[#111827] mb-1">Settings</h1>
        <p className="text-sm text-[#6B7280] mb-8">Manage your profile and account details.</p>

        {/* ── Profile ── */}
        <section className="rounded-2xl bg-white shadow-sm mb-6 overflow-hidden premium-card-hover">
          <div className="px-6 py-4 border-b border-[#F3F4F6]">
            <h2 className="text-sm font-bold text-[#111827]">Profile</h2>
          </div>

          <div className="px-6 py-5 space-y-5">

            {/* Student name */}
            <div>
              <label className="block text-xs font-semibold text-[#374151] mb-1.5">
                Student Name
              </label>
              <div className="flex gap-2">
                <input
                  ref={nameRef}
                  type="text"
                  value={nameInput}
                  onChange={(e) => { setNameInput(e.target.value); setNameError(""); setNameSaved(false); }}
                  onKeyDown={(e) => { if (e.key === "Enter") saveName(); }}
                  placeholder="Enter student name"
                  className="flex-1 rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] px-3.5 py-2.5 text-sm text-[#111827] placeholder-[#9CA3AF] outline-none focus:border-[#22C55E] focus:bg-white transition-colors"
                />
                <button
                  type="button"
                  onClick={saveName}
                  disabled={nameSaving}
                  className="flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition-colors disabled:opacity-60"
                  style={{ background: nameSaved ? "#16A34A" : "#22C55E" }}
                >
                  {nameSaved ? (
                    <>
                      <Check className="h-4 w-4" />
                      Saved
                    </>
                  ) : nameSaving ? "Saving…" : "Save"}
                </button>
              </div>
              {nameError && (
                <p className="mt-1.5 text-xs text-red-500" style={{ animation: "fadeIn 0.2s ease-out" }}>{nameError}</p>
              )}
              <p className="mt-1.5 text-xs text-[#9CA3AF]">
                This is the name shown in your dashboard and progress reports.
              </p>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-[#374151] mb-1.5">
                Parent / Account Email
              </label>
              <div className="rounded-xl border border-[#E5E7EB] bg-[#F3F4F6] px-3.5 py-2.5 text-sm text-[#6B7280] select-all">
                {email || "—"}
              </div>
              <p className="mt-1.5 text-xs text-[#9CA3AF]">Email cannot be changed here. Contact support if needed.</p>
            </div>

            {/* Joined */}
            {profile?.created_at && (
              <div>
                <label className="block text-xs font-semibold text-[#374151] mb-1.5">Joined</label>
                <p className="text-sm text-[#6B7280]">{formatDate(profile.created_at)}</p>
              </div>
            )}

          </div>
        </section>

        {/* ── Learning Progress ── */}
        <section className="rounded-2xl bg-white shadow-sm mb-6 overflow-hidden premium-card-hover">
          <div className="px-6 py-4 border-b border-[#F3F4F6]">
            <h2 className="text-sm font-bold text-[#111827]">Learning Progress</h2>
          </div>
          <div className="px-6 py-5 flex gap-8">
            <div>
              <div className="text-2xl font-bold text-[#111827]">
                {profile?.current_streak ?? 0}
                {(profile?.current_streak ?? 0) > 0 && " 🔥"}
              </div>
              <div className="text-xs text-[#9CA3AF] mt-1">Day streak</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-[#111827]">Beta</div>
              <div className="text-xs text-[#9CA3AF] mt-1">Current grade</div>
            </div>
          </div>
        </section>

        {/* ── Notifications ── */}
        <section className="rounded-2xl bg-white shadow-sm mb-6 overflow-hidden premium-card-hover">
          <div className="px-6 py-4 border-b border-[#F3F4F6]">
            <h2 className="text-sm font-bold text-[#111827]">Notifications</h2>
          </div>
          <div className="px-6 py-5">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <p className="text-sm font-semibold text-[#111827]">Email notifications</p>
                <p className="mt-1 text-xs text-[#9CA3AF] leading-relaxed">
                  Get notified about new lessons, progress updates, and important announcements.
                </p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={emailNotifications}
                onClick={toggleEmailNotifications}
                style={{
                  flexShrink: 0,
                  position: "relative",
                  display: "inline-flex",
                  alignItems: "center",
                  height: "24px",
                  width: "44px",
                  borderRadius: "9999px",
                  border: "none",
                  cursor: "pointer",
                  padding: "2px",
                  background: emailNotifications ? "#22C55E" : "#D1D5DB",
                  transition: "background-color 0.2s ease-in-out",
                  outline: "none",
                }}
              >
                <span
                  style={{
                    display: "block",
                    height: "20px",
                    width: "20px",
                    borderRadius: "9999px",
                    background: "white",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
                    transform: emailNotifications ? "translateX(20px)" : "translateX(0)",
                    transition: "transform 0.2s ease-in-out",
                  }}
                />
              </button>
            </div>
          </div>
        </section>

        {/* ── Account ── */}
        <section className="rounded-2xl bg-white shadow-sm overflow-hidden premium-card-hover">
          <div className="px-6 py-4 border-b border-[#F3F4F6]">
            <h2 className="text-sm font-bold text-[#111827]">Account</h2>
          </div>
          <div className="px-6 py-5 space-y-3">
            <button
              type="button"
              onClick={() => { try { localStorage.removeItem("last_selected_subject"); } catch {} router.push("/dashboard"); }}
              className="w-full rounded-xl border border-[#E5E7EB] px-4 py-2.5 text-sm font-semibold text-[#374151] hover:bg-[#F9FAFB] transition-colors text-left"
            >
              ← Back to Dashboard
            </button>
          </div>
        </section>

      </div>
    </div>
  );
}
