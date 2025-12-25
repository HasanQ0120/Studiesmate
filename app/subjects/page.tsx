import Link from "next/link";

const subjects = [
  { title: "Math", desc: "Clear steps and daily practice.", href: "/subjects/math" },
  { title: "English", desc: "Reading and writing made simple.", href: "/subjects/english" },
  { title: "Urdu", desc: "Bilingual support for clarity and confidence.", href: "/subjects/urdu" },
];

export default function SubjectsPage() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      <div className="mx-auto max-w-5xl px-4 py-12">
        <h1 className="text-3xl font-semibold tracking-tight">Subjects</h1>
        <p className="mt-2 text-sm text-slate-700">
          Start with the basics. Build consistency first.
        </p>

        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {subjects.map((s) => (
            <div key={s.title} className="rounded-2xl border border-slate-200 bg-white p-6">
              <h2 className="text-base font-semibold">{s.title}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-700">{s.desc}</p>
              <Link
                href={s.href}
                className="mt-5 inline-flex rounded-xl bg-[#0B2B5A] px-4 py-2 text-sm font-semibold text-white hover:bg-[#0A2550]"
              >
                Open
              </Link>
            </div>
          ))}
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
