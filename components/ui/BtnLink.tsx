import Link from "next/link";

type BtnLinkProps = {
  href: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
};

export default function BtnLink({ href, children, className = "", onClick }: BtnLinkProps) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={[
        "transition-all duration-200 ease-out",
        "hover:-translate-y-0.5 active:translate-y-0",
        "active:scale-[0.98]",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B2B5A]",
        className,
      ].join(" ")}
    >
      {children}
    </Link>
  );
}
