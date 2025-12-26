export default function ParentPage() {
  return (
    <div className="bg-white text-slate-900">
      <main className="mx-auto flex min-h-[calc(100vh-140px)] max-w-6xl items-center justify-center px-4 py-14">
        <div className="sm-shell w-full max-w-md text-center">
          <h1 className="sm-title">Parent dashboard (beta)</h1>
          <p className="sm-subtitle mt-2">Track learning progress and insights here.</p>

          <ul className="mt-6 space-y-2 text-left text-sm text-slate-600">
            <li>• Weekly learning summary</li>
            <li>• Quiz results</li>
            <li>• Weak topic suggestions</li>
          </ul>
        </div>
      </main>
    </div>
  );
}
