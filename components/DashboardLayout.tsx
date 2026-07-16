"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard, Calculator, BookOpen, FlaskConical,
  ChevronDown, ChevronRight, FileText,
  PlayCircle, HelpCircle,
  Copy, Lock, Settings,
} from "lucide-react";
import { supabase } from "@/lib/auth";
import { CURRICULUM, SubjectKey } from "@/lib/curriculum";

const TOPIC_LESSON_URLS: Record<string, string> = {
  "intro-to-place-value": "/subjects/maths/chapters/numbers",
  "reading-writing-whole-numbers": "/subjects/maths/chapters/addition-subtraction",
  "simple-sentences": "/subjects/english/chapters/english-intro",
  "compound-sentences": "/subjects/english/chapters/compound-sentences",
  "habitats": "/subjects/science/chapters/science-intro",
  "food-chains": "/subjects/science/chapters/food-chains",
};

const SUBJECT_EMOJI: Record<string, string> = {
  mathematics: "🧮",
  english: "📚",
  science: "🔬",
};

const TOPIC_UNLOCK_MAP: Record<string, string> = {
  "reading-writing-whole-numbers": "math-npv",
  "compound-sentences": "english-intro",
  "food-chains": "science-intro",
};

function getTopicUrl(topicId: string, section: "lesson" | "quiz" | "worksheet"): string | null {
  const base = TOPIC_LESSON_URLS[topicId];
  if (!base) return null;

  const isMathTopic = base.includes("/subjects/maths/");

  if (section === "lesson") return base;
  if (section === "quiz") return `${base}/quiz`;

  // worksheet: Math has a standalone page, English/Science use ?view=worksheet
  if (isMathTopic) return `${base}/worksheet`;
  return `${base}?view=worksheet`;
}

type Props = {
  children: React.ReactNode;
  selectedSubject?: string | null;
  onSubjectChange?: (subject: string | null) => void;
};

export default function DashboardLayout({ children, selectedSubject, onSubjectChange }: Props) {
  const pathname = usePathname();
  const router = useRouter();

  const [studentName, setStudentName] = useState<string>("");
  const [userEmail, setUserEmail] = useState<string>("");
  const [dropupOpen, setDropupOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [quizCompletions, setQuizCompletions] = useState<Record<string, boolean>>({});

  // Subject-mode sidebar state — initialize open section from current URL
  const [expandedSection, setExpandedSection] = useState<"lesson" | "quiz" | "worksheet" | null>(() => {
    if (pathname.endsWith("/quiz")) return "quiz";
    if (pathname.endsWith("/worksheet")) return "worksheet";
    if (pathname.startsWith("/subjects/")) return "lesson";
    return null;
  });
  const [expandedUnits, setExpandedUnits] = useState<Set<string>>(new Set());

  const avatarRef = useRef<HTMLDivElement>(null);
  const mainRef = useRef<HTMLElement>(null);
  const prevSubjectRef = useRef(selectedSubject);

  // Reset subject sidebar state only when selectedSubject actually changes value
  useEffect(() => {
    if (prevSubjectRef.current !== selectedSubject) {
      setExpandedSection(null);
      setExpandedUnits(new Set());
      prevSubjectRef.current = selectedSubject;
    }
  }, [selectedSubject]);

  useEffect(() => {
    function handleDocClick(e: MouseEvent) {
      if (avatarRef.current && !avatarRef.current.contains(e.target as Node)) {
        setDropupOpen(false);
      }
    }
    document.addEventListener("click", handleDocClick);
    return () => document.removeEventListener("click", handleDocClick);
  }, []);

  useEffect(() => {
    async function loadFromSession(session: { user: { id: string; email?: string; user_metadata?: Record<string, unknown> } } | null) {
      if (!session) return;
      const name = ((session.user.user_metadata?.studentName as string | undefined) || "").trim();
      setStudentName(name.split(" ")[0] || "");
      setUserEmail(session.user.email || "");
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      loadFromSession(session);
    });
    supabase.auth.getSession().then(({ data: { session } }) => loadFromSession(session));
    return () => subscription.unsubscribe();
  }, []);

  // Scroll the content area back to top on navigation OR when subject intro view opens
  useEffect(() => {
    if (mainRef.current) mainRef.current.scrollTop = 0;
  }, [pathname, selectedSubject]);

  // Hide site header and footer on all dashboard pages
  useEffect(() => {
    const header = document.querySelector("header");
    const footer = document.querySelector("footer");
    if (header) header.style.display = "none";
    if (footer) footer.style.display = "none";
    return () => {
      if (header) header.style.display = "";
      if (footer) footer.style.display = "";
    };
  }, []);

  useEffect(() => {
    function reloadCompletions() {
      try {
        const data = JSON.parse(localStorage.getItem("studiesmate_quiz_completions") || "{}");
        console.log("[StudiesMate] DashboardLayout reloadCompletions — quizCompletions:", JSON.stringify(data));
        Object.entries(TOPIC_UNLOCK_MAP).forEach(([topicId, quizKey]) => {
          console.log(`[StudiesMate]   unlock check: topic "${topicId}" requires quiz "${quizKey}" → passed: ${!!data[quizKey]}`);
        });
        setQuizCompletions(data);
      } catch {}
    }
    reloadCompletions();
    const onStorage = (e: StorageEvent) => {
      if (e.key === "studiesmate_quiz_completions") {
        try {
          setQuizCompletions(JSON.parse(e.newValue || "{}"));
        } catch {}
      }
    };
    window.addEventListener("storage", onStorage);
    window.addEventListener("sm-quiz-update", reloadCompletions);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("sm-quiz-update", reloadCompletions);
    };
  }, [pathname]);

  function toggleSection(section: "lesson" | "quiz" | "worksheet") {
    setExpandedSection((prev) => {
      if (prev === section) return null;
      setExpandedUnits(new Set());
      return section;
    });
  }

  function toggleUnit(unitId: string) {
    setExpandedUnits((prev) => {
      const next = new Set(prev);
      if (next.has(unitId)) next.delete(unitId);
      else next.add(unitId);
      return next;
    });
  }

  function isActive(href: string) { return pathname === href; }

  function handleLogout() {
    setDropupOpen(false);
    setShowLogoutModal(true);
  }

  async function handleConfirmLogout() {
    await supabase.auth.signOut();
    setShowLogoutModal(false);
    setShowToast(true);
    setTimeout(() => router.push("/"), 2000);
  }

  const isSubjectMode = !!selectedSubject;
  const sidebarW = "260px";
  const subjectData = selectedSubject ? CURRICULUM[selectedSubject as SubjectKey] : null;
  const activeSectionFromPath = pathname.endsWith("/quiz") ? "quiz"
    : pathname.endsWith("/worksheet") ? "worksheet"
    : pathname.startsWith("/subjects/") ? "lesson"
    : null;

  return (
    <div className="bg-[#F9FAFB]">
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* ── SIDEBAR ── */}
      <aside
        className="hidden md:flex flex-col justify-between bg-[#0F172A] fixed left-0 top-0 h-screen overflow-y-auto z-40"
        style={{ width: sidebarW }}
      >
        <div className="flex flex-col flex-1 min-h-0">
          {/* Logo */}
          <div className="px-5 pt-5 pb-4 border-b border-white/10 flex-shrink-0">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", background: "white", borderRadius: "8px", padding: "8px", width: "100%" }}>
              <img src="/logo.png" alt="StudiesMate" style={{ width: "100%", maxWidth: "140px", height: "auto", objectFit: "contain", display: "block", margin: "0 auto" }} />
            </div>
            <p className="mt-1 text-[11px] text-[#6B7280]">Beta</p>
          </div>

          {isSubjectMode && subjectData ? (
            /* ── SUBJECT MODE: Lesson / Quiz / Worksheet / Back ── */
            <>
              {/* Subject header */}
              <div className="px-5 py-3 border-b border-white/10 flex-shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    try {
                      localStorage.setItem("last_selected_subject", selectedSubject!);
                    } catch {}
                    router.push("/dashboard");
                  }}
                  className="flex items-center gap-2.5 w-full text-left group"
                >
                  <span className="text-xl leading-none">{SUBJECT_EMOJI[selectedSubject!] ?? "📖"}</span>
                  <span className="text-sm font-bold text-white leading-tight group-hover:text-[#22C55E] transition-colors">
                    {subjectData.name}
                  </span>
                </button>
                <p className="mt-1 text-[11px] text-[#4B5563] leading-tight">Grade 4 · Beta</p>
              </div>

              {/* Lesson / Quiz / Worksheet expandable sections */}
              <nav className="px-3 pt-3 pb-2 flex-1 overflow-y-auto">
                {(["lesson", "quiz", "worksheet"] as const).map((section) => {
                  const sectionLabel = section === "lesson" ? "Lesson" : section === "quiz" ? "Quiz" : "Worksheet";
                  const SectionIcon = section === "lesson" ? PlayCircle : section === "quiz" ? HelpCircle : FileText;
                  const isSecExpanded = expandedSection === section;

                  return (
                    <div key={section} className="mb-1">
                      <button
                        type="button"
                        onClick={() => toggleSection(section)}
                        className={`w-full flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-semibold transition-all ${
                          activeSectionFromPath === section
                            ? "bg-[#22C55E]/15 text-[#22C55E] hover:bg-[#22C55E]/20"
                            : "text-white hover:bg-white/5"
                        }`}
                      >
                        <SectionIcon className="h-4 w-4 shrink-0" style={{ color: "#22C55E" }} />
                        <span className="flex-1 text-left">{sectionLabel}</span>
                        {isSecExpanded
                          ? <ChevronDown className="h-3.5 w-3.5 text-[#6B7280]" />
                          : <ChevronRight className="h-3.5 w-3.5 text-[#6B7280]" />
                        }
                      </button>

                      <div
                        className="ml-3 border-l border-white/10 pl-2 mt-0.5 space-y-0.5 overflow-hidden transition-all duration-200 ease-out"
                        style={{ maxHeight: isSecExpanded ? "2000px" : "0px", opacity: isSecExpanded ? 1 : 0 }}
                      >
                          {subjectData.units.map((unit) => {
                            const isUnitOpen = expandedUnits.has(unit.id);
                            return (
                              <div key={unit.id}>
                                <button
                                  type="button"
                                  onClick={() => toggleUnit(unit.id)}
                                  className="w-full flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-left hover:bg-white/5 transition-all"
                                >
                                  <ChevronRight
                                    className="h-3 w-3 shrink-0 text-[#6B7280] transition-transform"
                                    style={{ transform: isUnitOpen ? "rotate(90deg)" : "none" }}
                                  />
                                  <span className="text-[11px] font-semibold text-[#9CA3AF] leading-tight flex-1">
                                    {unit.name}
                                  </span>
                                </button>

                                <div
                                  className="ml-4 space-y-0.5 pb-1 overflow-hidden transition-all duration-200 ease-out"
                                  style={{ maxHeight: isUnitOpen ? "1000px" : "0px", opacity: isUnitOpen ? 1 : 0 }}
                                >
                                    {unit.topics.map((topic) => {
                                      const requiredQuizKey = TOPIC_UNLOCK_MAP[topic.id];
                                      const isUnlockedByQuiz = requiredQuizKey ? !!quizCompletions[requiredQuizKey] : false;
                                      const isUnlocked = topic.status === "unlocked" || (topic.status === "locked-until-quiz" && isUnlockedByQuiz);
                                      const isLocked = topic.status === "locked-until-quiz" && !isUnlockedByQuiz;
                                      const url = isUnlocked ? getTopicUrl(topic.id, section) : null;
                                      const topicBase = TOPIC_LESSON_URLS[topic.id];
                                      const isActiveTopic = !!topicBase && pathname.startsWith(topicBase);

                                      if (url) {
                                        return (
                                          <Link
                                            key={topic.id}
                                            href={url}
                                            className={`flex items-start gap-1.5 rounded px-2 py-1.5 text-[11px] font-medium transition-all ${
                                              isActiveTopic
                                                ? "bg-[#22C55E]/20 text-[#22C55E] font-semibold"
                                                : "text-[#22C55E] hover:bg-white/5"
                                            }`}
                                          >
                                            <span className="mt-0.5 shrink-0 text-[10px]">▶</span>
                                            <span className="leading-tight">{topic.name}</span>
                                          </Link>
                                        );
                                      }

                                      return (
                                        <div
                                          key={topic.id}
                                          title={isLocked ? "Complete the previous quiz to unlock" : undefined}
                                          className="flex items-start gap-1.5 rounded px-2 py-1.5 cursor-default"
                                        >
                                          {isLocked
                                            ? <Lock className="h-2.5 w-2.5 mt-0.5 shrink-0 text-[#4B5563]" />
                                            : <span className="mt-0.5 shrink-0 text-[10px] text-[#374151]">○</span>
                                          }
                                          <span className="text-[11px] text-[#4B5563] leading-tight flex-1">{topic.name}</span>
                                          {isLocked && (
                                            <span className="text-[9px] bg-[#FEF3C7] text-[#92400E] rounded-full px-1.5 py-0.5 font-semibold shrink-0 self-start mt-0.5">Quiz</span>
                                          )}
                                          {topic.status === "coming-soon" && (
                                            <span className="text-[9px] bg-[#1F2937] text-[#6B7280] rounded-full px-1.5 py-0.5 shrink-0 self-start mt-0.5">Soon</span>
                                          )}
                                        </div>
                                      );
                                    })}
                                  </div>
                              </div>
                            );
                          })}
                        </div>
                    </div>
                  );
                })}
              </nav>

              {/* Back to Dashboard */}
              <div className="border-t border-white/10 px-3 py-3 flex-shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    try { localStorage.removeItem("last_selected_subject"); } catch {}
                    onSubjectChange?.(null);
                    if (pathname !== "/dashboard") router.push("/dashboard");
                  }}
                  className="w-full flex items-center justify-center rounded-xl py-2.5 px-4 text-sm font-semibold text-[#111827] hover:bg-[#E5E7EB] transition-colors"
                  style={{ background: "#F3F4F6" }}
                >
                  Dashboard
                </button>
              </div>
            </>
          ) : (
            /* ── DEFAULT MODE ── */
            <nav className="px-3 pt-4 pb-2 flex-1 overflow-y-auto">

              {/* 1. Home */}
              <Link
                href="/"
                className="flex items-center justify-center w-full rounded-xl py-3 px-4 mb-3 text-sm font-medium text-[#111827] bg-white border border-[#E5E7EB] hover:bg-[#F9FAFB] hover:border-[#D1D5DB] transition-colors"
              >
                Home
              </Link>

              {/* 2. Dashboard */}
              <Link
                href="/dashboard"
                onClick={() => { try { localStorage.removeItem("last_selected_subject"); } catch {} }}
                className="flex items-center justify-center w-full rounded-xl py-3 px-4 mb-3 text-sm font-medium text-[#111827] bg-white border border-[#E5E7EB] hover:bg-[#F9FAFB] hover:border-[#D1D5DB] transition-colors"
              >
                Dashboard
              </Link>

              {/* 3. My Progress */}
              <Link
                href="/my-progress"
                className="flex items-center justify-center w-full rounded-xl py-3 px-4 mb-3 text-sm font-medium text-[#111827] bg-white border border-[#E5E7EB] hover:bg-[#F9FAFB] hover:border-[#D1D5DB] transition-colors"
              >
                My Progress
              </Link>

              {/* 4. Connect Code */}
              <Link
                href="/connect-code"
                className={`flex items-center gap-3 border-l-2 rounded-r-lg px-3 py-2.5 text-sm font-semibold transition-all ${
                  isActive("/connect-code")
                    ? "border-[#22C55E] bg-[#22C55E]/15 text-[#22C55E]"
                    : "border-transparent text-[#9CA3AF] hover:bg-white/5 hover:text-white"
                }`}
              >
                <Copy className="h-4 w-4 shrink-0" />
                Connect Code
              </Link>

              {/* 5. Settings */}
              <Link
                href="/settings"
                className={`flex items-center gap-3 border-l-2 rounded-r-lg px-3 py-2.5 text-sm font-semibold transition-all ${
                  isActive("/settings")
                    ? "border-[#22C55E] bg-[#22C55E]/15 text-[#22C55E]"
                    : "border-transparent text-[#9CA3AF] hover:bg-white/5 hover:text-white"
                }`}
              >
                <Settings className="h-4 w-4 shrink-0" />
                Settings
              </Link>

            </nav>
          )}
        </div>

        {/* Bottom — Avatar with logout (default mode only) */}
        {!isSubjectMode && (
          <div className="border-t border-white/10 flex-shrink-0">
            <div className="px-3 py-2.5 relative" ref={avatarRef}>
              <button
                type="button"
                onClick={() => setDropupOpen((v) => !v)}
                className="flex w-full items-center gap-2.5 rounded-lg p-2 hover:bg-white/5 transition-colors"
              >
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#374151] text-xs font-bold text-white">
                  {studentName ? studentName[0].toUpperCase() : userEmail ? userEmail[0].toUpperCase() : "U"}
                </div>
                <span className="flex-1 truncate text-left text-sm font-medium text-white">
                  {studentName || userEmail.split("@")[0] || "Student"}
                </span>
              </button>

              {dropupOpen && (
                <div className="absolute bottom-full left-3 right-3 mb-1 overflow-hidden rounded-lg border border-[#E5E7EB] bg-white shadow-lg" style={{ animation: "dropupIn 0.15s ease-out" }}>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 px-3 py-2.5 text-sm text-[#111827] hover:bg-[#F9FAFB] transition-colors"
                  >
                    🚪 Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </aside>

      {/* Mobile bottom tab bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-white/10 bg-[#0F172A] flex items-center justify-around px-2 py-2">
        <Link href="/dashboard" onClick={() => { try { localStorage.removeItem("last_selected_subject"); } catch {} }} className="flex flex-col items-center gap-1 text-[10px] font-semibold text-[#9CA3AF]">
          <LayoutDashboard className="h-5 w-5" />
          Dashboard
        </Link>
        <Link href="/subjects/maths/chapters/numbers" className="flex flex-col items-center gap-1 text-[10px] font-semibold text-[#22C55E]">
          <Calculator className="h-5 w-5" />
          Math
        </Link>
        <Link href="/subjects/english/chapters/english-intro" className="flex flex-col items-center gap-1 text-[10px] font-semibold text-[#3B82F6]">
          <BookOpen className="h-5 w-5" />
          English
        </Link>
        <Link href="/subjects/science/chapters/science-intro" className="flex flex-col items-center gap-1 text-[10px] font-semibold text-[#F59E0B]">
          <FlaskConical className="h-5 w-5" />
          Science
        </Link>
      </div>

      {/* Main content */}
      <main
        ref={mainRef}
        className="h-screen overflow-y-auto pb-20 md:pb-0"
        style={{ marginLeft: `var(--sidebar-w, ${sidebarW})` }}
      >
        <style>{`:root { --sidebar-w: ${sidebarW}; } @media (max-width: 767px) { :root { --sidebar-w: 0px; } }`}</style>
        <div className="mx-auto max-w-[1100px]">
          <div key={pathname} style={{ animation: "fadeIn 0.25s ease-out" }}>
            {children}
          </div>
        </div>
      </main>

      {/* Logout toast */}
      {showToast && (
        <div style={{ position: "fixed", top: "20px", right: "20px", background: "#22C55E", color: "white", padding: "12px 20px", borderRadius: "12px", fontSize: "14px", fontWeight: 600, zIndex: 9999, animation: "slideInRight 0.3s ease-out", boxShadow: "0 4px 12px rgba(0,0,0,0.15)", maxWidth: "320px" }}>
          You have been logged out successfully.
        </div>
      )}

      {/* Logout confirmation modal */}
      {showLogoutModal && (
        <>
          <div className="backdrop-animate" style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div className="popup-animate" style={{ background: "white", borderRadius: "16px", padding: "32px", maxWidth: "380px", width: "90%", textAlign: "center", boxShadow: "0 20px 60px rgba(0,0,0,0.2)" }}>
              <p style={{ fontSize: "48px", marginBottom: "12px" }}>👋</p>
              <h2 style={{ fontSize: "22px", fontWeight: 700, color: "#0F172A" }}>Leaving so soon?</h2>
              <p style={{ fontSize: "14px", color: "#6B7280", marginTop: "8px" }}>Your progress is saved. We&apos;ll be here when you come back.</p>
              <div style={{ display: "flex", gap: "12px", justifyContent: "center", marginTop: "24px" }}>
                <button
                  type="button"
                  onClick={() => setShowLogoutModal(false)}
                  style={{ background: "#22C55E", color: "white", borderRadius: "9999px", padding: "10px 24px", fontWeight: 600, border: "none", cursor: "pointer", fontSize: "14px" }}
                >
                  Stay &amp; Learn
                </button>
                <button
                  type="button"
                  onClick={handleConfirmLogout}
                  style={{ background: "white", border: "1.5px solid #EF4444", color: "#EF4444", borderRadius: "9999px", padding: "10px 24px", fontWeight: 600, cursor: "pointer", fontSize: "14px" }}
                >
                  Yes, Log out
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
