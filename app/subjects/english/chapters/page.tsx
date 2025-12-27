"use client";

import BackButton from "@/components/BackButton";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";

const CHAPTERS = [
  { id: "reading", title: "Reading", desc: "Comprehension, fluency, and understanding texts." },
  { id: "grammar", title: "Grammar", desc: "Parts of speech, sentence structure, tenses, and punctuation." },
  { id: "vocabulary", title: "Vocabulary", desc: "Word meanings, synonyms/antonyms, and spelling practice." },
  { id: "writing", title: "Writing", desc: "Paragraphs, emails, stories, and clear writing structure." },
  { id: "speaking-listening", title: "Speaking & Listening", desc: "Pronunciation, listening skills, and confident speaking." },
];

export default function EnglishChaptersPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-white px-6 py-10">
      <div className="max-w-6xl mx-auto">
        {/* ✅ Back should go to the selected subjects dashboard */}
        <BackButton href="/dashboard" label="Back to Dashboard" />

        <h1 className="mt-6 text-3xl font-bold text-gray-900 mb-2">English</h1>
        <p className="text-gray-600 mb-10">
          Choose a chapter to start learning. Content is designed for clarity and basics.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {CHAPTERS.map((chapter) => (
            <div
              key={chapter.id}
              className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-all"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{chapter.title}</h3>
              <p className="text-sm text-gray-600 mb-6">{chapter.desc}</p>

              <button
                onClick={() => router.push(`/subjects/english/chapters/${chapter.id}`)}
                className="inline-flex items-center gap-2 rounded-xl bg-[#0B2B5A] px-4 py-2 text-sm font-semibold text-white hover:bg-[#0A2550] transition"
              >
                Open Chapter
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-slate-50 border border-slate-200 rounded-xl p-6 text-sm text-slate-600">
          <strong>Note:</strong> Lessons and exercises will be added gradually. This structure ensures
          consistency across all grades.
        </div>
      </div>
    </div>
  );
}
