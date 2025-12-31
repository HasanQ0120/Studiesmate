"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Menu, X } from "lucide-react";
import { supabase, signOutAccount } from "@/lib/auth";

type Profile = {
  studentName?: string;
  parentEmail?: string;
  studentClass?: string;
  className?: string;
};

type SessionShape = {
  studentName?: string;
  studentClass?: string;
  parentEmail?: string;
  loggedInAt?: string;
};

const PROFILE_KEY = "studiesmate_profile";
const SESSION_KEY = "studiesmate_session";

function safeParseJSON<T>(raw: string | null): T | null {
  try {
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

export default function Header() {
  const router = useRouter();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [localSession, setLocalSession] = useState<SessionShape | null>(null);

  // Supabase session state
  const [sbStudentName, setSbStudentName] = useState("");
  const [sbStudentClass, setSbStudentClass] = useState("");
  const [sbParentEmail, setSbParentEmail] = useState("");

  const [menuOpen, setMenuOpen] = useState(false); // account menu
  const [mobileNavOpen, setMobileNavOpen] = useState(false); // hamburger menu

  const menuRef = useRef<HTMLDivElement | null>(null);
  const mobileRef = useRef<HTMLDivElement | null>(null);

  function syncFromStorage() {
    const p = safeParseJSON<Profile>(localStorage.getItem(PROFILE_KEY));
    const s = safeParseJSON<SessionShape>(localStorage.getItem(SESSION_KEY));
    setProfile(p);
    setLocalSession(s);
  }

  async function syncFromSupabase() {
    const { data } = await supabase.auth.getUser();
    const user = data.user;

    const meta = (user?.user_metadata || {}) as {
      studentName?: string;
      studentClass?: string;
      parentEmail?: string;
    };

    setSbStudentName((meta.studentName || "").trim());
    setSbStudentClass((meta.studentClass || "").trim());
    setSbParentEmail((user?.email || meta.parentEmail || "").trim());
  }

  useEffect(() => {
    // localStorage sync (kept for backward compatibility)
    syncFromStorage();

    const onStorage = (e: StorageEvent) => {
      if (e.key === PROFILE_KEY || e.key === SESSION_KEY) syncFromStorage();
    };

    const onFocus = () => {
      syncFromStorage();
      syncFromSupabase();
    };

    const onAuthChanged = () => {
      syncFromStorage();
      syncFromSupabase();
    };

    window.addEventListener("storage", onStorage);
    window.addEventListener("focus", onFocus);
    window.addEventListener(
      "studiesmate_auth_changed",
      onAuthChanged as EventListener
    );

    // Supabase auth changes
    const { data: sub } = supabase.auth.onAuthStateChange(() => {
      syncFromSupabase();
    });

    // initial supabase sync
    syncFromSupabase();

    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("focus", onFocus);
      window.removeEventListener(
        "studiesmate_auth_changed",
        onAuthChanged as EventListener
      );
      sub.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      const target = e.target as Node;

      // close account dropdown if click outside
      if (menuRef.current && !menuRef.current.contains(target)) setMenuOpen(false);

      // close mobile menu if click outside
      if (mobileRef.current && !mobileRef.current.contains(target)) setMobileNavOpen(false);
    }

    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  // Logged in if Supabase has a user, OR fallback local session exists
  const isLoggedIn = useMemo(() => {
    return !!(sbParentEmail || localSession?.studentName);
  }, [sbParentEmail, localSession]);

  const displayName = useMemo(() => {
    return (
      sbStudentName ||
      (localSession?.studentName || profile?.studentName || "").trim()
    );
  }, [sbStudentName, localSession, profile]);

  const displayEmail = useMemo(() => {
    return (
      sbParentEmail ||
      (localSession?.parentEmail || profile?.parentEmail || "").trim()
    );
  }, [sbParentEmail, localSession, profile]);

  const avatarLetter = useMemo(() => {
    const name = displayName.trim();
    return name ? name[0].toUpperCase() : "U";
  }, [displayName]);

  async function handleLogout() {
    // Supabase sign out (if user exists)
    await signOutAccount();

    // Cleanup local session (kept for compatibility)
    localStorage.removeItem(SESSION_KEY);

    window.dispatchEvent(new Event("studiesmate_auth_changed"));
    setMenuOpen(false);
    setMobileNavOpen(false);
    router.push("/");
    router.refresh();
  }

  function closeMobileNav() {
    setMobileNavOpen(false);
  }

  function toggleMobileNav() {
    // don’t open both menus together
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

        {/* Desktop nav (UNCHANGED) */}
        <nav className="hidden items-center gap-6 text-sm md:flex">
          <Link href="/" className="opacity-95 hover:opacity-100">Home</Link>

          <div className="group relative">
            <button
              type="button"
              className="flex items-center opacity-95 hover:opacity-100"
              aria-label="Courses menu"
            >
              Courses
            </button>

            <div className="invisible absolute left-0 mt-3 w-56 rounded-xl border border-white/15 bg-white/95 p-2 text-slate-900 shadow-lg opacity-0 backdrop-blur transition group-hover:visible group-hover:opacity-100">
              <Link href="/subjects" className="block rounded-lg px-3 py-2 text-sm hover:bg-slate-100">
                View subjects
              </Link>
              <Link href="/parent" className="block rounded-lg px-3 py-2 text-sm hover:bg-slate-100">
                Parent dashboard (beta)
              </Link>
            </div>
          </div>

          <Link href="/about" className="opacity-95 hover:opacity-100">About</Link>
          <Link href="/subjects" className="opacity-95 hover:opacity-100">Subjects</Link>
          <Link href="/parent" className="opacity-95 hover:opacity-100">Parent</Link>
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
                    <Link href="/" onClick={closeMobileNav} className="rounded-lg px-3 py-2 hover:bg-white/10">
                      Home
                    </Link>
                    <Link href="/subjects" onClick={closeMobileNav} className="rounded-lg px-3 py-2 hover:bg-white/10">
                      Subjects
                    </Link>
                    <Link href="/parent" onClick={closeMobileNav} className="rounded-lg px-3 py-2 hover:bg-white/10">
                      Parent
                    </Link>
                    <Link href="/about" onClick={closeMobileNav} className="rounded-lg px-3 py-2 hover:bg-white/10">
                      About
                    </Link>

                    {isLoggedIn && (
                      <Link href="/dashboard" onClick={closeMobileNav} className="col-span-2 rounded-lg px-3 py-2 hover:bg-white/10">
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
                Sign up
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
                    <div className="mt-0.5 text-xs text-slate-600 break-all">
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
