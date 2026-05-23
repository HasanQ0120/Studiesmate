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
              Affordable. Bilingual. Built for Pakistan.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm">
            <Link href="/about" className="text-white/85 hover:text-white">
              About
            </Link>
            <Link href="/privacy" className="text-white/85 hover:text-white">
              Privacy Policy
            </Link>
<Link href="/phase-1" className="text-white/85 hover:text-white">
              Grades
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
              Contact: studiesmate.org@gmail.com
            </p>
            <div className="mt-4">
              <div className="text-sm font-semibold">Community</div>
              <div className="mt-2 flex flex-col gap-1.5">
                <a
                  href="https://www.instagram.com/studiesmate.pk"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-white/80 hover:text-white"
                >
                  Instagram
                </a>
                <a
                  href="https://chat.whatsapp.com/BgG4sUTHa1z8UXX7n2sKGn"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-white/80 hover:text-white"
                >
                  WhatsApp Community
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-white/15 pt-6 text-xs text-white/65">
          © {new Date().getFullYear()} StudiesMate. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
