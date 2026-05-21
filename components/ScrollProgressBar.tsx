"use client";

import { useEffect, useState } from "react";

export default function ScrollProgressBar() {
  const [pct, setPct] = useState(0);

  useEffect(() => {
    function onScroll() {
      const scrolled = window.scrollY;
      const total = document.documentElement.scrollHeight - window.innerHeight;
      setPct(total > 0 ? Math.round((scrolled / total) * 100) : 0);
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className="fixed top-0 left-0 z-[300] h-[3px] bg-[#F97316] transition-[width] duration-100 ease-out"
      style={{ width: `${pct}%` }}
      aria-hidden="true"
    />
  );
}
