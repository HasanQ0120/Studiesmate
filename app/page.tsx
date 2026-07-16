"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/auth";
import AuthModal from "@/components/AuthModal";

export default function HomePage() {
  const router = useRouter();

  const [demoLang, setDemoLang] = useState<"english" | "urdu">("english");
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "signup">("signup");
  const demoEnRef = useRef<HTMLVideoElement>(null);
  const demoUrRef = useRef<HTMLVideoElement>(null);

  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [promoVisible, setPromoVisible] = useState(false);
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);
  const [kickedMessage, setKickedMessage] = useState<string | null>(null);
  const [demoSrcs, setDemoSrcs] = useState<{ en: string; ur: string } | null>(null);
  const [demoError, setDemoError] = useState(false);

  useEffect(() => {
    let reached2s = false;
    let accumulated = 0;
    let lastEnTime: number | null = null;
    let lastUrTime: number | null = null;
    let listenerCleanup: (() => void) | null = null;

    function attach() {
      if (listenerCleanup) return;

      const onEnTimeUpdate = () => {
        if (reached2s) return;
        const cur = demoEnRef.current?.currentTime ?? 0;
        if (lastEnTime !== null) {
          const delta = cur - lastEnTime;
          if (delta > 0 && delta < 1) accumulated += delta;
        }
        lastEnTime = cur;
        if (accumulated >= 2) { reached2s = true; setPromoVisible(true); }
      };

      const onUrTimeUpdate = () => {
        if (reached2s) return;
        const cur = demoUrRef.current?.currentTime ?? 0;
        if (lastUrTime !== null) {
          const delta = cur - lastUrTime;
          if (delta > 0 && delta < 1) accumulated += delta;
        }
        lastUrTime = cur;
        if (accumulated >= 2) { reached2s = true; setPromoVisible(true); }
      };

      const enVideo = demoEnRef.current;
      const urVideo = demoUrRef.current;
      enVideo?.addEventListener("timeupdate", onEnTimeUpdate);
      urVideo?.addEventListener("timeupdate", onUrTimeUpdate);
      listenerCleanup = () => {
        enVideo?.removeEventListener("timeupdate", onEnTimeUpdate);
        urVideo?.removeEventListener("timeupdate", onUrTimeUpdate);
      };
    }

    function detach() {
      listenerCleanup?.();
      listenerCleanup = null;
      reached2s = false;
      accumulated = 0;
      lastEnTime = null;
      lastUrTime = null;
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setPromoVisible(false);
        detach();
      } else {
        attach();
      }
    });

    return () => {
      subscription.unsubscribe();
      listenerCleanup?.();
    };
  }, []);

  useEffect(() => {
    try {
      const msg = localStorage.getItem("sm_kicked_message");
      if (msg) {
        setKickedMessage(msg);
        localStorage.removeItem("sm_kicked_message");
      }
    } catch {}
  }, []);

  useEffect(() => {
    async function fetchDemoUrls() {
      try {
        const [enRes, urRes] = await Promise.all([
          fetch("/api/video-url?path=simple_sentences_english.mp4.mp4"),
          fetch("/api/video-url?path=simple_sentence_urdu.mp4.mp4"),
        ]);
        if (!enRes.ok || !urRes.ok) { setDemoError(true); return; }
        const [enData, urData] = await Promise.all([enRes.json(), urRes.json()]);
        if (!enData.url || !urData.url) { setDemoError(true); return; }
        setDemoSrcs({ en: enData.url, ur: urData.url });
      } catch {
        setDemoError(true);
      }
    }
    fetchDemoUrls();
  }, []);

  const faqs = [
    {
      q: "Is the Beta really free?",
      a: "Yes. The Beta is completely free, forever. No credit card, no hidden fees. You get 1 lesson, 1 quiz, and 1 worksheet per subject, covering Math, English, and Science.",
    },
    {
      q: "Which grades are available right now?",
      a: "Beta is open for all grades but contains 1 lesson per subject. Grade 4 full course is launching soon with complete Math, English, and Science coverage.",
    },
    {
      q: "Are the lessons in Urdu?",
      a: "Every lesson has a bilingual toggle. Switch between English and Roman Urdu at any point. The video continues from the same timestamp.",
    },
    {
      q: "Do I need to create an account?",
      a: "Yes, a free account is required so your child's progress is saved. Signup takes less than a minute. No credit card needed.",
    },
    {
      q: "How is StudiesMate different from other platforms?",
      a: "StudiesMate combines structured video lessons, instant quizzes, printable worksheets, a parent dashboard, and a bilingual toggle, all in one place. You can also use Explain Again to get a simple AI explanation whenever a topic feels confusing. No other platform built for Pakistani students brings all of this together.",
    },
    {
      q: "How does the daily streak work?",
      a: "To gain a streak point, you need to mark a lesson as complete and finish its quiz. It doesn't matter how many lessons or quizzes you complete in one day. Your streak only grows by one point per day. The goal isn't to rush, it's to show up every day.",
    },
  ];

  function handleDemoLangSwitch(newLang: "english" | "urdu") {
    if (newLang === demoLang) return;
    const activeRef = demoLang === "english" ? demoEnRef : demoUrRef;
    const nextRef = newLang === "english" ? demoEnRef : demoUrRef;
    const currentTime = activeRef.current?.currentTime ?? 0;
    activeRef.current?.pause();
    if (nextRef.current) {
      nextRef.current.currentTime = currentTime;
    }
    setDemoLang(newLang);
    nextRef.current?.play().catch(() => {});
  }

  const handleStartBeta = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        try { localStorage.removeItem("last_selected_subject"); } catch {}
        router.push("/dashboard");
      } else {
        setAuthMode("signup");
        setAuthModalOpen(true);
      }
    } catch {
      setAuthMode("signup");
      setAuthModalOpen(true);
    }
  };

  return (
    <>
    {kickedMessage && (
      <div className="fixed inset-x-0 top-0 z-50 flex items-center justify-between gap-4 bg-[#FEF2F2] border-b border-[#FECACA] px-4 py-3">
        <p className="flex-1 text-center text-sm text-[#DC2626]">{kickedMessage}</p>
        <button
          type="button"
          onClick={() => setKickedMessage(null)}
          className="flex-shrink-0 text-[#DC2626] text-lg leading-none font-semibold"
          aria-label="Dismiss"
        >
          ×
        </button>
      </div>
    )}
    <main className="min-h-screen bg-white text-[#111827]">
      <style>{`
        @keyframes borderTravel {
          0% { background-position: 0% 0%; }
          25% { background-position: 100% 0%; }
          50% { background-position: 100% 100%; }
          75% { background-position: 0% 100%; }
          100% { background-position: 0% 0%; }
        }
      `}</style>

      {/* ── SECTION 1: HERO ── */}
      <section className="bg-[#F9FAFB]" style={{ background: "linear-gradient(135deg, #F0FDF4 0%, #F9FAFB 40%, #EFF6FF 100%)" }}>
        <div className="mx-auto max-w-6xl px-4 py-16 md:py-24">
          <div className="flex flex-col items-center gap-12 md:flex-row md:items-center md:gap-16">

            {/* Left */}
            <div className="flex-1">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#DCFCE7] px-3 py-1 text-xs font-semibold text-[#16A34A]">
                ⚡ Free Beta
              </span>

              <h1 className="mt-5 text-4xl font-bold leading-tight tracking-tight text-[#111827] md:text-5xl">
                Smart learning for school students
              </h1>
              <div>
                <span className="text-4xl font-bold leading-tight tracking-tight text-[#22C55E] md:text-5xl">without stress</span>
              </div>

              <p className="mt-5 text-base leading-7 text-[#6B7280] md:text-lg">
                Bilingual video lessons in English and Urdu for Grades 1–8. Watch, quiz, and practice, designed for Pakistani school students.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={handleStartBeta}
                  className="rounded-full bg-[#22C55E] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#16A34A]"
                >
                  Start Free Beta →
                </button>
                <button
                  type="button"
                  onClick={() => document.getElementById("demo-video")?.scrollIntoView({ behavior: "smooth" })}
                  className="rounded-full border border-[#D1D5DB] bg-white px-6 py-3 text-sm font-semibold text-[#374151] transition-colors hover:border-[#9CA3AF]"
                >
                  ▶ Watch Demo
                </button>
              </div>

            </div>

            {/* Right — Student card */}
            <div className="w-full flex-shrink-0 md:w-80">
              <div className="rounded-2xl bg-white p-6 shadow-[0_8px_40px_rgba(0,0,0,0.1)]">
                {/* Student header */}
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#0F172A] text-sm font-bold text-white">AR</div>
                  <div>
                    <div className="text-sm font-semibold text-[#111827]">Ahmed Raza</div>
                    <div className="text-xs text-[#6B7280]">Beta · Mathematics</div>
                  </div>
                  <span className="ml-auto flex items-center gap-1 rounded-full bg-[#DCFCE7] px-2 py-0.5 text-xs font-medium text-[#16A34A]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#22C55E]" />
                    Active
                  </span>
                </div>

                {/* Progress bars */}
                <div className="mt-5 space-y-3">
                  {[
                    { label: "Mathematics", pct: 68, color: "#22C55E" },
                    { label: "English", pct: 45, color: "#3B82F6" },
                    { label: "Science", pct: 82, color: "#F97316" },
                  ].map(({ label, pct, color }) => (
                    <div key={label}>
                      <div className="mb-1 flex justify-between text-xs">
                        <span className="text-[#374151]">{label}</span>
                        <span className="font-medium text-[#374151]">{pct}%</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-[#F3F4F6]">
                        <div className="h-2 rounded-full" style={{ width: `${pct}%`, backgroundColor: color }} />
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── SECTION 2: HOW IT WORKS ── */}
      <section className="bg-[#F9FAFB]">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-[#111827]">How StudiesMate Works</h2>
            <p className="mt-3 text-base text-[#6B7280]">Three simple steps to better grades, in English or Urdu</p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[
              {
                num: "01",
                iconBg: "#DCFCE7",
                iconColor: "#22C55E",
                icon: (
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
                title: "Watch a Short Lesson",
                desc: "Bite-sized video lessons designed for the Pakistani curriculum. Toggle between English and Urdu anytime.",
              },
              {
                num: "02",
                iconBg: "#DBEAFE",
                iconColor: "#3B82F6",
                icon: (
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                ),
                title: "Take the Quiz",
                desc: "Quick quizzes after each lesson reinforce learning. Instant feedback so students know what to review.",
              },
              {
                num: "03",
                iconBg: "#FEF3C7",
                iconColor: "#F97316",
                icon: (
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                ),
                title: "Download the Worksheet",
                desc: "Print and practice on paper. Parents can track results on the connected dashboard.",
              },
            ].map(({ num, iconBg, iconColor, icon, title, desc }) => (
              <div
                key={num}
                className="relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm premium-card-hover"
              >
                <div className="text-6xl font-black text-[#F3F4F6] absolute right-4 top-2 leading-none select-none">{num}</div>
                <div className="relative">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl" style={{ backgroundColor: iconBg, color: iconColor }}>
                    {icon}
                  </div>
                  <h3 className="mt-4 text-lg font-bold text-[#111827]">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-[#6B7280]">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 3: SUBJECTS ── */}
      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="text-3xl font-bold text-[#111827]">Subjects for Grade 1–8</h2>
              <p className="mt-2 text-base text-[#6B7280]">Aligned with the Pakistani national curriculum</p>
            </div>
            <Link href="/phase-1" className="text-sm font-semibold text-[#22C55E] hover:text-[#16A34A]">View all grades →</Link>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {/* Mathematics */}
            <div className="rounded-2xl bg-[#F0FDF4] p-6 premium-card-hover">
              <div className="flex items-start justify-between">
                <span className="inline-flex rounded-full bg-[#DCFCE7] px-3 py-1 text-xs font-semibold text-[#16A34A]">Grade 1–8</span>
                <span className="text-2xl">🧮</span>
              </div>
              <h3 className="mt-4 text-lg font-bold text-[#111827]">Mathematics</h3>
              <ul className="mt-3 space-y-1.5">
                {["Numbers & Place Value", "Addition & Subtraction", "Multiplication", "Fractions"].map((t) => (
                  <li key={t} className="flex items-center gap-2 text-sm text-[#374151]">
                    <span className="text-[#22C55E]">✓</span>{t}
                  </li>
                ))}
              </ul>
              <div className="mt-5 flex items-center justify-between">
                <span className="text-xs text-[#6B7280]">1 lesson in Beta</span>
                <button type="button" onClick={handleStartBeta} className="text-sm font-semibold text-[#22C55E] hover:text-[#16A34A]">Start →</button>
              </div>
            </div>

            {/* English */}
            <div className="rounded-2xl bg-[#EFF6FF] p-6 premium-card-hover">
              <div className="flex items-start justify-between">
                <span className="inline-flex rounded-full bg-[#DBEAFE] px-3 py-1 text-xs font-semibold text-[#2563EB]">Grade 1–8</span>
                <span className="text-2xl">📚</span>
              </div>
              <h3 className="mt-4 text-lg font-bold text-[#111827]">English</h3>
              <ul className="mt-3 space-y-1.5">
                {["Simple Sentences", "Reading Comprehension", "Grammar Basics", "Creative Writing"].map((t) => (
                  <li key={t} className="flex items-center gap-2 text-sm text-[#374151]">
                    <span className="text-[#3B82F6]">✓</span>{t}
                  </li>
                ))}
              </ul>
              <div className="mt-5 flex items-center justify-between">
                <span className="text-xs text-[#6B7280]">1 lesson in Beta</span>
                <button type="button" onClick={handleStartBeta} className="text-sm font-semibold text-[#3B82F6] hover:text-[#2563EB]">Start →</button>
              </div>
            </div>

            {/* Science */}
            <div className="rounded-2xl bg-[#FEFCE8] p-6 premium-card-hover">
              <div className="flex items-start justify-between">
                <span className="inline-flex rounded-full bg-[#FEF3C7] px-3 py-1 text-xs font-semibold text-[#D97706]">Grade 1–8</span>
                <span className="text-2xl">🔬</span>
              </div>
              <h3 className="mt-4 text-lg font-bold text-[#111827]">Science</h3>
              <ul className="mt-3 space-y-1.5">
                {["Habitats & Animals", "Plants & Growth", "Human Body", "Earth & Space"].map((t) => (
                  <li key={t} className="flex items-center gap-2 text-sm text-[#374151]">
                    <span className="text-[#F97316]">✓</span>{t}
                  </li>
                ))}
              </ul>
              <div className="mt-5 flex items-center justify-between">
                <span className="text-xs text-[#6B7280]">1 lesson in Beta</span>
                <button type="button" onClick={handleStartBeta} className="text-sm font-semibold text-[#F97316] hover:text-[#EA580C]">Start →</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PROMO STRIP */}
      <div
        className="w-full flex items-center justify-center gap-4 px-4 cursor-pointer"
        style={{
          background: "#F97316",
          minHeight: "48px",
          opacity: promoVisible ? 1 : 0,
          pointerEvents: promoVisible ? "auto" : "none",
          transition: "opacity 0.3s ease",
        }}
        onClick={handleStartBeta}
      >
        <p className="text-sm font-semibold leading-tight py-2" style={{ color: "#14532D" }}>
          Unlock full lessons, quizzes &amp; Explain Again
        </p>
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); handleStartBeta(); }}
          className="flex-shrink-0 rounded-lg px-3 py-1.5 text-xs font-bold whitespace-nowrap hover:opacity-90 transition-opacity"
          style={{ background: "#FFFFFF", color: "#0B2B5A" }}
        >
          Sign Up Free →
        </button>
      </div>

      {/* ── SECTION 4: BILINGUAL FEATURE ── */}
      <section
        id="demo-video"
        className="bg-[#0F172A] text-white"
      >
        <div className="mx-auto max-w-6xl px-4 py-16">
          <div className="grid items-center gap-12 md:grid-cols-2">

            {/* Left */}
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#14532D] px-3 py-1 text-xs font-semibold text-[#22C55E]">
                🌐 Unique Feature
              </span>
              <h2 className="mt-5 text-3xl font-bold leading-tight md:text-4xl">
                Learn in English,{" "}
                <span className="text-[#22C55E]">switch to Urdu</span>{" "}
                instantly
              </h2>
              <p className="mt-4 text-base leading-7 text-white/70">
                Our Bilingual Slider lets students watch the same lesson in English or Roman Urdu, switching at any point without losing their place.
              </p>
              <ul className="mt-6 space-y-3">
                {[
                  "Same video timestamp, different language",
                  "Roman Urdu narration for all Grade 1 lessons",
                  "Practice questions in both languages",
                  "Built for the Pakistani classroom",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 text-sm text-white/80"
                  >
                    <span className="mt-0.5 font-bold text-[#22C55E]">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Right — interactive demo video */}
            <div style={{
              padding: '2px',
              borderRadius: '16px',
              background: 'linear-gradient(90deg, #22C55E, #0F172A, #0F172A, #22C55E)',
              backgroundSize: '300% 300%',
              animation: 'borderTravel 3s linear infinite',
            }}>
            <div className="p-6" style={{ borderRadius: '14px', overflow: 'hidden', background: '#1E293B' }}>
              <div className="flex overflow-hidden rounded-lg border border-white/10 mb-4 w-fit">
                <button
                  type="button"
                  onClick={() => handleDemoLangSwitch("english")}
                  className={`px-4 py-1.5 text-xs font-semibold transition-colors ${demoLang === "english" ? "bg-[#22C55E] text-white" : "text-white/50 hover:text-white"}`}
                >
                  English
                </button>
                <button
                  type="button"
                  onClick={() => handleDemoLangSwitch("urdu")}
                  className={`px-4 py-1.5 text-xs font-semibold transition-colors ${demoLang === "urdu" ? "bg-[#22C55E] text-white" : "text-white/50 hover:text-white"}`}
                >
                  اردو
                </button>
              </div>
              {!demoSrcs && !demoError && (
                <div style={{ aspectRatio: "16/9", display: "flex", alignItems: "center", justifyContent: "center", background: "black", borderRadius: "12px" }}>
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-white/30 border-t-white" />
                </div>
              )}
              {demoError && (
                <div style={{ aspectRatio: "16/9", display: "flex", alignItems: "center", justifyContent: "center", background: "black", borderRadius: "12px", padding: "0 24px" }}>
                  <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "14px", textAlign: "center" }}>Video temporarily unavailable, please refresh the page.</p>
                </div>
              )}
              <video
                ref={demoEnRef}
                src={demoSrcs?.en}
                controls
                controlsList="nodownload"
                width="100%"
                onError={() => { if (demoSrcs) setDemoError(true); }}
                style={{ borderRadius: "12px", background: "black", display: demoSrcs && demoLang === "english" ? "block" : "none" }}
              />
              <video
                ref={demoUrRef}
                src={demoSrcs?.ur}
                controls
                controlsList="nodownload"
                width="100%"
                onError={() => { if (demoSrcs) setDemoError(true); }}
                style={{ borderRadius: "12px", background: "black", display: demoSrcs && demoLang === "urdu" ? "block" : "none" }}
              />
              <div className="mt-4">
                <div className="text-sm font-semibold text-white">Simple Sentences</div>
                <div className="mt-1 text-xs text-white/50">English · Beta · 1:50</div>
              </div>
            </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── SECTION 5: HOW STUDIESMATE IS DIFFERENT ── */}
      <section className="bg-[#F9FAFB]">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-3xl font-bold text-[#0B2B5A]">How StudiesMate is Different</h2>
            <p className="mt-1 text-base font-semibold text-[#374151]">{"We're not just another video library."}</p>
            <p className="mt-4 text-sm leading-relaxed text-[#6B7280]">
              Most learning platforms give you hundreds of videos and hope something sticks.
              StudiesMate does something different. We focus on making sure your child actually
              understands, not just watches.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {[
                {
                  emoji: "🌐",
                  title: "The Bilingual Slider",
                  description: "Every lesson can switch between English and Urdu instantly, at the exact same point in the video. No restarting. No losing your place. When a concept doesn't click in English, Urdu explanation is one click away.",
                },
                {
                  emoji: "📚",
                  title: "A Real Learning Path",
                  description: "Every topic follows the same structure: Watch the lesson → Take a quiz → Practice with a worksheet. No random content. No guessing what to study next.",
                },
                {
                  emoji: "💰",
                  title: "An Alternative to Tuition",
                  description: "Consistent quality every single time, not dependent on which tutor you get that week. Flexible timing that fits around your child's schedule, not the other way around.",
                },
                {
                  emoji: "🎯",
                  title: "Built for Pakistani Students",
                  description: "Every lesson is designed around what Pakistani students actually need, with the exact curriculum and language support, built by people who understand the classroom-to-home gap firsthand.",
                },
                {
                  emoji: "👨‍👩‍👧",
                  title: "Parents Stay Informed",
                  description: "Connect your dashboard using your child's unique code and see exactly what they've learned, where they need help, and how they're progressing, all in one place.",
                },
                {
                  emoji: "🛡️",
                  title: "No Ads. No Distractions.",
                  description: "No ads, no distractions. Just focused learning. And if something's not working right, tell us directly through the Feedback button in the app. We read every report and fix it fast.",
                },
              ].map((card, i) => (
                <div key={card.title} className="breathe-card" style={{ animationDelay: `${i * 0.3}s` }}>
                  <div className="rounded-2xl bg-white p-6 shadow-sm border border-[#F3F4F6] special-card-hover h-full">
                    <div className="text-3xl mb-3 leading-none">{card.emoji}</div>
                    <h3 className="text-base font-bold text-[#0B2B5A] mb-2">{card.title}</h3>
                    <p className="text-sm text-[#6B7280] leading-relaxed">{card.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <p className="mt-8 border-t border-[#E5E7EB] pt-6 text-sm leading-relaxed text-[#6B7280]">
              {"We're building this the right way, one subject, one topic at a time, with your child's understanding as the only real goal."}
            </p>
          </div>
        </div>
      </section>

      {/* ── SECTION 5.5: TESTIMONIALS ── */}
      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-[#111827]">What People Are Saying</h2>
            <p className="mt-3 text-base text-[#6B7280]">Real feedback from real users.</p>
          </div>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {["/testimonial1.png", "/testimonial2.png", "/testimonial3.png"].map((src, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setLightboxSrc(src)}
                className="w-full overflow-hidden rounded-2xl border border-[#F3F4F6] bg-white shadow-sm premium-card-hover cursor-zoom-in text-left"
              >
                <img
                  src={src}
                  alt={`Testimonial ${i + 1}`}
                  className="block h-auto w-full"
                />
              </button>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link
              href="/testimonials"
              className="inline-flex items-center gap-1.5 rounded-full border border-[#D1D5DB] bg-white px-6 py-3 text-sm font-semibold text-[#374151] transition-colors hover:border-[#9CA3AF]"
            >
              View More →
            </Link>
          </div>
        </div>
      </section>

      {/* ── SECTION 6: FOUNDER NOTE ── */}
      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <div className="mx-auto max-w-2xl">
            <div className="rounded-2xl border border-[#E5E7EB] bg-white p-8 shadow-[0_4px_20px_rgba(0,0,0,0.06)] premium-card-hover">
              <div className="text-center">
                <img src="/favicon.png" alt="StudiesMate" style={{ width: "48px", height: "48px", borderRadius: "8px", marginBottom: "12px", display: "inline-block" }} />
              </div>
              <p className="text-center text-base font-bold text-[#111827] w-full">A note from the founders</p>
              <div className="mt-5 space-y-4 text-sm leading-7 text-[#6B7280]">
                <p>
                  My name is Muhammad Hasan. I am 18 years old, from Karachi. I built StudiesMate because I saw students around me struggling, not because they weren&apos;t smart, but because concepts were being taught in a language they hadn&apos;t fully mastered yet.
                </p>
                <p>
                  Muhammad Umer handles all the content. Every video is made with care to make sure your child actually understands, not just memorizes.
                </p>
                <p>
                  StudiesMate is our answer to that problem. Bilingual lessons, no distractions, built honestly for Pakistani students.
                </p>
                <p>
                  We are just getting started. But we are building this the right way, slowly, with your child&apos;s understanding as the only goal.
                </p>
              </div>
              <p className="mt-6 text-sm font-semibold text-[#0F172A]">
                — Muhammad Hasan &amp; Muhammad Umer, Founders of StudiesMate
              </p>
            </div>

          </div>
        </div>
      </section>

      <div style={{
        maxWidth: '200px',
        margin: '0 auto',
        height: '3px',
        background: 'linear-gradient(90deg, transparent, #22C55E, transparent)',
        borderRadius: '9999px'
      }} />

      {/* ── SECTION 7: FAQ ── */}
      <section className="bg-white">
        <div className="mx-auto max-w-[700px] px-6 py-20">
          <div>
            <h2 style={{ color: "#0F172A", fontSize: "32px", fontWeight: 700, textAlign: "center", margin: 0 }}>
              Common Questions
            </h2>
            <p style={{ color: "#6B7280", fontSize: "16px", textAlign: "center", marginTop: "12px", marginBottom: "48px" }}>
              Everything parents ask before getting started.
            </p>

            <div>
              {faqs.map((item, i) => (
                <div key={i} style={{ borderBottom: "1px solid #E5E7EB" }}>
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    style={{
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "20px 0",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      textAlign: "left",
                    }}
                  >
                    <span style={{ fontWeight: 600, color: "#111827", fontSize: "16px" }}>{item.q}</span>
                    <span style={{
                      fontSize: "22px",
                      color: "#6B7280",
                      transform: openFaq === i ? "rotate(45deg)" : "rotate(0deg)",
                      transition: "transform 0.2s ease",
                      flexShrink: 0,
                      marginLeft: "16px",
                      lineHeight: 1,
                    }}>+</span>
                  </button>
                  <div style={{
                    maxHeight: openFaq === i ? "300px" : "0px",
                    opacity: openFaq === i ? 1 : 0,
                    overflow: "hidden",
                    transition: "max-height 0.25s ease-out, opacity 0.2s ease-out",
                  }}>
                    <p style={{ color: "#6B7280", fontSize: "15px", lineHeight: 1.6, paddingBottom: "20px", margin: 0 }}>
                      {item.a}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

    </main>
    {typeof window !== "undefined" && createPortal(
      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} initialMode={authMode} />,
      document.body
    )}
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
          style={{ maxHeight: "90vh", maxWidth: "100%", borderRadius: "12px", boxShadow: "0 25px 60px rgba(0,0,0,0.5)" }}
        />
      </div>,
      document.body
    )}
    </>
  );
}
