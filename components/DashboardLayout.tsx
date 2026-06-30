"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard, Calculator, BookOpen, FlaskConical,
  ChevronDown, ChevronRight, FileText,
  PlayCircle, HelpCircle, TrendingUp, Home,
  Copy, Check, Eye, EyeOff,
} from "lucide-react";
import { supabase } from "@/lib/auth";

type SidebarChild = {
  id: string;
  label: string;
  href: string;
  icon: React.ElementType;
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const [expanded, setExpanded] = useState<string[]>([]);
  const [connectCode, setConnectCode] = useState<string>("");
  const [studentName, setStudentName] = useState<string>("");
  const [userEmail, setUserEmail] = useState<string>("");
  const [dropupOpen, setDropupOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [codeVisible, setCodeVisible] = useState(true);
  const [codeCopied, setCodeCopied] = useState(false);

  const avatarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let sectionId: string | null = null;
    if (pathname.startsWith("/subjects/maths")) sectionId = "maths";
    else if (pathname.startsWith("/subjects/english")) sectionId = "english";
    else if (pathname.startsWith("/subjects/science")) sectionId = "science";
    if (sectionId) {
      setExpanded((prev) => (prev.includes(sectionId!) ? prev : [...prev, sectionId!]));
    }
  }, [pathname]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("studiesmate_sidebar_expanded");
      if (saved) setExpanded(JSON.parse(saved));
    } catch {}

    function handleDocClick(e: MouseEvent) {
      if (avatarRef.current && !avatarRef.current.contains(e.target as Node)) {
        setDropupOpen(false);
      }
    }
    document.addEventListener("click", handleDocClick);
    return () => {
      document.removeEventListener("click", handleDocClick);
    };
  }, []);

  useEffect(() => {
    async function loadFromSession(session: { user: { id: string; email?: string; user_metadata?: Record<string, unknown> } } | null) {
      if (!session) return;
      const name = ((session.user.user_metadata?.studentName as string | undefined) || "").trim();
      setStudentName(name.split(" ")[0] || "");
      setUserEmail(session.user.email || "");
      const { data } = await supabase
        .from("profiles")
        .select("connect_code")
        .eq("id", session.user.id)
        .maybeSingle();
      if (data?.connect_code) setConnectCode(data.connect_code);
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      loadFromSession(session);
    });

    supabase.auth.getSession().then(({ data: { session } }) => loadFromSession(session));

    return () => subscription.unsubscribe();
  }, []);

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

  function toggleExpand(id: string) {
    setExpanded((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      try { localStorage.setItem("studiesmate_sidebar_expanded", JSON.stringify(next)); } catch {}
      return next;
    });
  }

  function isActive(href: string) { return pathname === href; }

  function handleLogout() {
    setDropupOpen(false);
    setShowLogoutModal(true);
  }

  function handleCopyCode() {
    if (!connectCode) return;
    navigator.clipboard.writeText(connectCode);
    setCodeCopied(true);
    setTimeout(() => setCodeCopied(false), 1500);
  }

  async function handleConfirmLogout() {
    await supabase.auth.signOut();
    setShowLogoutModal(false);
    setShowToast(true);
    setTimeout(() => router.push("/"), 2000);
  }

  type SubjectEntry = {
    id: string;
    label: string;
    icon: React.ElementType;
    iconColor: string;
    sectionLabel: string;
    children: SidebarChild[];
  };

  const subjects: SubjectEntry[] = [
    {
      id: "maths",
      label: "Mathematics",
      icon: Calculator,
      iconColor: "#22C55E",
      sectionLabel: "NUMBERS & PLACE VALUE",
      children: [
        { id: "maths-lesson", label: "Lesson", href: "/subjects/maths/chapters/numbers", icon: PlayCircle },
        { id: "maths-quiz", label: "Quiz", href: "/subjects/maths/chapters/numbers?view=quiz", icon: HelpCircle },
        { id: "maths-ws", label: "Worksheet", href: "/subjects/maths/chapters/numbers?view=worksheet", icon: FileText },
      ],
    },
    {
      id: "english",
      label: "English",
      icon: BookOpen,
      iconColor: "#3B82F6",
      sectionLabel: "SIMPLE SENTENCE",
      children: [
        { id: "english-lesson", label: "Lesson", href: "/subjects/english/chapters/english-intro", icon: PlayCircle },
        { id: "english-quiz", label: "Quiz", href: "/subjects/english/chapters/english-intro?view=quiz", icon: HelpCircle },
        { id: "english-ws", label: "Worksheet", href: "/subjects/english/chapters/english-intro?view=worksheet", icon: FileText },
      ],
    },
    {
      id: "science",
      label: "Science",
      icon: FlaskConical,
      iconColor: "#F59E0B",
      sectionLabel: "HABITAT",
      children: [
        { id: "science-lesson", label: "Lesson", href: "/subjects/science/chapters/science-intro", icon: PlayCircle },
        { id: "science-quiz", label: "Quiz", href: "/subjects/science/chapters/science-intro?view=quiz", icon: HelpCircle },
        { id: "science-ws", label: "Worksheet", href: "/subjects/science/chapters/science-intro?view=worksheet", icon: FileText },
      ],
    },
  ];

  return (
    <div className="bg-[#F9FAFB]">
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* ── SIDEBAR ── */}
      <aside className="hidden md:flex w-[220px] flex-col justify-between bg-[#0F172A] fixed left-0 top-0 h-screen overflow-y-auto z-40">

        <div className="flex flex-col">
          {/* Logo */}
          <div className="px-5 pt-5 pb-4 border-b border-white/10">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", background: "white", borderRadius: "8px", padding: "8px", width: "100%" }}>
              <img src="/logo.png" alt="StudiesMate" style={{ width: "100%", maxWidth: "140px", height: "auto", objectFit: "contain", display: "block", margin: "0 auto" }} />
            </div>
            <p className="mt-1 text-[11px] text-[#6B7280]">Beta</p>
          </div>

          {/* Nav */}
          <nav className="px-3 pt-4 pb-2">

            {/* Home */}
            <Link
              href="/"
              className="flex items-center gap-3 border-l-2 border-transparent rounded-r-lg px-3 py-2.5 mb-1 text-sm font-semibold text-white hover:bg-white/5 transition-all"
              style={{ animation: "fadeIn 0.4s ease-out both", animationDelay: "0.05s" }}
            >
              <Home className="h-4 w-4 shrink-0" />
              Home
            </Link>

            {/* Dashboard */}
            <Link
              href="/dashboard"
              className={`flex items-center gap-3 border-l-2 rounded-r-lg px-3 py-2.5 mb-1 text-sm font-semibold transition-all ${
                isActive("/dashboard")
                  ? "border-[#22C55E] bg-[#22C55E]/15 text-[#22C55E]"
                  : "border-transparent text-white hover:bg-white/5"
              }`}
              style={{ animation: "fadeIn 0.4s ease-out both", animationDelay: "0.1s" }}
            >
              <LayoutDashboard className="h-4 w-4 shrink-0" />
              Dashboard
            </Link>

            {/* Subject collapsibles */}
            {subjects.map(({ id, label, icon: Icon, iconColor, sectionLabel, children }, i) => {
              const isExpanded = expanded.includes(id);
              return (
                <div key={id} className="mb-1" style={{ animation: "fadeIn 0.4s ease-out both", animationDelay: `${(i + 3) * 0.05}s` }}>
                  <button
                    type="button"
                    onClick={() => toggleExpand(id)}
                    className="w-full flex items-center gap-3 border-l-2 border-transparent rounded-r-lg px-3 py-2.5 text-sm font-semibold text-white hover:bg-white/5 transition-all"
                  >
                    <Icon className="h-4 w-4 shrink-0" style={{ color: iconColor }} />
                    <span className="flex-1 text-left">{label}</span>
                    {isExpanded
                      ? <ChevronDown className="h-3.5 w-3.5 text-[#6B7280]" />
                      : <ChevronRight className="h-3.5 w-3.5 text-[#6B7280]" />
                    }
                  </button>

                  {isExpanded && (
                    <div className="ml-5 border-l border-white/10 pl-3 pt-1 pb-1 flex flex-col gap-0.5">
                      <span className="px-1 pt-1 pb-1.5 text-[10px] font-bold uppercase tracking-wider text-[#4B5563]">
                        {sectionLabel}
                      </span>

                      {children.map((child) => {
                        const ChildIcon = child.icon;
                        return (
                          <Link
                            key={child.id}
                            href={child.href}
                            className={`flex items-center gap-2 rounded-lg px-2 py-1.5 text-xs font-medium transition-all ${
                              isActive(child.href)
                                ? "text-[#22C55E] bg-[#22C55E]/10"
                                : "text-[#9CA3AF] hover:text-white hover:bg-white/5"
                            }`}
                          >
                            <ChildIcon className="h-3.5 w-3.5 shrink-0" />
                            {child.label}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}

            {/* All Grades */}
            <Link
              href="/phase-1"
              className={`flex items-center gap-3 border-l-2 border-transparent rounded-r-lg px-3 py-2.5 text-sm font-semibold transition-all ${
                isActive("/phase-1")
                  ? "border-[#22C55E] bg-[#22C55E]/15 text-[#22C55E]"
                  : "text-[#9CA3AF] hover:bg-white/5 hover:text-white"
              }`}
              style={{ animation: "fadeIn 0.4s ease-out both", animationDelay: "0.3s" }}
            >
              <TrendingUp className="h-4 w-4 shrink-0" />
              All Grades
            </Link>
          </nav>
        </div>

        {/* Bottom — Connect Parent + Avatar */}
        <div className="border-t border-white/10">
          <div className="px-5 pt-4 pb-3">
            <Link href="/parent" className="flex items-center gap-2 group">
              <span className="h-2 w-2 rounded-full bg-[#22C55E]" />
              <span className="text-sm font-medium text-white group-hover:text-[#22C55E] transition-colors">Connect Parent</span>
            </Link>
            <div className="mt-1.5 flex items-center gap-1.5">
              <span className="font-mono text-xs text-[#22C55E]">
                {connectCode
                  ? `Code: ${codeVisible ? connectCode : connectCode.replace(/-.+$/, "-••••")}`
                  : "Code: —"}
              </span>
              {connectCode && (
                <>
                  <button
                    type="button"
                    onClick={handleCopyCode}
                    title="Copy code"
                    style={{ background: "none", border: "none", cursor: "pointer", padding: "1px", lineHeight: 1, color: codeCopied ? "#22C55E" : "#9CA3AF" }}
                    className="hover:!text-white transition-colors"
                  >
                    {codeCopied
                      ? <Check style={{ width: 14, height: 14 }} />
                      : <Copy style={{ width: 14, height: 14 }} />
                    }
                  </button>
                  <button
                    type="button"
                    onClick={() => setCodeVisible((v) => !v)}
                    title={codeVisible ? "Hide code" : "Show code"}
                    style={{ background: "none", border: "none", cursor: "pointer", padding: "1px", lineHeight: 1, color: "#9CA3AF" }}
                    className="hover:!text-white transition-colors"
                  >
                    {codeVisible
                      ? <EyeOff style={{ width: 14, height: 14 }} />
                      : <Eye style={{ width: 14, height: 14 }} />
                    }
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Avatar row with dropup */}
          <div className="border-t border-white/10 px-3 py-2.5 relative" ref={avatarRef}>
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
              <div className="absolute bottom-full left-3 right-3 mb-1 overflow-hidden rounded-lg border border-[#E5E7EB] bg-white shadow-lg">
                <button
                  type="button"
                  onClick={() => { setDropupOpen(false); router.push("/"); }}
                  className="flex w-full items-center gap-2 px-3 py-2.5 text-sm text-[#111827] hover:bg-[#F9FAFB] transition-colors"
                >
                  🏠 Home
                </button>
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
      </aside>

      {/* Mobile bottom tab bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-white/10 bg-[#0F172A] flex items-center justify-around px-2 py-2">
        <Link href="/dashboard" className="flex flex-col items-center gap-1 text-[10px] font-semibold text-[#9CA3AF]">
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
      <main className="md:ml-[220px] h-screen overflow-y-auto pb-20 md:pb-0">
        <div className="mx-auto max-w-[1100px]">
          {children}
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
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ background: "white", borderRadius: "16px", padding: "32px", maxWidth: "380px", width: "90%", textAlign: "center", boxShadow: "0 20px 60px rgba(0,0,0,0.2)" }}>
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
      )}
    </div>
  );
}
