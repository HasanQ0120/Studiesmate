import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50 flex flex-col">
      {/* Top bar */}
      <header className="w-full border-b bg-white">
        <div className="max-w-5xl mx-auto flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-xl bg-blue-500 flex items-center justify-center text-white font-bold">
              S
            </div>
            <div>
              <h1 className="text-lg font-semibold text-slate-900">
                StudiesMate
              </h1>
              <p className="text-xs text-slate-500">
                Learn calmly, one small step at a time.
              </p>
            </div>
          </div>

          <nav className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm text-slate-700 hover:text-slate-900"
            >
              Login
            </Link>
            <Link
              href="/login"
              className="rounded-full bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 transition"
            >
              Get started
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero section */}
      <section className="flex-1">
        <div className="max-w-5xl mx-auto px-4 py-12 grid gap-10 md:grid-cols-2 items-center">
          {/* Left side text */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-blue-600 mb-2">
              Beta – Classes 1 to 5
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 leading-tight">
              A calm study companion
              <span className="text-blue-600"> for your child.</span>
            </h2>
            <p className="text-sm md:text-base text-slate-600 mb-6">
              Short lessons, simple quizzes, and an AI helper that explains
              mistakes in clear English or Urdu. No pressure, no competition –
              just understanding.
            </p>

            <div className="flex flex-wrap items-center gap-3 mb-4">
              <Link
                href="/login"
                className="rounded-full bg-blue-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-blue-700 transition"
              >
                Start as a student
              </Link>
              <Link
                href="/login"
                className="rounded-full border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100 transition"
              >
                I am a parent
              </Link>
            </div>

            <ul className="space-y-2 text-sm text-slate-600">
              <li>• Short concepts for Classes 1–5</li>
              <li>• AI explains in English or Urdu on one tap</li>
              <li>• Light quizzes to check understanding</li>
            </ul>
          </div>

          {/* Right side simple card */}
          <div className="md:justify-self-end w-full max-w-sm mx-auto">
            <div className="bg-white rounded-2xl shadow-md border border-slate-100 p-5 space-y-4">
              <h3 className="text-base font-semibold text-slate-900">
                How it works
              </h3>
              <ol className="space-y-2 text-sm text-slate-600">
                <li>
                  <span className="font-semibold text-slate-800">1.</span>{" "}
                  Choose your class and subject.
                </li>
                <li>
                  <span className="font-semibold text-slate-800">2.</span>{" "}
                  Watch a short lesson or try a quick quiz.
                </li>
                <li>
                  <span className="font-semibold text-slate-800">3.</span>{" "}
                  Stuck? Ask the AI to explain in English or Urdu.
                </li>
              </ol>

              <div className="rounded-xl bg-blue-50 px-4 py-3 text-xs text-slate-700">
                <p className="font-semibold text-blue-700 mb-1">
                  Early beta notice
                </p>
                <p>
                  This is an early version. Content is limited while we test the
                  experience with real students and parents.
                </p>
              </div>

              <Link
                href="/login"
                className="block text-center rounded-full bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition"
              >
                Continue to login
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-white">
        <div className="max-w-5xl mx-auto px-4 py-4 flex flex-col md:flex-row items-center justify-between gap-2">
          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} StudiesMate. Beta version for learning
            and feedback.
          </p>
          <p className="text-xs text-slate-500">
            Made with care for students in Pakistan.
          </p>
        </div>
      </footer>
    </main>
  );
}
