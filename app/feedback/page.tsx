"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { supabase } from "@/lib/auth";

type SbMeta = {
  studentName?: string;
  parentEmail?: string;
};

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
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

  const canSend = useMemo(() => {
    // allow sending with or without screenshot
    return message.trim().length >= 10 && status !== "sending";
  }, [message, status]);

  function handlePickFile(e: React.ChangeEvent<HTMLInputElement>) {
    setFileError("");
    const file = e.target.files?.[0] || null;

    if (!file) {
      setScreenshot(null);
      return;
    }

    if (!ALLOWED_MIME.includes(file.type)) {
      setScreenshot(null);
      setFileError("Only PNG, JPG, or WebP images are allowed.");
      // reset input so user can re-pick same file
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
      .upload(path, file, {
        cacheControl: "3600",
        upsert: false,
        contentType: file.type,
      });

    if (upErr) throw upErr;

    const { data } = supabase.storage.from("feedback-screenshots").getPublicUrl(path);
    return data.publicUrl;
  }

  async function handleSubmit() {
    if (!canSend) return;

    setStatus("sending");
    setError("");
    setFileError("");

    try {
      let screenshot_url: string | null = null;

      if (screenshot) {
        screenshot_url = await uploadScreenshot(screenshot);
      }

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
    <div className="bg-white">
      <div className="mx-auto max-w-6xl px-4 py-16">
        <div className="mx-auto max-w-2xl rounded-2xl border border-slate-200 bg-white p-6 text-slate-900 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <h1 className="text-xl font-semibold tracking-tight">Feedback</h1>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
              Beta
            </span>
          </div>

          <p className="mt-2 text-sm text-slate-600">
            Tell us what’s confusing, broken, missing, or annoying. Short and specific feedback is best.
          </p>

          <div className="mt-6">
            <label className="text-sm font-medium text-slate-800">
              Your feedback (min 10 characters)
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={6}
              placeholder="Example: Subjects page takes too long to load on mobile..."
              className="mt-2 w-full rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-slate-200"
            />
          </div>

          {/* Screenshot upload (styled like the Submit button) */}
          <div className="mt-6">
            <p className="text-sm font-medium text-slate-800">Optional screenshot</p>

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
                className="cursor-pointer rounded-xl bg-[#0B2B5A] px-4 py-2 text-sm font-semibold text-white"
              >
                Choose image
              </label>

              <span className="text-sm text-slate-600">
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
                  className="text-sm font-semibold text-slate-700 underline"
                >
                  Remove
                </button>
              )}
            </div>

            <p className="mt-2 text-xs text-slate-500">
              Optional. Upload one screenshot (PNG/JPG/WebP, max 5MB). Please avoid sharing passwords,
              phone numbers, or private information.
            </p>

            {fileError && <p className="mt-2 text-sm text-red-600">{fileError}</p>}
          </div>

          {status === "error" && <p className="mt-3 text-sm text-red-600">{error}</p>}
          {status === "sent" && <p className="mt-3 text-sm text-green-700">Feedback sent. Thanks.</p>}

          <div className="mt-5">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!canSend}
              className="rounded-xl bg-[#0B2B5A] px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
            >
              {status === "sending" ? "Sending..." : "Submit feedback"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
