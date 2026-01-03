"use client";

import { useEffect, useRef, useState } from "react";

type RevealProps = {
  children: React.ReactNode;
  className?: string;

  threshold?: number;
  rootMargin?: string;
  once?: boolean;

  delayMs?: number;
};

export default function Reveal({
  children,
  className = "",
  threshold = 0.12,
  rootMargin = "0px 0px -10% 0px",
  once = true,
  delayMs = 0,
}: RevealProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (delayMs) {
            window.setTimeout(() => setIsVisible(true), delayMs);
          } else {
            setIsVisible(true);
          }
          if (once) obs.unobserve(entry.target);
        } else if (!once) {
          setIsVisible(false);
        }
      },
      { threshold, rootMargin }
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold, rootMargin, once, delayMs]);

  return (
    <div
      ref={ref}
      className={[
        "transform-gpu will-change-transform",
        "transition-all duration-900 ease-out", // slower (was 700)
        isVisible
          ? "opacity-100 translate-y-0 blur-0"
          : "opacity-0 translate-y-4 blur-[1px]", // slightly more distance
        className,
      ].join(" ")}
    >
      {children}
    </div>
  );
}
