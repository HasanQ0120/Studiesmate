export default function ParentPage() {
  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="max-w-xl w-full bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-2xl font-semibold text-slate-900 mb-2">
          Parent dashboard (beta)
        </h1>
        <p className="text-slate-600 text-sm mb-4">
          This is the parent area. Next we will add progress reports and controls.
        </p>

        <ul className="list-disc text-sm text-slate-600 pl-5 space-y-1">
          <li>Weekly learning summary</li>
          <li>Quiz results</li>
          <li>Weak topics suggestion</li>
        </ul>
      </div>
    </main>
  );
}
