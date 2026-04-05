// import { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { apiFetch } from "../utils/api";

// export default function CourseDetail() {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [course, setCourse] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const user = JSON.parse(localStorage.getItem("user") || "{}");

//   useEffect(() => {
//     loadCourse();
//   }, [id]);

//   const loadCourse = async () => {
//     setLoading(true);
//     try {
//       const res = await apiFetch(`/api/courses/${id}`);
//       if (res.success) {
//         setCourse(res.data.course);
//         setError("");
//       } else {
//         setError(res.message || res.error || "Course not found");
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loading) return <PageLoader />;

//   if (error || !course) {
//     return (
//       <div className="min-h-screen bg-gray-50 px-4 py-10 text-gray-900">
//         <div className="mx-auto max-w-3xl rounded-xl border border-gray-200 bg-white p-8 text-center shadow-sm">
//           <h2 className="text-xl font-semibold">Course not found</h2>
//           <button
//             onClick={() => navigate(-1)}
//             className="mt-4 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
//           >
//             Go Back
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 px-4 py-8 text-gray-900 sm:px-6 lg:px-8">
//       <div className="mx-auto max-w-6xl">
//         <button
//           onClick={() => navigate(-1)}
//           className="mb-6 text-sm font-medium text-gray-500 transition hover:text-gray-700"
//         >
//           ← Back to Courses
//         </button>

//         <div className="mb-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
//           <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
//             <div>
//               <h1 className="text-3xl font-bold tracking-tight text-gray-900">
//                 {course.title}
//               </h1>
//               <p className="mt-2 text-sm font-medium uppercase tracking-[0.2em] text-blue-600">
//                 {course.code}
//               </p>
//             </div>

//             <div className="inline-flex rounded-full border border-green-200 bg-green-50 px-4 py-2 text-sm font-medium text-green-700">
//               {course.students?.length || 0} students enrolled
//             </div>
//           </div>

//           <div className="mt-6 flex flex-wrap gap-6 text-sm text-gray-600">
//             <span>{course.assignments?.length || 0} assignments</span>
//             {course.professor && <span>{course.professor.name}</span>}
//             {user?.role && <span>Role: {user.role}</span>}
//           </div>
//         </div>

//         {course.assignments?.length ? (
//           <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
//             {course.assignments.map((a) => (
//               <div
//                 key={a._id}
//                 className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
//               >
//                 <div className="mb-3 flex items-start justify-between gap-3">
//                   <h3 className="text-base font-semibold text-gray-900">
//                     {a.title}
//                   </h3>

//                   <span
//                     className={`rounded-full px-2.5 py-1 text-xs font-medium ${
//                       a.submissionType === "group"
//                         ? "bg-purple-50 text-purple-700"
//                         : "bg-blue-50 text-blue-700"
//                     }`}
//                   >
//                     {a.submissionType === "group" ? "Group" : "Individual"}
//                   </span>
//                 </div>

//                 <p className="mb-4 text-sm leading-6 text-gray-600">
//                   {a.description}
//                 </p>

//                 <div className="flex flex-wrap gap-4 text-sm text-gray-500">
//                   <span>{new Date(a.deadline).toLocaleDateString()}</span>
//                   {a.oneDriveLink && (
//                     <a
//                       href={a.oneDriveLink}
//                       target="_blank"
//                       rel="noreferrer"
//                       className="font-medium text-blue-600 hover:text-blue-700"
//                     >
//                       View Link
//                     </a>
//                   )}
//                 </div>

//                 <div className="mt-5">
//                   <button
//                     onClick={() => navigate(`/assignments/${a._id}`)}
//                     className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
//                   >
//                     Assignment Details
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         ) : (
//           <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center">
//             <h3 className="text-lg font-semibold text-gray-900">
//               No assignments yet
//             </h3>
//             <p className="mt-2 text-sm text-gray-500">
//               Assignments for this course will appear here.
//             </p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// function PageLoader() {
//   return (
//     <div className="flex min-h-screen items-center justify-center bg-gray-50">
//       <div className="text-center">
//         <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />
//         <p className="mt-4 text-sm text-gray-500">Loading...</p>
//       </div>
//     </div>
//   );
// }


import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiFetch } from "../utils/api";

export default function CourseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    loadCourse();
  }, [id]);

  const loadCourse = async () => {
    setLoading(true);
    try {
      const res = await apiFetch(`/api/courses/${id}`);
      if (res.success) {
        setCourse(res.data.course);
        setError("");
      } else {
        setError(res.message || res.error || "Course not found");
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <PageLoader />;

  if (error || !course) {
    return (
      <div className="min-h-screen bg-[#f0faf5] px-4 py-10 text-gray-900">
        <div className="mx-auto max-w-3xl rounded-2xl border border-green-100 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-50">
            <svg className="h-6 w-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900">Course not found</h2>
          <p className="mt-2 text-sm text-gray-500">This course may have been removed or you don't have access.</p>
          <button
            onClick={() => navigate(-1)}
            className="mt-6 rounded-xl border border-green-200 px-5 py-2.5 text-sm font-medium text-green-700 transition hover:bg-green-50"
          >
            ← Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f0faf5] text-gray-900">
      {/* Hero header */}
      <div className="bg-linear-to-br from-[#1a6b4a] via-[#1e8a5e] to-[#3dd68c] px-4 pb-10 pt-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <button
            onClick={() => navigate(-1)}
            className="mb-6 inline-flex items-center gap-1.5 rounded-full border border-white/30 bg-white/10 px-4 py-1.5 text-sm font-medium text-white backdrop-blur-sm transition hover:bg-white/20"
          >
            ← Back to Courses
          </button>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-green-200">
                {course.code}
              </p>
              <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                {course.title}
              </h1>
              <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-white/70">
                {course.professor && (
                  <span className="flex items-center gap-1.5">
                    <span className="text-base">👨‍🏫</span> {course.professor.name}
                  </span>
                )}
                {user?.role && (
                  <span className="rounded-full bg-white/15 px-3 py-0.5 text-xs font-medium capitalize text-white">
                    {user.role}
                  </span>
                )}
              </div>
            </div>

            <div className="flex shrink-0 flex-col gap-2 sm:items-end">
              <div className="rounded-2xl bg-white/15 px-5 py-3 text-center backdrop-blur-sm">
                <p className="text-2xl font-bold text-white">{course.students?.length || 0}</p>
                <p className="text-xs text-white/70">Students enrolled</p>
              </div>
              <div className="rounded-2xl bg-white/10 px-5 py-3 text-center backdrop-blur-sm">
                <p className="text-2xl font-bold text-white">{course.assignments?.length || 0}</p>
                <p className="text-xs text-white/70">Assignments</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Assignments grid */}
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        {course.assignments?.length ? (
          <>
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900">Assignments</h2>
              <p className="mt-1 text-sm text-gray-500">All assignments for this course.</p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {course.assignments.map((a) => (
                <div
                  key={a._id}
                  className="rounded-2xl border border-green-100 bg-white p-5 shadow-sm hover:shadow-md transition-shadow"
                >
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

                  <p className="mb-4 text-sm leading-6 text-gray-500">{a.description}</p>

                  <div className="mb-5 flex flex-wrap gap-2 text-xs">
                    <span className="rounded-full bg-gray-100 px-2.5 py-1 text-gray-600">
                      {new Date(a.deadline).toLocaleDateString()}
                    </span>
                    {a.oneDriveLink && (
                      <a
                        href={a.oneDriveLink}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-full border border-green-200 bg-green-50 px-2.5 py-1 font-semibold text-green-700 transition hover:bg-green-100"
                      >
                        View Link ↗
                      </a>
                    )}
                  </div>

                  <button
                    onClick={() => navigate(`/assignments/${a._id}`)}
                    className="w-full rounded-xl bg-linear-to-r from-[#1a6b4a] to-[#2da870] px-4 py-2.5 text-sm font-medium text-white transition hover:opacity-90"
                  >
                    Assignment Details
                  </button>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="rounded-2xl border-2 border-dashed border-green-200 bg-white px-6 py-16 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-50">
              <svg className="h-6 w-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900">No assignments yet</h3>
            <p className="mt-2 text-sm text-gray-500">Assignments for this course will appear here.</p>
          </div>
        )}
      </div>
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