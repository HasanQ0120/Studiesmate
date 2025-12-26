import Link from "next/link";

function titleCase(s: string) {
  return s
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export default function SubjectPlaceholderPage({
  params,
}: {
  params: { subject: string };
}) {
  const subjectName = titleCase(params.subject);

  return (
    <div className="min-h-screen bg-white px-6 py-10">
      <div className="max-w-4xl mx-auto">
        <Link href="/dashboard" className="text-blue-600 text-sm">
          ← Back to Dashboard
        </Link>

        <h1 className="mt-4 text-3xl font-bold text-gray-900">
          {subjectName}
        </h1>

        <p className="mt-2 text-gray-600">
          Chapters and lessons for {subjectName} will be added gradually.
          For Phase 1, this page is a placeholder.
        </p>

        <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">
            What’s coming
          </h2>

          <ul className="mt-3 list-disc pl-5 text-sm text-gray-700 space-y-2">
            <li>Clear chapters</li>
            <li>Short lessons (10–15 mins)</li>
            <li>Practice questions</li>
            <li>Progress tracking</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
