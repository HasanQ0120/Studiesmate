export default function EnglishPage() {
  return (
    <main className="min-h-screen bg-slate-50 flex flex-col">
      <header className="w-full border-b bg-white">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="text-lg font-semibold text-slate-900">
            English – Class topics
          </h1>
          <p className="text-xs text-slate-500">Phase 1 – placeholder</p>
        </div>
      </header>

      <section className="flex-1">
        <div className="max-w-4xl mx-auto px-4 py-8 space-y-4">
          <p className="text-sm text-slate-700">
            This is the English area. In Phase 1, we will add:
          </p>
          <ul className="text-sm text-slate-600 list-disc pl-5 space-y-1">
            <li>Short reading passages with simple questions</li>
            <li>Vocabulary and spelling practice</li>
            <li>AI explanations for difficult sentences</li>
          </ul>
        </div>
      </section>
    </main>
  );
}
