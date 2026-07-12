"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import DashboardLayout from "@/components/DashboardLayout";

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

  // Reset subject mode when navigating away from /dashboard
  useEffect(() => {
    if (pathname !== "/dashboard") setSelectedSubject(null);
  }, [pathname]);

  return (
    <DashboardLayout selectedSubject={selectedSubject} onSubjectChange={setSelectedSubject}>
      <SubjectContext.Provider value={{ selectedSubject, setSelectedSubject }}>
        {children}
      </SubjectContext.Provider>
    </DashboardLayout>
  );
}
