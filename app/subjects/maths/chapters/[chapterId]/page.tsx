"use client";

import DashboardLayout from "@/components/DashboardLayout";
import { useParams, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";
import { FileText, Download, HelpCircle, ChevronRight } from "lucide-react";
import { supabase } from "@/lib/auth";
import { updateStreak } from "@/lib/streak";
import PageFade from "@/components/PageFade";

const VIDEO_IDS: Record<string, { en: string; ur: string }> = {
  numbers: {
    en: "https://studiesmate.b-cdn.net/place_value_english.mp4.mp4",
    ur: "https://studiesmate.b-cdn.net/place_value_urdu.mp4.mp4",
  },
};

const CHAPTER_META: Record<string, {
  title: string;
  quizSubtitle: string;
  quizQuestion: string;
  quizOptions: string[];
  worksheetSubtitle: string;
  explainEn: string;
  explainUr: string;
  transcript: string;
}> = {
  numbers: {
    title: "Numbers & Place Value",
    quizSubtitle: "Test your understanding of Place Value",
    quizQuestion: "In the number 456, what is the value of 4?",
    quizOptions: ["4", "40", "400", "4000"],
    worksheetSubtitle: "Print and practice Place Value exercises",
    explainEn: "In any number, each digit has a position called its 'place'. This position tells you exactly how much that digit is worth. In 456: the '4' is in the hundreds place, so its value is 400. The '5' is in the tens place — its value is 50. The '6' is in the ones place — its value is 6. The further left a digit sits, the bigger its value!",
    explainUr: "کسی بھی نمبر میں، ہر ہندسے کی ایک جگہ ہوتی ہے جسے 'place' کہتے ہیں۔ یہ جگہ بتاتی ہے کہ اس ہندسے کی قدر کتنی ہے۔ 456 میں: '4' سیکڑوں کی جگہ پر ہے، اس لیے اس کی قدر 400 ہے۔ '5' دہائیوں میں ہے — اس کی قدر 50 ہے۔ '6' اکائیوں میں ہے — اس کی قدر 6 ہے۔ جتنا ہندسہ بائیں طرف ہو، اتنی زیادہ اس کی قدر ہے۔",
    transcript: `Welcome to StudiesMate. Let's learn math.

Hello, Grade 4. Today we will learn about place value and how to read larger numbers.

You already know the smaller places — ones, tens, hundreds, and thousands. In Grade 4, we use larger numbers. Let us look at the thousands family — thousands, ten thousands, and hundred thousands.

Let us review. In the number four thousand, three hundred twenty-one — the four is in the thousands place. The three is in the hundreds place. The two is in the tens place. And the one is in the ones place.

Now let us look at a larger number. Fifty-four thousand, three hundred twenty-one. What is the value of the five? Because it sits in the ten thousands place — its value is fifty thousand.

Let us go even larger. Two hundred fifty-four thousand, three hundred twenty-one. The two is in the hundred thousands place. Its value is two hundred thousand. Let us break down this whole number — two hundred thousand, plus fifty thousand, plus four thousand, plus three hundred, plus twenty, plus one.

Now it is your turn. Look at the number eighty-nine thousand and twelve. Pause the video and write down the value of the eight.

The eight is in the ten thousands place. So its value is eighty thousand. Well done.

Remember — where a digit sits gives it its value. Thank you for learning with StudiesMate. Please download the worksheet to practise. See you in the next video.`,
  },
};

function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-2 rounded-lg bg-[#0F172A] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#1E293B]"
    >
      ← Back to Lesson
    </button>
  );
}

function ChapterPageInner() {
  const params = useParams<{ chapterId: string }>();
  const searchParams = useSearchParams();
  const chapterId = params.chapterId;
  const meta = CHAPTER_META[chapterId];
  const videoIds = VIDEO_IDS[chapterId] ?? { en: "", ur: "" };

  const [lang, setLang] = useState<"en" | "ur">("en");
  const [lessonCompletions, setLessonCompletions] = useState<Record<string, string>>({});
  const [transcriptOpen, setTranscriptOpen] = useState(false);
  const [notesOpen, setNotesOpen] = useState(false);
  const [explanation, setExplanation] = useState("");
  const [isExplaining, setIsExplaining] = useState(false);
  const [creditsLeft, setCreditsLeft] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [view, setView] = useState<"lesson" | "quiz" | "worksheet">(
    searchParams.get("view") === "quiz" ? "quiz" :
    searchParams.get("view") === "worksheet" ? "worksheet" : "lesson"
  );

  const videoEnRef = useRef<HTMLVideoElement>(null);
  const videoUrRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    try {
      setLessonCompletions(JSON.parse(localStorage.getItem("studiesmate_lesson_completions") || "{}"));
    } catch {}
  }, []);

  useEffect(() => {
    if (!meta) return;
    try {
      localStorage.setItem("studiesmate_last_activity_v2", JSON.stringify({
        action: `Opened ${meta.title} lesson`,
        href: `/subjects/maths/chapters/${chapterId}`,
        timestamp: new Date().toISOString(),
      }));
      localStorage.setItem("last_lesson_math", meta.title);
    } catch {}
  }, [chapterId, meta]);

  function handleLangSwitch(newLang: "en" | "ur") {
    if (newLang === lang) return;
    const activeRef = lang === "en" ? videoEnRef : videoUrRef;
    const nextRef = newLang === "en" ? videoEnRef : videoUrRef;
    const currentTime = activeRef.current?.currentTime ?? 0;
    activeRef.current?.pause();
    if (nextRef.current) {
      nextRef.current.currentTime = currentTime;
    }
    setLang(newLang);
    nextRef.current?.play().catch(() => {});
  }

  async function handleExplainAgain() {
    setIsExplaining(true);
    setShowExplanation(false);
    const { data: { session } } = await supabase.auth.getSession();
    const userId = session?.user?.id;
    const response = await fetch("/api/explain", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        topic: meta.title,
        subject: "Mathematics",
        language: lang === "ur" ? "urdu" : "english",
        userId,
      }),
    });
    const data = await response.json();
    if (response.status === 403 && data.error === "no_credits") {
      setExplanation("no_credits");
    } else {
      setExplanation(data.explanation);
      setCreditsLeft(data.creditsLeft);
    }
    setIsExplaining(false);
    setShowExplanation(true);
  }

  function markComplete() {
    try {
      const completions = JSON.parse(localStorage.getItem("studiesmate_lesson_completions") || "{}");
      completions[chapterId] = new Date().toISOString();
      localStorage.setItem("studiesmate_lesson_completions", JSON.stringify(completions));
      localStorage.setItem("studiesmate_last_activity_v2", JSON.stringify({
        action: `Completed ${meta?.title || chapterId} lesson`,
        href: `/subjects/maths/chapters/${chapterId}`,
        timestamp: new Date().toISOString(),
      }));
      setLessonCompletions(completions);
    } catch {}
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user.id) updateStreak(session.user.id);
    });
  }

  if (!meta || !videoIds.en) {
    return (
      <DashboardLayout>
        <div className="flex min-h-screen items-center justify-center bg-[#F9FAFB] text-center px-6">
          <div>
            <p className="text-lg font-bold text-[#111827]">This chapter is coming soon.</p>
            <p className="mt-2 text-sm text-[#6B7280]">Check back after Beta launches more content.</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const isCompleted = !!lessonCompletions[chapterId];

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-[#F9FAFB] px-5 py-7 pb-20 md:pb-10">

        {/* Breadcrumb */}
        <p className="text-xs text-[#9CA3AF]">Mathematics › {meta.title}</p>

        {/* Title */}
        <h1 className="mt-1.5 text-2xl font-bold text-[#111827]">Lesson 1: {meta.title}</h1>

        {/* Two-column layout */}
        <div className="mt-6 grid gap-5 lg:grid-cols-[1fr_340px]">

          {/* ── LEFT COLUMN ── */}
          <div className="flex flex-col gap-4">
            {view === "lesson" ? (
              <>
                {/* Video player */}
                <div className="overflow-hidden rounded-xl bg-[#0F172A]">
                  <div className="aspect-video relative">
                    <video
                      ref={videoEnRef}
                      src={videoIds.en}
                      controls
                      className="absolute inset-0 h-full w-full"
                      style={{ display: lang === "en" ? "block" : "none" }}
                    />
                    <video
                      ref={videoUrRef}
                      src={videoIds.ur}
                      controls
                      className="absolute inset-0 h-full w-full"
                      style={{ display: lang === "ur" ? "block" : "none" }}
                    />
                  </div>
                  <div className="px-4 py-3">
                    <p className="text-sm font-bold text-white">{meta.title}</p>
                    <p className="mt-0.5 text-xs text-[#9CA3AF]">Mathematics · Beta · 8:45</p>
                  </div>
                </div>

                {/* Bilingual Mode card */}
                <div className="flex items-center justify-between rounded-xl border border-[#F3F4F6] bg-white p-4 shadow-sm">
                  <div>
                    <p className="text-sm font-bold text-[#111827]">Bilingual Mode</p>
                    <p className="mt-0.5 text-xs text-[#6B7280]">Video continues from the same timestamp</p>
                  </div>
                  <div className="flex overflow-hidden rounded-lg border border-[#E5E7EB]">
                    <button
                      type="button"
                      onClick={() => handleLangSwitch("en")}
                      className={`px-3 py-1.5 text-xs font-semibold transition-colors ${lang === "en" ? "bg-[#22C55E] text-white" : "text-[#9CA3AF] hover:text-[#374151]"}`}
                    >
                      English
                    </button>
                    <button
                      type="button"
                      onClick={() => handleLangSwitch("ur")}
                      className={`px-3 py-1.5 text-xs font-semibold transition-colors ${lang === "ur" ? "bg-[#22C55E] text-white" : "text-[#9CA3AF] hover:text-[#374151]"}`}
                    >
                      اردو
                    </button>
                  </div>
                </div>

                {/* Explain Again card */}
                <div className="rounded-xl border border-[#F3F4F6] bg-white shadow-sm">
                  <div className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#F3F4F6]">
                        <FileText className="h-4 w-4 text-[#6B7280]" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-[#111827]">Explain Again</p>
                        <p className="mt-0.5 text-xs text-[#6B7280]">
                          Get a simple explanation in {lang === "en" ? "English" : "اردو"}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleExplainAgain}
                      disabled={isExplaining}
                      className="inline-flex items-center gap-1.5 rounded-full bg-[#22C55E] px-4 py-1.5 text-xs font-semibold text-white hover:bg-[#16A34A] transition-colors disabled:opacity-70"
                    >
                      {isExplaining ? (
                        <>
                          <span className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent" />
                          Explaining...
                        </>
                      ) : "Explain Again →"}
                    </button>
                  </div>
                </div>
                {showExplanation && (
                  <div className="rounded-xl border border-[#E5E7EB] bg-white p-4 mt-2">
                    {explanation === "no_credits" ? (
                      <div>
                        <p className="text-sm text-[#6B7280]">You&apos;ve used all your Explain Again credits. Grade 4 is launching soon — purchase it to get 25 credits every day.</p>
                        <a href="/phase-1" className="mt-3 inline-block rounded-full bg-[#22C55E] px-4 py-1.5 text-xs font-semibold text-white hover:bg-[#16A34A] transition-colors">Upgrade to Grade 4 →</a>
                      </div>
                    ) : (
                      <div>
                        <p style={{ fontSize: "15px", lineHeight: "1.6", color: "#111827" }}>{explanation}</p>
                        <p className="mt-2 text-xs text-[#9CA3AF]">Credits left: {creditsLeft}</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Transcript card */}
                <div className="rounded-xl border border-[#F3F4F6] bg-white shadow-sm">
                  <button
                    type="button"
                    onClick={() => setTranscriptOpen((v) => !v)}
                    className="flex w-full items-center gap-3 p-4"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#F3F4F6]">
                      <FileText className="h-4 w-4 text-[#6B7280]" />
                    </div>
                    <span className="flex-1 text-left text-sm font-bold text-[#111827]">Read Transcript</span>
                    <ChevronRight
                      className="h-4 w-4 text-[#9CA3AF] transition-transform duration-200"
                      style={{ transform: transcriptOpen ? "rotate(90deg)" : "rotate(0deg)" }}
                    />
                  </button>
                  <div
                    className="overflow-hidden transition-all duration-300"
                    style={{ maxHeight: transcriptOpen ? "2000px" : "0px" }}
                  >
                    <div className="border-t border-[#F3F4F6] px-4 pb-4 pt-3">
                      <p style={{ fontSize: "14px", lineHeight: "1.8", color: "#475569", whiteSpace: "pre-line" }}>
                        {meta.transcript}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Notes card */}
                <div className="rounded-xl border border-[#F3F4F6] bg-white shadow-sm">
                  <button
                    type="button"
                    onClick={() => setNotesOpen((v) => !v)}
                    className="flex w-full items-center gap-3 p-4"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#F3F4F6]">
                      <FileText className="h-4 w-4 text-[#6B7280]" />
                    </div>
                    <span className="flex-1 text-left text-sm font-bold text-[#111827]">Read Notes</span>
                    <ChevronRight
                      className="h-4 w-4 text-[#9CA3AF] transition-transform duration-200"
                      style={{ transform: notesOpen ? "rotate(90deg)" : "rotate(0deg)" }}
                    />
                  </button>
                  <div
                    className="overflow-hidden transition-all duration-300"
                    style={{ maxHeight: notesOpen ? "6000px" : "0px" }}
                  >
                    <div className="border-t border-[#F3F4F6] px-4 pb-4 pt-3 flex flex-col gap-3">
                      <p className="text-xs text-[#6B7280]">🟡 Yellow = Most Important &nbsp;|&nbsp; 🟢 Green = Good to Know</p>
                      <div style={{ background: "#FEFCE8", borderLeft: "3px solid #EAB308", borderRadius: "8px", padding: "12px 14px" }}>
                        <p className="text-xs font-bold text-[#92400E] mb-1">🟡 Core Concept</p>
                        <p style={{ fontSize: "14px", lineHeight: "1.7", color: "#44403C" }}>{"Place value is one of the most important ideas in math. It means that the SAME digit can represent completely different amounts depending on WHERE it sits in a number. A '5' sitting in the ones place means just 5 — but that same '5' sitting in the ten thousands place means 50,000! This is why understanding place value is the foundation for everything else in math."}</p>
                      </div>
                      <div style={{ background: "#F0FDF4", borderLeft: "3px solid #22C55E", borderRadius: "8px", padding: "12px 14px" }}>
                        <p className="text-xs font-bold text-[#166534] mb-1">🟢 The Place Value Chart</p>
                        <p style={{ fontSize: "14px", lineHeight: "1.7", color: "#14532D" }}>{"Ones → Tens → Hundreds → Thousands → Ten Thousands → Hundred Thousands. Each step to the left multiplies the value by 10."}</p>
                      </div>
                      <div style={{ background: "#FEFCE8", borderLeft: "3px solid #EAB308", borderRadius: "8px", padding: "12px 14px" }}>
                        <p className="text-xs font-bold text-[#92400E] mb-1">🟡 Solved Example 1: What is the value of 7 in 47,392?</p>
                        <p style={{ fontSize: "14px", lineHeight: "1.7", color: "#44403C" }}>{"Step 1: Identify the position of 7 — count from the right: 2(ones), 9(tens), 3(hundreds), 7(thousands). Step 2: The 7 is in the thousands place. "}<strong>{"Answer: Its value is 7,000"}</strong></p>
                      </div>
                      <div style={{ background: "#FEFCE8", borderLeft: "3px solid #EAB308", borderRadius: "8px", padding: "12px 14px" }}>
                        <p className="text-xs font-bold text-[#92400E] mb-1">🟡 Solved Example 2: What is the value of 3 in 356,891?</p>
                        <p style={{ fontSize: "14px", lineHeight: "1.7", color: "#44403C" }}>{"Step 1: Count positions from the right: 1,9,8,6,5,3. Step 2: The 3 is the 6th digit from the right — hundred thousands place. "}<strong>{"Answer: Its value is 300,000"}</strong></p>
                      </div>
                      <div style={{ background: "#FEFCE8", borderLeft: "3px solid #EAB308", borderRadius: "8px", padding: "12px 14px" }}>
                        <p className="text-xs font-bold text-[#92400E] mb-1">🟡 Solved Example 3: Break down 62,504 into its place values</p>
                        <p style={{ fontSize: "14px", lineHeight: "1.7", color: "#44403C" }}>{"Step 1: Write each digit with its place: 6(ten thousands), 2(thousands), 5(hundreds), 0(tens), 4(ones). Step 2: Multiply each digit by its place value: 60,000 + 2,000 + 500 + 0 + 4. "}<strong>{"Answer: 62,504 = 60,000 + 2,000 + 500 + 0 + 4"}</strong></p>
                      </div>
                      <div style={{ background: "#FEFCE8", borderLeft: "3px solid #EAB308", borderRadius: "8px", padding: "12px 14px" }}>
                        <p className="text-xs font-bold text-[#92400E] mb-1">🟡 Solved Example 4: Which number is bigger: 45,231 or 45,321?</p>
                        <p style={{ fontSize: "14px", lineHeight: "1.7", color: "#44403C" }}>{"Step 1: Both numbers start with the same digits — 4 and 5 — so compare the next digit. Step 2: In 45,231 the hundreds digit is 2. In 45,321 the hundreds digit is 3. Step 3: Since 3 is greater than 2, the second number is bigger. "}<strong>{"Answer: 45,321 is bigger"}</strong></p>
                      </div>
                      <div style={{ background: "#F0FDF4", borderLeft: "3px solid #22C55E", borderRadius: "8px", padding: "12px 14px" }}>
                        <p className="text-xs font-bold text-[#166534] mb-1">🟢 Common Mistake to Avoid</p>
                        <p style={{ fontSize: "14px", lineHeight: "1.7", color: "#14532D" }}>{"Many students think a number with MORE digits is always bigger — that's true! But when two numbers have the SAME number of digits, you must compare digit by digit from left to right until you find a difference."}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Mark as Complete */}
                {isCompleted ? (
                  <div className="flex items-center justify-center gap-2 rounded-full border border-[#6EE7B7] bg-[#ECFDF5] py-3 text-sm font-semibold text-[#10B981]">
                    ✓ Lesson Completed
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={markComplete}
                    className="w-full rounded-full bg-[#0F172A] py-3 text-sm font-semibold text-white hover:bg-[#1E293B] transition-colors"
                  >
                    ✓ Mark as Complete
                  </button>
                )}
              </>
            ) : view === "quiz" ? (
              <>
                <BackButton onClick={() => setView("lesson")} />
                <iframe
                  src="/StudiesMate_Quiz_PlaceValue.html"
                  width="100%"
                  height={600}
                  style={{ border: "none", borderRadius: "12px" }}
                  scrolling="auto"
                />
              </>
            ) : (
              <>
                <BackButton onClick={() => setView("lesson")} />
                <iframe
                  src="/worksheet_place_value.pdf"
                  width="100%"
                  height={700}
                  style={{ border: "none", borderRadius: "12px" }}
                />
              </>
            )}
          </div>

          {/* ── RIGHT COLUMN ── */}
          <div className="flex flex-col gap-4">

            {/* Quick Quiz card */}
            <div className="rounded-xl border border-[#F3F4F6] bg-white p-5 shadow-sm">
              <div className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5 text-[#22C55E]" />
                <h3 className="text-sm font-bold text-[#111827]">Quick Quiz</h3>
              </div>
              <p className="mt-1 text-xs text-[#6B7280]">{meta.quizSubtitle}</p>

              <p className="mt-4 text-sm font-semibold text-[#111827]">{meta.quizQuestion}</p>
              <div className="mt-3 space-y-2">
                {meta.quizOptions.map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setSelectedOption(option)}
                    className={`w-full rounded-lg border px-3 py-2 text-left text-sm transition-colors ${
                      selectedOption === option
                        ? "border-[#22C55E] bg-[#F0FDF4] font-semibold text-[#16A34A]"
                        : "border-[#E5E7EB] bg-white text-[#374151] hover:border-[#D1D5DB]"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={() => setView("quiz")}
                className="mt-4 flex w-full items-center justify-center rounded-xl bg-[#22C55E] py-2.5 text-sm font-semibold text-white hover:bg-[#16A34A] transition-colors"
              >
                Start Full Quiz →
              </button>
            </div>

            {/* Worksheet card */}
            <div className="rounded-xl border border-[#F3F4F6] bg-white p-5 shadow-sm">
              <div className="flex items-center gap-2">
                <Download className="h-5 w-5 text-[#6B7280]" />
                <h3 className="text-sm font-bold text-[#111827]">Worksheet</h3>
              </div>
              <p className="mt-1 text-xs text-[#6B7280]">{meta.worksheetSubtitle}</p>
              <button
                type="button"
                onClick={() => setView("worksheet")}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-[#E5E7EB] bg-white py-2.5 text-sm font-semibold text-[#374151] hover:border-[#D1D5DB] transition-colors"
              >
                <Download className="h-4 w-4" />
                Download PDF
              </button>
            </div>
          </div>

        </div>
      </div>
    </DashboardLayout>
  );
}

export default function ChapterPage() {
  return (
    <PageFade>
      <Suspense fallback={null}>
        <ChapterPageInner />
      </Suspense>
    </PageFade>
  );
}
