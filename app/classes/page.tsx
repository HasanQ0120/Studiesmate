"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/auth";
import PageFade from "@/components/PageFade";

type Profile = {
  student_name: string | null;
  current_streak: number | null;
  last_active_date: string | null;
  connect_code: string | null;
};

const SUBJECTS = [
  {
    key: "mathematics",
    name: "Mathematics",
    emoji: "🧮",
    desc: "Numbers, shapes, and problem-solving, from place value to fractions.",
    color: "#EFF6FF",
    border: "#BFDBFE",
    accent: "#2563EB",
    topics: 36,
    available: 1,
  },
  {
    key: "english",
    name: "English",
    emoji: "📚",
    desc: "Grammar, sentences, vocabulary, and the joy of reading clearly.",
    color: "#FFF7ED",
    border: "#FED7AA",
    accent: "#EA580C",
    topics: 29,
    available: 1,
  },
  {
    key: "science",
    name: "Science",
    emoji: "🔬",
    desc: "The human body, habitats, materials, sound, and electricity.",
    color: "#F0FDF4",
    border: "#BBF7D0",
    accent: "#16A34A",
    topics: 18,
    available: 1,
  },
];

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "Never";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

export default function ClassesPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [studentName, setStudentName] = useState("");
  const [loading, setLoading] = useState(true);
  const [codeVisible, setCodeVisible] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }) => {
      const session = data.session;
      if (!session) {
        router.replace("/");
        return;
      }

      const meta = session.user.user_metadata as Record<string, string>;
      setStudentName((meta?.studentName || meta?.full_name || "").trim());

      const { data: prof } = await supabase
        .from("profiles")
        .select("student_name, current_streak, last_active_date, connect_code")
        .eq("id", session.user.id)
        .maybeSingle();

      setProfile(prof ?? null);
      if (prof?.student_name) setStudentName(prof.student_name);
      setLoading(false);
    });
  }, [router]);

  if (loading) {
    return (
      <PageFade>
        <main className="min-h-screen bg-[#F9FAFB] pb-16">
          <div className="mx-auto max-w-5xl px-4 py-10">
            <div className="skeleton mb-10" style={{ height: 160, borderRadius: 20 }} />
            <div className="skeleton mb-4" style={{ height: 24, width: 140 }} />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 20 }}>
              <div className="skeleton" style={{ height: 200, borderRadius: 16 }} />
              <div className="skeleton" style={{ height: 200, borderRadius: 16 }} />
              <div className="skeleton" style={{ height: 200, borderRadius: 16 }} />
            </div>
          </div>
        </main>
      </PageFade>
    );
  }

  const firstName = (studentName || "Student").split(" ")[0];
  const streak = profile?.current_streak ?? 0;
  const lastActive = formatDate(profile?.last_active_date ?? null);
  const connectCode = profile?.connect_code ?? null;

  return (
    <PageFade>
      <main className="min-h-screen bg-[#F9FAFB] pb-16">
        <div className="mx-auto max-w-5xl px-4 py-10">

          {/* Summary strip */}
          <div style={{ background: "linear-gradient(135deg, #0B2B5A 0%, #1a4a8a 100%)", borderRadius: "20px", padding: "28px 32px", marginBottom: "40px", color: "white" }}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "24px", alignItems: "flex-start", justifyContent: "space-between" }}>
              <div>
                <h1 style={{ fontSize: "24px", fontWeight: 700, marginBottom: "4px" }}>
                  {"Welcome back, " + firstName + " 👋"}
                </h1>
                <p style={{ fontSize: "14px", color: "#93C5FD", marginBottom: "20px" }}>Grade 4 · Beta Access</p>

                <div style={{ display: "flex", gap: "24px", flexWrap: "wrap" }}>
                  <div>
                    <div style={{ fontSize: streak > 0 ? "26px" : "14px", fontWeight: 800, lineHeight: 1 }}>
                      {streak > 0 ? streak + " 🔥" : "Start today!"}
                    </div>
                    <div style={{ fontSize: "12px", color: "#93C5FD", marginTop: "4px" }}>Day streak</div>
                  </div>
                  <div>
                    <div style={{ fontSize: "14px", fontWeight: 600 }}>{lastActive}</div>
                    <div style={{ fontSize: "12px", color: "#93C5FD", marginTop: "4px" }}>Last active</div>
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "10px", minWidth: "180px" }}>
                <Link
                  href="/subjects/maths/chapters/numbers"
                  style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "6px", background: "#22C55E", color: "white", borderRadius: "9999px", padding: "10px 22px", fontWeight: 600, fontSize: "14px", textDecoration: "none" }}
                >
                  Resume Learning →
                </Link>

                {connectCode && (
                  <button
                    type="button"
                    onClick={() => setCodeVisible((v) => !v)}
                    style={{ background: "rgba(255,255,255,0.1)", color: "#E2E8F0", border: "1px solid rgba(255,255,255,0.2)", borderRadius: "9999px", padding: "8px 16px", fontSize: "13px", fontWeight: 500, cursor: "pointer" }}
                  >
                    {codeVisible ? "Hide" : "Show"} Connect Code
                  </button>
                )}

                {codeVisible && connectCode && (
                  <div style={{ background: "rgba(255,255,255,0.12)", borderRadius: "10px", padding: "10px 14px", textAlign: "center" }}>
                    <div style={{ fontSize: "11px", color: "#93C5FD", marginBottom: "4px" }}>Parent Connect Code</div>
                    <div style={{ fontSize: "20px", fontWeight: 800, letterSpacing: "2px" }}>{connectCode}</div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Subject cards */}
          <h2 style={{ fontSize: "20px", fontWeight: 700, color: "#111827", marginBottom: "16px" }}>Your Subjects</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "20px" }}>
            {SUBJECTS.map((s) => (
              <div
                key={s.key}
                style={{ background: s.color, border: `1.5px solid ${s.border}`, borderRadius: "16px", padding: "24px", display: "flex", flexDirection: "column" }}
              >
                <div style={{ fontSize: "36px", marginBottom: "12px" }}>{s.emoji}</div>
                <h3 style={{ fontSize: "18px", fontWeight: 700, color: "#111827", marginBottom: "6px" }}>{s.name}</h3>
                <p style={{ fontSize: "13px", color: "#6B7280", lineHeight: 1.5, marginBottom: "16px", flex: 1 }}>{s.desc}</p>

                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
                  <span style={{ fontSize: "12px", color: s.accent, fontWeight: 600 }}>
                    {s.available} lesson available
                  </span>
                  <span style={{ fontSize: "12px", color: "#9CA3AF" }}>
                    {s.topics} topics total
                  </span>
                </div>

                <Link
                  href={`/classes/${s.key}`}
                  style={{ display: "flex", alignItems: "center", justifyContent: "center", background: s.accent, color: "white", borderRadius: "10px", padding: "10px 16px", fontSize: "14px", fontWeight: 600, textDecoration: "none" }}
                >
                  View Subject →
                </Link>
              </div>
            ))}
          </div>

        </div>
      </main>
    </PageFade>
  );
}
