import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#0B2B5A] text-white">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <div className="text-lg font-semibold">StudiesMate</div>
            <p className="mt-2 text-sm text-white/80">Calm learning. Clear progress.</p>
            <p className="mt-4 text-xs text-white/65">
              Phase 1 focuses on trust and clarity, not hype.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm">
            <Link href="/about" className="text-white/85 hover:text-white">
              About & Privacy
            </Link>
            <Link href="/vision" className="text-white/85 hover:text-white">
              Vision
            </Link>
            <Link href="/subjects" className="text-white/85 hover:text-white">
              Subjects
            </Link>
            <Link href="/parent" className="text-white/85 hover:text-white">
              Parent
            </Link>
            <Link href="/login" className="text-white/85 hover:text-white">
              Login
            </Link>
            <Link href="/signup" className="text-white/85 hover:text-white">
              Sign up
            </Link>
          </div>

          <div>
            <div className="text-sm font-semibold">Contact</div>
            <p className="mt-2 text-sm text-white/80">
              If you’re testing Phase 1 and spot confusion, send feedback.
            </p>
            <p className="mt-3 text-xs text-white/65">
              (Use your preferred contact route later. Keep it simple for now.)
            </p>
          </div>
        </div>

        <div className="mt-10 border-t border-white/15 pt-6 text-xs text-white/65">
          © {new Date().getFullYear()} StudiesMate. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
