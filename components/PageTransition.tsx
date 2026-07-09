"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

// Routes that manage their own transitions — skip the wrapper animation so
// the fixed sidebar doesn't flash opacity on every navigation.
const DASHBOARD_PREFIXES = ["/dashboard", "/settings", "/connect-code", "/subjects"];

export default function PageTransition({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [show, setShow] = useState(false);

  const isDashboardRoute = DASHBOARD_PREFIXES.some((p) => pathname.startsWith(p));

  useEffect(() => {
    if (isDashboardRoute) return;
    setShow(false);
    const id = requestAnimationFrame(() => setShow(true));
    return () => cancelAnimationFrame(id);
  }, [pathname, isDashboardRoute]);

  if (isDashboardRoute) return <>{children}</>;

  return (
    <div
      key={pathname}
      className={[
        "page-wrapper transition-all duration-500 ease-out",
        show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3",
      ].join(" ")}
    >
      {children}
    </div>
  );
}
