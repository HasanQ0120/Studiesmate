"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/auth";
import { CURRICULUM, SubjectKey } from "@/lib/curriculum";
import PageFade from "@/components/PageFade";

const TOPIC_URLS: Record<string, string> = {
  "intro-to-place-value": "/subjects/maths/chapters/numbers",
  "simple-sentences": "/subjects/english/chapters/english-intro",
  "habitats": "/subjects/science/chapters/science-intro",
};

const SUBJECT_EMOJI: Record<string, string> = {
  mathematics: "🧮",
  english: "📚",
  science: "🔬",
};

const SUBJECT_COLOR: Record<string, { bg: string; border: string; accent: string; light: string }> = {
  mathematics: { bg: "#EFF6FF", border: "#BFDBFE", accent: "#2563EB", light: "#DBEAFE" },
  english:     { bg: "#FFF7ED", border: "#FED7AA", accent: "#EA580C", light: "#FFEDD5" },
  science:     { bg: "#F0FDF4", border: "#BBF7D0", accent: "#16A34A", light: "#DCFCE7" },
};

function TopicRow({ topic, subjectKey }: { topic: { id: string; name: string; desc: string; status: string }; subjectKey: string }) {
  const url = TOPIC_URLS[topic.id];
  const isUnlocked = topic.status === "unlocked";
  const isLocked = topic.status === "locked-until-quiz";
  const isSoon = topic.status === "coming-soon";
  const colors = SUBJECT_COLOR[subjectKey] ?? SUBJECT_COLOR.mathematics;

  const inner = (
    <div style={{
      display: "flex",
      alignItems: "flex-start",
      gap: "12px",
      padding: "12px 16px",
      borderRadius: "10px",
      background: isUnlocked ? colors.light : isSoon ? "transparent" : "#F9FAFB",
      border: `1px solid ${isUnlocked ? colors.border : "#F3F4F6"}`,
      opacity: isSoon ? 0.5 : 1,
      cursor: isUnlocked ? "pointer" : "default",
      transition: "background 0.15s",
    }}>
      <div style={{ marginTop: "2px", flexShrink: 0 }}>
        {isUnlocked && <span style={{ fontSize: "16px" }}>▶</span>}
        {isLocked && <span style={{ fontSize: "15px" }}>🔒</span>}
        {isSoon && <span style={{ fontSize: "15px", color: "#D1D5DB" }}>○</span>}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
          <span style={{ fontSize: "14px", fontWeight: isUnlocked ? 600 : 500, color: isUnlocked ? colors.accent : isSoon ? "#9CA3AF" : "#374151" }}>
            {topic.name}
          </span>
          {isSoon && (
            <span style={{ fontSize: "11px", background: "#F3F4F6", color: "#9CA3AF", borderRadius: "999px", padding: "2px 8px", fontWeight: 600 }}>
              Coming Soon
            </span>
          )}
          {isLocked && (
            <span style={{ fontSize: "11px", background: "#FEF3C7", color: "#92400E", borderRadius: "999px", padding: "2px 8px", fontWeight: 600 }}>
              Quiz required
            </span>
          )}
        </div>
        <div style={{ fontSize: "12px", color: "#6B7280", marginTop: "2px" }}>{topic.desc}</div>
      </div>
    </div>
  );

  if (isUnlocked && url) {
    return <Link href={url} style={{ textDecoration: "none", display: "block" }}>{inner}</Link>;
  }
  return <div>{inner}</div>;
}

export default function SubjectPage() {
  const params = useParams();
  const router = useRouter();
  const subjectKey = (params.subject as string ?? "").toLowerCase();
  const subjectData = CURRICULUM[subjectKey as SubjectKey];

  const [loading, setLoading] = useState(true);
  const [openUnits, setOpenUnits] = useState<Set<string>>(
    new Set(subjectData?.units[0]?.id ? [subjectData.units[0].id] : [])
  );

  useEffect(() => {
    if (!subjectData) {
      router.replace("/classes");
      return;
    }
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) {
        router.replace("/");
        return;
      }
      setLoading(false);
    });
  }, [router, subjectData]);

  function toggleUnit(id: string) {
    setOpenUnits((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  if (!subjectData || loading) {
    return (
      <PageFade>
        <main className="min-h-screen bg-[#F9FAFB] flex items-center justify-center">
          <div style={{ width: 36, height: 36, border: "3px solid #E5E7EB", borderTopColor: "#22C55E", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </main>
      </PageFade>
    );
  }

  const emoji = SUBJECT_EMOJI[subjectKey] ?? "📖";
  const colors = SUBJECT_COLOR[subjectKey] ?? SUBJECT_COLOR.mathematics;
  const totalTopics = subjectData.units.reduce((sum, u) => sum + u.topics.length, 0);
  const unlockedTopics = subjectData.units.reduce(
    (sum, u) => sum + u.topics.filter((t) => t.status === "unlocked").length,
    0
  );

  return (
    <PageFade>
      <main className="min-h-screen bg-[#F9FAFB] pb-16">
        <div className="mx-auto max-w-3xl px-4 py-10">

          {/* Breadcrumb */}
          <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", color: "#9CA3AF", marginBottom: "20px" }}>
            <Link href="/classes" style={{ color: "#6B7280", textDecoration: "none" }}>Classes</Link>
            <span>›</span>
            <span style={{ color: "#111827", fontWeight: 500 }}>{subjectData.name}</span>
          </div>

          {/* Subject header */}
          <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "24px" }}>
            <div style={{ fontSize: "48px", lineHeight: 1 }}>{emoji}</div>
            <div>
              <h1 style={{ fontSize: "28px", fontWeight: 800, color: "#111827" }}>
                {subjectData.name}
              </h1>
              <p style={{ fontSize: "13px", color: "#6B7280", marginTop: "2px" }}>
                Grade 4 · {unlockedTopics} lesson{unlockedTopics !== 1 ? "s" : ""} available · {totalTopics} topics total
              </p>
            </div>
          </div>

          {/* Who is this for */}
          <div style={{ background: colors.bg, border: `1.5px solid ${colors.border}`, borderRadius: "14px", padding: "20px 24px", marginBottom: "32px" }}>
            <div style={{ fontSize: "11px", fontWeight: 700, color: colors.accent, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "8px" }}>
              Who is this for?
            </div>
            <p style={{ fontSize: "14px", color: "#374151", lineHeight: 1.65 }}>
              {subjectData.whoIsThisFor}
            </p>
          </div>

          {/* Unit accordion */}
          <h2 style={{ fontSize: "16px", fontWeight: 700, color: "#111827", marginBottom: "12px" }}>
            Course Outline
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {subjectData.units.map((unit) => {
              const isOpen = openUnits.has(unit.id);
              const availableCount = unit.topics.filter((t) => t.status === "unlocked").length;

              return (
                <div key={unit.id} style={{ background: "white", border: "1.5px solid #E5E7EB", borderRadius: "14px", overflow: "hidden" }}>
                  <button
                    type="button"
                    onClick={() => toggleUnit(unit.id)}
                    style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", background: "transparent", border: "none", cursor: "pointer", textAlign: "left" }}
                  >
                    <div>
                      <div style={{ fontSize: "15px", fontWeight: 700, color: "#111827" }}>{unit.name}</div>
                      <div style={{ fontSize: "12px", color: "#6B7280", marginTop: "2px" }}>{unit.topics.length} topics</div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", flexShrink: 0, marginLeft: "12px" }}>
                      {availableCount > 0 && (
                        <span style={{ fontSize: "11px", background: colors.light, color: colors.accent, borderRadius: "999px", padding: "3px 10px", fontWeight: 600, whiteSpace: "nowrap" }}>
                          {availableCount} available
                        </span>
                      )}
                      <span style={{ fontSize: "18px", color: "#9CA3AF", lineHeight: 1 }}>{isOpen ? "▲" : "▼"}</span>
                    </div>
                  </button>

                  {isOpen && (
                    <div style={{ padding: "0 16px 16px", display: "flex", flexDirection: "column", gap: "6px" }}>
                      {unit.topics.map((topic) => (
                        <TopicRow key={topic.id} topic={topic} subjectKey={subjectKey} />
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>
      </main>
    </PageFade>
  );
}
