import BackButton from "@/components/BackButton";
import { use } from "react";

const SUBJECT_TITLE = "Social Studies";
const SUBJECT_ID = "social-studies";

const CHAPTER_META: Record<string, { title: string; desc: string }> = {
  "myself-family-community": {
    title: "Myself, Family & Community",
    desc: "Roles at home, helping others, and community life.",
  },
  "citizenship-responsibility": {
    title: "Citizenship & Responsibility",
    desc: "Rules, rights, duties, and being a good citizen.",
  },
  "culture-traditions": {
    title: "Culture & Traditions",
    desc: "Festivals, traditions, values, and respecting differences.",
  },
  "maps-directions": {
    title: "Maps & Directions",
    desc: "Maps, symbols, simple directions, and places around us.",
  },
  "environment-caring-earth": {
    title: "Environment & Caring for Earth",
    desc: "Cleanliness, recycling, resources, and protecting nature.",
  },
  "basic-economics": {
    title: "Basic Economics",
    desc: "Needs vs wants, money basics, saving, and simple trade.",
  },
  "history-around-us": {
    title: "History Around Us",
    desc: "Past and present, timelines, and local history basics.",
  },
  "government-services": {
    title: "Government & Services",
    desc: "Community helpers, services, and basic governance.",
  },
};

export default function SocialStudiesChapterPage({
  params,
}: {
  params: Promise<{ chapterId: string }>;
}) {
  const { chapterId } = use(params);

  const meta = CHAPTER_META[chapterId] ?? {
    title: "Chapter",
    desc: "Lesson content will be added soon.",
  };

  return (
    <main className="min-h-screen bg-white text-slate-900">
      <div className="mx-auto max-w-5xl px-4 py-12">
        {/* Single back button only */}
        <BackButton
          href={`/subjects/${SUBJECT_ID}/chapters`}
          label="Back to Chapters"
        />

        <h1 className="mt-6 text-3xl font-semibold tracking-tight">
          {SUBJECT_TITLE} • {meta.title}
        </h1>
        <p className="mt-2 text-sm text-slate-700">{meta.desc}</p>

        <div className="mt-10 rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="text-base font-semibold">Lesson coming soon</h2>
          <p className="mt-2 text-sm text-slate-700">
            We’ll add a full lesson, examples, and a quick quiz here.
          </p>
        </div>
      </div>
    </main>
  );
}
