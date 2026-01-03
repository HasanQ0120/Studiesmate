"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function PageTransition({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(false);
    const id = requestAnimationFrame(() => setShow(true));
    return () => cancelAnimationFrame(id);
  }, [pathname]);

  return (
    <div
      key={pathname}
      className={[
        "transition-all duration-500 ease-out", // was 300
        show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3",
      ].join(" ")}
    >
      {children}
    </div>
  );
}
