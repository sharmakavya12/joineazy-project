import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../utils/api";
import logo1 from "../assets/logo1.png";

function emptyForm() {
  return {
    title: "", description: "", deadline: "",
    oneDriveLink: "", submissionType: "individual", course: "", _id: "",
  };
}

function ProfessorDashboard() {
  const navigate = useNavigate();
  const [overview, setOverview] = useState({});
  const [assignmentStats, setAssignmentStats] = useState([]);
  const [recentSubmissions, setRecentSubmissions] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("assignments");
  const [searchTerm, setSearchTerm] = useState("");
  const [modal, setModal] = useState(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [formData, setFormData] = useState(emptyForm());
  const [errors, setErrors] = useState({});
  const [courseForm, setCourseForm] = useState({ title: "", code: "" });
  const [courseError, setCourseError] = useState("");

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const titleRef = useRef(null);

  useEffect(() => {
    if (!user || user.role !== "professor") { navigate("/"); return; }
    fetchAll();
  }, []);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [dashRes, assignRes, courseRes] = await Promise.all([
        apiFetch("/api/professor/dashboard"),
        apiFetch("/api/assignments"),
        apiFetch("/api/courses"),
      ]);
      if (dashRes.success) {
        setOverview(dashRes.data.overview || {});
        setAssignmentStats(dashRes.data.assignmentStats || []);
        setRecentSubmissions(dashRes.data.recentSubmissions || []);
      }
      if (assignRes.success) setAssignments(assignRes.data?.assignments || []);
      if (courseRes.success) setCourses(courseRes.data?.courses || []);
    } finally {
      setLoading(false);
    }
  };

  const validate = () => {
    const e = {};
    if (!formData.title.trim()) e.title = "Required";
    if (!formData.description.trim()) e.description = "Required";
    if (!formData.deadline) e.deadline = "Required";
    if (!formData.course) e.course = "Required";
    setErrors(e);
    if (e.title) titleRef.current?.focus();
    return Object.keys(e).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setSaving(true);
    const endpoint = formData._id ? `/api/assignments/${formData._id}` : "/api/assignments";
    const res = await apiFetch(endpoint, {
      method: formData._id ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: formData.title.trim(), description: formData.description.trim(),
        deadline: formData.deadline, oneDriveLink: formData.oneDriveLink.trim(),
        submissionType: formData.submissionType, course: formData.course,
      }),
    });
    if (res.success) {
      setMessage({ text: formData._id ? "Assignment updated." : "Assignment created.", type: "success" });
      setModal(null); setFormData(emptyForm()); fetchAll();
    } else {
      setMessage({ text: res.message || res.error || "Unable to save assignment.", type: "error" });
    }
    setSaving(false);
  };

  const handleEdit = (a) => {
    setFormData({
      title: a.title || "", description: a.description || "",
      deadline: a.deadline ? new Date(a.deadline).toISOString().split("T")[0] : "",
      oneDriveLink: a.oneDriveLink || "",
      submissionType: a.submissionType || "individual",
      course: typeof a.course === "object" ? a.course?._id || "" : a.course || "",
      _id: a._id,
    });
    setErrors({}); setModal("edit");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this assignment?")) return;
    const res = await apiFetch(`/api/assignments/${id}`, { method: "DELETE" });
    if (res.success) { setMessage({ text: "Assignment deleted.", type: "success" }); fetchAll(); }
    else setMessage({ text: res.message || res.error || "Unable to delete.", type: "error" });
  };

  const handleCreateCourse = async () => {
    setCourseError("");
    if (!courseForm.title.trim() || !courseForm.code.trim()) { setCourseError("Title and code are required."); return; }
    const res = await apiFetch("/api/courses", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify(courseForm),
    });
    if (res.success) {
      setModal(null); setCourseForm({ title: "", code: "" });
      fetchAll(); setMessage({ text: "Course created.", type: "success" });
    } else {
      setCourseError(res.message || res.error || "Unable to create course.");
    }
  };

  const filtered = assignments.filter((a) => {
    const q = searchTerm.toLowerCase();
    return a.title?.toLowerCase().includes(q) || a.course?.title?.toLowerCase().includes(q);
  });

  if (loading) return <Loader />;

  const tabs = [
    { id: "assignments", label: "Assignments" },
    { id: "courses", label: "Courses" },
    { id: "analytics", label: "Analytics" },
    { id: "submissions", label: "Recent Submissions" },
  ];

  return (
    <div className="min-h-screen bg-[#f0faf5] text-gray-900">
      {/* HEADER */}
      <header className="sticky top-0 z-40 bg-linear-to-r from-[#1a6b4a] to-[#2da870] shadow-md">
        <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-lg">
              <img src={logo1} alt="Logo" className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-base font-semibold text-white leading-tight">Professor Dashboard</h1>
              <p className="text-xs text-green-200">{user.name || "Professor"}</p>
            </div>
          </div>
          <button
            onClick={() => { localStorage.clear(); navigate("/auth"); }}
            className="rounded-full border border-white/30 bg-white/10 px-4 py-1.5 text-sm font-medium text-white transition hover:bg-white hover:text-[#1a6b4a]"
          >
            Logout
          </button>
        </div>
      </header>

      <div className="flex min-h-[calc(100vh-64px)]">
        {/* SIDEBAR */}
        <aside className="hidden w-64 shrink-0 border-r border-green-100 bg-white lg:flex lg:flex-col">
          <div className="flex-1 p-4 pt-6">
            <p className="mb-3 px-3 text-[11px] font-semibold uppercase tracking-widest text-green-600">
              Navigation
            </p>
            <nav className="space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full rounded-xl px-4 py-2.5 text-left text-sm font-medium transition ${
                    activeTab === tab.id
                      ? "bg-linear-to-r from-[#1a6b4a] to-[#2da870] text-white shadow-sm"
                      : "text-gray-600 hover:bg-green-50 hover:text-green-800"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>

            <div className="mt-6 space-y-2 border-t border-green-100 pt-6">
              <button
                onClick={() => { setFormData(emptyForm()); setErrors({}); setModal("create"); }}
                className="w-full rounded-xl bg-linear-to-r from-[#1a6b4a] to-[#2da870] px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:opacity-90"
              >
                + New Assignment
              </button>
              <button
                onClick={() => setModal("course")}
                className="w-full rounded-xl border border-green-200 bg-white px-4 py-2.5 text-sm font-medium text-green-700 transition hover:bg-green-50"
              >
                + New Course
              </button>
            </div>
          </div>
        </aside>

        {/* MAIN */}
        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
          {/* Mobile tabs */}
          <div className="mb-4 flex flex-wrap gap-2 lg:hidden">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  activeTab === tab.id
                    ? "bg-linear-to-r from-[#1a6b4a] to-[#2da870] text-white shadow-sm"
                    : "bg-white text-gray-600 border border-green-200 hover:border-green-400"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <div className="mb-6 flex flex-wrap gap-2 lg:hidden">
            <button
              onClick={() => { setFormData(emptyForm()); setErrors({}); setModal("create"); }}
              className="rounded-xl bg-linear-to-r from-[#1a6b4a] to-[#2da870] px-4 py-2 text-sm font-medium text-white"
            >
              + New Assignment
            </button>
            <button
              onClick={() => setModal("course")}
              className="rounded-xl border border-green-200 bg-white px-4 py-2 text-sm font-medium text-green-700"
            >
              + New Course
            </button>
          </div>

          {/* Message */}
          {message.text && (
            <div className={`mb-6 rounded-xl border px-4 py-3 text-sm ${
              message.type === "error"
                ? "border-red-200 bg-red-50 text-red-700"
                : "border-green-200 bg-green-50 text-green-700"
            }`}>
              {message.text}
            </div>
          )}

          {/* Stat cards */}
          <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
            {[
              { label: "Courses", value: overview.totalCourses || 0, color: "from-[#1a6b4a] to-[#2da870]" },
              { label: "Assignments", value: overview.totalAssignments || 0, color: "from-[#0e7490] to-[#22d3ee]" },
              { label: "Students", value: overview.totalStudents || 0, color: "from-[#166534] to-[#4ade80]" },
              { label: "Groups", value: overview.totalGroups || 0, color: "from-[#854d0e] to-[#fbbf24]" },
            ].map((card, i) => (
              <div key={i} className={`rounded-2xl bg-linear-to-br ${card.color} p-4 text-white shadow-sm`}>
                <p className="text-xs font-medium text-white/80">{card.label}</p>
                <h3 className="mt-2 text-3xl font-bold">{card.value}</h3>
              </div>
            ))}
          </div>

          {/* ASSIGNMENTS TAB */}
          {activeTab === "assignments" && (
            <div>
              <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Assignments</h2>
                  <p className="mt-1 text-sm text-gray-500">Manage and track all assignment activity.</p>
                </div>
                <input
                  type="text"
                  placeholder="Search assignments..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full rounded-full border border-green-400 px-4 py-2.5 text-sm outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100 sm:w-64"
                />
              </div>

              {filtered.length === 0 ? (
                <EmptyState
                  title="No assignments"
                  desc="Create your first assignment to get started."
                  action={() => { setFormData(emptyForm()); setErrors({}); setModal("create"); }}
                  actionLabel="Create Assignment"
                />
              ) : (
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {filtered.map((a) => {
                    const stat = assignmentStats.find((s) => s.assignmentId?.toString() === a._id?.toString());
                    const submitted = stat?.submittedStudents || stat?.submittedGroups || 0;
                    const total = stat?.enrolledStudents || stat?.totalGroups || 0;
                    const pct = total ? Math.round((submitted / total) * 100) : 0;

                    return (
                      <div key={a._id} className="rounded-2xl border border-green-100 bg-white p-5 shadow-sm hover:shadow-md transition-shadow">
                        <div className="mb-3 flex items-start justify-between gap-3">
                          <h3 className="text-base font-semibold text-gray-900">{a.title}</h3>
                          <span className={`rounded-full px-2.5 py-1 text-xs font-semibold whitespace-nowrap ${
                            a.submissionType === "group"
                              ? "bg-teal-100 text-teal-700"
                              : "bg-green-100 text-green-700"
                          }`}>
                            {a.submissionType === "group" ? "Group" : "Individual"}
                          </span>
                        </div>

                        <p className="mb-4 text-sm leading-6 text-gray-500">
                          {a.description?.slice(0, 90)}{a.description?.length > 90 ? "..." : ""}
                        </p>

                        <div className="mb-4 flex flex-wrap gap-2 text-xs">
                          <span className="rounded-full bg-gray-100 px-2.5 py-1 text-gray-600">
                            {a.course?.title || "No course"}
                          </span>
                          <span className="rounded-full bg-gray-100 px-2.5 py-1 text-gray-600">
                            {a.deadline ? new Date(a.deadline).toLocaleDateString() : "No deadline"}
                          </span>
                        </div>

                        {total > 0 && (
                          <div className="mb-4">
                            <div className="mb-1.5 flex items-center justify-between text-xs text-gray-500">
                              <span>Submissions</span>
                              <span>{submitted}/{total} ({pct}%)</span>
                            </div>
                            <div className="h-2 w-full overflow-hidden rounded-full bg-green-50 border border-green-100">
                              <div
                                className="h-full rounded-full bg-linear-to-r from-[#1a6b4a] to-[#2da870] transition-all"
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                          </div>
                        )}

                        <div className="flex flex-wrap gap-2">
                          {a.oneDriveLink && (
                            <a
                              href={a.oneDriveLink}
                              target="_blank"
                              rel="noreferrer"
                              className="rounded-xl border border-green-200 bg-green-50 px-3 py-2 text-xs font-semibold text-green-700 transition hover:bg-green-100"
                            >
                              View
                            </a>
                          )}
                          <button
                            onClick={() => handleEdit(a)}
                            className="rounded-xl border border-green-200 px-3 py-2 text-xs font-semibold text-green-700 transition hover:bg-green-50"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(a._id)}
                            className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-100"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* COURSES TAB */}
          {activeTab === "courses" && (
            <div>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900">My Courses</h2>
                <p className="mt-1 text-sm text-gray-500">View all courses you manage.</p>
              </div>
              {courses.length === 0 ? (
                <EmptyState title="No courses" desc="Create a course to get started." action={() => setModal("course")} actionLabel="Create Course" />
              ) : (
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {courses.map((c) => (
                    <div key={c._id} className="rounded-2xl border border-green-100 bg-white p-5 shadow-sm">
                      <div className="mb-3 flex items-start justify-between gap-3">
                        <div>
                          <h3 className="text-base font-semibold text-gray-900">{c.title}</h3>
                          <p className="mt-1 text-xs uppercase tracking-widest text-gray-400">{c.code}</p>
                        </div>
                        <span className="rounded-full bg-green-100 px-2.5 py-1 text-xs font-semibold text-green-700">
                          {c.students?.length || 0} students
                        </span>
                      </div>
                      <p className="text-sm text-gray-500">{c.assignments?.length || 0} assignments</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ANALYTICS TAB */}
          {activeTab === "analytics" && (
            <div>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Assignment Analytics</h2>
                <p className="mt-1 text-sm text-gray-500">Monitor assignment submission rates.</p>
              </div>
              {assignmentStats.length === 0 ? (
                <EmptyState title="No data yet" desc="Create assignments to see analytics." />
              ) : (
                <div className="space-y-4">
                  {assignmentStats.map((stat, i) => {
                    const submitted = stat.submittedStudents ?? stat.submittedGroups ?? 0;
                    const total = stat.enrolledStudents ?? stat.totalGroups ?? 0;
                    const pending = stat.pendingStudents ?? stat.pendingGroups ?? 0;
                    const pct = total ? Math.round((submitted / total) * 100) : 0;

                    return (
                      <div key={i} className="rounded-2xl border border-green-100 bg-white p-5 shadow-sm">
                        <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                          <div>
                            <h3 className="text-base font-semibold text-gray-900">{stat.title}</h3>
                            <p className="mt-1 text-sm text-gray-500">
                              {stat.submissionType === "group" ? "Group" : "Individual"} •{" "}
                              {stat.deadline ? new Date(stat.deadline).toLocaleDateString() : "No deadline"}
                            </p>
                          </div>
                          <div className="flex gap-6">
                            <div className="text-center">
                              <p className="text-2xl font-bold text-green-600">{submitted}</p>
                              <p className="text-xs text-gray-500">Submitted</p>
                            </div>
                            <div className="text-center">
                              <p className="text-2xl font-bold text-amber-500">{pending}</p>
                              <p className="text-xs text-gray-500">Pending</p>
                            </div>
                          </div>
                        </div>
                        <div className="h-2 w-full overflow-hidden rounded-full bg-green-50 border border-green-100">
                          <div
                            className="h-full rounded-full bg-linear-to-r from-[#1a6b4a] to-[#2da870] transition-all"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <p className="mt-2 text-sm text-gray-500">{pct}% submission rate</p>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* SUBMISSIONS TAB */}
          {activeTab === "submissions" && (
            <div>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Recent Submissions</h2>
                <p className="mt-1 text-sm text-gray-500">Latest confirmed student and group submissions.</p>
              </div>
              {recentSubmissions.length === 0 ? (
                <EmptyState title="No submissions yet" desc="Student submissions will appear here." />
              ) : (
                <div className="space-y-3">
                  {recentSubmissions.map((s, i) => (
                    <div key={i} className="flex items-center gap-4 rounded-2xl border border-green-100 bg-white p-4 shadow-sm">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-[#1a6b4a] to-[#2da870] text-sm font-bold text-white">
                        {s.studentId?.name?.[0]?.toUpperCase() || "?"}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-gray-900">
                          {s.studentId?.name || "Unknown"}
                          {s.groupId && <span className="font-normal text-gray-500"> • {s.groupId.name}</span>}
                        </p>
                        <p className="truncate text-sm text-gray-500">{s.assignmentId?.title}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-green-600">✓ Confirmed</p>
                        <p className="text-xs text-gray-400">
                          {s.confirmedAt ? new Date(s.confirmedAt).toLocaleDateString() : "–"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {/* ASSIGNMENT MODAL */}
      {(modal === "create" || modal === "edit") && (
        <Modal onClose={() => setModal(null)} title={modal === "edit" ? "Edit Assignment" : "New Assignment"}>
          <div className="space-y-4">
            <MField label="Title" error={errors.title}>
              <input ref={titleRef} type="text" placeholder="Assignment title" value={formData.title}
                onChange={(e) => { setFormData({ ...formData, title: e.target.value }); setErrors({ ...errors, title: "" }); }}
                className={inputClass(errors.title)} />
            </MField>
            <MField label="Description" error={errors.description}>
              <textarea rows={3} placeholder="Describe the assignment..." value={formData.description}
                onChange={(e) => { setFormData({ ...formData, description: e.target.value }); setErrors({ ...errors, description: "" }); }}
                className={`${inputClass(errors.description)} resize-y`} />
            </MField>
            <MField label="Course" error={errors.course}>
              <select value={formData.course}
                onChange={(e) => { setFormData({ ...formData, course: e.target.value }); setErrors({ ...errors, course: "" }); }}
                className={inputClass(errors.course)}>
                <option value="">Select course</option>
                {courses.map((c) => <option key={c._id} value={c._id}>{c.title} ({c.code})</option>)}
              </select>
            </MField>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <MField label="Deadline" error={errors.deadline}>
                <input type="date" value={formData.deadline}
                  onChange={(e) => { setFormData({ ...formData, deadline: e.target.value }); setErrors({ ...errors, deadline: "" }); }}
                  className={inputClass(errors.deadline)} />
              </MField>
              <MField label="Type">
                <select value={formData.submissionType}
                  onChange={(e) => setFormData({ ...formData, submissionType: e.target.value })}
                  className={inputClass()}>
                  <option value="individual">Individual</option>
                  <option value="group">Group</option>
                </select>
              </MField>
            </div>
            <MField label="OneDrive Link (optional)">
              <input type="url" placeholder="https://onedrive.live.com/..." value={formData.oneDriveLink}
                onChange={(e) => setFormData({ ...formData, oneDriveLink: e.target.value })}
                className={inputClass()} />
            </MField>
            <button onClick={handleSave} disabled={saving}
              className="w-full rounded-xl bg-linear-to-r from-[#1a6b4a] to-[#2da870] px-4 py-2.5 text-sm font-bold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60">
              {saving ? "Saving..." : modal === "edit" ? "Update Assignment" : "Create Assignment"}
            </button>
          </div>
        </Modal>
      )}

      {/* COURSE MODAL */}
      {modal === "course" && (
        <Modal onClose={() => setModal(null)} title="New Course">
          {courseError && (
            <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{courseError}</div>
          )}
          <div className="space-y-4">
            <MField label="Course Title">
              <input type="text" placeholder="Introduction to Computer Science" value={courseForm.title}
                onChange={(e) => setCourseForm({ ...courseForm, title: e.target.value })}
                className={inputClass()} />
            </MField>
            <MField label="Course Code">
              <input type="text" placeholder="CS101" value={courseForm.code}
                onChange={(e) => setCourseForm({ ...courseForm, code: e.target.value.toUpperCase() })}
                className={`${inputClass()} uppercase tracking-widest`} />
            </MField>
            <button onClick={handleCreateCourse}
              className="w-full rounded-xl bg-linear-to-r from-[#1a6b4a] to-[#2da870] px-4 py-2.5 text-sm font-bold text-white transition hover:opacity-90">
              Create Course
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

function Modal({ onClose, title, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4" onClick={onClose}>
      <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="mb-5 flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-900">{title}</h3>
          <button onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 transition text-lg leading-none">
            ×
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function MField({ label, error, children }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-gray-700">{label}</label>
      {children}
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}

function inputClass(hasError) {
  return `w-full rounded-xl border px-4 py-2.5 text-sm text-gray-900 outline-none transition focus:ring-2 ${
    hasError
      ? "border-red-400 focus:border-red-500 focus:ring-red-100"
      : "border-green-200 focus:border-green-500 focus:ring-green-100"
  }`;
}

function EmptyState({ title, desc, action, actionLabel }) {
  return (
    <div className="rounded-2xl border-2 border-dashed border-green-200 bg-white px-6 py-16 text-center">
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-50">
        <svg className="h-6 w-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
        </svg>
      </div>
      <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      <p className="mt-2 text-sm text-gray-500">{desc}</p>
      {action && (
        <button onClick={action}
          className="mt-6 rounded-xl bg-gradient-to-r from-[#1a6b4a] to-[#2da870] px-5 py-2.5 text-sm font-medium text-white transition hover:opacity-90">
          {actionLabel}
        </button>
      )}
    </div>
  );
}

function Loader() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f0faf5]">
      <div className="text-center">
        <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-green-100 border-t-[#1a6b4a]" />
        <p className="mt-4 text-sm font-medium text-green-700">Loading...</p>
      </div>
    </div>
  );
}

export default ProfessorDashboard;