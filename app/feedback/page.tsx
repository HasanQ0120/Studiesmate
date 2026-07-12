"use client";

import Link from "next/link";
import PageFade from "@/components/PageFade";
import { useEffect, useMemo, useRef, useState } from "react";
import { supabase } from "@/lib/auth";
import AuthModal from "@/components/AuthModal";

type SbMeta = {
  studentName?: string;
  parentEmail?: string;
};

const POSITIVE_TAGS = [
  "Solves a real problem",
  "Videos are clear and helpful",
  "Bilingual slider is amazing",
  "My child enjoyed learning",
];

const IMPROVE_TAGS = [
  "Urdu explanation could be simpler",
  "Video quality needs improvement",
  "App feels slow or buggy",
  "Needs more content",
];

export default function FeedbackPage() {
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "signup">("signup");
  const [studentName, setStudentName] = useState("");
  const [parentEmail, setParentEmail] = useState("");
  const [userId, setUserId] = useState<string | null>(null);

  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [comment, setComment] = useState("");

  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadUser() {
      const { data } = await supabase.auth.getUser();
      const user = data.user;
      const meta = (user?.user_metadata || {}) as SbMeta;
      setStudentName((meta.studentName || "").trim());
      setParentEmail((user?.email || meta.parentEmail || "").trim());
      setUserId(user?.id ?? null);
    }
    loadUser();
  }, []);

  const isLoggedIn = useMemo(() => !!parentEmail.trim(), [parentEmail]);
  const canSend = isLoggedIn && rating > 0 && status !== "sending";

  function toggleTag(tag: string) {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  }

  async function handleSubmit() {
    if (!canSend) return;
    setStatus("sending");
    setError("");
    try {
      const payload = {
        user_email: parentEmail || null,
        student_name: studentName || null,
        message: comment.trim() || null,
        comment: comment.trim() || null,
        rating,
        selected_tags: selectedTags.length > 0 ? selectedTags : null,
        page: "/feedback",
        screenshot_url: null,
      };
      const { error: insertError } = await supabase.from("feedback").insert(payload);
      if (insertError) throw insertError;
      try {
        localStorage.setItem("feedback_submitted", "true");
        window.dispatchEvent(new Event("feedback_submitted"));
      } catch {}
      setStatus("sent");
    } catch (err: any) {
      setStatus("error");
      setError(err?.message || "Failed to send feedback.");
    }
  }

  if (status === "sent") {
    return (
      <PageFade>
        <div className="min-h-[60vh] bg-white flex items-center justify-center px-4 py-20">
          <div className="mx-auto max-w-md text-center">
            <div className="text-5xl mb-6">✅</div>
            <h2 style={{ color: "#0F172A", fontSize: "26px", fontWeight: 700, marginBottom: "16px" }}>
              JazakAllah!
            </h2>
            <p style={{ color: "#6B7280", fontSize: "15px", lineHeight: 1.7, marginBottom: "12px" }}>
              Your feedback has been submitted.
            </p>
            <p style={{ color: "#6B7280", fontSize: "15px", lineHeight: 1.7, marginBottom: "12px" }}>
              If you ever face any issue or bug while using StudiesMate, please report it here anytime. We fix things fast.
            </p>
            <p style={{ color: "#6B7280", fontSize: "15px", lineHeight: 1.7, marginBottom: "32px" }}>
              Have questions or want updates?{" "}
              <a
                href="https://chat.whatsapp.com/H8q5PBchpRNC4TWIeWp49I"
                target="_blank"
                rel="noreferrer"
                style={{ color: "#22C55E", fontWeight: 600, textDecoration: "underline" }}
              >
                Join our WhatsApp community
              </a>
            </p>
            <Link
              href="/dashboard"
              onClick={() => { try { localStorage.removeItem("last_selected_subject"); } catch {} }}
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                background: "#F97316",
                color: "white",
                borderRadius: "12px",
                padding: "12px 28px",
                fontSize: "14px",
                fontWeight: 700,
                textDecoration: "none",
              }}
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
        <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} initialMode={authMode} />
      </PageFade>
    );
  }

  return (
    <PageFade>
    <div>
      {/* Hero */}
      <div className="bg-[#F0FDF4] px-4 py-14 text-center">
        <div className="text-4xl">💬</div>
        <h1 className="mt-4 text-3xl font-bold text-[#111827]">Share Your Feedback</h1>
        <p className="mx-auto mt-3 max-w-md text-sm text-[#6B7280]">
          Every message is read by the founders. Help us build something better for Pakistani students.
        </p>
      </div>

      {/* Form */}
      <div className="bg-white px-4 py-12">
        <div className="mx-auto max-w-[600px] rounded-xl bg-white p-8 shadow-md border border-[#E5E7EB]">

          {/* Not logged in */}
          {!isLoggedIn && (
            <div className="mb-6 rounded-xl border border-[#DCFCE7] bg-[#F0FDF4] p-4">
              <p className="text-sm font-semibold text-[#16A34A]">Log in required</p>
              <p className="mt-1 text-sm text-[#374151]">Please log in or sign up to submit feedback.</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <button type="button" onClick={() => { setAuthMode("login"); setAuthOpen(true); }} className="rounded-lg border border-[#22C55E] px-3 py-2 text-sm font-semibold text-[#22C55E] hover:bg-[#F0FDF4] transition-colors">Log in</button>
                <button type="button" onClick={() => { setAuthMode("signup"); setAuthOpen(true); }} className="rounded-lg border border-[#22C55E] px-3 py-2 text-sm font-semibold text-[#22C55E] hover:bg-[#F0FDF4] transition-colors">Sign up</button>
              </div>
            </div>
          )}

          {/* Star rating */}
          <div className="mb-6">
            <p className="text-sm font-semibold text-[#111827] mb-3">How would you rate StudiesMate?</p>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  style={{
                    fontSize: "36px",
                    lineHeight: 1,
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: "2px",
                    color: (hoverRating || rating) >= star ? "#F97316" : "#D1D5DB",
                    transition: "color 0.1s",
                  }}
                  aria-label={`${star} star`}
                >
                  ★
                </button>
              ))}
            </div>
            {rating > 0 && (
              <p className="mt-1 text-xs text-[#6B7280]">
                {["", "Poor", "Fair", "Good", "Great", "Excellent!"][rating]}
              </p>
            )}
          </div>

          {/* Positive tags */}
          <div className="mb-4">
            <p className="text-sm font-semibold text-[#111827] mb-2">What's working well?</p>
            <div className="flex flex-wrap gap-2">
              {POSITIVE_TAGS.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggleTag(tag)}
                  className="rounded-full border px-3 py-1.5 text-xs font-medium transition-colors"
                  style={{
                    background: selectedTags.includes(tag) ? "#DCFCE7" : "#F9FAFB",
                    borderColor: selectedTags.includes(tag) ? "#22C55E" : "#E5E7EB",
                    color: selectedTags.includes(tag) ? "#16A34A" : "#374151",
                  }}
                >
                  {selectedTags.includes(tag) ? "✓ " : ""}{tag}
                </button>
              ))}
            </div>
          </div>

          {/* Improve tags */}
          <div className="mb-6">
            <p className="text-sm font-semibold text-[#111827] mb-2">Areas to improve</p>
            <div className="flex flex-wrap gap-2">
              {IMPROVE_TAGS.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggleTag(tag)}
                  className="rounded-full border px-3 py-1.5 text-xs font-medium transition-colors"
                  style={{
                    background: selectedTags.includes(tag) ? "#FEF2F2" : "#F9FAFB",
                    borderColor: selectedTags.includes(tag) ? "#EF4444" : "#E5E7EB",
                    color: selectedTags.includes(tag) ? "#DC2626" : "#374151",
                  }}
                >
                  {selectedTags.includes(tag) ? "✓ " : ""}{tag}
                </button>
              ))}
            </div>
          </div>

          {/* Optional comment */}
          <div className="mb-6">
            <label className="text-sm font-semibold text-[#111827]">
              Anything else you&apos;d like to share? <span className="font-normal text-[#9CA3AF]">(optional)</span>
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              placeholder="Tell us more..."
              className="mt-2 w-full rounded-lg border border-[#E5E7EB] bg-white p-3 text-sm text-[#111827] outline-none transition-colors focus:border-[#22C55E] focus:ring-2 focus:ring-[#22C55E]/20"
            />
          </div>

          {status === "error" && <p className="mb-4 text-sm text-red-600">{error}</p>}

          <button
            type="button"
            onClick={handleSubmit}
            disabled={!canSend}
            className="w-full rounded-xl bg-[#22C55E] py-3 text-sm font-semibold text-white transition-colors hover:bg-[#16A34A] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {status === "sending" ? "Sending..." : "Submit feedback"}
          </button>

          {!isLoggedIn && (
            <p className="mt-3 text-center text-xs text-[#9CA3AF]">You must be logged in to submit.</p>
          )}
          {rating === 0 && isLoggedIn && (
            <p className="mt-3 text-center text-xs text-[#9CA3AF]">Please select a star rating to submit.</p>
          )}
        </div>
      </div>
    </div>
    <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} initialMode={authMode} />
    </PageFade>
  );
}
