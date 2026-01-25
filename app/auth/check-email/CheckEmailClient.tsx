"use client";

import { useMemo, useState } from "react";
import { createClient } from "@supabase/supabase-js";

type Props = {
  email: string;
};

function getSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) return null;
  return createClient(url, anon);
}

export default function CheckEmailClient({ email }: Props) {
  const supabase = useMemo(() => getSupabaseClient(), []);
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState<"idle" | "sent" | "error">("idle");
  const [message, setMessage] = useState("");

  async function resendEmail() {
    if (!email) {
      setStatus("error");
      setMessage("Email is missing. Please go back and enter your email again.");
      return;
    }

    if (!supabase) {
      setStatus("error");
      setMessage("Supabase env is missing. Check NEXT_PUBLIC_SUPABASE_URL/ANON_KEY.");
      return;
    }

    try {
      setSending(true);
      setStatus("idle");
      setMessage("");

      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) throw error;

      setStatus("sent");
      setMessage("Email sent again.");
    } catch (e: any) {
      setStatus("error");
      setMessage(e?.message || "Could not resend. Please try again.");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <button
        type="button"
        onClick={resendEmail}
        disabled={sending}
        className="inline-flex items-center justify-center rounded-xl bg-[#0B2B5A] px-4 py-2 text-sm font-semibold text-white hover:bg-[#0A2550] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {sending ? "Sending..." : "Resend email"}
      </button>

      {message ? (
        <span
          className={`text-sm ${
            status === "error" ? "text-red-600" : "text-emerald-700"
          }`}
        >
          {message}
        </span>
      ) : null}
    </div>
  );
}
