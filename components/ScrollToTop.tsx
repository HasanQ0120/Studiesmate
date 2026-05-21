"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function onScroll() {
      setVisible(window.scrollY > 500);
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function scrollTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (!visible) return null;

  return (
    <button
      type="button"
      onClick={scrollTop}
      aria-label="Scroll to top"
      className="fixed bottom-6 right-6 z-[150] flex h-11 w-11 items-center justify-center rounded-full bg-[#F97316] text-white shadow-lg hover:bg-[#EA580C] transition-colors"
    >
      <ArrowUp className="h-5 w-5" />
    </button>
  );
}
