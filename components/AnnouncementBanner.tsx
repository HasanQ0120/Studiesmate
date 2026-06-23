"use client";

import { usePathname } from "next/navigation";

export default function AnnouncementBanner() {
  const pathname = usePathname();
  if (pathname !== "/") return null;

  return (
    <div className="flex h-10 w-full items-center justify-center bg-[#F97316] px-4 text-center text-sm font-medium text-white">
      🎉 Free access. Join the Movement now →{" "}
      <a
        href="https://chat.whatsapp.com/H8q5PBchpRNC4TWIeWp49I"
        target="_blank"
        rel="noopener noreferrer"
        className="ml-1 underline underline-offset-2 hover:opacity-80"
      >
        Click here
      </a>
    </div>
  );
}
