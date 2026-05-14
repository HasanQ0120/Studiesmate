import BackButton from "@/components/BackButton";

export default function PlaceValueQuizPage() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      <div className="mx-auto max-w-4xl px-6 py-10">
        <BackButton href="/quiz/math" label="Back" />

        <h1 className="mt-6 text-3xl font-semibold tracking-tight">
          Numbers &amp; Place Value Quiz
        </h1>

        <div className="mt-8">
          <iframe
            src="/StudiesMate_Quiz_PlaceValue.html"
            width="100%"
            height="750px"
            style={{ border: "none", borderRadius: "12px" }}
            title="Place Value Quiz"
          />
        </div>
      </div>
    </main>
  );
}
