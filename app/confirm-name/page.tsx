"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/auth";

export default function ConfirmNamePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState("");
  const [googleName, setGoogleName] = useState("");
  const [error, setError] = useState("");
  const [userId, setUserId] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function init() {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) { router.replace("/"); return; }
      if (user.app_metadata?.provider !== "google") { router.replace("/dashboard"); return; }

      const { data: profile } = await supabase
        .from("profiles")
        .select("student_name")
        .eq("id", user.id)
        .maybeSingle();

      if (profile?.student_name?.trim()) { router.replace("/dashboard"); return; }

      const fetched = (
        (user.user_metadata?.full_name as string | undefined) ||
        (user.user_metadata?.name as string | undefined) ||
        ""
      ).trim();

      setGoogleName(fetched);
      setName(fetched);
      setUserId(user.id);
      setLoading(false);
      setTimeout(() => inputRef.current?.focus(), 50);
    }

    init();
  }, [router]);

  async function handleConfirm() {
    const trimmed = name.trim();
    if (!trimmed) { setError("Please enter your name."); return; }
    if (saving) return;

    setSaving(true);
    setError("");

    const { error: dbError } = await supabase
      .from("profiles")
      .upsert({ id: userId, student_name: trimmed }, { onConflict: "id" });

    if (dbError) {
      setSaving(false);
      setError("Failed to save. Please try again.");
      return;
    }

    // Update user_metadata so the dashboard greeting reads the confirmed name
    await supabase.auth.updateUser({ data: { studentName: trimmed } });

    router.replace("/dashboard");
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#22C55E] border-t-transparent" />
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#FFFFFF",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px 16px",
      }}
    >
      <style>{`
        .confirm-input:focus { border-color: #22C55E !important; }
        .confirm-btn:not(:disabled):hover { background: #16A34A !important; }
      `}</style>

      <div style={{ width: "100%", maxWidth: "440px" }}>
        <div style={{ fontSize: "48px", textAlign: "center", marginBottom: "24px", lineHeight: 1 }}>✏️</div>

        <h1 style={{ color: "#0F172A", fontSize: "26px", fontWeight: 700, margin: "0 0 12px", textAlign: "center" }}>
          Confirm Your Name
        </h1>

        {googleName ? (
          <p style={{ color: "#6B7280", fontSize: "15px", lineHeight: 1.6, margin: "0 0 28px", textAlign: "center" }}>
            We found your name as{" "}
            <strong style={{ color: "#0F172A" }}>{googleName}</strong>. Is this correct?
          </p>
        ) : (
          <p style={{ color: "#6B7280", fontSize: "15px", lineHeight: 1.6, margin: "0 0 28px", textAlign: "center" }}>
            Please enter your name to continue.
          </p>
        )}

        <input
          ref={inputRef}
          className="confirm-input"
          type="text"
          value={name}
          onChange={(e) => { setName(e.target.value); setError(""); }}
          onKeyDown={(e) => { if (e.key === "Enter" && name.trim()) handleConfirm(); }}
          placeholder="Enter your name"
          style={{
            width: "100%",
            padding: "14px 16px",
            fontSize: "16px",
            border: "2px solid #E5E7EB",
            borderRadius: "12px",
            color: "#0F172A",
            outline: "none",
            boxSizing: "border-box",
            marginBottom: "8px",
            transition: "border-color 0.15s",
          }}
        />

        <p style={{ color: "#F97316", fontSize: "12px", margin: "0 0 20px", lineHeight: 1.5 }}>
          This cannot be changed later. Please confirm carefully.
        </p>

        {error && (
          <p style={{ color: "#EF4444", fontSize: "13px", margin: "0 0 16px" }}>{error}</p>
        )}

        <button
          type="button"
          className="confirm-btn"
          onClick={handleConfirm}
          disabled={!name.trim() || saving}
          style={{
            width: "100%",
            padding: "15px",
            background: "#22C55E",
            color: "white",
            border: "none",
            borderRadius: "9999px",
            fontSize: "16px",
            fontWeight: 700,
            cursor: name.trim() && !saving ? "pointer" : "not-allowed",
            opacity: name.trim() && !saving ? 1 : 0.6,
            transition: "background 0.15s",
          }}
        >
          {saving ? "Saving..." : "Confirm"}
        </button>
      </div>
    </div>
  );
}
