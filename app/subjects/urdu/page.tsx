export default function UrduPage() {
  return (
    <main className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="w-full border-b bg-white">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <h1 className="text-lg font-semibold text-slate-900">
            Urdu – Class topics
          </h1>
          <p className="text-xs text-slate-500">Phase 1 – placeholder</p>
        </div>
      </header>

      {/* Content section */}
      <section className="flex-1">
        <div className="max-w-4xl mx-auto px-4 py-4 space-y-4">
          <p className="text-sm text-slate-700">
            This is the Urdu area. In Phase 1, we will add:
          </p>

          <ul className="text-sm text-slate-600 list-disc pl-5 space-y-1">
            <li>Alphabets and basic reading practice</li>
            <li>Simple words and small sentences</li>
            <li>Short reading passages for comprehension</li>
            <li>AI explanations in Urdu and English (placeholder)</li>
          </ul>
        </div>
      </section>
    </main>
  );
}
