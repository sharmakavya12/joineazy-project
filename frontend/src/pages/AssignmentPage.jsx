import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiFetch } from "../utils/api";
import logo1 from "../assets/logo1.png"; // For consistency

function AssignmentPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [assignment, setAssignment] = useState(null);
  const [submissionStatus, setSubmissionStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Submit modal states (copied from StudentDashboard)
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submissionForm, setSubmissionForm] = useState({
    submissionTitle: "",
    oneDriveLink: "",
    notes: "",
  });

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const fetchAssignment = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await apiFetch(`/api/assignments/${id}`);

      if (res.success) {
        setAssignment(res.data.assignment);
      } else {
        setError(res.message || "Assignment not found");
      }
    } catch (err) {
      setError("Failed to load assignment");
    } finally {
      setLoading(false);
    }
  };

  const fetchStatus = async () => {
    try {
      const res = await apiFetch(`/api/submissions/${id}/status`);
      setSubmissionStatus(res.data || { submitted: false, confirmed: false });
    } catch {
      setSubmissionStatus({ submitted: false, confirmed: false });
    }
  };

  useEffect(() => {
    fetchAssignment();
    if (user.id) fetchStatus();
  }, [id]);

  const openSubmitModal = () => {
    setSubmissionForm({ submissionTitle: "", oneDriveLink: "", notes: "" });
    setSubmitError("");
    setShowSubmitModal(true);
  };

  const handleConfirmSubmit = async () => {
    if (!submissionForm.submissionTitle.trim()) {
      setSubmitError("Submission title is required.");
      return;
    }
    setSubmitError("");
    setSubmitting(true);

    // Body logic copied from StudentDashboard (assumes group detection backend-side)
    const body = {
      studentId: user.id,
      ...submissionForm,
    };

    const res = await apiFetch(`/api/submissions/${id}/confirm`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.success) {
      setSubmitError(res.message || res.error || "Submission failed.");
      setSubmitting(false);
      return;
    }

    // Update local state
    setSubmissionStatus({ confirmed: true });
    setShowSubmitModal(false);
    setSubmitting(false);
    setSubmissionForm({ submissionTitle: "", oneDriveLink: "", notes: "" });
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f0faf5]">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-green-100 border-t-[#1a6b4a]" />
          <p className="mt-4 text-sm font-medium text-green-700">
            Loading assignment...
          </p>
        </div>
      </div>
    );
  }

  if (error || !assignment) {
    return (
      <div className="min-h-screen bg-[#f0faf5] px-4 py-10">
        <div className="mx-auto max-w-3xl rounded-2xl border border-green-100 bg-white p-8 text-center shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900">
            Assignment not found
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            {error || "This assignment does not exist."}
          </p>
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

  const isSubmitted = submissionStatus?.confirmed;

  return (
    <div className="min-h-screen bg-[#f0faf5] text-gray-900">
      <div className="bg-linear-to-br from-[#1a6b4a] via-[#1e8a5e] to-[#3dd68c] px-4 pb-10 pt-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <button
            onClick={() => navigate(-1)}
            className="mb-6 inline-flex items-center gap-1.5 rounded-full border border-white/30 bg-white/10 px-4 py-1.5 text-sm font-medium text-white backdrop-blur-sm transition hover:bg-white/20"
          >
            ← Back
          </button>

          <h1 className="text-3xl font-medium tracking-tight text-white sm:text-4xl">
            {assignment.title}
          </h1>
          <p className="mt-2 text-sm text-white/75 sm:text-base">
            {assignment.description}
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-green-100 bg-white p-6 shadow-sm">
          <div className="space-y-3 text-sm text-gray-700">
            <p>
              <span className="font-semibold text-gray-900">Course:</span>{" "}
              {assignment.course?.title || "—"}
            </p>
            <p>
              <span className="font-semibold text-gray-900">Deadline:</span>{" "}
              {assignment.deadline
                ? new Date(assignment.deadline).toLocaleDateString()
                : "—"}
            </p>
            {isSubmitted && (
              <p className="flex items-center gap-2">
                <span className="font-semibold text-green-700">Status:</span>
                <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800">
                  Submitted
                </span>
              </p>
            )}
          </div>

          {assignment.oneDriveLink && (
            <a
              href={assignment.oneDriveLink}
              target="_blank"
              rel="noreferrer"
              className="mt-4 rounded-full mx-1 px-5 py-3 text-sm font-semibold border border-green-400 text-green-600 shadow-sm transition duration-300 hover:bg-linear-to-r hover:from-[#1a6b4a] hover:to-[#2da870] hover:text-white"
 >
              View Assignment →
            </a>
          )}

          {/* Submit Button */}
          {!isSubmitted && user.id && (
            <button
              onClick={openSubmitModal}
             className="mt-4 rounded-full mx-1 px-5 py-3 text-sm font-semibold border border-green-400 text-green-600 shadow-sm transition duration-300 hover:bg-linear-to-r hover:from-[#1a6b4a] hover:to-[#2da870] hover:text-white"
>
              Submit Assignment
            </button>
          )}
        </div>
      </div>

      {/* Submission Modal (copied from StudentDashboard) */}
      {showSubmitModal && assignment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <div className="mb-5 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                Submit {assignment.title}
              </h3>
              <button
                onClick={() => setShowSubmitModal(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 transition text-lg leading-none"
              >
                ×
              </button>
            </div>

            {submitError && (
              <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {submitError}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">Submission Title *</label>
                <input
                  type="text"
                  placeholder="e.g. Lab Report 1"
                  value={submissionForm.submissionTitle}
                  onChange={(e) => setSubmissionForm({ ...submissionForm, submissionTitle: e.target.value })}
                  className="w-full rounded-xl border border-green-200 px-4 py-2.5 text-sm outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">OneDrive Link</label>
                <input
                  type="url"
                  placeholder="https://1drv.ms/..."
                  value={submissionForm.oneDriveLink}
                  onChange={(e) => setSubmissionForm({ ...submissionForm, oneDriveLink: e.target.value })}
                  className="w-full rounded-xl border border-green-200 px-4 py-2.5 text-sm outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">Notes (optional)</label>
                <textarea
                  rows="3"
                  placeholder="Any additional comments..."
                  value={submissionForm.notes}
                  onChange={(e) => setSubmissionForm({ ...submissionForm, notes: e.target.value })}
                  className="w-full rounded-xl border border-green-200 px-4 py-2.5 text-sm outline-none transition resize-vertical focus:border-green-500 focus:ring-2 focus:ring-green-100"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowSubmitModal(false)}
                  className="flex-1 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmSubmit}
                  disabled={submitting}
                  className="flex-1 rounded-xl bg-linear-to-r from-[#1a6b4a] to-[#2da870] px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting ? "Submitting..." : "Confirm & Submit"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {!user.id && (
        <div className="fixed bottom-6 right-6 rounded-full bg-linear-to-r from-[#1a6b4a] to-[#2da870] p-4 text-white shadow-lg">
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </div>
      )}
    </div>
  );
}

export default AssignmentPage;

