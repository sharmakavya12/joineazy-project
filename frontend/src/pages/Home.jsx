import { useNavigate } from "react-router-dom";
import logo1 from "../assets/logo1.png";

export default function Home() {
  const navigate = useNavigate();

  const features = [
    {
      icon: "📋",
      title: "Assignment Management",
      desc: "Professors can create, edit, and track assignments with deadlines and OneDrive links.",
    },
    {
      icon: "👥",
      title: "Group Submissions",
      desc: "Form groups, assign leaders, and acknowledge submissions on behalf of the whole team.",
    },
    {
      icon: "📊",
      title: "Progress Analytics",
      desc: "Real-time submission tracking with progress bars and status badges for every assignment.",
    },
    {
      icon: "🔐",
      title: "Role-Based Access",
      desc: "Separate dashboards for students and professors with JWT-secured authentication.",
    },
    {
      icon: "🎓",
      title: "Course Enrollment",
      desc: "Students enroll in courses using a course code shared by their professor.",
    },
    {
      icon: "✅",
      title: "Submission Tracking",
      desc: "Individual and group acknowledgment flows with visual confirmation feedback.",
    },
  ];

  return (
    <div className="min-h-screen overflow-x-hidden bg-white text-gray-900">
      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 flex h-16 items-center justify-between border-b border-green-100 bg-white/90 px-4 backdrop-blur-xl sm:px-6 lg:px-10 shadow-sm">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-linear-to-br from-[#1a6b4a] to-[#2da870]  ">
            <img src={logo1} alt="Logo" className="h-6 w-6" />
          </div>
          <span className="text-lg font-medium tracking-tight text-gray-900">SGAMS</span>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => navigate("/auth")}
            className="rounded-full border border-green-300 bg-transparent px-5 py-2 text-sm font-semibold text-green-700 transition hover:bg-green-700 hover:text-white"
          >
            Login
          </button>
          <button
            onClick={() => navigate("/auth")}
            className="rounded-full bg-linear-to-br from-[#1a6b4a] to-[#2da870] px-5 py-2 text-sm font-semibold text-white shadow-md transition hover:-translate-y-0.5"
          >
            Get Started
          </button>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative flex flex-col items-center overflow-hidden bg-linear-to-br from-[#1a6b4a] via-[#1e8a5e] to-[#3dd68c] px-4 pb-24 pt-20 text-center sm:px-6 lg:px-10">
        {/* Decorative wave bottom */}
        <div className="pointer-events-none absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 40 C360 80 1080 0 1440 40 L1440 80 L0 80 Z" fill="white" />
          </svg>
        </div>

        {/* Subtle radial overlays */}
        <div className="pointer-events-none absolute right-[-5%] top-[20%] h-64 w-64 rounded-full bg-white/5" />
        <div className="pointer-events-none absolute bottom-[15%] left-[-5%] h-48 w-48 rounded-full bg-white/5" />

        <div className="relative mb-7 inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/15 px-4 py-1.5 text-sm font-semibold text-white backdrop-blur-sm">
          <span className="h-1.5 w-1.5 rounded-full bg-white" />
          Student & Group Assignment Management System
        </div>

        <h1 className="relative mb-6 max-w-4xl text-4xl  leading-tight tracking-tight text-white sm:text-5xl lg:text-7xl">
          Assignments,{" "}
          <span className="rounded-xl bg-white/20 px-3 py-1 text-white">
            simplified
          </span>{" "}
          for everyone
        </h1>

        <p className="relative mb-10 max-w-2xl text-base leading-8 text-white/80 sm:text-lg">
          A unified platform for professors to manage assignments and for students
          to submit, track progress, and collaborate in groups — all in one place.
        </p>

        <div className="relative flex flex-wrap justify-center gap-4">
          <button
            onClick={() => navigate("/auth")}
            className="flex items-center gap-2 rounded-full bg-white px-8 py-3.5 text-base font-bold text-[#1a6b4a] shadow-lg transition hover:-translate-y-0.5"
          >
            Get Started Free <span>→</span>
          </button>
          <button
            onClick={() => navigate("/auth")}
            className="rounded-full border border-white/30 bg-white/10 px-8 py-3.5 text-base font-semibold text-white backdrop-blur-sm transition hover:bg-white/20"
          >
            Login to Dashboard
          </button>
        </div>

        {/* Dashboard mockup */}
        <div className="relative mt-16 w-full max-w-4xl rounded-3xl border border-white/20 bg-white/10 p-6 shadow-2xl backdrop-blur-sm">
          <div className="mb-5 flex items-center gap-2">
            <div className="h-2.5 w-2.5 rounded-full bg-red-400" />
            <div className="h-2.5 w-2.5 rounded-full bg-amber-400" />
            <div className="h-2.5 w-2.5 rounded-full bg-green-300" />
            <div className="ml-2 h-6 flex-1 rounded-md bg-white/10" />
          </div>

          <div className="mb-5 grid grid-cols-2 gap-3 md:grid-cols-4">
            {[
              { label: "Courses", val: "6", color: "text-white", bg: "bg-white/20" },
              { label: "Assignments", val: "14", color: "text-white", bg: "bg-white/20" },
              { label: "Submitted", val: "11", color: "text-green-200", bg: "bg-white/15" },
              { label: "Pending", val: "3", color: "text-amber-200", bg: "bg-white/15" },
            ].map((s, i) => (
              <div key={i} className={`rounded-2xl ${s.bg} p-4`}>
                <div className={`text-2xl font-extrabold ${s.color}`}>{s.val}</div>
                <div className="mt-1 text-xs text-white/60">{s.label}</div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {[
              { title: "Data Structures Lab", type: "Individual", status: "Submitted", pct: 100, statusColor: "text-green-200", statusBg: "bg-green-500/30", bar: "from-green-300 to-green-200" },
              { title: "OS Assignment 3", type: "Group", status: "Pending", pct: 40, statusColor: "text-amber-200", statusBg: "bg-amber-500/30", bar: "from-white/60 to-white/40" },
            ].map((a, i) => (
              <div key={i} className="rounded-2xl bg-white/10 p-4">
                <div className="mb-3 flex items-start justify-between gap-3">
                  <div className="flex-1 text-sm font-bold text-white">{a.title}</div>
                  <span className={`rounded-md px-2 py-1 text-[10px] font-bold ${a.statusBg} ${a.statusColor}`}>
                    {a.status}
                  </span>
                </div>
                <div className="mb-3 text-xs text-white/50">
                  {a.type === "Group" ? "👥" : "👤"} {a.type}
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-white/15">
                  <div className={`h-full bg-linear-to-r ${a.bar} rounded-full`} style={{ width: `${a.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-10">
        <div className="mb-14 text-center">
          <div className="mb-4 inline-block rounded-full border border-green-200 bg-green-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-green-700">
            Features
          </div>
          <h2 className="mb-4 text-3xl font-medium tracking-tight text-gray-900 sm:text-4xl">
            Everything you need, nothing you don't
          </h2>
          <p className="mx-auto max-w-xl text-base text-gray-500">
            Built for academic workflows — clean, fast, and intuitive for both students and professors.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {features.map((f, i) => (
            <div
              key={i}
              className="rounded-2xl border border-green-100 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:border-green-300 hover:shadow-md"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-green-100 bg-linear-to-br from-[#e8f8f0] to-[#c6eedd] text-2xl">
                {f.icon}
              </div>
              <h3 className="mb-2 text-base font-bold text-gray-900">{f.title}</h3>
              <p className="text-sm leading-6 text-gray-500">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ROLES */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-10">
        <div className="grid gap-6 lg:grid-cols-2">
          {[
            {
              role: "For Students",
              icon: "🎓",
              gradient: "from-[#1a6b4a] to-[#2da870]",
              light: "bg-green-50 border-green-100",
              checkBg: "bg-green-100",
              checkColor: "text-green-700",
              points: [
                "View all enrolled courses and assignments",
                "Submit individual assignments with one click",
                "Form groups and let leaders acknowledge submissions",
                "Track your progress with real-time status badges",
              ],
            },
            {
              role: "For Professors",
              icon: "👨‍🏫",
              gradient: "from-[#0e7490] to-[#22d3ee]",
              light: "bg-teal-50 border-teal-100",
              checkBg: "bg-teal-100",
              checkColor: "text-teal-700",
              points: [
                "Create and manage courses with unique codes",
                "Create assignments with deadlines and OneDrive links",
                "Monitor submission rates with progress analytics",
                "View individual and group submission statuses",
              ],
            },
          ].map((r, i) => (
            <div key={i} className={`rounded-3xl border p-8 ${r.light}`}>
              <div className="mb-6 flex items-center gap-3">
                <div className={`flex h-11 w-11 items-center justify-center rounded-xl bg-linear-to-br ${r.gradient} text-2xl shadow-sm`}>
                  {r.icon}
                </div>
                <h3 className="text-2xl font-extrabold text-gray-900">{r.role}</h3>
              </div>
              <div className="flex flex-col gap-3">
                {r.points.map((p, j) => (
                  <div key={j} className="flex items-start gap-3">
                    <div className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] font-bold ${r.checkBg} ${r.checkColor}`}>
                      ✓
                    </div>
                    <span className="text-sm leading-6 text-gray-600">{p}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 py-20 sm:px-6 lg:px-10">
        <div className="relative mx-auto max-w-3xl overflow-hidden rounded-3xl bg-linear-to-br from-[#1a6b4a] to-[#3dd68c] px-6 py-14 text-center shadow-xl sm:px-10">
          <div className="pointer-events-none absolute left-1/2 top-0 h-48 w-64 -translate-x-1/2 rounded-full bg-white/10 blur-3xl" />
          <h2 className="relative mb-4 text-3xl font-medium tracking-tight text-white sm:text-4xl">
            Ready to get started?
          </h2>
          <p className="relative mb-9 text-base text-white/75">
            Join SGAMS today and take control of your academic assignments.
          </p>
          <div className="relative flex flex-wrap justify-center gap-4">
            <button
              onClick={() => navigate("/auth")}
              className="rounded-2xl bg-white px-9 py-3.5 text-base font-bold text-[#1a6b4a] shadow-lg transition hover:-translate-y-0.5"
            >
              Create Account →
            </button>
            <button
              onClick={() => navigate("/auth")}
              className="rounded-2xl border border-white/30 bg-white/15 px-9 py-3.5 text-base font-semibold text-white backdrop-blur-sm transition hover:bg-white/25"
            >
              Sign In
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="flex flex-wrap items-center justify-between gap-4 border-t border-green-100 bg-[#f0faf5] px-4 py-8 sm:px-6 lg:px-10">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-linear-to-br from-[#1a6b4a] to-[#2da870] text-sm">
            <img src={logo1} alt="Logo" className="h-6 w-6" />
          </div>
          <span className="text-sm font-medium text-gray-900">SGAMS</span>
        </div>
        <p className="text-sm text-gray-400">
          Student & Group Assignment Management System
        </p>
      </footer>
    </div>
  );
}