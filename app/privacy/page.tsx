import Link from "next/link";

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      <div className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="text-3xl font-semibold tracking-tight">Privacy Policy</h1>
        <p className="mt-2 text-sm text-slate-500">Last updated: June 2026</p>

        <div className="mt-10 space-y-6 text-sm leading-7 text-slate-700">
          <p>
            StudiesMate collects only the information needed to provide our service, including your name, email address, and your child's grade level.
          </p>
          <p>
            We do not sell, share, or distribute your personal data to any third party.
          </p>
          <p>
            We do not show advertisements.
          </p>
          <p>
            Your data is stored securely and used only to provide access to StudiesMate lessons and quizzes.
          </p>
          <p>
            You can request deletion of your account and data at any time by emailing us at{" "}
            <a href="mailto:studiesmate.org@gmail.com" className="text-[#0B2B5A] hover:underline">
              studiesmate.org@gmail.com
            </a>
          </p>
          <p>
            By using StudiesMate, you agree to this policy.
          </p>
        </div>

        <div className="mt-12">
          <Link href="/" className="text-sm text-[#0B2B5A] hover:underline">
            ← Back to home
          </Link>
        </div>
      </div>
    </main>
  );
}
