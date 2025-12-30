"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";

type Profile = {
  studentName?: string;
  parentEmail?: string;
  studentClass?: string;
  className?: string;
};

type Session = {
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
  const [session, setSession] = useState<Session | null>(null);

  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  function syncFromStorage() {
    const p = safeParseJSON<Profile>(localStorage.getItem(PROFILE_KEY));
    const s = safeParseJSON<Session>(localStorage.getItem(SESSION_KEY));
    setProfile(p);
    setSession(s);
  }

  useEffect(() => {
    syncFromStorage();

    const onStorage = (e: StorageEvent) => {
      if (e.key === PROFILE_KEY || e.key === SESSION_KEY) syncFromStorage();
    };

    const onFocus = () => syncFromStorage();
    const onAuthChanged = () => syncFromStorage();

    window.addEventListener("storage", onStorage);
    window.addEventListener("focus", onFocus);
    window.addEventListener("studiesmate_auth_changed", onAuthChanged as EventListener);

    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("focus", onFocus);
      window.removeEventListener("studiesmate_auth_changed", onAuthChanged as EventListener);
    };
  }, []);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  const isLoggedIn = !!session?.studentName;

  const displayName = useMemo(() => {
    return (session?.studentName || profile?.studentName || "").trim();
  }, [session, profile]);

  const displayEmail = useMemo(() => {
    return (session?.parentEmail || profile?.parentEmail || "").trim();
  }, [session, profile]);

  const avatarLetter = useMemo(() => {
    const name = displayName.trim();
    return name ? name[0].toUpperCase() : "U";
  }, [displayName]);

  function handleLogout() {
    localStorage.removeItem(SESSION_KEY);
    window.dispatchEvent(new Event("studiesmate_auth_changed"));
    setMenuOpen(false);
    router.push("/");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0B2B5A] text-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-lg font-semibold tracking-tight">StudiesMate</span>
        </Link>

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
                onClick={() => setMenuOpen((v) => !v)}
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

      <div className="border-t border-white/10 md:hidden">
        <div className="mx-auto flex max-w-6xl items-center gap-4 overflow-x-auto px-4 py-3 text-sm">
          <Link href="/subjects" className="whitespace-nowrap text-white/90 hover:text-white">
            Subjects
          </Link>
          <Link href="/parent" className="whitespace-nowrap text-white/90 hover:text-white">
            Parent
          </Link>
          <Link href="/about" className="whitespace-nowrap text-white/90 hover:text-white">
            About
          </Link>
        </div>
      </div>
    </header>
  );
}
