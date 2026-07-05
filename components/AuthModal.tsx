"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { signUpParentAccount, signInParentAccount, supabase } from "@/lib/auth";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode: "login" | "signup";
}

function isValidEmail(email: string) {
  const e = email.trim().toLowerCase();
  return e.includes("@") && e.includes(".") && e.length >= 6;
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  background: "transparent",
  border: "none",
  borderBottom: "1px solid #E5E7EB",
  color: "#111827",
  fontSize: "14px",
  padding: "10px 0",
  outline: "none",
  boxSizing: "border-box",
};

export default function AuthModal({ isOpen, onClose, initialMode }: AuthModalProps) {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "signup">(initialMode);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      setError("");
      setName("");
      setEmail("");
      setPhone("");
      setPassword("");
    }
  }, [isOpen, initialMode]);

  const canSubmit =
    mode === "signup"
      ? name.trim().length >= 2 && isValidEmail(email) && password.trim().length >= 6
      : isValidEmail(email) && password.trim().length >= 6;

  async function handleGoogleSignIn() {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/google-callback`,
      },
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit || loading) return;
    setError("");
    setLoading(true);

    if (mode === "signup") {
      const { error: supaError } = await signUpParentAccount({
        parentEmail: email.trim().toLowerCase(),
        password,
        studentName: name,
        studentClass: "",
        phone,
      });
      setLoading(false);
      if (supaError) { setError(supaError.message || "Signup failed."); return; }
      onClose();
      router.push(`/verify-otp?email=${encodeURIComponent(email.trim().toLowerCase())}`);
    } else {
      const { error: signInError } = await signInParentAccount({
        parentEmail: email.trim().toLowerCase(),
        password,
      });
      setLoading(false);
      if (signInError) { setError(signInError.message || "Login failed."); return; }
      onClose();
      router.push("/dashboard");
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.6)",
          zIndex: 100,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflowY: "auto",
          padding: "16px",
        }}
        onClick={onClose}
      >
      <style>{`
        .auth-input::placeholder { color: #9CA3AF; }
        .auth-input:focus { border-bottom-color: #22C55E !important; }
        .auth-modal-input:-webkit-autofill,
        .auth-modal-input:-webkit-autofill:hover,
        .auth-modal-input:-webkit-autofill:focus {
          -webkit-text-fill-color: #111827;
          -webkit-box-shadow: 0 0 0px 1000px #FFFFFF inset;
          transition: background-color 5000s ease-in-out 0s;
        }
      `}</style>

      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 60 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        style={{
          background: "#FFFFFF",
          borderRadius: "20px",
          padding: "36px 40px",
          maxWidth: "480px",
          width: "90vw",
          maxHeight: "90vh",
          overflowY: "auto",
          position: "relative",
          boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          type="button"
          onClick={onClose}
          style={{
            position: "absolute",
            top: "16px",
            right: "20px",
            background: "none",
            border: "none",
            color: "#111827",
            fontSize: "24px",
            cursor: "pointer",
            lineHeight: 1,
            padding: 0,
          }}
        >
          ×
        </button>

        {/* Heading */}
        <h2 style={{ color: "#0F172A", fontSize: "24px", fontWeight: 700, margin: 0, marginBottom: "4px" }}>
          {mode === "signup" ? "Sign up now to unlock free access" : "Welcome back"}
        </h2>
        <p style={{ color: "#6B7280", fontSize: "14px", marginTop: "6px", marginBottom: "20px" }}>
          {mode === "signup"
            ? "Join thousands of Pakistani students learning smarter."
            : "Log in to continue learning."}
        </p>

        {/* Google sign-in */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
            width: "100%",
            marginTop: "16px",
            padding: "11px",
            background: "white",
            color: "#111827",
            border: "1px solid #E5E7EB",
            borderRadius: "8px",
            fontSize: "14px",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          <svg width="18" height="18" viewBox="0 0 48 48">
            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.31-8.16 2.31-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
          </svg>
          {mode === "login" ? "Log in with Google" : "Sign up with Google"}
        </button>

        {/* Divider */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px", margin: "16px 0" }}>
          <div style={{ flex: 1, height: "1px", background: "#E5E7EB" }} />
          <span style={{ color: "#9CA3AF", fontSize: "12px" }}>or</span>
          <div style={{ flex: 1, height: "1px", background: "#E5E7EB" }} />
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {mode === "signup" && (
            <input
              className="auth-input auth-modal-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Student name"
              style={inputStyle}
            />
          )}
          <input
            className="auth-input auth-modal-input"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            style={inputStyle}
          />
          {mode === "signup" && (
            <input
              className="auth-input auth-modal-input"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Phone Number (optional)"
              style={inputStyle}
            />
          )}
          <input
            className="auth-input auth-modal-input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            minLength={6}
            style={inputStyle}
          />

          {error && (
            <div
              style={{
                background: "rgba(239,68,68,0.15)",
                color: "#FCA5A5",
                borderRadius: "8px",
                padding: "10px 14px",
                fontSize: "13px",
              }}
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={!canSubmit || loading}
            style={{
              width: "100%",
              padding: "13px",
              background: "#22C55E",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontSize: "14px",
              fontWeight: 700,
              cursor: canSubmit && !loading ? "pointer" : "not-allowed",
              opacity: canSubmit && !loading ? 1 : 0.6,
              marginTop: "4px",
            }}
          >
            {loading ? "Please wait..." : mode === "signup" ? "Sign up" : "Log in"}
          </button>
        </form>

        {/* Toggle link */}
        <p style={{ textAlign: "center", marginTop: "16px", fontSize: "14px", color: "#6B7280" }}>
          {mode === "signup" ? (
            <>
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => setMode("login")}
                style={{ background: "none", border: "none", color: "#22C55E", fontSize: "14px", cursor: "pointer", fontWeight: 600 }}
              >
                Log in
              </button>
            </>
          ) : (
            <>
              Don&apos;t have an account?{" "}
              <button
                type="button"
                onClick={() => setMode("signup")}
                style={{ background: "none", border: "none", color: "#22C55E", fontSize: "14px", cursor: "pointer", fontWeight: 600 }}
              >
                Sign up
              </button>
            </>
          )}
        </p>

        {/* Terms */}
        <p style={{ textAlign: "center", marginTop: "12px", fontSize: "12px", color: "#9CA3AF" }}>
          By signing up you agree to our Terms and Privacy Policy
        </p>
      </motion.div>
      </motion.div>
      )}
    </AnimatePresence>
  );
}
