"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { Quiz } from "@/data/quizzes";

type Props = {
  quiz: Quiz;
  storageKey?: string;
};

type StoredResult = {
  completedAt: string;
  correctCount: number;
  total: number;
};

function safeParse<T>(raw: string | null): T | null {
  try {
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

export default function QuickQuiz({ quiz, storageKey }: Props) {
  const router = useRouter();
  const key = storageKey || `studiesmate_quiz_${quiz.id}`;
  const total = quiz.questions.length;

  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [saved, setSaved] = useState<StoredResult | null>(null);

  useEffect(() => {
    const existing = safeParse<StoredResult>(localStorage.getItem(key));
    if (existing) setSaved(existing);
  }, [key]);

  const correctCount = useMemo(() => {
    let c = 0;
    for (const q of quiz.questions) {
      const picked = answers[q.id];
      if (picked === q.correctIndex) c += 1;
    }
    return c;
  }, [answers, quiz.questions]);

  const allAnswered = useMemo(() => {
    return quiz.questions.every((q) => typeof answers[q.id] === "number");
  }, [answers, quiz.questions]);

  function pick(qid: string, optionIndex: number) {
    if (submitted) return;
    setAnswers((prev) => ({ ...prev, [qid]: optionIndex }));
  }

  function submit() {
    if (!allAnswered) return;
    setSubmitted(true);

    const result: StoredResult = {
      completedAt: new Date().toISOString(),
      correctCount,
      total,
    };

    localStorage.setItem(key, JSON.stringify(result));
    setSaved(result);
  }

  function retry() {
    setSubmitted(false);
    setAnswers({});
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">{quiz.title}</h3>
          <p className="mt-1 text-sm text-slate-600">
            {total} questions • quick check (no timer)
          </p>
        </div>

        {saved && (
          <div className="text-xs text-slate-600">
            Last attempt:{" "}
            <span className="font-semibold text-slate-900">
              {saved.correctCount}/{saved.total}
            </span>
          </div>
        )}
      </div>

      <div className="mt-6 space-y-5">
        {quiz.questions.map((q, idx) => {
          const picked = answers[q.id];
          const correct = q.correctIndex;

          return (
            <div key={q.id} className="rounded-xl border border-slate-200 p-4">
              <div className="text-sm font-semibold text-slate-900">
                {idx + 1}. {q.question}
              </div>

              <div className="mt-3 grid gap-2">
                {q.options.map((opt, i) => {
                  const isPicked = picked === i;
                  const showState = submitted;
                  const isCorrect = i === correct;
                  const isWrongPicked = showState && isPicked && i !== correct;

                  let cls = "w-full rounded-lg border px-3 py-2 text-left text-sm transition";

                  if (!showState) {
                    cls += isPicked
                      ? " border-[#0B2B5A] bg-slate-50"
                      : " border-slate-200 hover:bg-slate-50";
                  } else {
                    if (isCorrect) cls += " border-green-300 bg-green-50";
                    else if (isWrongPicked) cls += " border-red-300 bg-red-50";
                    else cls += " border-slate-200 bg-white";
                  }

                  return (
                    <button
                      key={opt}
                      type="button"
                      className={cls}
                      onClick={() => pick(q.id, i)}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>

              {submitted && q.explanation && (
                <div className="mt-3 rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-700">
                  {q.explanation}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-sm text-slate-700">
          {submitted ? (
            <span>
              Result:{" "}
              <span className="font-semibold text-slate-900">
                {correctCount}/{total}
              </span>
            </span>
          ) : (
            <span className="text-slate-600">Answer all questions, then submit.</span>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          {!submitted ? (
            <button
              type="button"
              onClick={submit}
              disabled={!allAnswered}
              className="rounded-xl bg-[#0B2B5A] px-4 py-2 text-sm font-semibold text-white hover:bg-[#0A2550] disabled:cursor-not-allowed disabled:opacity-50"
            >
              Submit
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={retry}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-50"
              >
                Try again
              </button>

              <button
                type="button"
                onClick={() => router.push("/quizzes")}
                className="rounded-xl bg-[#0B2B5A] px-4 py-2 text-sm font-semibold text-white hover:bg-[#0A2550]"
              >
                Do another quiz →
              </button>

              <button
                type="button"
                onClick={() => router.push("/dashboard")}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-50"
              >
                Back to dashboard
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
