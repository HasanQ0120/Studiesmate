"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { supabase } from "@/lib/auth";

function detectInAppBrowser(): boolean {
  if (typeof window === "undefined") return false;
  const ua = window.navigator.userAgent;
  return (
    /GSA\//.test(ua) ||          // Gmail iOS (Google Search App)
    /FBAN|FBAV/.test(ua) ||      // Facebook app
    /Instagram/.test(ua) ||       // Instagram app
    /LinkedInApp/.test(ua) ||     // LinkedIn app
    /\bwv\b/.test(ua) ||          // Android generic WebView flag
    /\[FB[_\w]*\]/.test(ua)       // Facebook Messenger
  );
}

function AuthConfirmInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [inApp, setInApp] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (detectInAppBrowser()) {
      setInApp(true);
      return;
    }

    async function confirm() {
      const code = searchParams.get("code");

      if (!code) {
        setError("No confirmation code found in the link. Please use the link from your email.");
        return;
      }

      const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

      if (exchangeError) {
        setError(exchangeError.message || "Confirmation failed. The link may have expired.");
        return;
      }

      router.replace("/dashboard");
    }

    confirm();
  }, [searchParams, router]);

  function handleCopyLink() {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  }

  if (inApp) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white px-6">
        <div className="w-full max-w-sm text-center">
          <p className="text-4xl mb-4">🌐</p>
          <h1 className="text-xl font-bold text-[#111827]">Open in Chrome or Safari</h1>
          <p className="mt-2 text-sm text-[#6B7280]">
            This confirmation link needs to open in your default browser — not inside the Gmail or app webview — to work correctly.
          </p>
          <button
            type="button"
            onClick={handleCopyLink}
            className="mt-6 inline-flex items-center justify-center rounded-xl bg-[#22C55E] px-6 py-3 text-sm font-semibold text-white hover:bg-[#16A34A] transition-colors"
          >
            {copied ? "✓ Copied!" : "Copy link"}
          </button>
          <p className="mt-3 text-xs text-[#9CA3AF]">
            Paste the copied link into Chrome or Safari, then open it.
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white px-6">
        <div className="w-full max-w-sm text-center">
          <p className="text-4xl mb-4">⚠️</p>
          <h1 className="text-xl font-bold text-[#111827]">Confirmation failed</h1>
          <p className="mt-2 text-sm text-[#6B7280]">{error}</p>
          <a
            href="/"
            className="mt-6 inline-flex items-center justify-center rounded-xl bg-[#0F172A] px-6 py-3 text-sm font-semibold text-white hover:bg-[#1E293B] transition-colors"
          >
            Back to Login
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-6">
      <div className="w-full max-w-sm text-center">
        <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-[#22C55E] border-t-transparent" />
        <p className="text-sm text-[#6B7280]">Confirming your email…</p>
      </div>
    </div>
  );
}

export default function AuthConfirmPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#22C55E] border-t-transparent" />
      </div>
    }>
      <AuthConfirmInner />
    </Suspense>
  );
}
