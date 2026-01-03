"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Menu, X } from "lucide-react";
import { supabase, signOutAccount } from "@/lib/auth";

type SbMeta = {
  studentName?: string;
  studentClass?: string;
  parentEmail?: string;
};

export default function Header() {
  const router = useRouter();

  // Supabase session state (single source of truth)
  const [sbStudentName, setSbStudentName] = useState("");
  const [sbStudentClass, setSbStudentClass] = useState("");
  const [sbParentEmail, setSbParentEmail] = useState("");

  const [menuOpen, setMenuOpen] = useState(false); // account menu
  const [mobileNavOpen, setMobileNavOpen] = useState(false); // hamburger menu

  const menuRef = useRef<HTMLDivElement | null>(null);
  const mobileRef = useRef<HTMLDivElement | null>(null);

  async function syncFromSupabase() {
    const { data } = await supabase.auth.getUser();
    const user = data.user;

    const meta = (user?.user_metadata || {}) as SbMeta;

    setSbStudentName((meta.studentName || "").trim());
    setSbStudentClass((meta.studentClass || "").trim());
    setSbParentEmail((user?.email || meta.parentEmail || "").trim());
  }

  useEffect(() => {
    const onFocus = () => {
      syncFromSupabase();
    };

    window.addEventListener("focus", onFocus);

    const { data: sub } = supabase.auth.onAuthStateChange(() => {
      syncFromSupabase();
    });

    syncFromSupabase();

    return () => {
      window.removeEventListener("focus", onFocus);
      sub.subscription.unsubscribe();
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

  const isLoggedIn = useMemo(() => {
    return !!sbParentEmail;
  }, [sbParentEmail]);

  const displayName = useMemo(() => {
    return (sbStudentName || "").trim();
  }, [sbStudentName]);

  const displayEmail = useMemo(() => {
    return (sbParentEmail || "").trim();
  }, [sbParentEmail]);

  const avatarLetter = useMemo(() => {
    const name = displayName.trim();
    return name ? name[0].toUpperCase() : "U";
  }, [displayName]);

  async function handleLogout() {
    await signOutAccount();

    setMenuOpen(false);
    setMobileNavOpen(false);

    router.push("/");
    router.refresh();
  }

  function closeMobileNav() {
    setMobileNavOpen(false);
  }

  function toggleMobileNav() {
    setMenuOpen(false);
    setMobileNavOpen((v) => !v);
  }

  function toggleAccountMenu() {
    setMobileNavOpen(false);
    setMenuOpen((v) => !v);
  }

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0B2B5A] text-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-lg font-semibold tracking-tight">StudiesMate</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-6 text-sm md:flex">
          <Link href="/" className="opacity-95 hover:opacity-100">
            Home
          </Link>

          {/* Renamed: Courses -> What we offer */}
          <div className="group relative">
            <button
              type="button"
              className="flex items-center opacity-95 hover:opacity-100"
              aria-label="What we offer menu"
            >
              What we offer
            </button>

            <div className="invisible absolute left-0 mt-3 w-56 rounded-xl border border-white/15 bg-white/95 p-2 text-slate-900 shadow-lg opacity-0 backdrop-blur transition group-hover:visible group-hover:opacity-100">
              <Link
                href="/signup"
                className="block rounded-lg px-3 py-2 text-sm hover:bg-slate-100"
              >
                Start Phase 1
              </Link>
              <Link
                href="/subjects"
                className="block rounded-lg px-3 py-2 text-sm hover:bg-slate-100"
              >
                Subjects
              </Link>
              <Link
                href="/parent"
                className="block rounded-lg px-3 py-2 text-sm hover:bg-slate-100"
              >
                Parent view (beta)
              </Link>
            </div>
          </div>

          <Link href="/about" className="opacity-95 hover:opacity-100">
            About
          </Link>
          <Link href="/subjects" className="opacity-95 hover:opacity-100">
            Subjects
          </Link>
          <Link href="/parent" className="opacity-95 hover:opacity-100">
            Parent
          </Link>

          {isLoggedIn && (
            <Link href="/dashboard" className="opacity-95 hover:opacity-100">
              Dashboard
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-2">
          {/* Mobile hamburger */}
          <div className="md:hidden" ref={mobileRef}>
            <button
              type="button"
              onClick={toggleMobileNav}
              className="mr-1 inline-flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 ring-1 ring-white/15 hover:bg-white/15"
              aria-label="Open menu"
            >
              {mobileNavOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>

            {mobileNavOpen && (
              <div className="absolute left-0 right-0 top-full border-t border-white/10 bg-[#0B2B5A]">
                <div className="mx-auto max-w-6xl px-4 py-3">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <Link
                      href="/"
                      onClick={closeMobileNav}
                      className="rounded-lg px-3 py-2 hover:bg-white/10"
                    >
                      Home
                    </Link>
                    <Link
                      href="/subjects"
                      onClick={closeMobileNav}
                      className="rounded-lg px-3 py-2 hover:bg-white/10"
                    >
                      Subjects
                    </Link>
                    <Link
                      href="/parent"
                      onClick={closeMobileNav}
                      className="rounded-lg px-3 py-2 hover:bg-white/10"
                    >
                      Parent
                    </Link>
                    <Link
                      href="/about"
                      onClick={closeMobileNav}
                      className="rounded-lg px-3 py-2 hover:bg-white/10"
                    >
                      About
                    </Link>

                    {isLoggedIn && (
                      <Link
                        href="/dashboard"
                        onClick={closeMobileNav}
                        className="col-span-2 rounded-lg px-3 py-2 hover:bg-white/10"
                      >
                        Dashboard
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Auth / Account */}
          {!isLoggedIn ? (
            <>
              <Link
                href="/login"
                className="rounded-lg px-3 py-2 text-sm font-medium text-white/90 hover:text-white"
              >
                Log in
              </Link>

              <Link
                href="/signup"
                className="rounded-lg bg-white px-3 py-2 text-sm font-semibold text-[#0B2B5A] hover:bg-white/95"
              >
                Start with Phase 1
              </Link>
            </>
          ) : (
            <div className="relative" ref={menuRef}>
              <button
                type="button"
                onClick={toggleAccountMenu}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15 text-sm font-semibold text-white ring-1 ring-white/20 hover:bg-white/20"
                aria-label="Account menu"
              >
                {avatarLetter}
              </button>

              {menuOpen && (
                <div className="absolute right-0 mt-3 w-60 rounded-xl border border-white/15 bg-white/95 p-2 text-slate-900 shadow-lg backdrop-blur">
                  <div className="px-3 py-2">
                    <div className="text-sm font-semibold text-slate-900">
                      {displayName || "Student"}
                    </div>
                    <div className="mt-0.5 break-all text-xs text-slate-600">
                      {displayEmail || "No parent email"}
                    </div>
                  </div>

                  <div className="my-2 h-px bg-slate-200" />

                  <Link
                    href="/dashboard"
                    onClick={() => setMenuOpen(false)}
                    className="block rounded-lg px-3 py-2 text-sm hover:bg-slate-100"
                  >
                    Dashboard
                  </Link>

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="mt-1 block w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-slate-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
