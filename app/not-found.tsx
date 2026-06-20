import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[#0B2B5A] flex items-center justify-center px-4">
      <div className="text-center">
        <div className="text-8xl font-bold text-white/10">404</div>
        <div className="mt-4 text-4xl font-bold text-white">Page not found</div>
        <p className="mt-4 text-base text-white/70 max-w-md mx-auto">
          The page you are looking for does not exist or has been moved.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            href="/"
            className="rounded-xl bg-white px-6 py-3 text-sm font-bold text-[#0B2B5A] hover:bg-white/95 transition-colors"
          >
            Go Home
          </Link>
          <Link
            href="/dashboard"
            className="rounded-xl border border-white/30 px-6 py-3 text-sm font-bold text-white hover:bg-white/10 transition-colors"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    </main>
  );
}
