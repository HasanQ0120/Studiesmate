import Link from "next/link";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0B2B5A] text-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-lg font-semibold tracking-tight">
            StudiesMate
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-6 text-sm md:flex">
          <Link href="/" className="opacity-95 hover:opacity-100">
            Home
          </Link>

          <div className="group relative">
            <button
              type="button"
              className="flex items-center opacity-95 hover:opacity-100"
              aria-label="Courses menu"
            >
              Courses
            </button>

            <div className="invisible absolute left-0 mt-3 w-56 rounded-xl border border-white/15 bg-white/95 p-2 text-slate-900 shadow-lg opacity-0 backdrop-blur transition group-hover:visible group-hover:opacity-100">
              <Link
                href="/subjects"
                className="block rounded-lg px-3 py-2 text-sm hover:bg-slate-100"
              >
                View subjects
              </Link>
              <Link
                href="/parent"
                className="block rounded-lg px-3 py-2 text-sm hover:bg-slate-100"
              >
                Parent dashboard (beta)
              </Link>
            </div>
          </div>

          <Link href="/about" className="opacity-95 hover:opacity-100">
            About us
          </Link>

          <Link href="/subjects" className="opacity-95 hover:opacity-100">
            Subjects
          </Link>

          <Link href="/parent" className="opacity-95 hover:opacity-100">
            Parent
          </Link>
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          <Link
            href="/auth"
            className="rounded-lg px-3 py-2 text-sm font-medium text-white/90 hover:text-white"
          >
            Log in
          </Link>

          <Link
            href="/auth"
            className="rounded-lg bg-white px-3 py-2 text-sm font-semibold text-[#0B2B5A] hover:bg-white/95"
          >
            Sign up
          </Link>
        </div>
      </div>

      {/* Mobile quick links */}
      <div className="border-t border-white/10 md:hidden">
        <div className="mx-auto flex max-w-6xl items-center gap-4 overflow-x-auto px-4 py-3 text-sm">
          <Link
            href="/subjects"
            className="whitespace-nowrap text-white/90 hover:text-white"
          >
            Subjects
          </Link>
          <Link
            href="/parent"
            className="whitespace-nowrap text-white/90 hover:text-white"
          >
            Parent
          </Link>
          <Link
            href="/about"
            className="whitespace-nowrap text-white/90 hover:text-white"
          >
            About
          </Link>
        </div>
      </div>
    </header>
  );
}
