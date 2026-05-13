"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { getQuizById } from "@/data/quizzes";
import { playCorrect, playWrong } from "@/lib/sound";

export default function QuizPlayPage() {
  const params = useParams<{ id: string }>();
  const quiz = getQuizById(params?.id ?? "");

  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [fillInput, setFillInput] = useState("");
  const [done, setDone] = useState(false);

  if (!quiz) {
    return (
      <main className="min-h-screen bg-white text-slate-900">
        <div className="mx-auto max-w-xl px-4 py-16 text-center">
          <h1 className="text-2xl font-semibold">Quiz not found</h1>
          <Link
            href="/dashboard"
            className="mt-6 inline-flex rounded-xl bg-[#0B2B5A] px-5 py-3 text-sm font-semibold text-white hover:bg-[#0A2550]"
          >
            ← Dashboard
          </Link>
        </div>
      </main>
    );
  }

  const total = quiz.questions.length;
  const question = quiz.questions[current];
  const isFill = question.type === "fill";

  function handleMCQ(idx: number) {
    if (isCorrect !== null) return;
    const correct = idx === question.correctIndex;
    setSelectedIdx(idx);
    setIsCorrect(correct);
    if (correct) {
      playCorrect();
      setScore((s) => s + 1);
    } else {
      playWrong();
    }
  }

  function normalizeFill(s: string) {
    return s.trim().replace(/,/g, "").replace(/\s+/g, " ").toLowerCase();
  }

  function handleFillSubmit() {
    if (isCorrect !== null || !fillInput.trim()) return;
    const input = normalizeFill(fillInput);
    const correct = (question.correctAnswers ?? []).some(
      (a) => normalizeFill(a) === input
    );
    setIsCorrect(correct);
    if (correct) {
      playCorrect();
      setScore((s) => s + 1);
    } else {
      playWrong();
    }
  }

  function advance() {
    if (current + 1 >= total) {
      try {
        const completions = JSON.parse(
          localStorage.getItem("studiesmate_quiz_completions") || "{}"
        );
        if (quiz) {
          completions[quiz.id] = true;
          localStorage.setItem(
            "studiesmate_last_activity_v2",
            JSON.stringify({
              action: `Completed ${quiz.title} Quiz`,
              timestamp: new Date().toISOString(),
            })
          );
        }
        localStorage.setItem("studiesmate_quiz_completions", JSON.stringify(completions));
      } catch {}
      setDone(true);
    } else {
      setCurrent((c) => c + 1);
      setSelectedIdx(null);
      setIsCorrect(null);
      setFillInput("");
    }
  }

  function restart() {
    setCurrent(0);
    setScore(0);
    setSelectedIdx(null);
    setIsCorrect(null);
    setFillInput("");
    setDone(false);
  }

  // ── Results screen ──────────────────────────────────────────────────────────
  if (done) {
    const pct = score / total;
    const msg =
      pct === 1
        ? "Perfect score! Excellent work."
        : pct >= 0.75
        ? "Great job! Almost there."
        : pct >= 0.5
        ? "Good effort. Keep practicing."
        : "Keep going — practice makes perfect.";

    return (
      <main className="min-h-screen bg-white text-slate-900">
        <div className="mx-auto max-w-xl px-4 py-20 text-center">
          <div className="text-6xl font-bold text-[#0B2B5A]">
            {score}/{total}
          </div>
          <h2 className="mt-4 text-2xl font-semibold">{msg}</h2>
          <p className="mt-2 text-sm text-slate-500">{quiz.title}</p>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <button
              onClick={restart}
              className="rounded-xl bg-[#0B2B5A] px-6 py-3 text-sm font-semibold text-white hover:bg-[#0A2550]"
            >
              Try Again
            </button>
            <Link
              href="/dashboard"
              className="rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-900 hover:bg-slate-50"
            >
              ← Dashboard
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // ── Quiz screen ─────────────────────────────────────────────────────────────
  return (
    <main className="min-h-screen bg-white text-slate-900">
      <div className="mx-auto max-w-xl px-4 py-10">
        {/* Top bar */}
        <div className="flex items-center justify-between">
          <Link href="/dashboard" className="text-sm text-slate-500 hover:text-slate-700">
            ← Dashboard
          </Link>
          <span className="text-sm font-medium text-slate-500">
            {current + 1} / {total}
          </span>
        </div>

        {/* Progress segments */}
        <div className="mt-4 flex gap-1.5">
          {quiz.questions.map((_, i) => (
            <div key={i} className="flex-1">
              <div
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i < current
                    ? "bg-[#0B2B5A]"
                    : i === current
                    ? "bg-[#0B2B5A]/40"
                    : "bg-slate-200"
                }`}
              />
            </div>
          ))}
        </div>

        {/* Question card */}
        <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            {isFill ? "Fill in the Blank" : "Multiple Choice"} · Q{current + 1}
          </p>
          <h2 className="mt-2 text-lg font-semibold leading-snug">{question.question}</h2>

          {/* MCQ options */}
          {question.options && question.options.length > 0 && (
            <div className="mt-5 grid gap-3">
              {question.options.map((opt, i) => {
                let cls =
                  "w-full rounded-xl border px-4 py-3 text-left text-sm font-medium transition-all duration-150";

                if (isCorrect === null) {
                  cls += " border-slate-200 hover:border-[#0B2B5A] hover:bg-slate-50 cursor-pointer";
                } else if (i === question.correctIndex) {
                  cls += " border-green-500 bg-green-50 text-green-800";
                } else if (i === selectedIdx) {
                  cls += " border-red-400 bg-red-50 text-red-800";
                } else {
                  cls += " border-slate-200 opacity-50 cursor-default";
                }

                return (
                  <button key={i} type="button" onClick={() => handleMCQ(i)} className={cls}>
                    <span className="mr-2 font-semibold text-slate-400">
                      {String.fromCharCode(65 + i)}.
                    </span>
                    {opt}
                  </button>
                );
              })}
            </div>
          )}

          {/* Fill-in-blank */}
          {(!question.options || question.options.length === 0) && (
            <div className="mt-5 space-y-3">
              <input
                value={fillInput}
                onChange={(e) => setFillInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleFillSubmit();
                }}
                disabled={isCorrect !== null}
                placeholder="Type your answer..."
                className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition-colors ${
                  isCorrect === null
                    ? "border-slate-300 focus:border-[#0B2B5A]"
                    : isCorrect
                    ? "border-green-500 bg-green-50 text-green-800"
                    : "border-red-400 bg-red-50 text-red-800"
                }`}
              />
              {isCorrect === null && (
                <button
                  onClick={handleFillSubmit}
                  disabled={!fillInput.trim()}
                  className="rounded-xl bg-[#0B2B5A] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#0A2550] disabled:opacity-40"
                >
                  Check Answer
                </button>
              )}
            </div>
          )}

          {/* Feedback + Next button */}
          {isCorrect !== null && (
            <div className="mt-5 space-y-3">
              <p
                className={`text-sm font-semibold ${
                  isCorrect ? "text-green-700" : "text-red-700"
                }`}
              >
                {isCorrect
                  ? "✓ Correct!"
                  : isFill
                  ? `✗ Correct answer: ${question.correctAnswers?.[0]}`
                  : `✗ Correct answer: ${question.options?.[question.correctIndex ?? 0]}`}
              </p>
              <button
                onClick={advance}
                className="rounded-xl bg-[#0B2B5A] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#0A2550]"
              >
                {current + 1 >= total ? "See Results →" : "Next →"}
              </button>
            </div>
          )}
        </div>

        {/* Live score */}
        <p className="mt-4 text-right text-xs text-slate-400">
          Score so far: {score} / {current + (isCorrect !== null ? 1 : 0)}
        </p>
      </div>
    </main>
  );
}
