"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X } from "lucide-react";
import { supabase } from "@/lib/auth";
import AuthModal from "@/components/AuthModal";

type SbMeta = {
  studentName?: string;
  studentClass?: string;
  parentEmail?: string;
};

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();

  const [sbStudentName, setSbStudentName] = useState("");
  const [sbStudentClass, setSbStudentClass] = useState("");
  const [sbParentEmail, setSbParentEmail] = useState("");

  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(true);

  const menuRef = useRef<HTMLDivElement | null>(null);
  const mobileRef = useRef<HTMLDivElement | null>(null);

  function applySession(session: { user: { user_metadata?: Record<string, unknown>; email?: string } } | null) {
    const user = session?.user ?? null;
    const meta = (user?.user_metadata || {}) as SbMeta;
    setSbStudentName((meta.studentName || "").trim());
    setSbStudentClass((meta.studentClass || "").trim());
    setSbParentEmail((user?.email || (meta.parentEmail as string | undefined) || "").trim());
  }

  useEffect(() => {
    function onFeedbackSubmitted() { setFeedbackSubmitted(true); }
    window.addEventListener("feedback_submitted", onFeedbackSubmitted);
    return () => window.removeEventListener("feedback_submitted", onFeedbackSubmitted);
  }, []);

  useEffect(() => {
    try {
      if (localStorage.getItem("feedback_submitted") === "true") return;
      let firstVisit = localStorage.getItem("first_visit_timestamp");
      if (!firstVisit) {
        firstVisit = Date.now().toString();
        localStorage.setItem("first_visit_timestamp", firstVisit);
      }
      const elapsed = Date.now() - parseInt(firstVisit, 10);
      const remaining = Math.max(0, 15000 - elapsed);
      if (remaining === 0) {
        setFeedbackSubmitted(false);
      } else {
        const timer = setTimeout(() => setFeedbackSubmitted(false), remaining);
        return () => clearTimeout(timer);
      }
    } catch {}
  }, []);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      applySession(session);
    });
    function onFocus() {
      supabase.auth.getSession().then(({ data: { session } }) => applySession(session));
    }
    window.addEventListener("focus", onFocus);
    return () => {
      subscription.unsubscribe();
      window.removeEventListener("focus", onFocus);
    };
  }, []);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      const target = e.target as Node;
      if (menuRef.current && !menuRef.current.contains(target)) setMenuOpen(false);
      if (mobileRef.current && !mobileRef.current.contains(target)) setMobileNavOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  const isLoggedIn = useMemo(() => !!sbParentEmail, [sbParentEmail]);
  const displayName = useMemo(() => sbStudentName.trim(), [sbStudentName]);
  const displayEmail = useMemo(() => sbParentEmail.trim(), [sbParentEmail]);
  const avatarLetter = useMemo(() => {
    const name = displayName.trim();
    return name ? name[0].toUpperCase() : "U";
  }, [displayName]);

  function closeMobileNav() { setMobileNavOpen(false); }
  function toggleMobileNav() { setMenuOpen(false); setMobileNavOpen((v) => !v); }
  function toggleAccountMenu() { setMobileNavOpen(false); setMenuOpen((v) => !v); }
  function handleLogout() { setMenuOpen(false); setShowLogoutModal(true); }

  async function handleConfirmLogout() {
    await supabase.auth.signOut();
    setShowLogoutModal(false);
    setShowToast(true);
    setTimeout(() => router.push("/"), 2000);
  }

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Grades", href: "/phase-1" },
    { label: "About", href: "/about" },
    { label: "Feedback", href: "/feedback" },
  ];

  const loggedInLinks = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Grades", href: "/phase-1" },
    { label: "Feedback", href: "/feedback" },
    { label: "About", href: "/about" },
  ];

  return (
    <>
    <header className="sticky top-0 z-50 border-b border-[#F3F4F6] bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">

        {/* Logo */}
        <Link href="/" className="flex items-center">
          <img src="/logo.png" alt="StudiesMate" width={120} height={36} style={{ objectFit: "contain" }} />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-8 text-sm font-medium text-[#374151] md:flex">
          {(!isLoggedIn ? navLinks : loggedInLinks).map(({ label, href }) => (
            <Link
              key={label}
              href={href}
              onClick={() => { if (href === "/dashboard") { try { localStorage.removeItem("last_selected_subject"); } catch {} } }}
              className={`relative transition-colors hover:text-[#22C55E] ${pathname === href ? "text-[#22C55E] font-semibold" : ""}`}
            >
              {label}
              {label === "Feedback" && !feedbackSubmitted && (
                <span style={{ position: "absolute", top: -3, right: -7, width: 8, height: 8, background: "#EF4444", borderRadius: "50%", display: "block" }} />
              )}
            </Link>
          ))}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {/* Mobile hamburger */}
          <div className="md:hidden" ref={mobileRef}>
            <button
              type="button"
              onClick={toggleMobileNav}
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[#E5E7EB] hover:bg-[#F9FAFB]"
              aria-label="Open menu"
            >
              {mobileNavOpen ? <X className="h-5 w-5 text-[#374151]" /> : <Menu className="h-5 w-5 text-[#374151]" />}
            </button>

            {mobileNavOpen && (
              <div className="absolute left-0 right-0 top-full border-t border-[#F3F4F6] bg-white shadow-lg" style={{ animation: "slideDown 0.2s ease-out" }}>
                <div className="mx-auto max-w-6xl px-4 py-3">
                  <div className="grid grid-cols-2 gap-1 text-sm">
                    {(!isLoggedIn ? navLinks : loggedInLinks).map(({ label, href }) => (
                      <Link
                        key={label}
                        href={href}
                        onClick={() => { closeMobileNav(); if (href === "/dashboard") { try { localStorage.removeItem("last_selected_subject"); } catch {} } }}
                        className={`relative rounded-lg px-3 py-2 ${pathname === href ? "text-[#22C55E] font-semibold" : "text-[#374151] hover:text-[#22C55E]"}`}
                      >
                        {label}
                        {label === "Feedback" && !feedbackSubmitted && (
                          <span style={{ position: "absolute", top: 6, marginLeft: 3, width: 7, height: 7, background: "#EF4444", borderRadius: "50%", display: "inline-block" }} />
                        )}
                      </Link>
                    ))}
                    {!isLoggedIn && (
                      <>
                        <button type="button" onClick={() => { closeMobileNav(); setAuthMode("login"); setAuthModalOpen(true); }} className="rounded-lg px-3 py-2 text-[#374151] hover:text-[#22C55E] text-left">Login</button>
                        <button type="button" onClick={() => { closeMobileNav(); setAuthMode("signup"); setAuthModalOpen(true); }} className="rounded-lg px-3 py-2 text-[#374151] hover:text-[#22C55E] text-left">Sign Up</button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Auth */}
          {!isLoggedIn ? (
            <>
              <button
                type="button"
                onClick={() => { setAuthMode("login"); setAuthModalOpen(true); }}
                className="hidden text-sm font-medium text-[#374151] transition-colors hover:text-[#22C55E] md:inline"
              >
                Login
              </button>
              <button
                type="button"
                onClick={() => { setAuthMode("signup"); setAuthModalOpen(true); }}
                className="hidden rounded-full bg-[#22C55E] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#16A34A] md:inline-flex"
              >
                Start Free Beta
              </button>
            </>
          ) : (
            <div className="relative" ref={menuRef}>
              <button
                type="button"
                onClick={toggleAccountMenu}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-[#22C55E] text-sm font-semibold text-white hover:bg-[#16A34A]"
                aria-label="Account menu"
              >
                {avatarLetter}
              </button>

              {menuOpen && (
                <div className="absolute right-0 mt-3 w-60 rounded-xl border border-[#F3F4F6] bg-white p-2 text-[#111827] shadow-lg" style={{ animation: "dropdownIn 0.15s ease-out", transformOrigin: "top right" }}>
                  <div className="px-3 py-2">
                    <div className="text-sm font-semibold text-[#111827]">{displayName || "Student"}</div>
                    <div className="mt-0.5 break-all text-xs text-[#6B7280]">{displayEmail || "No parent email"}</div>
                  </div>
                  <div className="my-2 h-px bg-[#F3F4F6]" />
                  <Link href="/dashboard" onClick={() => { setMenuOpen(false); try { localStorage.removeItem("last_selected_subject"); } catch {}; }} className="block rounded-lg px-3 py-2 text-sm hover:bg-[#F9FAFB]">Dashboard</Link>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-[#111827] hover:bg-[#F9FAFB] transition-colors"
                  >
                    🚪 Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>

    <AuthModal
      isOpen={authModalOpen}
      onClose={() => setAuthModalOpen(false)}
      initialMode={authMode}
    />

    {showToast && (
      <div className="toast-slide-in" style={{ position: "fixed", top: "20px", right: "20px", background: "#22C55E", color: "white", padding: "12px 20px", borderRadius: "12px", fontSize: "14px", fontWeight: 600, zIndex: 9999, boxShadow: "0 4px 12px rgba(0,0,0,0.15)", maxWidth: "320px" }}>
        You have been logged out successfully.
      </div>
    )}

    {showLogoutModal && (
      <div className="backdrop-animate" style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 9998, display: "flex", alignItems: "center", justifyContent: "center" }}>
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
    )}
    </>
  );
}
