"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/auth";

function GoogleCallbackInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function handleCallback() {
      const code = searchParams.get("code");

      let userId: string;
      let provider: string | undefined;

      if (code) {
        const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
        if (exchangeError || !data.session) {
          setError(exchangeError?.message || "Authentication failed. Please try again.");
          return;
        }
        userId = data.session.user.id;
        provider = data.session.user.app_metadata?.provider as string | undefined;
      } else {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          setError("No authentication session found.");
          return;
        }
        userId = session.user.id;
        provider = session.user.app_metadata?.provider as string | undefined;
      }

      if (provider !== "google") {
        router.replace("/dashboard");
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("student_name")
        .eq("id", userId)
        .maybeSingle();

      if (profile?.student_name?.trim()) {
        router.replace("/dashboard");
      } else {
        router.replace("/confirm-name");
      }
    }

    handleCallback();
  }, [searchParams, router]);

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
