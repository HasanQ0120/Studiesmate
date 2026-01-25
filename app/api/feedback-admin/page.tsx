"use client";

import { useEffect, useMemo, useState } from "react";

type FeedbackRow = {
  id?: string;
  created_at?: string;
  user_email?: string | null;
  student_name?: string | null;
  message?: string | null;
  page?: string | null;
  screenshot_url?: string | null;
};

export default function FeedbackAdminPage() {
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"locked" | "checking" | "open">("locked");
  const [error, setError] = useState("");

  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<FeedbackRow[]>([]);
  const [loadError, setLoadError] = useState("");

  const canUnlock = useMemo(() => password.trim().length >= 4, [password]);

  // Always lock on every refresh (your requirement)
  useEffect(() => {
    setStatus("locked");
    setItems([]);
    setError("");
    setLoadError("");
  }, []);

  async function verify() {
    if (!canUnlock) return;

    setStatus("checking");
    setError("");

    try {
      const res = await fetch("/api/feedback-admin/verify", {
        method: "POST",
        headers: {
          "x-admin-password": password.trim(),
        },
      });

      if (!res.ok) {
        setStatus("locked");
        setError("Wrong password.");
        return;
      }

      setStatus("open");
      await loadList(password.trim());
    } catch {
      setStatus("locked");
      setError("Could not verify. Please try again.");
    }
  }

  async function loadList(pass: string) {
    setLoading(true);
    setLoadError("");

    try {
      const res = await fetch("/api/feedback-admin/list", {
        headers: {
          "x-admin-password": pass,
        },
        cache: "no-store",
      });

      if (res.status === 401) {
        setStatus("locked");
        setError("Session locked. Enter password again.");
        setItems([]);
        return;
      }

      const json = await res.json();
      if (!res.ok) {
        setLoadError(json?.error || "Failed to load feedback.");
        return;
      }

      setItems(Array.isArray(json?.items) ? json.items : []);
    } catch {
      setLoadError("Failed to load feedback.");
    } finally {
      setLoading(false);
    }
  }

  function lockNow() {
    setStatus("locked");
    setPassword("");
    setItems([]);
    setError("");
    setLoadError("");
  }

  return (
    <main className="min-h-screen bg-white text-slate-900">
      <section className="mx-auto max-w-6xl px-4 py-14">
        <div className="mx-auto max-w-3xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="text-xl font-semibold tracking-tight">Feedback Admin</h1>
              <p className="mt-1 text-sm text-slate-600">
                Password required every time you open this page.
              </p>
            </div>

            {status === "open" && (
              <button
                type="button"
                onClick={lockNow}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50"
              >
                Lock
              </button>
            )}
          </div>

          {status !== "open" ? (
            <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <label className="text-sm font-medium text-slate-800">
                Admin password
              </label>

              <div className="mt-2 flex flex-wrap items-center gap-3">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") verify();
                  }}
                  placeholder="Enter password"
                  className="w-full max-w-sm rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-slate-200"
                />

                <button
                  type="button"
                  onClick={verify}
                  disabled={!canUnlock || status === "checking"}
                  className="rounded-xl bg-[#0B2B5A] px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
                >
                  {status === "checking" ? "Checking..." : "Continue →"}
                </button>
              </div>

              {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
            </div>
          ) : (
            <div className="mt-8">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="text-sm text-slate-700">
                  Total: <span className="font-semibold text-slate-900">{items.length}</span>
                </div>

                <button
                  type="button"
                  onClick={() => loadList(password.trim())}
                  disabled={loading}
                  className="rounded-xl bg-[#0B2B5A] px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
                >
                  {loading ? "Refreshing..." : "Refresh"}
                </button>
              </div>

              {loadError && <p className="mt-3 text-sm text-red-600">{loadError}</p>}

              <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200">
                <div className="max-h-[520px] overflow-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="sticky top-0 bg-slate-50">
                      <tr className="border-b border-slate-200">
                        <th className="p-3 font-semibold text-slate-800">Time</th>
                        <th className="p-3 font-semibold text-slate-800">Student</th>
                        <th className="p-3 font-semibold text-slate-800">Email</th>
                        <th className="p-3 font-semibold text-slate-800">Message</th>
                        <th className="p-3 font-semibold text-slate-800">Page</th>
                        <th className="p-3 font-semibold text-slate-800">Screenshot</th>
                      </tr>
                    </thead>

                    <tbody>
                      {items.length === 0 ? (
                        <tr>
                          <td className="p-4 text-slate-600" colSpan={6}>
                            No feedback yet.
                          </td>
                        </tr>
                      ) : (
                        items.map((r, idx) => (
                          <tr
                            key={r.id || `${r.created_at || "t"}-${idx}`}
                            className="border-b border-slate-100"
                          >
                            <td className="p-3 text-slate-700">
                              {r.created_at ? new Date(r.created_at).toLocaleString() : "-"}
                            </td>
                            <td className="p-3 text-slate-700">{r.student_name || "-"}</td>
                            <td className="p-3 text-slate-700">{r.user_email || "-"}</td>
                            <td className="p-3 text-slate-900">
                              {r.message || "-"}
                            </td>
                            <td className="p-3 text-slate-700">{r.page || "-"}</td>
                            <td className="p-3">
                              {r.screenshot_url ? (
                                <a
                                  href={r.screenshot_url}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="text-sm font-semibold text-[#0B2B5A] underline"
                                >
                                  View
                                </a>
                              ) : (
                                <span className="text-slate-500">-</span>
                              )}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
