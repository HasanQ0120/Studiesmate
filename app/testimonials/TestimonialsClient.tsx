"use client";

import Link from "next/link";
import { createPortal } from "react-dom";
import { useState } from "react";

const TESTIMONIALS = [
  "/testimonial1.png",
  "/testimonial2.png",
  "/testimonial3.png",
  "/testimonial4.png",
  "/testimonial5.png",
];

export default function TestimonialsClient() {
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);

  return (
    <>
      <main className="min-h-screen bg-white text-[#111827]">
        <div className="mx-auto max-w-6xl px-4 py-12">

          <Link
            href="/"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              background: "white",
              border: "1px solid #E5E7EB",
              borderRadius: "12px",
              padding: "10px 20px",
              fontSize: "14px",
              fontWeight: 500,
              color: "#374151",
              textDecoration: "none",
              transition: "background 0.15s ease",
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = "#F9FAFB"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = "white"; }}
          >
            ← Back to Home
          </Link>

          <div className="mt-8 text-center">
            <h1 className="text-3xl font-bold text-[#111827] md:text-4xl">What People Are Saying</h1>
            <p className="mt-3 text-base text-[#6B7280]">Real feedback from real users.</p>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-3">
            {TESTIMONIALS.map((src, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setLightboxSrc(src)}
                className="w-full overflow-hidden rounded-2xl border border-[#F3F4F6] bg-white shadow-sm cursor-zoom-in text-left transition-shadow duration-200 hover:shadow-md"
              >
                <img
                  src={src}
                  alt={`Testimonial ${i + 1}`}
                  className="block h-auto w-full"
                />
              </button>
            ))}
          </div>

        </div>
      </main>

      {typeof window !== "undefined" && lightboxSrc && createPortal(
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.85)" }}
          onClick={() => setLightboxSrc(null)}
        >
          <button
            type="button"
            onClick={() => setLightboxSrc(null)}
            aria-label="Close"
            style={{
              position: "absolute",
              top: "16px",
              right: "16px",
              width: "36px",
              height: "36px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "50%",
              background: "rgba(255,255,255,0.15)",
              color: "white",
              fontSize: "22px",
              lineHeight: 1,
              border: "none",
              cursor: "pointer",
            }}
          >
            ×
          </button>
          <img
            src={lightboxSrc}
            alt="Testimonial"
            onClick={(e) => e.stopPropagation()}
            style={{
              maxHeight: "90vh",
              maxWidth: "100%",
              borderRadius: "12px",
              boxShadow: "0 25px 60px rgba(0,0,0,0.5)",
            }}
          />
        </div>,
        document.body
      )}
    </>
  );
}
