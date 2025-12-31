import { Suspense } from "react";
import CheckEmailClient from "./CheckEmailClient";

export default function Page({
  searchParams,
}: {
  searchParams: { email?: string };
}) {
  const email = (searchParams?.email || "").trim();

  // Suspense is optional here, but safe. Client component does not fetch.
  return (
    <Suspense fallback={<div className="min-h-[calc(100vh-140px)]" />}>
      <CheckEmailClient email={email} />
    </Suspense>
  );
}
