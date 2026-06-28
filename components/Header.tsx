"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { supabase } from "@/lib/auth";

type SbMeta = {
  studentName?: string;
  studentClass?: string;
  parentEmail?: string;
};

export default function Header() {
  const pathname = usePathname();

  const [sbStudentName, setSbStudentName] = useState("");
  const [sbStudentClass, setSbStudentClass] = useState("");
  const [sbParentEmail, setSbParentEmail] = useState("");

  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

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

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Grades", href: "/phase-1" },
    { label: "About", href: "/about" },
    { label: "Feedback", href: "/feedback" },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-[#F3F4F6] bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">

        {/* Logo */}
        <Link href="/" className="flex items-center">
          <img src="/logo.png" alt="StudiesMate" width={120} height={36} style={{ objectFit: "contain" }} />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-8 text-sm font-medium text-[#374151] md:flex">
          {navLinks.map(({ label, href }) => (
            <Link key={label} href={href} className="transition-colors hover:text-[#22C55E]">
              {label}
            </Link>
          ))}
          {isLoggedIn && (
            <Link href="/dashboard" className="transition-colors hover:text-[#22C55E]">
              Dashboard
            </Link>
          )}
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
              <div className="absolute left-0 right-0 top-full border-t border-[#F3F4F6] bg-white shadow-lg">
                <div className="mx-auto max-w-6xl px-4 py-3">
                  <div className="grid grid-cols-2 gap-1 text-sm">
                    {navLinks.map(({ label, href }) => (
                      <Link key={label} href={href} onClick={closeMobileNav} className="rounded-lg px-3 py-2 text-[#374151] hover:text-[#22C55E]">{label}</Link>
                    ))}
                    {!isLoggedIn ? (
                      <>
                        <Link href="/login" onClick={closeMobileNav} className="rounded-lg px-3 py-2 text-[#374151] hover:text-[#22C55E]">Login</Link>
                        <Link href="/signup" onClick={closeMobileNav} className="rounded-lg px-3 py-2 text-[#374151] hover:text-[#22C55E]">Sign Up</Link>
                      </>
                    ) : (
                      <Link href="/dashboard" onClick={closeMobileNav} className="rounded-lg px-3 py-2 text-[#374151] hover:text-[#22C55E]">Dashboard</Link>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Auth */}
          {!isLoggedIn ? (
            <>
              <Link href="/login" className="hidden text-sm font-medium text-[#374151] transition-colors hover:text-[#22C55E] md:inline">
                Login
              </Link>
              <Link href="/signup" className="hidden rounded-full bg-[#22C55E] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#16A34A] md:inline-flex">
                Start Free Beta
              </Link>
            </>
          ) : (
            <>
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
                  <div className="absolute right-0 mt-3 w-60 rounded-xl border border-[#F3F4F6] bg-white p-2 text-[#111827] shadow-lg">
                    <div className="px-3 py-2">
                      <div className="text-sm font-semibold text-[#111827]">{displayName || "Student"}</div>
                      <div className="mt-0.5 break-all text-xs text-[#6B7280]">{displayEmail || "No parent email"}</div>
                    </div>
                    <div className="my-2 h-px bg-[#F3F4F6]" />
                    <Link href="/dashboard" onClick={() => setMenuOpen(false)} className="block rounded-lg px-3 py-2 text-sm hover:bg-[#F9FAFB]">Dashboard</Link>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
