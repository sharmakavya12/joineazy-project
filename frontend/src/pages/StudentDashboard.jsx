import { useState, useEffect } from "react";
import { apiFetch } from "../utils/api";
import { useNavigate } from "react-router-dom";
import logo1 from "../assets/logo1.png";

function StudentDashboard() {
  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);
  const [overview, setOverview] = useState({});
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("courses");
  const [enrollCode, setEnrollCode] = useState("");
  const [enrolling, setEnrolling] = useState(false);
  const [enrollMsg, setEnrollMsg] = useState({ text: "", type: "" });
  const [users, setUsers] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [submissionForm, setSubmissionForm] = useState({
    submissionTitle: "",
    oneDriveLink: "",
    notes: "",
  });

  const [showGroupModal, setShowGroupModal] = useState(false);
  const [groupForm, setGroupForm] = useState({
    name: "",
    assignmentId: "",
    courseId: "",
    memberIds: "",
  });
  const [creatingGroup, setCreatingGroup] = useState(false);
  const [groupError, setGroupError] = useState("");

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    if (user?.role && user.role !== "student") {
      navigate("/");
      return;
    }

    loadDashboard();
    loadUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadUsers = async () => {
    try {
      const res = await apiFetch("/api/users");
      console.log("USERS API RESPONSE =", res);

      const fetchedUsers =
        res?.users ||
        res?.data?.users ||
        res?.data ||
        [];

      setUsers(Array.isArray(fetchedUsers) ? fetchedUsers : []);
    } catch (err) {
      console.error("LOAD USERS ERROR =", err);
      setUsers([]);
    }
  };

  const loadDashboard = async () => {
    setLoading(true);
    try {
      const [dashRes, groupRes] = await Promise.all([
        apiFetch("/api/student/dashboard"),
        apiFetch("/api/groups/my-group"),
      ]);

      if (dashRes?.success) {
        setCourses(dashRes?.data?.courses || dashRes?.courses || []);
        setOverview(dashRes?.data?.overview || dashRes?.overview || {});
      }

      if (groupRes?.success) {
        setGroups(groupRes?.data?.groups || groupRes?.groups || []);
      } else {
        setGroups(groupRes?.data?.groups || groupRes?.groups || []);
      }
    } catch (err) {
      console.error("LOAD DASHBOARD ERROR =", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelfEnroll = async () => {
    if (!enrollCode.trim()) {
      setEnrollMsg({ text: "Enter course code", type: "error" });
      return;
    }

    setEnrolling(true);
    setEnrollMsg({ text: "", type: "" });

    const res = await apiFetch("/api/courses/enroll/self", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: enrollCode.trim().toUpperCase() }),
    });

    if (res?.success) {
      setEnrollMsg({ text: "Enrolled successfully.", type: "success" });
      setEnrollCode("");
      loadDashboard();
    } else {
      setEnrollMsg({
        text: res?.message || res?.error || "Unable to enroll.",
        type: "error",
      });
    }

    setEnrolling(false);
  };

  const openSubmitModal = (assignment) => {
    setError("");
    setSelectedAssignment(assignment);
    setSubmissionForm({
      submissionTitle: "",
      oneDriveLink: "",
      notes: "",
    });
    setShowSubmitModal(true);
  };

  const handleConfirmSubmit = async () => {
    if (!selectedAssignment) return;

    if (!submissionForm.submissionTitle.trim()) {
      setError("Submission title is required.");
      return;
    }

    setError("");
    setSubmitting(true);

    const group = groups.find(
      (g) => g.assignment?._id === selectedAssignment._id
    );

    const body = {
      ...(selectedAssignment.submissionType === "group"
        ? { groupId: group?._id }
        : { studentId: user.id }),
      ...submissionForm,
    };

    const res = await apiFetch(
      `/api/submissions/${selectedAssignment._id}/confirm`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }
    );

    if (!res?.success) {
      setError(res?.message || res?.error || "Submission failed.");
      setSubmitting(false);
      return;
    }

    setCourses((prev) =>
      prev.map((course) => ({
        ...course,
        assignments: (course.assignments || []).map((assignment) =>
          assignment._id === selectedAssignment._id
            ? {
                ...assignment,
                submissionStatus: { confirmed: true },
              }
            : assignment
        ),
      }))
    );

    setShowSubmitModal(false);
    setSelectedAssignment(null);
    setSubmissionForm({
      submissionTitle: "",
      oneDriveLink: "",
      notes: "",
    });
    setSubmitting(false);
  };

  const handleCreateGroup = async () => {
    setGroupError("");

    if (!groupForm.name.trim() || !groupForm.assignmentId || !groupForm.courseId) {
      setGroupError("Name, assignment and course are required.");
      return;
    }

    setCreatingGroup(true);

    const memberIds = [...selectedMembers];

    if (!memberIds.includes(user.id)) {
      memberIds.push(user.id);
    }

    const res = await apiFetch("/api/groups", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: groupForm.name,
        assignmentId: groupForm.assignmentId,
        courseId: groupForm.courseId,
        memberIds,
      }),
    });

    if (res?.success || res?.group || res?.data?.group) {
      setShowGroupModal(false);
      setGroupForm({
        name: "",
        assignmentId: "",
        courseId: "",
        memberIds: "",
      });
      setSelectedMembers([]);
      loadDashboard();
    } else {
      setGroupError(res?.message || res?.error || "Unable to create group.");
    }

    setCreatingGroup(false);
  };

  const allGroupAssignments = courses.flatMap((course) =>
    (course.assignments || [])
      .filter((assignment) => assignment.submissionType === "group")
      .map((assignment) => ({
        ...assignment,
        courseId: course._id,
      }))
  );

  const totalAssignments = overview.totalAssignments || 0;
  const submitted = overview.submittedAssignments || 0;
  const progress = totalAssignments
    ? Math.round((submitted / totalAssignments) * 100)
    : 0;

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-[#f0faf5] text-gray-900">
      <header className="sticky top-0 z-40 bg-linear-to-r from-[#1a6b4a] to-[#2da870] shadow-md">
        <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20">
              <img src={logo1} alt="Logo" className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-base font-semibold leading-tight text-white">
                Student Dashboard
              </h1>
              <p className="text-xs text-green-200">{user.name || "Student"}</p>
            </div>
          </div>

          <button
            onClick={() => {
              localStorage.clear();
              navigate("/auth");
            }}
            className="rounded-full border border-white/30 bg-white/10 px-4 py-1.5 text-sm font-medium text-white transition hover:bg-white hover:text-[#1a6b4a]"
          >
            Logout
          </button>
        </div>
      </header>

      <div className="flex min-h-[calc(100vh-64px)]">
        <aside className="hidden w-64 shrink-0 border-r border-green-100 bg-white lg:flex lg:flex-col">
          <div className="flex-1 p-4 pt-6">
            <p className="mb-3 px-3 text-[11px] font-semibold uppercase tracking-widest text-green-600">
              Navigation
            </p>

            <nav className="space-y-1">
              {[
                { id: "courses", label: "My Courses" },
                { id: "groups", label: "My Groups" },
                { id: "enroll", label: "Enroll in Course" },
              ].map((tab) => (
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
          </div>

          <div className="p-4">
            <div className="rounded-2xl border border-green-100 bg-linear-to-br from-[#e8f8f0] to-[#d0f0e4] p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-green-700">
                Overall Progress
              </p>

              <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-green-100">
                <div
                  className="h-full rounded-full bg-linear-to-r from-[#1a6b4a] to-[#2da870] transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>

              <p className="mt-2 text-sm font-medium text-green-800">
                {submitted}/{totalAssignments} submitted ({progress}%)
              </p>
            </div>
          </div>
        </aside>

        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
          <div className="mb-6 flex flex-wrap gap-2 lg:hidden">
            {[
              { id: "courses", label: "Courses" },
              { id: "groups", label: "Groups" },
              { id: "enroll", label: "Enroll" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  activeTab === tab.id
                    ? "bg-linear-to-r from-[#1a6b4a] to-[#2da870] text-white shadow-sm"
                    : "border border-green-200 bg-white text-gray-600 hover:border-green-400"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
            {[
              {
                label: "Enrolled Courses",
                value: overview.enrolledCourses || 0,
                color: "from-[#1a6b4a] to-[#2da870]",
              },
              {
                label: "Total Assignments",
                value: totalAssignments,
                color: "from-[#0e7490] to-[#22d3ee]",
              },
              {
                label: "Submitted",
                value: submitted,
                color: "from-[#166534] to-[#4ade80]",
              },
              {
                label: "Pending",
                value: overview.pendingAssignments || 0,
                color: "from-[#854d0e] to-[#fbbf24]",
              },
            ].map((card, index) => (
              <div
                key={index}
                className={`rounded-2xl bg-linear-to-br ${card.color} p-4 text-white shadow-sm`}
              >
                <p className="text-xs font-medium text-white/80">{card.label}</p>
                <h3 className="mt-2 text-3xl font-bold">{card.value}</h3>
              </div>
            ))}
          </div>

          {error && (
            <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {activeTab === "courses" && (
            <div>
              <SectionHeader
                title="My Courses"
                subtitle="View assignments and track submissions."
              />

              {courses.length === 0 ? (
                <EmptyState
                  title="No courses yet"
                  desc="Enroll in a course using the course code from your professor."
                  action={() => setActiveTab("enroll")}
                  actionLabel="Enroll Now"
                />
              ) : (
                <div className="space-y-8">
                  {courses.map((course) => (
                    <div key={course._id}>
                      <div className="mb-4 flex flex-col gap-3 rounded-2xl border border-green-100 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            {course.title}
                          </h3>
                          <p className="mt-1 text-sm text-gray-500">
                            {course.code} • Prof. {course.professor?.name || "N/A"}
                          </p>
                        </div>

                        <span className="inline-flex items-center rounded-full border border-green-100 bg-green-50 px-3 py-1 text-sm font-medium text-green-700">
                          {course.assignments?.length || 0} assignments
                        </span>
                      </div>

                      {course.assignments?.length === 0 ? (
                        <p className="text-sm text-gray-500">No assignments yet.</p>
                      ) : (
                        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                          {course.assignments.map((assignment) => {
                            const isSubmitted =
                              assignment.submissionStatus?.confirmed;
                            const isOverdue = assignment.isOverdue;
                            const group = groups.find(
                              (g) => g.assignment?._id === assignment._id
                            );
                            const isGroupAssignment =
                              assignment.submissionType === "group";
                            const isLeader = group?.isLeader;

                            return (
                              <div
                                key={assignment._id}
                                className="rounded-2xl border border-green-100 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
                              >
                                <div className="mb-3 flex items-start justify-between gap-3">
                                  <h4 className="text-base font-semibold text-gray-900">
                                    {assignment.title}
                                  </h4>

                                  <span
                                    className={`whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ${
                                      isSubmitted
                                        ? "bg-green-100 text-green-700"
                                        : isOverdue
                                        ? "bg-red-100 text-red-700"
                                        : "bg-amber-100 text-amber-700"
                                    }`}
                                  >
                                    {isSubmitted
                                      ? "Submitted"
                                      : isOverdue
                                      ? "Overdue"
                                      : "Pending"}
                                  </span>
                                </div>

                                <p className="mb-4 text-sm leading-6 text-gray-500">
                                  {assignment.description?.slice(0, 90)}
                                  {assignment.description?.length > 90 ? "..." : ""}
                                </p>

                                <div className="mb-4 flex flex-wrap gap-2 text-xs">
                                  <span className="rounded-full bg-gray-100 px-2.5 py-1 text-gray-600">
                                    {new Date(assignment.deadline).toLocaleDateString()}
                                  </span>

                                  <span className="rounded-full bg-teal-50 px-2.5 py-1 text-teal-700">
                                    {isGroupAssignment ? "Group" : "Individual"}
                                  </span>
                                </div>

                                {isGroupAssignment && group && (
                                  <div className="mb-4 rounded-xl border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700">
                                    Group: {group.name} {isLeader ? "• Leader" : ""}
                                  </div>
                                )}

                                {isGroupAssignment && !group && !isSubmitted && (
                                  <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-700">
                                    No group yet. Create one to submit.
                                  </div>
                                )}

                                <div className="flex gap-2">
                                  {!isSubmitted &&
                                    (!isGroupAssignment ||
                                      (isGroupAssignment && group && isLeader)) && (
                                      <button
                                        onClick={() => openSubmitModal(assignment)}
                                        className="flex-1 rounded-full bg-linear-to-r from-[#1a6b4a] to-[#2da870] px-4 py-2 text-sm font-medium text-white transition hover:opacity-90"
                                      >
                                        {isGroupAssignment
                                          ? "Acknowledge Submission"
                                          : "Submit Assignment"}
                                      </button>
                                    )}

                                  <button
                                    onClick={() =>
                                      navigate(`/assignments/${assignment._id}`)
                                    }
                                    className="rounded-full border border-green-200 px-4 py-2 text-sm font-medium text-green-700 transition hover:border-green-600 hover:bg-green-600 hover:text-white"
                                  >
                                    Details
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "groups" && (
            <div>
              <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <SectionHeader
                  title="My Groups"
                  subtitle="Manage your group assignments."
                />

                <button
                  onClick={() => setShowGroupModal(true)}
                  className="rounded-full bg-linear-to-r from-[#1a6b4a] to-[#2da870] px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:opacity-90"
                >
                  + Create Group
                </button>
              </div>

              {groups.length === 0 ? (
                <EmptyState
                  title="No groups yet"
                  desc="Create a group for a group assignment."
                  action={() => setShowGroupModal(true)}
                  actionLabel="Create Group"
                />
              ) : (
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {groups.map((group) => (
                    <div
                      key={group._id}
                      className="rounded-2xl border border-green-100 bg-white p-5 shadow-sm"
                    >
                      <div className="mb-4 flex items-start justify-between gap-3">
                        <div>
                          <h3 className="text-base font-semibold text-gray-900">
                            {group.name}
                          </h3>
                          <p className="mt-1 text-sm text-gray-500">
                            {group.assignment?.title}
                          </p>
                        </div>

                        {group.isLeader && (
                          <span className="rounded-full bg-green-100 px-2.5 py-1 text-xs font-semibold text-green-700">
                            Leader
                          </span>
                        )}
                      </div>

                      <div className="space-y-2">
                        {group.members?.map((member) => (
                          <div
                            key={member._id}
                            className="flex items-center gap-3 rounded-xl border border-green-50 bg-[#f0faf5] px-3 py-2"
                          >
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-[#1a6b4a] to-[#2da870] text-sm font-semibold text-white">
                              {member.name?.[0]?.toUpperCase() || "?"}
                            </div>

                            <div className="min-w-0">
                              <p className="truncate text-sm font-medium text-gray-900">
                                {member.name}
                              </p>
                              <p className="truncate text-xs text-gray-500">
                                {member.email}
                              </p>
                            </div>

                            {(group.leader?._id === member._id ||
                              group.leader === member._id) && (
                              <span className="ml-auto text-xs font-semibold text-green-600">
                                Leader
                              </span>
                            )}
                          </div>
                        ))}
                      </div>

                      {group.submitted && (
                        <div className="mt-4 rounded-xl border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700">
                          Submitted on{" "}
                          {new Date(group.submittedAt).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "enroll" && (
            <div className="max-w-xl">
              <SectionHeader
                title="Enroll in Course"
                subtitle="Enter the course code provided by your professor."
              />

              {enrollMsg.text && (
                <div
                  className={`mb-4 rounded-xl px-4 py-3 text-sm ${
                    enrollMsg.type === "error"
                      ? "border border-red-200 bg-red-50 text-red-700"
                      : "border border-green-200 bg-green-50 text-green-700"
                  }`}
                >
                  {enrollMsg.text}
                </div>
              )}

              <div className="rounded-2xl border border-green-100 bg-white p-6 shadow-sm">
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Course Code
                </label>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <input
                    type="text"
                    placeholder="e.g. CS101"
                    value={enrollCode}
                    onChange={(e) => {
                      setEnrollCode(e.target.value);
                      setEnrollMsg({ text: "", type: "" });
                    }}
                    onKeyDown={(e) => e.key === "Enter" && handleSelfEnroll()}
                    className="flex-1 rounded-xl border border-green-200 px-4 py-2.5 text-sm uppercase tracking-wide text-gray-900 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
                  />

                  <button
                    onClick={handleSelfEnroll}
                    disabled={enrolling}
                    className="rounded-xl bg-linear-to-r from-[#1a6b4a] to-[#2da870] px-6 py-2.5 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {enrolling ? "Enrolling..." : "Enroll"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {showGroupModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <div className="mb-5 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                Create Group
              </h3>

              <button
                onClick={() => setShowGroupModal(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-lg leading-none text-gray-500 transition hover:bg-gray-200"
              >
                ×
              </button>
            </div>

            {groupError && (
              <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {groupError}
              </div>
            )}

            <div className="space-y-4">
              <ModalField label="Group Name">
                <input
                  type="text"
                  placeholder="Team Alpha"
                  value={groupForm.name}
                  onChange={(e) =>
                    setGroupForm({ ...groupForm, name: e.target.value })
                  }
                  className="w-full rounded-xl border border-green-200 px-4 py-2.5 text-sm outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
                />
              </ModalField>

              <ModalField label="Assignment">
                <select
                  value={groupForm.assignmentId}
                  onChange={(e) => {
                    const assignment = allGroupAssignments.find(
                      (item) => item._id === e.target.value
                    );
                    setGroupForm({
                      ...groupForm,
                      assignmentId: e.target.value,
                      courseId: assignment?.courseId || "",
                    });
                  }}
                  className="w-full rounded-xl border border-green-200 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
                >
                  <option value="">Select assignment</option>
                  {allGroupAssignments.map((assignment) => (
                    <option key={assignment._id} value={assignment._id}>
                      {assignment.title}
                    </option>
                  ))}
                </select>
              </ModalField>

              <ModalField label="Select Members (optional)">
                <div className="max-h-40 space-y-2 overflow-y-auto rounded-xl border border-green-200 p-3">
                  {users.length === 0 ? (
                    <p className="text-sm text-gray-500">No users found.</p>
                  ) : (
                    users
                      .filter((u) => u._id && u._id !== user.id && u.role === "student")
                      .map((u) => (
                        <label
                          key={u._id}
                          className="flex cursor-pointer items-center gap-2 text-sm"
                        >
                          <input
                            type="checkbox"
                            checked={selectedMembers.includes(u._id)}
                            onChange={() => {
                              setSelectedMembers((prev) =>
                                prev.includes(u._id)
                                  ? prev.filter((id) => id !== u._id)
                                  : [...prev, u._id]
                              );
                            }}
                          />
                          <span>{u.name}</span>
                        </label>
                      ))
                  )}
                </div>
              </ModalField>

              <button
                onClick={handleCreateGroup}
                disabled={creatingGroup}
                className="w-full rounded-xl bg-linear-to-r from-[#1a6b4a] to-[#2da870] px-4 py-2.5 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {creatingGroup ? "Creating..." : "Create Group"}
              </button>
            </div>
          </div>
        </div>
      )}

      {showSubmitModal && selectedAssignment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <div className="mb-5 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                Submit {selectedAssignment.title}
              </h3>

              <button
                onClick={() => setShowSubmitModal(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition hover:bg-gray-200"
              >
                ×
              </button>
            </div>

            {error && (
              <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <ModalField label="Submission Title *">
                <input
                  type="text"
                  placeholder="e.g. Lab Report 1"
                  value={submissionForm.submissionTitle}
                  onChange={(e) =>
                    setSubmissionForm({
                      ...submissionForm,
                      submissionTitle: e.target.value,
                    })
                  }
                  className="w-full rounded-xl border border-green-200 px-4 py-2.5 text-sm outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
                />
              </ModalField>

              <ModalField label="OneDrive Link">
                <input
                  type="url"
                  placeholder="https://1drv.ms/..."
                  value={submissionForm.oneDriveLink}
                  onChange={(e) =>
                    setSubmissionForm({
                      ...submissionForm,
                      oneDriveLink: e.target.value,
                    })
                  }
                  className="w-full rounded-xl border border-green-200 px-4 py-2.5 text-sm outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
                />
              </ModalField>

              <ModalField label="Notes (optional)">
                <textarea
                  rows="3"
                  placeholder="Any additional comments..."
                  value={submissionForm.notes}
                  onChange={(e) =>
                    setSubmissionForm({
                      ...submissionForm,
                      notes: e.target.value,
                    })
                  }
                  className="w-full resize-none rounded-xl border border-green-200 px-4 py-2.5 text-sm outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
                />
              </ModalField>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowSubmitModal(false)}
                  className="flex-1 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                >
                  Cancel
                </button>

                <button
                  onClick={handleConfirmSubmit}
                  disabled={submitting}
                  className="flex-1 rounded-xl bg-linear-to-r from-[#1a6b4a] to-[#2da870] px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting ? "Submitting..." : "Submit"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function SectionHeader({ title, subtitle }) {
  return (
    <div className="mb-6">
      <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
      {subtitle && <p className="mt-1 text-sm text-gray-500">{subtitle}</p>}
    </div>
  );
}

function ModalField({ label, children }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-gray-700">
        {label}
      </label>
      {children}
    </div>
  );
}

function EmptyState({ title, desc, action, actionLabel }) {
  return (
    <div className="rounded-2xl border-2 border-dashed border-green-200 bg-white px-6 py-16 text-center">
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-50">
        <svg
          className="h-6 w-6 text-green-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M12 4v16m8-8H4"
          />
        </svg>
      </div>

      <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      <p className="mt-2 text-sm text-gray-500">{desc}</p>

      {action && (
        <button
          onClick={action}
          className="mt-6 rounded-xl bg-gradient-to-r from-[#1a6b4a] to-[#2da870] px-5 py-2.5 text-sm font-medium text-white transition hover:opacity-90"
        >
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

export default StudentDashboard;