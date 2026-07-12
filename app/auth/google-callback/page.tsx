"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/auth";

function GoogleCallbackInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [duplicateEmail, setDuplicateEmail] = useState(false);

  useEffect(() => {
    async function handleCallback() {
      const code = searchParams.get("code");

      let userId: string;
      let provider: string | undefined;
      let accessToken: string;

      if (code) {
        const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
        if (exchangeError || !data.session) {
          setError(exchangeError?.message || "Authentication failed. Please try again.");
          return;
        }
        userId = data.session.user.id;
        provider = data.session.user.app_metadata?.provider as string | undefined;
        accessToken = data.session.access_token;
      } else {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          setError("No authentication session found.");
          return;
        }
        userId = session.user.id;
        provider = session.user.app_metadata?.provider as string | undefined;
        accessToken = session.access_token;
      }

      if (provider !== "google") {
        try { localStorage.removeItem("last_selected_subject"); } catch {}
        router.replace("/dashboard");
        return;
      }

      // Check if another account already exists for this email using email/password.
      // The API also deletes the phantom Google account server-side if a conflict is found.
      try {
        const checkRes = await fetch("/api/auth/check-duplicate-email", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${accessToken}`,
          },
        });
        if (checkRes.ok) {
          const { conflict } = await checkRes.json();
          if (conflict) {
            // Phantom Google account was deleted server-side; clear the local session too
            try { await supabase.auth.signOut(); } catch {}
            setDuplicateEmail(true);
            return;
          }
        }
      } catch {
        // Non-fatal: if the duplicate check fails, proceed rather than blocking the user
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("student_name")
        .eq("id", userId)
        .maybeSingle();

      if (profile?.student_name?.trim()) {
        try { localStorage.removeItem("last_selected_subject"); } catch {}
        router.replace("/dashboard");
      } else {
        router.replace("/confirm-name");
      }
    }

    handleCallback();
  }, [searchParams, router]);

  if (duplicateEmail) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white px-6">
        <div className="w-full max-w-sm text-center">
          <p className="text-4xl mb-4">⚠️</p>
          <h1 className="text-xl font-bold text-[#111827]">Account already exists</h1>
          <p className="mt-3 text-sm text-[#6B7280] leading-relaxed">
            An account with this email was created using email and password. Please log in
            with your original method to keep all your existing progress.
          </p>
          <a
            href="/"
            className="mt-6 inline-flex items-center justify-center rounded-xl bg-[#0F172A] px-6 py-3 text-sm font-semibold text-white hover:bg-[#1E293B] transition-colors"
          >
            Go to homepage to log in
          </a>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white px-6">
        <div className="w-full max-w-sm text-center">
          <p className="text-4xl mb-4">⚠️</p>
          <h1 className="text-xl font-bold text-[#111827]">Sign in failed</h1>
          <p className="mt-2 text-sm text-[#6B7280]">{error}</p>
          <a
            href="/"
            className="mt-6 inline-flex items-center justify-center rounded-xl bg-[#0F172A] px-6 py-3 text-sm font-semibold text-white hover:bg-[#1E293B] transition-colors"
          >
            Back to Home
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-white">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#22C55E] border-t-transparent" />
    </div>
  );
}

export default function GoogleCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-white">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#22C55E] border-t-transparent" />
        </div>
      }
    >
      <GoogleCallbackInner />
    </Suspense>
  );
}
