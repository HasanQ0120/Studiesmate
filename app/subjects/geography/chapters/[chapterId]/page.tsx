import BackButton from "@/components/BackButton";

const SUBJECT_TITLE = "Geography";
const SUBJECT_ID = "geography";

const CHAPTER_META: Record<string, { title: string; desc: string }> = {
  "maps-globes": {
    title: "Maps & Globes",
    desc: "Directions, symbols, scale, globes, and basic map reading.",
  },
  "continents-oceans": {
    title: "Continents & Oceans",
    desc: "Where places are on Earth and how to locate them.",
  },
  "weather-climate": {
    title: "Weather & Climate",
    desc: "Weather vs climate, seasons, rainfall, and temperature.",
  },
  landforms: {
    title: "Landforms",
    desc: "Mountains, plains, rivers, deserts, and how land changes.",
  },
  "water-world": {
    title: "Water on Earth",
    desc: "Rivers, lakes, oceans, water cycle, and water use.",
  },
  "natural-resources": {
    title: "Natural Resources",
    desc: "Types of resources, conservation, and responsible use.",
  },
  "population-settlements": {
    title: "People & Settlements",
    desc: "Where people live, cities vs villages, and basic population ideas.",
  },
  environment: {
    title: "Environment & Care for Earth",
    desc: "Pollution, recycling, and protecting nature.",
  },
};

export default async function GeographyChapterPage({
  params,
}: {
  params: Promise<{ chapterId: string }>;
}) {
  const { chapterId } = await params;

  const meta = CHAPTER_META[chapterId] ?? {
    title: "Chapter",
    desc: "Lesson content will be added soon.",
  };

  return (
    <main className="min-h-screen bg-white text-slate-900">
      <div className="mx-auto max-w-5xl px-4 py-12">
        <BackButton href={`/subjects/${SUBJECT_ID}/chapters`} label="Back to Chapters" />

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
