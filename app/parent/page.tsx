export default function ParentPage() {
  return (
    <main className="min-h-[60vh] flex items-center justify-center">
      <div className="sm-shell max-w-md w-full text-center">
        <h1 className="sm-title">Parent dashboard (beta)</h1>
        <p className="sm-subtitle mt-2">
          Track learning progress and insights here.
        </p>

        <ul className="mt-4 text-sm text-slate-600 space-y-2 text-left">
          <li>• Weekly learning summary</li>
          <li>• Quiz results</li>
          <li>• Weak topic suggestions</li>
        </ul>
      </div>
    </main>
  );
}
