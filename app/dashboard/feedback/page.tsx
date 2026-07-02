"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/auth";

type FeedbackRow = {
  id: string;
  created_at: string | null;
  user_email: string | null;
  student_name: string | null;
  message: string | null;
  comment: string | null;
  rating: number | null;
  selected_tags: string[] | null;
  page: string | null;
  screenshot_url: string | null;
};

type Props = {
  adminPassword?: string; // ✅ provided only when coming from /feedback-admin gate
};

function formatDate(input?: string | null) {
  if (!input) return "";
  const d = new Date(input);
  if (Number.isNaN(d.getTime())) return input;
  return d.toLocaleString();
}

function getAdminEmails(): Set<string> {
  const raw = (process.env.NEXT_PUBLIC_ADMIN_EMAILS || "").trim();
  if (!raw) return new Set();
  return new Set(
    raw
      .split(",")
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean)
  );
}

export default function AdminFeedbackPage({ adminPassword }: Props) {
  const router = useRouter();

  const isPasswordAdminRoute = Boolean(adminPassword);

  const [meEmail, setMeEmail] = useState<string>("");
  const [authChecked, setAuthChecked] = useState(false);

  const [rows, setRows] = useState<FeedbackRow[]>([]);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [limit, setLimit] = useState(30);

  const adminEmails = useMemo(() => getAdminEmails(), []);
  const isAdminByEmail = useMemo(() => {
    if (!adminEmails.size) return false;
    return adminEmails.has((meEmail || "").toLowerCase());
  }, [adminEmails, meEmail]);

  const isAllowed = useMemo(() => {
    if (isPasswordAdminRoute) return true;
    return isAdminByEmail;
  }, [isPasswordAdminRoute, isAdminByEmail]);

  // Auth check:
  // - Password route: no Supabase session needed
  // - Dashboard route: require Supabase session
  useEffect(() => {
    if (isPasswordAdminRoute) {
      setAuthChecked(true);
      return;
    }

    async function loadMe() {
      const { data, error } = await supabase.auth.getUser();

      if (error || !data.user) {
        setAuthChecked(true);
        router.replace("/");
        return;
      }

      setMeEmail((data.user.email || "").trim());
      setAuthChecked(true);
    }

    loadMe();
  }, [isPasswordAdminRoute, router]);

  // Redirect non-admin users ONLY for the dashboard route
  useEffect(() => {
    if (!authChecked) return;
    if (isPasswordAdminRoute) return;

    if (!isAllowed) {
      router.replace("/dashboard");
    }
  }, [authChecked, isAllowed, isPasswordAdminRoute, router]);

  // Load feedback
  useEffect(() => {
    if (!authChecked) return;
    if (!isAllowed) return;

    async function loadFeedback() {
      setStatus("loading");
      setError("");

      // ✅ Password-based admin route loads via API with header
      if (isPasswordAdminRoute) {
        try {
          const res = await fetch("/api/feedback-admin/list", {
            method: "GET",
            headers: {
              "x-admin-password": adminPassword || "",
            },
          });

          const json = await res.json().catch(() => null);

          if (!res.ok || !json?.ok) {
            setStatus("error");
            setError(json?.error || "Failed to load feedback.");
            return;
          }

          const apiRows = (json.rows || []) as FeedbackRow[];
          console.log("[FeedbackAdmin] API returned", apiRows.length, "rows");
          if (apiRows[0]) {
            const first = apiRows[0];
            console.log("[FeedbackAdmin] First row keys:", Object.keys(first));
            console.log("[FeedbackAdmin] First row rating:", first.rating, "| selected_tags:", first.selected_tags, "| comment:", first.comment);
          }
          setRows(apiRows);
          setStatus("idle");
          return;
        } catch (e: any) {
          setStatus("error");
          setError(e?.message || "Failed to load feedback.");
          return;
        }
      }

      // Existing dashboard-admin route keeps supabase fetch
      const { data, error } = await supabase
        .from("feedback")
        .select("id, created_at, user_email, student_name, message, comment, rating, selected_tags, page, screenshot_url")
        .order("created_at", { ascending: false })
        .limit(300);

      if (error) {
        setStatus("error");
        setError(error.message || "Failed to load feedback.");
        return;
      }

      setRows((data as FeedbackRow[]) || []);
      setStatus("idle");
    }

    loadFeedback();
  }, [authChecked, isAllowed, isPasswordAdminRoute, adminPassword]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return rows;

    return rows.filter((r) => {
      const hay = [
        r.user_email || "",
        r.student_name || "",
        r.message || "",
        r.comment || "",
        r.page || "",
        r.screenshot_url || "",
        Array.isArray(r.selected_tags) ? r.selected_tags.join(" ") : "",
        r.rating != null ? String(r.rating) : "",
      ]
        .join(" ")
        .toLowerCase();

      return hay.includes(q);
    });
  }, [rows, query]);

  const visible = useMemo(() => filtered.slice(0, limit), [filtered, limit]);

  if (!authChecked) {
    return (
      <div className="min-h-screen bg-white px-6 py-10">
        <div className="mx-auto max-w-6xl">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="text-sm text-gray-600">Checking access…</div>
          </div>
        </div>
      </div>
    );
  }

  if (!isAllowed) {
    return (
      <div className="min-h-screen bg-white px-6 py-10">
        <div className="mx-auto max-w-6xl">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="text-sm text-gray-600">Redirecting…</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white px-6 py-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Feedback (Admin)</h1>
            <p className="mt-1 text-sm text-gray-600">
              View feedback submitted from the app, including optional screenshots.
            </p>
          </div>

          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-50"
          >
            ← Back to Dashboard
          </Link>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="w-full sm:max-w-md">
              <label className="text-xs font-semibold text-gray-700">Search</label>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by email, name, message, page…"
                className="mt-1 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-gray-200"
              />
            </div>

            <div className="text-xs text-gray-500">
              Showing <span className="font-semibold text-gray-700">{visible.length}</span> of{" "}
              <span className="font-semibold text-gray-700">{filtered.length}</span>
            </div>
          </div>

          {status === "error" && (
            <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {status === "loading" ? (
            <div className="mt-5 text-sm text-gray-600">Loading feedback…</div>
          ) : visible.length === 0 ? (
            <div className="mt-5 rounded-xl bg-gray-50 p-4 text-sm text-gray-600">
              No feedback found.
            </div>
          ) : (
            <div className="mt-5 space-y-4">
              {visible.map((r) => {
                console.log(`[FeedbackAdmin] Row ${r.id?.slice(0,8)} — rating:`, r.rating, "| tags:", r.selected_tags, "| comment:", r.comment);
                return (
                <div key={r.id} className="rounded-xl border border-gray-200 bg-white p-4">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <div className="text-sm font-semibold text-gray-900">
                        {r.student_name || "Unknown student"}
                      </div>
                      <div className="mt-1 text-xs text-gray-600">
                        {r.user_email || "No email"} {r.page ? <span>• {r.page}</span> : null}
                        {r.created_at ? <span> • {formatDate(r.created_at)}</span> : null}
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      {r.screenshot_url ? (
                        <a
                          href={r.screenshot_url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center justify-center rounded-xl bg-[#0B2B5A] px-3 py-2 text-xs font-semibold text-white hover:bg-[#0A2550]"
                        >
                          View screenshot
                        </a>
                      ) : (
                        <span className="text-xs text-gray-400">No screenshot</span>
                      )}
                    </div>
                  </div>

                  {r.rating != null && (
                    <div className="mt-3 flex items-center gap-1">
                      {[1,2,3,4,5].map((s) => (
                        <span key={s} style={{ color: r.rating! >= s ? "#F97316" : "#D1D5DB", fontSize: "16px" }}>★</span>
                      ))}
                      <span className="ml-1 text-xs text-gray-500">{r.rating}/5</span>
                    </div>
                  )}
                  {Array.isArray(r.selected_tags) && r.selected_tags.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {r.selected_tags.map((tag) => (
                        <span key={tag} className="rounded-full border border-gray-200 bg-gray-50 px-2 py-0.5 text-xs text-gray-600">{tag}</span>
                      ))}
                    </div>
                  )}
                  {(r.comment || r.message) && (
                    <div className="mt-3 whitespace-pre-wrap text-sm text-gray-800">{r.comment || r.message}</div>
                  )}

                  <div className="mt-3 text-xs text-gray-400">ID: {r.id}</div>
                </div>
                );
              })}
            </div>
          )}

          {filtered.length > visible.length && (
            <div className="mt-5">
              <button
                type="button"
                onClick={() => setLimit((n) => n + 30)}
                className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-50"
              >
                Load more
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
