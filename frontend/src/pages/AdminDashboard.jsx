import { useEffect, useState, useRef } from "react";
import { apiFetch } from "../utils/api";

function AdminDashboard() {
  const [stats, setStats] = useState({});
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [createModal, setCreateModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    dueDate: "",
    oneDriveLink: "",
    _id: ""
  });
  const [errors, setErrors] = useState({});

  // Form refs
  const titleRef = useRef(null);
  const descRef = useRef(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || user.role !== "admin") {
      window.location.href = "/";
      return;
    }
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [statsRes, assignmentsRes] = await Promise.all([
        apiFetch("/api/admin/dashboard"),
        apiFetch("/api/assignments")
      ]);
      setStats(statsRes.data);
      setAssignments(assignmentsRes.data);
    } catch (err) {
      console.error(err);
      alert("Error fetching data");
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.description.trim()) newErrors.description = "Description is required";
    if (!formData.dueDate) newErrors.dueDate = "Due date is required";
    if (!formData.oneDriveLink.trim()) newErrors.oneDriveLink = "Link is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreate = async () => {
    if (!validateForm()) {
      titleRef.current?.focus();
      return;
    }

    try {
      const endpoint = formData._id ? `/api/assignments/${formData._id}` : "/api/assignments/create";
      const method = formData._id ? "PUT" : "POST";
      
      const { res, data } = await apiFetch(endpoint, {
        method,
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          dueDate: formData.dueDate,
          oneDriveLink: formData.oneDriveLink,
        }),
      });

      if (!res.ok) throw new Error(data.msg);

      alert(formData._id ? "Assignment Updated ✅" : "Assignment Created ✅");
      setCreateModal(false);
      setEditModal(false);
      setFormData({ title: "", description: "", dueDate: "", oneDriveLink: "", _id: "" });
      fetchData();
    } catch (err) {
      alert(err.message || "Error saving assignment");
    }
  };

  const handleEdit = (assignment) => {
    setFormData({
      title: assignment.title,
      description: assignment.description,
      dueDate: assignment.dueDate,
      oneDriveLink: assignment.oneDriveLink,
      _id: assignment._id
    });
    setCreateModal(false);
    setEditModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this assignment?")) return;

    try {
      const { res, data } = await apiFetch(`/api/assignments/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error(data.msg);
      
      alert("Assignment Deleted ✅");
      fetchData();
    } catch (err) {
      alert("Error deleting assignment");
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/auth";
  };

  const filteredAssignments = assignments.filter(a =>
    a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const StatsCard = ({ title, value, icon, color = "blue" }) => (
    <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 group">
      <div className="flex items-center justify-between">
        <div className={`p-3 rounded-xl bg-linear-to-r ${color === 'blue' ? 'from-blue-500 to-blue-600' : 'from-green-500 to-green-600'} group-hover:scale-105 transition-transform`}>
          <div className="text-white text-xl">{icon}</div>
        </div>
        <div className="text-3xl font-bold text-gray-900">{value || 0}</div>
      </div>
      <p className="text-gray-600 mt-2 font-medium">{title}</p>
    </div>
  );

  const AssignmentTable = () => (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      <div className="p-6 border-b">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h2 className="text-2xl font-bold text-gray-900">Assignments</h2>
          <input
            type="text"
            placeholder="Search assignments..."
            className="flex-1 max-w-md px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submissions</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredAssignments.map((assignment) => (
              <tr key={assignment._id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900 max-w-xs truncate">
                  {assignment.title}
                </td>
                <td className="px-6 py-4 max-w-md truncate text-gray-600">
                  {assignment.description}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {assignment.dueDate ? new Date(assignment.dueDate).toLocaleDateString() : 'No date'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {stats.assignmentStats?.find(stat => stat.title === assignment.title)?.submissions || 0}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  <a
                    href={assignment.oneDriveLink}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 hover:text-blue-900"
                  >
                    View
                  </a>
                  <button
                    onClick={() => handleEdit(assignment)}
                    className="text-indigo-600 hover:text-indigo-900"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(assignment._id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {filteredAssignments.length === 0 && !loading && (
        <div className="text-center py-12">
          <div className="mx-auto h-24 w-24 text-gray-400 mb-4">📚</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No assignments</h3>
          <p className="rounded-md bg-gray-100 text-gray-500 mb-6">Create your first assignment to get started.</p>
          <button
            onClick={() => setCreateModal(true)}
            className="bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700 transition"
          >
            Create Assignment
          </button>
        </div>
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-blue-50">
      {/* Navbar */}
      {/* <nav className="bg-white/80 backdrop-blur-md shadow-lg border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Admin Dashboard
            </h1>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-100 text-red-700 rounded-xl hover:bg-red-200 transition-all duration-200 font-medium"
          >
            Logout
          </button>
        </div>
   <nav className="bg-white/80 backdrop-blur-md shadow-lg border-b border-gray-200 sticky top-0 z-50">
  <div className="w-full px-6 py-4 flex items-center justify-between">
    
    {/* LEFT */}
  <nav className="bg-white/80 backdrop-blur-md shadow-lg border-b border-gray-200 sticky top-0 z-50">
  <div className="w-full px-6 py-4 flex items-center justify-between">
    
    {/* LEFT */}
    <h1 className="text-2xl bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
      Admin Dashboard
    </h1>

    {/* RIGHT */}
    <button
      onClick={handleLogout}
      className="px-4 py-2 border border-red-500 text-red-500 rounded-full hover:bg-red-500 hover:text-white transition-all duration-200 font-medium"
    >
      Logout
    </button>

  </div>
</nav>
      <div className="flex">
        {/* Sidebar */}
    <aside className="w-64 bg-white/70 backdrop-blur-md shadow-lg border-r border-gray-200 h-screen sticky top-16">
  <div className="p-6">
    
    <button
      onClick={() => setCreateModal(true)}
      className="w-full flex items-center justify-center space-x-2 
                 py-3 px-4 rounded-full font-semibold 
                 border border-gray-300 text-gray-800 
                 hover:border-cyan-500 hover:text-cyan-600 
                 hover:bg-cyan-50 
                 transition-all duration-300"
    >
      <span className="text-lg font-bold">+</span>
      <span>New Assignment</span>
    </button>

  </div>
</aside>

        {/* Main Content */}
        <main className="flex-1 p-8 overflow-auto">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            <StatsCard
              title="Total Assignments"
              value={stats.totalAssignments}
              color="blue"
            />
            <StatsCard
              title="Total Groups"
              value={stats.totalGroups}
              color="green"
            />
            <StatsCard
              title="Total Submissions"
              value={stats.totalSubmissions}
              color="indigo"
            />
            <StatsCard
              title="Active Assignments"
              value={assignments.length}
              color="purple"
            />
          </div>

          {/* Assignments Table */}
          <AssignmentTable />
        </main>
      </div>

      {/* Create/Edit Modal */}
      {(createModal || editModal) && (
        <>
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" onClick={() => {
            setCreateModal(false);
            setEditModal(false);
          }} />
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="p-8">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {editModal ? "Edit Assignment" : "Create Assignment"}
                  </h2>
                  <button
                    onClick={() => {
                      setCreateModal(false);
                      setEditModal(false);
                    }}
                    className="text-gray-400 hover:text-gray-600 text-2xl"
                  >
                    ×
                  </button>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                    <input
                      ref={titleRef}
                      type="text"
                      className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all ${
                        errors.title ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-gray-300 focus:border-blue-500'
                      }`}
                      value={formData.title}
                      onChange={(e) => {
                        setFormData({...formData, title: e.target.value});
                        if (errors.title) setErrors({...errors, title: ''});
                      }}
                      placeholder="Enter assignment title"
                    />
                    {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <textarea
                      ref={descRef}
                      rows={3}
                      className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all resize-vertical ${
                        errors.description ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-gray-300 focus:border-blue-500'
                      }`}
                      value={formData.description}
                      onChange={(e) => {
                        setFormData({...formData, description: e.target.value});
                        if (errors.description) setErrors({...errors, description: ''});
                      }}
                      placeholder="Enter assignment description"
                    />
                    {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Due Date</label>
                      <input
                        type="date"
                        className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all ${
                          errors.dueDate ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-gray-300 focus:border-blue-500'
                        }`}
                        value={formData.dueDate}
                        onChange={(e) => {
                          setFormData({...formData, dueDate: e.target.value});
                          if (errors.dueDate) setErrors({...errors, dueDate: ''});
                        }}
                      />
                      {errors.dueDate && <p className="mt-1 text-sm text-red-600">{errors.dueDate}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">OneDrive Link</label>
                      <input
                        type="url"
                        className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all ${
                          errors.oneDriveLink ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-gray-300 focus:border-blue-500'
                        }`}
                        value={formData.oneDriveLink}
                        onChange={(e) => {
                          setFormData({...formData, oneDriveLink: e.target.value});
                          if (errors.oneDriveLink) setErrors({...errors, oneDriveLink: ''});
                        }}
                        placeholder="https://onedrive.live.com/..."
                      />
                      {errors.oneDriveLink && <p className="mt-1 text-sm text-red-600">{errors.oneDriveLink}</p>}
                    </div>
                  </div>

                  <button
                    onClick={handleCreate}
                    className="w-full bg-linear-to-r from-blue-600 to-blue-700 text-white py-4 px-6 rounded-2xl font-semibold shadow-lg hover:shadow-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300"
                  >
                    {editModal ? "Update Assignment" : "Create Assignment"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default AdminDashboard;
