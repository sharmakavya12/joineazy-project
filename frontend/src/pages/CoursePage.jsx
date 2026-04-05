import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiFetch } from "../utils/api";

// ─── COURSE PAGE ─────────────────────────────────────────────────────────────
function CoursePage() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [code, setCode] = useState("");
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => { loadCourses(); }, []);

  const loadCourses = async () => {
    setLoading(true);
    try {
      const res = await apiFetch("/api/courses");
      if (res.success) setCourses(res.data.courses || []);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    setError(""); setMessage("");
    if (!title.trim() || !code.trim()) { setError("Title and code required."); return; }
    setCreating(true);
    const res = await apiFetch("/api/courses", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, code }),
    });
    if (res.success) {
      setTitle(""); setCode(""); setMessage("Course created."); loadCourses();
    } else {
      setError(res.message || res.error || "Unable to create course.");
    }
    setCreating(false);
  };

  if (loading) return <PageLoader />;

  return (
    <div className="min-h-screen bg-[#f0faf5] text-gray-900">
      {/* Hero header */}
      <div className="bg-linear-to-br from-[#1a6b4a] via-[#1e8a5e] to-[#3dd68c] px-4 pb-10 pt-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <button
            onClick={() => navigate(-1)}
            className="mb-6 inline-flex items-center gap-1.5 rounded-full border border-white/30 bg-white/10 px-4 py-1.5 text-sm font-medium text-white backdrop-blur-sm transition hover:bg-white/20"
          >
            ← Back
          </button>
          <h1 className="text-3xl font-extrabold tracking-tight text-white">Courses</h1>
          <p className="mt-2 text-sm text-white/70">View and manage course information.</p>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Create course form — professors only */}
        {user.role === "professor" && (
          <div className="mb-8 rounded-2xl border border-green-100 bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-bold text-gray-900">Create New Course</h3>

            {error && (
              <div className="mb-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
            )}
            {message && (
              <div className="mb-3 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">{message}</div>
            )}

            <div className="flex flex-col gap-3 md:flex-row">
              <input
                type="text"
                placeholder="Course Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="flex-1 rounded-xl border border-green-200 px-4 py-2.5 text-sm outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
              />
              <input
                type="text"
                placeholder="CODE"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                className="w-full rounded-xl border border-green-200 px-4 py-2.5 text-sm uppercase tracking-widest outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100 md:w-40"
              />
              <button
                onClick={handleCreate}
                disabled={creating}
                className="rounded-xl bg-linear-to-r from-[#1a6b4a] to-[#2da870] px-6 py-2.5 text-sm font-bold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {creating ? "Creating..." : "Create"}
              </button>
            </div>
          </div>
        )}

        {/* Course grid */}
        {courses.length === 0 ? (
          <div className="rounded-2xl border-2 border-dashed border-green-200 bg-white px-6 py-16 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-50">
              <svg className="h-6 w-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900">No courses found</h3>
            <p className="mt-2 text-sm text-gray-500">Courses will appear here once available.</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {courses.map((c) => (
              <div
                key={c._id}
                onClick={() => navigate(`/courses/${c._id}`)}
                className="cursor-pointer rounded-2xl border border-green-100 bg-white p-5 shadow-sm transition hover:shadow-md hover:border-green-300"
              >
                <div className="mb-3 flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-base font-semibold text-gray-900">{c.title}</h3>
                    <p className="mt-1 text-xs uppercase tracking-widest text-gray-400">{c.code}</p>
                  </div>
                  <span className="rounded-full bg-green-100 px-2.5 py-1 text-xs font-semibold text-green-700 whitespace-nowrap">
                    {c.students?.length || 0} students
                  </span>
                </div>
                <p className="text-sm text-gray-500">{c.assignments?.length || 0} assignments</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── HELPERS ──────────────────────────────────────────────────────────────────
function Badge({ color, children }) {
  const colors = {
    blue: "bg-green-100 text-green-700 border-green-200",
    purple: "bg-teal-100 text-teal-700 border-teal-200",
    green: "bg-green-100 text-green-700 border-green-200",
    red: "bg-red-100 text-red-700 border-red-200",
    yellow: "bg-amber-100 text-amber-700 border-amber-200",
  };
  return (
    <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${colors[color] || colors.blue}`}>
      {children}
    </span>
  );
}

function InfoItem({ label, value }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">{label}</p>
      <p className="mt-1 text-sm font-semibold text-gray-900">{value}</p>
    </div>
  );
}

function PageLoader() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f0faf5]">
      <div className="text-center">
        <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-green-100 border-t-[#1a6b4a]" />
        <p className="mt-4 text-sm font-medium text-green-700">Loading...</p>
      </div>
    </div>
  );
}

export default CoursePage;