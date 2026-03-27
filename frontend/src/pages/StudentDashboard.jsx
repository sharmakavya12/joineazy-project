
// import { useState, useEffect } from "react";
// import { apiFetch } from "../utils/api";
// import { useNavigate } from "react-router-dom";

// function StudentDashboard() {
//   const navigate = useNavigate();
//   const [assignments, setAssignments] = useState([]);
//   const [group, setGroup] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [groupName, setGroupName] = useState("");
//   const [members, setMembers] = useState("");
//   const [submitting, setSubmitting] = useState(null);

//   const token = localStorage.getItem("token");

//   const fetchAssignments = async () => {
//     try {
//       const { data, res } = await apiFetch("/api/assignments");
//       if (res.ok && Array.isArray(data)) {
//         setAssignments(data.map(a => ({ ...a, status: "pending" })));
//       }
//     } catch {}
//   };

//   const fetchGroup = async () => {
//     try {
//       const { data } = await apiFetch("/api/groups/my-group");
//       setGroup(data);
//     } catch {}
//   };

//   useEffect(() => {
//     if (!token) return navigate("/auth");

//     const load = async () => {
//       setLoading(true);
//       await Promise.all([fetchAssignments(), fetchGroup()]);
//       setLoading(false);
//     };

//     load();
//   }, [token, navigate]);

//   const handleCreateGroup = async (e) => {
//     e.preventDefault();
//     const memberEmails = members.split(",").map(m => m.trim()).filter(Boolean);

//     try {
//       const { res } = await apiFetch("/api/groups/create", {
//         method: "POST",
//         body: JSON.stringify({ name: groupName, members: memberEmails }),
//       });

//       if (res.ok) {
//         setGroupName("");
//         setMembers("");
//         fetchGroup();
//       }
//     } catch {}
//   };

//   const handleSubmit = async (id) => {
//     if (!group) return;

//     setSubmitting(id);

//     try {
//       const { res } = await apiFetch("/api/submissions/confirm", {
//         method: "POST",
//         body: JSON.stringify({ groupId: group._id, assignmentId: id }),
//       });

//       if (res.ok) {
//         setAssignments(prev =>
//           prev.map(a => a._id === id ? { ...a, status: "submitted" } : a)
//         );
//       }
//     } catch {}

//     setSubmitting(null);
//   };

//   const total = assignments.length;
//   const completed = assignments.filter(a => a.status === "submitted").length;
//   const progress = total ? Math.round((completed / total) * 100) : 0;

//   if (loading) {
//     return <div className="h-screen flex items-center justify-center">Loading...</div>;
//   }

//   return (
// bg-gray-100

//       {/* NAVBAR */}
// bg-white shadow border-b sticky top-0 z-50
//         <div className="w-full px-8 py-6 flex justify-between items-center">
//           <div className="flex items-center space-x-3">
//             <div className="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center">
              
//             </div>
// h1 className="text-2xl font-bold text-blue-600"
//               Student Dashboard
//             </h1>
//           </div>

//           <button
//             onClick={() => {
//               localStorage.removeItem("token");
//               navigate("/auth");
//             }}
// px-5 py-2 border border-red-500 text-red-500 rounded-full hover:bg-red-500 hover:text-white transition
//           >
//             Logout
//           </button>
//         </div>
//       </header>

//       <div className="flex">

//         {/*  SIDEBAR (FIXED) */}
//         <aside className="w-80 bg-white/80 backdrop-blur-md border-r border-white/30 p-8 
//                           sticky top-20 h-[calc(100vh-80px)] overflow-y-auto shadow-2xl">

//           <h2 className="text-xl font-bold bg-linear-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-6">My Group</h2>

//           {group ? (
//             <div className="space-y-3">
//               <div className="bg-linear-to-r from-blue-500 to-indigo-500 text-white p-4 rounded-2xl shadow-xl">
//                 <h3 className="font-black text-lg">{group.name}</h3>
//               </div>
//               <div className="space-y-2">
//                 {group.members.map(m => (
//                   <div key={m._id} className="flex items-center p-3 bg-gray-50/50 rounded-xl hover:bg-gray-100 transition">
//                     <div className="w-8 h-8 bg-linear-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center mr-3">
//                       👤
//                     </div>
//                     <span className="font-medium text-gray-800">{m.email}</span>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           ) : (
//             <form onSubmit={handleCreateGroup} className="space-y-4 bg-white/50 p-6 rounded-3xl backdrop-blur-sm border border-white/30">
//               <input
//                 className="w-full bg-white/70 border border-gray-200 p-4 rounded-3xl text-lg placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-400 transition-all backdrop-blur-sm shadow-lg"
//                 placeholder="Group Name *"
//                 value={groupName}
//                 onChange={e => setGroupName(e.target.value)}
//               />
//               <input
//                 className="w-full bg-white/70 border border-gray-200 p-4 rounded-3xl text-lg placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-400 transition-all backdrop-blur-sm shadow-lg"
//                 placeholder="Member emails (comma separated)"
//                 value={members}
//                 onChange={e => setMembers(e.target.value)}
//               />
//               <button className="w-full bg-linear-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-3xl font-bold text-lg shadow-2xl hover:from-blue-700 hover:to-indigo-700 hover:scale-105 transition-all duration-300 backdrop-blur-sm">
//                 Create Group 🚀
//               </button>
//             </form>
//           )}
//         </aside>

//         {/* MAIN CONTENT */}
//         <main className="flex-1 p-8 space-y-6">

//           {/* PROGRESS PIE CHART */}
//           <div className="bg-white/80 backdrop-blur-md p-8 rounded-3xl shadow-2xl border border-white/30">
//             <div className="flex items-center space-x-4 mb-6">
//               <div className="w-16 h-16 bg-linear-to-r from-green-400 to-blue-500 rounded-2xl flex items-center justify-center shadow-xl">
//                 📊
//               </div>
//               <div>
//                 <h3 className="text-2xl font-bold bg-linear-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-1">Assignment Progress</h3>
//                 <p className="text-gray-600">Your group's completion rate</p>
//               </div>
//             </div>

//             <div className="flex flex-col md:flex-row items-center gap-8">
//               {/* Animated SVG Pie Chart */}
//               <div className="relative">
//                 <svg className="w-48 h-48 md:w-64 md:h-64" viewBox="0 0 42 42">
//                   <circle
//                     className="pie-chart-bg"
//                     cx="21" cy="21" r="15.9155"
//                     fill="none"
//                     stroke="#e5e7eb"
//                     strokeWidth="7"
//                     strokeLinecap="round"
//                   />
//                   <circle
//                     className="pie-chart-progress"
//                     cx="21" cy="21" r="15.9155"
//                     fill="none"
//                     stroke="url(#gradient)"
//                     strokeWidth="7"
//                     strokeDasharray={`${progress * 1.11} 100`}
//                     strokeDashoffset="0"
//                     strokeLinecap="round"
//                     pathLength="1"
//                     style={{ "--progress": `${progress}%` }}
//                   />
//                   <defs>
//                     <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
//                       <stop offset="0%" stopColor="#10b981" />
//                       <stop offset="50%" stopColor="#3b82f6" />
//                       <stop offset="100%" stopColor="#8b5cf6" />
//                     </linearGradient>
//                   </defs>
//                 </svg>
//                 <div className="absolute inset-0 flex items-center justify-center">
//                   <div className="text-center">
//                     <div className="text-3xl md:text-4xl font-black bg-linear-to-r from-green-500 to-blue-500 bg-clip-text text-transparent drop-shadow-lg">
//                       {progress}%
//                     </div>
//                     <div className="text-sm font-medium text-gray-600 mt-1">{completed}/{total}</div>
//                   </div>
//                 </div>
//               </div>

//               <div className="text-center md:text-left">
//                 <div className="space-y-2">
//                   <div className="flex items-center space-x-3">
//                     <div className="w-4 h-4 bg-green-500 rounded-full shadow-lg"></div>
//                     <span className="font-semibold text-lg">Completed</span>
//                     <span className="ml-auto text-2xl font-black text-green-600">{completed}</span>
//                   </div>
//                   <div className="flex items-center space-x-3">
//                     <div className="w-4 h-4 bg-gray-300 rounded-full shadow-lg"></div>
//                     <span className="font-semibold text-lg">Pending</span>
//                     <span className="ml-auto text-2xl font-black text-gray-600">{total - completed}</span>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             <style jsx>{`
//               .pie-chart-progress {
//                 animation: pie-chart-load 1.5s cubic-bezier(0.4, 0, 0.2, 1);
//                 transform: rotate(-90deg);
//                 transform-origin: 50% 50%;
//               }
//               @keyframes pie-chart-load {
//                 0% { stroke-dasharray: 0 100; }
//                 100% { stroke-dasharray: ${progress * 1.11} 100; }
//               }
//             `}</style>
//           </div>

//           {/* ASSIGNMENTS */}
//           <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {assignments.map(a => (
//               <div key={a._id} className="group bg-white/80 backdrop-blur-md p-6 rounded-3xl shadow-xl border border-white/30 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 hover:bg-white/95">
//                 <div className="flex justify-between items-start mb-4">
//                   <h4 className="font-black text-xl bg-linear-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent line-clamp-1 pr-2">
//                     {a.title}
//                   </h4>
//                   <span className={`px-3 py-1 rounded-full text-xs font-bold ${
//                     a.status === 'submitted' 
//                       ? 'bg-linear-to-r from-green-400 to-emerald-500 text-white shadow-lg' 
//                       : 'bg-linear-to-r from-orange-400 to-yellow-500 text-white shadow-lg'
//                   }`}>
//                     {a.status.toUpperCase()}
//                   </span>
//                 </div>

//                 <p className="text-gray-600 mb-4 line-clamp-2 leading-relaxed">
//                   {a.description}
//                 </p>

//                 <div className="flex items-center space-x-3 mb-4">
//                   {a.dueDate && (
//                     <div className="flex items-center space-x-1 text-sm text-gray-500">
//                       <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
//                         <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"/>
//                       </svg>
//                       <span>{new Date(a.dueDate).toLocaleDateString()}</span>
//                     </div>
//                   )}
//                   <a 
//                     href={a.oneDriveLink} 
//                     target="_blank" rel="noopener noreferrer"
//                     className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 font-medium text-sm group-hover:scale-105 transition"
//                   >
//                     <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
//                       <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z"/>
//                       <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z"/>
//                     </svg>
//                     <span>Open Assignment</span>
//                   </a>
//                 </div>

//                 {group && a.status === "pending" && (
//                   <button
//                     onClick={() => handleSubmit(a._id)}
//                     disabled={submitting === a._id}
//                     className="w-full bg-linear-to-r from-emerald-500 to-green-600 text-white py-4 rounded-2xl font-bold text-lg shadow-xl hover:from-emerald-600 hover:to-green-700 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 backdrop-blur-sm group-hover:shadow-2xl"
//                   >
//                     {submitting === a._id ? (
//                       <>
//                         <svg className="w-5 h-5 animate-spin mx-auto mb-1" fill="none" viewBox="0 0 24 24">
//                           <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                           <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                         </svg>
//                         Submitting...
//                       </>
//                     ) : (
//                       " Submit Assignment"
//                     )}
//                   </button>
//                 )}
//               </div>
//             ))}
//           </div>

//         </main>
//       </div>
//     </div>
//   );
// }

// export default StudentDashboard;

import { useState, useEffect } from "react";
import { apiFetch } from "../utils/api";
import { useNavigate } from "react-router-dom";

function StudentDashboard() {
  const navigate = useNavigate();

  const [assignments, setAssignments] = useState([]);
  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [groupName, setGroupName] = useState("");
  const [members, setMembers] = useState("");
  const [submitting, setSubmitting] = useState(null);

  const token = localStorage.getItem("token");

  // ================= FETCH =================
  const fetchAssignments = async () => {
    try {
      const { data, res } = await apiFetch("/api/assignments");
      if (res.ok && Array.isArray(data)) {
        setAssignments(data.map(a => ({ ...a, status: "pending" })));
      }
    } catch {}
  };

  const fetchGroup = async () => {
    try {
      const { data } = await apiFetch("/api/groups/my-group");
      setGroup(data);
    } catch {}
  };

  useEffect(() => {
    if (!token) return navigate("/auth");

    const load = async () => {
      setLoading(true);
      await Promise.all([fetchAssignments(), fetchGroup()]);
      setLoading(false);
    };

    load();
  }, []);

  // ================= GROUP =================
  const handleCreateGroup = async (e) => {
    e.preventDefault();
    const memberEmails = members.split(",").map(m => m.trim());

    try {
      const { res } = await apiFetch("/api/groups/create", {
        method: "POST",
        body: JSON.stringify({ name: groupName, members: memberEmails }),
      });

      if (res.ok) {
        setGroupName("");
        setMembers("");
        fetchGroup();
      }
    } catch {}
  };

  // ================= SUBMIT =================
  const handleSubmit = async (id) => {
    if (!group) return;

    setSubmitting(id);

    try {
      const { res } = await apiFetch("/api/submissions/confirm", {
        method: "POST",
        body: JSON.stringify({
          groupId: group._id,
          assignmentId: id,
        }),
      });

      if (res.ok) {
        setAssignments(prev =>
          prev.map(a =>
            a._id === id ? { ...a, status: "submitted" } : a
          )
        );
      }
    } catch {}

    setSubmitting(null);
  };

  // ================= PROGRESS =================
  const total = assignments.length;
  const completed = assignments.filter(a => a.status === "submitted").length;
  const progress = total ? Math.round((completed / total) * 100) : 0;

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center text-lg font-semibold">
        Loading...
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen">

      {/* ================= NAVBAR ================= */}
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">
            Student Dashboard
          </h1>

          <button
            onClick={() => {
              localStorage.removeItem("token");
              navigate("/auth");
            }}
            className="px-4 py-2 border border-red-500 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition"
          >
            Logout
          </button>
        </div>
      </header>

      <div className="flex">

        {/* ================= SIDEBAR ================= */}
        <aside className="w-72 bg-white p-6 shadow-md sticky top-64px h-[calc(100vh-64px)] overflow-y-auto">
          <h2 className="text-xl font-semibold mb-4">My Group</h2>

          {group ? (
            <div>
              <div className="bg-blue-500 text-white p-4 rounded-lg mb-4">
                {group.name}
              </div>

              {group.members.map(m => (
                <div key={m._id} className="p-2 border-b text-sm">
                  {m.email}
                </div>
              ))}
            </div>
          ) : (
            <form onSubmit={handleCreateGroup} className="space-y-3">
              <input
                className="w-full border p-3 rounded-lg"
                placeholder="Group Name"
                value={groupName}
                onChange={e => setGroupName(e.target.value)}
              />
              <input
                className="w-full border p-3 rounded-lg"
                placeholder="Member emails"
                value={members}
                onChange={e => setMembers(e.target.value)}
              />
              <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
                Create Group
              </button>
            </form>
          )}
        </aside>

        {/* ================= MAIN ================= */}
        <main className="flex-1 p-6 space-y-6">

          {/* ================= PROGRESS ================= */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-2">
              Assignment Progress
            </h3>

            <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
              <div
                className="bg-green-500 h-4 rounded-full"
                style={{ width: `${progress}%` }}
              ></div>
            </div>

            <p className="text-sm text-gray-600">
              {completed} / {total} completed ({progress}%)
            </p>
          </div>

          {/* ================= ASSIGNMENTS ================= */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {assignments.map(a => (
              <div
                key={a._id}
                className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition"
              >
                <div className="flex justify-between">
                  <h4 className="font-semibold">{a.title}</h4>
                  <span
                    className={`text-xs px-2 py-1 rounded ${
                      a.status === "submitted"
                        ? "bg-green-100 text-green-600"
                        : "bg-yellow-100 text-yellow-600"
                    }`}
                  >
                    {a.status}
                  </span>
                </div>

                <p className="text-sm text-gray-600 mt-2">
                  {a.description}
                </p>

                <a
                  href={a.oneDriveLink}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-500 text-sm mt-2 inline-block"
                >
                  Open Assignment
                </a>

                {group && a.status === "pending" && (
                  <button
                    onClick={() => handleSubmit(a._id)}
                    disabled={submitting === a._id}
                    className="w-full mt-3 bg-green-500 text-white py-2 rounded hover:bg-green-600"
                  >
                    {submitting === a._id
                      ? "Submitting..."
                      : "Submit"}
                  </button>
                )}
              </div>
            ))}
          </div>

        </main>
      </div>
    </div>
  );
}

export default StudentDashboard;