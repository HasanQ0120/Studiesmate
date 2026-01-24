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
  message: string;
  page: string | null;
  screenshot_url: string | null;
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

export default function AdminFeedbackPage() {
  const router = useRouter();

  const [meEmail, setMeEmail] = useState<string>("");
  const [authChecked, setAuthChecked] = useState(false);
  const [rows, setRows] = useState<FeedbackRow[]>([]);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [limit, setLimit] = useState(30);

  const adminEmails = useMemo(() => getAdminEmails(), []);
  const isAdmin = useMemo(() => {
    if (!adminEmails.size) return false; // safer default
    return adminEmails.has((meEmail || "").toLowerCase());
  }, [adminEmails, meEmail]);

  useEffect(() => {
    async function loadMe() {
      const { data, error } = await supabase.auth.getUser();

      // Not logged in (or token error) -> send to login
      if (error || !data.user) {
        setAuthChecked(true);
        router.replace("/login");
        return;
      }

      setMeEmail((data.user.email || "").trim());
      setAuthChecked(true);
    }

    loadMe();
  }, [router]);

  // If logged in but not admin -> send to dashboard
  useEffect(() => {
    if (!authChecked) return;
    if (!isAdmin) {
      router.replace("/dashboard");
    }
  }, [authChecked, isAdmin, router]);

  useEffect(() => {
    if (!authChecked) return;
    if (!isAdmin) return;

    async function loadFeedback() {
      setStatus("loading");
      setError("");

      const { data, error } = await supabase
        .from("feedback")
        .select("id, created_at, user_email, student_name, message, page, screenshot_url")
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
  }, [authChecked, isAdmin]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return rows;

    return rows.filter((r) => {
      const hay = [
        r.user_email || "",
        r.student_name || "",
        r.message || "",
        r.page || "",
        r.screenshot_url || "",
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

  if (!isAdmin) {
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
              {visible.map((r) => (
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

                  <div className="mt-3 whitespace-pre-wrap text-sm text-gray-800">{r.message}</div>

                  <div className="mt-3 text-xs text-gray-400">ID: {r.id}</div>
                </div>
              ))}
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
