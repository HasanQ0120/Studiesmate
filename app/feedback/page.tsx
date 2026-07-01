"use client";

import Link from "next/link";
import PageFade from "@/components/PageFade";
import { useEffect, useMemo, useRef, useState } from "react";
import { supabase } from "@/lib/auth";

type SbMeta = {
  studentName?: string;
  parentEmail?: string;
};

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_MIME = ["image/png", "image/jpeg", "image/webp"];

export default function FeedbackPage() {
  const [studentName, setStudentName] = useState("");
  const [parentEmail, setParentEmail] = useState("");
  const [message, setMessage] = useState("");

  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [fileError, setFileError] = useState("");

  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState("");

  const fileInputId = "feedback-screenshot";
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    async function loadUser() {
      const { data } = await supabase.auth.getUser();
      const user = data.user;
      const meta = (user?.user_metadata || {}) as SbMeta;
      setStudentName((meta.studentName || "").trim());
      setParentEmail((user?.email || meta.parentEmail || "").trim());
    }
    loadUser();
  }, []);

  const isLoggedIn = useMemo(() => !!parentEmail.trim(), [parentEmail]);

  const canSend = useMemo(() => {
    return isLoggedIn && message.trim().length >= 10 && status !== "sending";
  }, [isLoggedIn, message, status]);

  function handlePickFile(e: React.ChangeEvent<HTMLInputElement>) {
    setFileError("");
    const file = e.target.files?.[0] || null;
    if (!file) { setScreenshot(null); return; }
    if (!ALLOWED_MIME.includes(file.type)) {
      setScreenshot(null);
      setFileError("Only PNG, JPG, or WebP images are allowed.");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      setScreenshot(null);
      setFileError("Image is too large. Max size is 5MB.");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }
    setScreenshot(file);
  }

  async function uploadScreenshot(file: File) {
    const ext = file.name.split(".").pop()?.toLowerCase() || "png";
    const safeExt = ["png", "jpg", "jpeg", "webp"].includes(ext) ? ext : "png";
    const path = `feedback/${Date.now()}-${Math.random().toString(16).slice(2)}.${safeExt}`;
    const { error: upErr } = await supabase.storage
      .from("feedback-screenshots")
      .upload(path, file, { cacheControl: "3600", upsert: false, contentType: file.type });
    if (upErr) throw upErr;
    const { data } = supabase.storage.from("feedback-screenshots").getPublicUrl(path);
    return data.publicUrl;
  }

  async function handleSubmit() {
    if (!isLoggedIn) {
      setStatus("error");
      setError("Please log in or sign up to submit feedback.");
      return;
    }
    if (!canSend) return;
    setStatus("sending");
    setError("");
    setFileError("");
    try {
      let screenshot_url: string | null = null;
      if (screenshot) screenshot_url = await uploadScreenshot(screenshot);
      const payload = {
        user_email: parentEmail || null,
        student_name: studentName || null,
        message: message.trim(),
        page: "/feedback",
        screenshot_url,
      };
      const { error: insertError } = await supabase.from("feedback").insert(payload);
      if (insertError) throw insertError;
      setStatus("sent");
      setMessage("");
      setScreenshot(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err: any) {
      setStatus("error");
      setError(err?.message || "Failed to send feedback.");
    }
  }

  return (
    <PageFade>
    <div>
      {/* Top hero */}
      <div className="bg-[#F0FDF4] px-4 py-14 text-center">
        <div className="text-4xl">💬</div>
        <h1 className="mt-4 text-3xl font-bold text-[#111827]">Share Your Feedback</h1>
        <p className="mx-auto mt-3 max-w-md text-sm text-[#6B7280]">
          Tell us what's confusing, broken, or missing. Every message is read by the founders.
        </p>
      </div>

      {/* Form */}
      <div className="bg-white px-4 py-12">
        <div className="mx-auto max-w-[600px] rounded-xl bg-white p-8 shadow-md border border-[#E5E7EB]">

          {/* Not logged in warning */}
          {!isLoggedIn && (
            <div className="mb-6 rounded-xl border border-[#DCFCE7] bg-[#F0FDF4] p-4">
              <p className="text-sm font-semibold text-[#16A34A]">Log in required</p>
              <p className="mt-1 text-sm text-[#374151]">Please log in or sign up to submit feedback.</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Link
                  href="/login"
                  className="rounded-lg border border-[#22C55E] px-3 py-2 text-sm font-semibold text-[#22C55E] hover:bg-[#F0FDF4] transition-colors"
                >
                  Log in
                </Link>
                <Link
                  href="/signup"
                  className="rounded-lg border border-[#22C55E] px-3 py-2 text-sm font-semibold text-[#22C55E] hover:bg-[#F0FDF4] transition-colors"
                >
                  Sign up
                </Link>
              </div>
            </div>
          )}

          {/* Textarea */}
          <div>
            <label className="text-sm font-medium text-[#374151]">
              Your feedback (min 10 characters)
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={6}
              placeholder="Example: Subjects page takes too long to load on mobile..."
              className="mt-2 w-full rounded-lg border border-[#E5E7EB] bg-white p-3 text-sm text-[#111827] outline-none transition-colors focus:border-[#22C55E] focus:ring-2 focus:ring-[#22C55E]/20"
            />
          </div>

          {/* Screenshot upload */}
          <div className="mt-6">
            <p className="text-sm font-medium text-[#374151]">Optional screenshot</p>
            <input
              ref={fileInputRef}
              id={fileInputId}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={handlePickFile}
              className="sr-only"
            />
            <div className="mt-2 flex flex-wrap items-center gap-3">
              <label
                htmlFor={fileInputId}
                className="cursor-pointer rounded-lg border border-[#E5E7EB] px-4 py-2 text-sm font-semibold text-[#374151] hover:bg-[#F9FAFB] transition-colors"
              >
                Choose image
              </label>
              <span className="text-sm text-[#6B7280]">
                {screenshot ? screenshot.name : "No file chosen"}
              </span>
              {screenshot && (
                <button
                  type="button"
                  onClick={() => {
                    setScreenshot(null);
                    setFileError("");
                    if (fileInputRef.current) fileInputRef.current.value = "";
                  }}
                  className="text-sm font-semibold text-[#6B7280] underline"
                >
                  Remove
                </button>
              )}
            </div>
            <p className="mt-2 text-xs text-[#9CA3AF]">
              Optional. Upload one screenshot (PNG/JPG/WebP, max 5MB). Please avoid sharing passwords or private information.
            </p>
            {fileError && <p className="mt-2 text-sm text-red-600">{fileError}</p>}
          </div>

          {status === "error" && <p className="mt-4 text-sm text-red-600">{error}</p>}
          {status === "sent" && (
            <p className="mt-4 text-sm font-semibold text-[#22C55E]">Feedback sent. Thank you!</p>
          )}

          {/* Submit */}
          <div className="mt-6">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!canSend}
              className="w-full rounded-xl bg-[#22C55E] py-3 text-sm font-semibold text-white transition-colors hover:bg-[#16A34A] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {status === "sending" ? "Sending..." : "Submit feedback"}
            </button>
          </div>
        </div>
      </div>
    </div>
    </PageFade>
  );
}
