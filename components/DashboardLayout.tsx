"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Calculator, BookOpen, FlaskConical, ChevronDown, ChevronRight, Home, Lock, FileText } from "lucide-react";

type SidebarChild = {
  id: string;
  label: string;
  href: string | null;
  isQuiz: boolean;
  isWorksheet: boolean;
  worksheetUnlocked?: boolean;
};

type UnlockState = {
  place_value: boolean;
  habitat: boolean;
};

function loadUnlocks(): UnlockState {
  try {
    return {
      place_value: localStorage.getItem("worksheet_unlocked_place_value") === "true",
      habitat: localStorage.getItem("worksheet_unlocked_habitat") === "true",
    };
  } catch {
    return { place_value: false, habitat: false };
  }
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [expanded, setExpanded] = useState<string[]>([]);
  const [unlocks, setUnlocks] = useState<UnlockState>({ place_value: false, habitat: false });
  const [lockedMsg, setLockedMsg] = useState<string | null>(null);

  useEffect(() => {
    setUnlocks(loadUnlocks());
    try {
      const saved = localStorage.getItem("studiesmate_sidebar_expanded");
      if (saved) setExpanded(JSON.parse(saved));
    } catch {}

    function handleMessage(e: MessageEvent) {
      if (e.data?.type === "quizComplete") {
        setUnlocks(loadUnlocks());
      }
    }
    function handleDocClick() {
      setLockedMsg(null);
    }
    window.addEventListener("message", handleMessage);
    document.addEventListener("click", handleDocClick);
    return () => {
      window.removeEventListener("message", handleMessage);
      document.removeEventListener("click", handleDocClick);
    };
  }, []);

  function toggleExpand(id: string) {
    setExpanded(prev => {
      const next = prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id];
      try {
        localStorage.setItem("studiesmate_sidebar_expanded", JSON.stringify(next));
      } catch {}
      return next;
    });
  }

  function isActive(href: string) {
    return pathname === href;
  }

  const sidebarItems = [
    {
      id: "dashboard",
      label: "Home",
      icon: LayoutDashboard,
      href: "/dashboard",
      locked: false,
      children: [] as SidebarChild[],
    },
    {
      id: "maths",
      label: "Mathematics",
      icon: Calculator,
      href: null,
      locked: false,
      children: [
        { id: "numbers-lesson", label: "Numbers & Place Value", href: "/subjects/maths/chapters/numbers", isQuiz: false, isWorksheet: false },
        { id: "numbers-quiz", label: "Numbers & Place Value Quiz", href: "/subjects/maths/chapters/numbers/quiz", isQuiz: true, isWorksheet: false },
        { id: "numbers-worksheet", label: "Numbers & Place Value Worksheet", href: unlocks.place_value ? "/subjects/maths/chapters/numbers/worksheet" : null, isQuiz: false, isWorksheet: true, worksheetUnlocked: unlocks.place_value },
      ] as SidebarChild[],
    },
    {
      id: "english",
      label: "English",
      icon: BookOpen,
      href: null,
      locked: false,
      children: [
        { id: "english-lesson", label: "Simple Sentences", href: "/subjects/english/chapters/english-intro", isQuiz: false, isWorksheet: false },
        { id: "english-quiz", label: "Simple Sentences Quiz", href: "/subjects/english/chapters/english-intro/quiz", isQuiz: true, isWorksheet: false },
      ] as SidebarChild[],
    },
    {
      id: "science",
      label: "Science",
      icon: FlaskConical,
      href: null,
      locked: false,
      children: [
        { id: "science-lesson", label: "What is a Habitat?", href: "/subjects/science/chapters/science-intro", isQuiz: false, isWorksheet: false },
        { id: "science-quiz", label: "What is a Habitat? Quiz", href: "/subjects/science/chapters/science-intro/quiz", isQuiz: true, isWorksheet: false },
        { id: "science-worksheet", label: "What is a Habitat? Worksheet", href: unlocks.habitat ? "/subjects/science/chapters/science-intro/worksheet" : null, isQuiz: false, isWorksheet: true, worksheetUnlocked: unlocks.habitat },
      ] as SidebarChild[],
    },
  ];

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      {/* Left Sidebar */}
      <aside className="hidden md:flex flex-col w-64 shrink-0 border-r border-[#E2E8F0] bg-white sticky top-[72px] h-[calc(100vh-72px)] overflow-y-auto">
        <div className="p-4">
          <p className="text-[13px] font-bold uppercase tracking-widest text-[#F97316] mb-3 px-2">Beta</p>

          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const isExpanded = expanded.includes(item.id);

            if (item.href) {
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-xl px-3 py-2.5 mb-1 text-sm font-semibold transition-all ${
                    isActive(item.href)
                      ? "bg-[#FFF7ED] text-[#F97316] border border-[#FED7AA]"
                      : "text-[#475569] hover:bg-[#F8FAFC] hover:text-[#0F172A]"
                  }`}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  {item.label}
                </Link>
              );
            }

            return (
              <div key={item.id} className="mb-1">
                <button
                  type="button"
                  onClick={() => !item.locked && toggleExpand(item.id)}
                  className={`w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all ${
                    item.locked
                      ? "text-[#94A3B8] cursor-not-allowed"
                      : "text-[#475569] hover:bg-[#F8FAFC] hover:text-[#0F172A]"
                  }`}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span className="flex-1 text-left">{item.label}</span>
                  {item.locked ? (
                    <span className="text-[10px] font-bold text-[#94A3B8] bg-[#F1F5F9] rounded-full px-2 py-0.5">Soon</span>
                  ) : (
                    isExpanded ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />
                  )}
                </button>

                {isExpanded && !item.locked && item.children.length > 0 && (
                  <div className="ml-4 mt-1 border-l border-[#E2E8F0] pl-3 flex flex-col gap-1">
                    {item.children.map((child) => {
                      if (child.isWorksheet) {
                        if (child.worksheetUnlocked && child.href) {
                          return (
                            <Link
                              key={child.id}
                              href={child.href}
                              className={`flex items-center gap-2 rounded-lg px-2 py-2 text-xs font-semibold transition-all ${
                                isActive(child.href)
                                  ? "bg-[#FFF7ED] text-[#F97316]"
                                  : "text-[#475569] hover:bg-[#F8FAFC] hover:text-[#0F172A]"
                              }`}
                            >
                              <FileText className="h-3 w-3 shrink-0 text-[#22C55E]" />
                              {child.label}
                            </Link>
                          );
                        }
                        return (
                          <div key={child.id}>
                            <button
                              type="button"
                              onClick={(e) => { e.stopPropagation(); setLockedMsg(prev => prev === child.id ? null : child.id); }}
                              className="w-full flex items-center gap-2 rounded-lg px-2 py-2 text-xs font-semibold text-[#94A3B8] cursor-default"
                            >
                              <Lock className="h-3 w-3 shrink-0" />
                              {child.label}
                            </button>
                            {lockedMsg === child.id && (
                              <p className="mt-0.5 mb-1 px-2 text-[11px] text-[#F97316] leading-snug">
                                Complete the quiz first to unlock this worksheet.
                              </p>
                            )}
                          </div>
                        );
                      }

                      return (
                        <Link
                          key={child.id}
                          href={child.href as string}
                          className={`flex items-center gap-2 rounded-lg px-2 py-2 text-xs font-semibold transition-all ${
                            isActive(child.href as string)
                              ? "bg-[#FFF7ED] text-[#F97316]"
                              : "text-[#475569] hover:bg-[#F8FAFC] hover:text-[#0F172A]"
                          }`}
                        >
                          <div className={`h-2 w-2 rounded-full shrink-0 ${isActive(child.href as string) ? "bg-[#F97316]" : "bg-[#E2E8F0]"}`} />
                          {child.label}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </aside>

      {/* Mobile bottom tab bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-[#E2E8F0] bg-white flex items-center justify-around px-2 py-2">
        <Link href="/dashboard" className="flex flex-col items-center gap-1 text-[10px] font-semibold text-[#475569]">
          <Home className="h-5 w-5" />
          Home
        </Link>
        <Link href="/subjects/maths/chapters/numbers" className="flex flex-col items-center gap-1 text-[10px] font-semibold text-[#475569]">
          <Calculator className="h-5 w-5" />
          Math
        </Link>
        <Link href="/subjects/english/chapters/english-intro" className="flex flex-col items-center gap-1 text-[10px] font-semibold text-[#475569]">
          <BookOpen className="h-5 w-5" />
          English
        </Link>
        <Link href="/subjects/science/chapters/science-intro" className="flex flex-col items-center gap-1 text-[10px] font-semibold text-[#475569]">
          <FlaskConical className="h-5 w-5" />
          Science
        </Link>
      </div>

      {/* Right content panel */}
      <main className="flex-1 min-w-0 overflow-y-auto pb-20 md:pb-0">
        {children}
      </main>
    </div>
  );
}
