"use client";

import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import DashboardLayout from "@/components/DashboardLayout";
import { supabase } from "@/lib/auth";

type SubjectContextType = {
  selectedSubject: string | null;
  setSelectedSubject: (s: string | null) => void;
};

export const SubjectContext = createContext<SubjectContextType>({
  selectedSubject: null,
  setSelectedSubject: () => {},
});

export function useSubjectContext() {
  return useContext(SubjectContext);
}

export default function DashboardPagesLayout({ children }: { children: ReactNode }) {
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const pathname = usePathname();
  const router = useRouter();
  const kickingRef = useRef(false);

  // Reset subject mode when navigating away from /dashboard
  useEffect(() => {
    if (pathname !== "/dashboard") setSelectedSubject(null);
  }, [pathname]);

  // Single active session enforcement: check every 30s that this device's
  // session token still matches the one stored in Supabase. A newer login on
  // another device overwrites the Supabase token, causing a mismatch here.
  useEffect(() => {
    async function checkSession() {
      if (kickingRef.current) return;

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      let localToken: string | null = null;
      try { localToken = localStorage.getItem("sm_session_token"); } catch {}

      const { data: profile } = await supabase
        .from("profiles")
        .select("active_session_token")
        .eq("id", user.id)
        .maybeSingle();

      const serverToken = profile?.active_session_token ?? null;

      // Migration case: neither side has a token yet (deployed after user logged in).
      // Silently write a token so future checks work, and continue.
      if (!localToken && !serverToken) {
        const token = crypto.randomUUID();
        try {
          await supabase.from("profiles").update({ active_session_token: token }).eq("id", user.id);
          localStorage.setItem("sm_session_token", token);
        } catch {}
        return;
      }

      // Tokens match — session is valid
      if (localToken && serverToken && localToken === serverToken) return;

      // Mismatch — a newer login on another device/browser invalidated this session
      kickingRef.current = true;
      try { localStorage.setItem("sm_kicked_message", "You've been logged out because your account was accessed from another device or browser."); } catch {}
      try { localStorage.removeItem("sm_session_token"); } catch {}
      await supabase.auth.signOut();
      router.replace("/");
    }

    checkSession();
    const interval = setInterval(checkSession, 30_000);
    return () => clearInterval(interval);
  }, [router]);

  return (
    <DashboardLayout selectedSubject={selectedSubject} onSubjectChange={setSelectedSubject}>
      <SubjectContext.Provider value={{ selectedSubject, setSelectedSubject }}>
        {children}
      </SubjectContext.Provider>
    </DashboardLayout>
  );
}
