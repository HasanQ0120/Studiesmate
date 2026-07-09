"use client";

import Link from "next/link";

type Props = {
  href: string;
  label?: string; // optional custom text
  onClick?: () => void;
};

export default function BackButton({ href, label = "Back", onClick }: Props) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="
        inline-flex items-center gap-2
        rounded-xl bg-[#0B2B5A] px-4 py-2
        text-sm font-semibold text-white
        hover:bg-[#0A2550]
        transition
      "
      aria-label={label}
      title={label}
    >
      <span className="text-base leading-none">←</span>
      <span>{label}</span>
    </Link>
  );
}
