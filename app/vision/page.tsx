import Link from "next/link";

export default function VisionPage() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      <div className="mx-auto max-w-4xl px-4 py-12">
        <h1 className="text-3xl font-semibold tracking-tight">Vision</h1>

        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <h2 className="text-base font-semibold">Our Vision</h2>
            <p className="mt-2 text-sm leading-6 text-slate-700">
              Make learning feel clear, calm, and consistent for every student.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <h2 className="text-base font-semibold">Our Mission</h2>
            <p className="mt-2 text-sm leading-6 text-slate-700">
              Help students build confidence through understanding and daily practice,
              while giving parents a safe and focused learning environment.
            </p>
          </div>
        </div>

        <div className="mt-10">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl bg-[#0B2B5A] px-4 py-2 text-sm font-semibold text-white hover:bg-[#0A2550]"
          >
            ← Back to home
          </Link>
        </div>
      </div>
    </main>
  );
}
