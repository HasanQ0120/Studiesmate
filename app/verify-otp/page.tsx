"use client";

import { Suspense, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/auth";

function VerifyOtpContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  const [otp, setOtp] = useState(["", "", "", "", "", "", "", ""]);
  const [otpError, setOtpError] = useState("");
  const [otpLoading, setOtpLoading] = useState(false);
  const [resendMsg, setResendMsg] = useState("");

  const refs = useRef<(HTMLInputElement | null)[]>([]);

  function handleOtpChange(index: number, value: string) {
    // Paste support: full code pasted into box 0
    if (value.length > 1 && index === 0) {
      const digits = value.replace(/\D/g, "").slice(0, 8).split("");
      const newOtp = ["", "", "", "", "", "", "", ""].map((_, i) => digits[i] || "");
      setOtp(newOtp);
      setOtpError("");
      const lastFilled = Math.min(digits.length, 7);
      refs.current[lastFilled]?.focus();
      if (digits.length === 8) verifyOtp(digits.join(""));
      return;
    }

    const digit = value.replace(/\D/g, "").slice(-1);
    const newOtp = [...otp];
    newOtp[index] = digit;
    setOtp(newOtp);
    setOtpError("");

    if (digit && index < 7) refs.current[index + 1]?.focus();
    if (digit && newOtp.every((d) => d !== "")) verifyOtp(newOtp.join(""));
  }

  function handleOtpKeyDown(index: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      refs.current[index - 1]?.focus();
    }
  }

  async function verifyOtp(code: string) {
    setOtpLoading(true);
    setOtpError("");
    const { error } = await supabase.auth.verifyOtp({
      email,
      token: code,
      type: "signup",
    });
    setOtpLoading(false);
    if (error) {
      setOtpError("Invalid or expired code. Please try again or resend.");
      setOtp(["", "", "", "", "", "", "", ""]);
      setTimeout(() => refs.current[0]?.focus(), 50);
      return;
    }
    router.push("/dashboard");
  }

  async function handleResend() {
    setResendMsg("");
    setOtpError("");
    const { error } = await supabase.auth.resend({ type: "signup", email });
    if (error) {
      console.error("[VerifyOTP] Resend error:", error.message);
      setOtpError("Failed to resend. Please wait a moment and try again.");
    } else {
      setResendMsg("Code resent! Check your inbox.");
    }
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
        .otp-box:focus { border-color: #F97316 !important; outline: none; }
        .verify-btn:not(:disabled):hover { background: #16A34A !important; }
        .resend-btn:hover { text-decoration: underline; }
        @media (max-width: 480px) {
          .otp-row { max-width: 244px; row-gap: 12px; margin-left: auto; margin-right: auto; }
        }
        @media (min-width: 768px) {
          .otp-row { flex-wrap: nowrap; }
        }
      `}</style>

      <div style={{ width: "100%", maxWidth: "520px", textAlign: "center" }}>
        <div style={{ fontSize: "48px", marginBottom: "24px", lineHeight: 1 }}>✉️</div>

        <h1 style={{ color: "#0F172A", fontSize: "26px", fontWeight: 700, margin: "0 0 12px" }}>
          Verify Your Email
        </h1>

        <p style={{ color: "#6B7280", fontSize: "15px", lineHeight: 1.6, margin: "0 0 36px" }}>
          Enter the 8-digit code sent to{" "}
          <span style={{ color: "#0F172A", fontWeight: 600 }}>{email}</span>
        </p>

        {/* OTP boxes */}
        <div className="otp-row" style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "10px", marginBottom: "32px" }}>
          {otp.map((digit, i) => (
            <input
              key={i}
              ref={(el) => { refs.current[i] = el; }}
              className="otp-box"
              type="text"
              inputMode="numeric"
              maxLength={8}
              value={digit}
              onChange={(e) => handleOtpChange(i, e.target.value)}
              onKeyDown={(e) => handleOtpKeyDown(i, e)}
              autoFocus={i === 0}
              style={{
                width: "52px",
                height: "60px",
                textAlign: "center",
                fontSize: "22px",
                fontWeight: 700,
                color: "#0F172A",
                border: "2px solid #E5E7EB",
                borderRadius: "12px",
                background: "#F9FAFB",
                cursor: "text",
                transition: "border-color 0.15s",
                boxSizing: "border-box",
              }}
            />
          ))}
        </div>

        {otpError && (
          <p style={{ color: "#EF4444", fontSize: "14px", margin: "0 0 20px" }}>{otpError}</p>
        )}

        {resendMsg && (
          <p style={{ color: "#22C55E", fontSize: "14px", margin: "0 0 20px" }}>{resendMsg}</p>
        )}

        <button
          type="button"
          onClick={() => verifyOtp(otp.join(""))}
          disabled={otp.some((d) => !d) || otpLoading}
          className="verify-btn"
          style={{
            width: "100%",
            padding: "15px",
            background: "#22C55E",
            color: "white",
            border: "none",
            borderRadius: "9999px",
            fontSize: "16px",
            fontWeight: 700,
            cursor: otp.every((d) => d) && !otpLoading ? "pointer" : "not-allowed",
            opacity: otp.every((d) => d) && !otpLoading ? 1 : 0.6,
            marginBottom: "24px",
            transition: "background 0.15s",
          }}
        >
          {otpLoading ? "Verifying..." : "Verify"}
        </button>

        <p style={{ fontSize: "14px", color: "#6B7280", marginBottom: "12px" }}>
          Didn&apos;t receive it?{" "}
          <button
            type="button"
            onClick={handleResend}
            className="resend-btn"
            style={{
              background: "none",
              border: "none",
              color: "#22C55E",
              fontSize: "13px",
              fontWeight: 600,
              cursor: "pointer",
              padding: 0,
              textDecoration: "none",
            }}
          >
            Resend code
          </button>
        </p>

        <p style={{ fontSize: "13px", color: "#9CA3AF", lineHeight: 1.5 }}>
          Check your email on any device — then come back here to enter the code.
        </p>
      </div>
    </div>
  );
}

export default function VerifyOtpPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>Loading…</div>}>
      <VerifyOtpContent />
    </Suspense>
  );
}
