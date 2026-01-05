import { useEffect, useState } from "react";
import {
  fetchDepartmentStudents,
  fetchMyStudents,
  assignStudent,
  unassignStudent,
} from "../../services/staffStudentService";

const Students = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.id; 
  const role = user?.role;

  const [activeTab, setActiveTab] = useState("department");
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [processingId, setProcessingId] = useState(null); // disable button during API call

  // Auto-hide message after 3s
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  // Fetch students
  const fetchData = async () => {
    if (!userId || !role) return;
    setLoading(true);
    try {
      const res =
        activeTab === "department"
          ? await fetchDepartmentStudents(userId, role)
          : await fetchMyStudents(userId, role);
      setStudents(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error(err);
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeTab, userId, role]);

  // Assign student
  const handleAssign = async (studentId) => {
    if (!userId) return;
    setProcessingId(studentId);
    try {
      const res = await assignStudent(studentId, userId);
      if (res.data.success) {
        setMessage({ type: "success", text: "Student added to counselling!" });
        await fetchData(); // refresh immediately
      } else {
        setMessage({ type: "error", text: res.data.message || "Failed to assign student" });
      }
    } catch (err) {
      console.error(err);
      setMessage({ type: "error", text: err.response?.data?.message || "Failed to assign student" });
    } finally {
      setProcessingId(null);
    }
  };

  // Unassign student
  const handleUnassign = async (studentId) => {
    setProcessingId(studentId);
    try {
      const res = await unassignStudent(studentId);
      if (res.data.success) {
        setMessage({ type: "success", text: "Student removed from counselling!" });
        await fetchData(); // refresh immediately
      } else {
        setMessage({ type: "error", text: res.data.message || "Failed to unassign student" });
      }
    } catch (err) {
      console.error(err);
      setMessage({ type: "error", text: "Failed to unassign student" });
    } finally {
      setProcessingId(null);
    }
  };

  const filteredStudents = students.filter(
    (s) =>
      s.name?.toLowerCase().includes(search.toLowerCase()) ||
      s.register_number?.includes(search)
  );

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Students</h2>

      {/* Toast message */}
      {message && (
        <div
          className={`fixed top-4 right-4 px-4 py-2 rounded shadow-md text-white ${
            message.type === "success" ? "bg-green-500" : "bg-red-500"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-4 mb-4">
        <button
          className={`px-5 py-2 rounded-lg font-medium transition ${
            activeTab === "department"
              ? "bg-blue-600 text-white shadow"
              : "bg-gray-200 hover:bg-gray-300"
          }`}
          onClick={() => setActiveTab("department")}
        >
          Department Students
        </button>
        <button
          className={`px-5 py-2 rounded-lg font-medium transition ${
            activeTab === "my"
              ? "bg-blue-600 text-white shadow"
              : "bg-gray-200 hover:bg-gray-300"
          }`}
          onClick={() => setActiveTab("my")}
        >
          My Counselling Students
        </button>
      </div>

      {/* Search */}
      <input
        type="text"
        placeholder="Search by name or register no"
        className="border p-2 w-full mb-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

    {/* Table */}
{loading ? (
  <p className="text-gray-300">Loading...</p>
) : filteredStudents.length === 0 ? (
  <p className="text-gray-500">No students found</p>
) : (
  <div className="overflow-x-auto rounded-3xl border border-white/20 bg-white/10 backdrop-blur-lg shadow-lg">
    <table className="w-full border-collapse text-sm text-white">
      <thead className="bg-white/20 backdrop-blur-md text-gray-100">
        <tr>
          <th className="p-3 text-left">Name</th>
          <th className="p-3 text-left">Register</th>
          <th className="p-3 text-left">Email</th>
          <th className="p-3 text-left">Dept</th>
          <th className="p-3 text-left">Year</th>
          <th className="p-3 text-left">Type</th>
          <th className="p-3 text-left">Assigned Staff</th>
          <th className="p-3 text-center">Action</th>
        </tr>
      </thead>

      <tbody>
        {filteredStudents.map((s, idx) => (
          <tr
            key={s.id}
            className={`transition-all duration-300 hover:bg-white/10 ${
              idx % 2 === 0 ? "bg-white/5" : "bg-white/10"
            }`}
          >
            <td className="p-3">{s.name}</td>
            <td className="p-3">{s.register_number}</td>
            <td className="p-3">{s.email}</td>
            <td className="p-3">{s.department}</td>
            <td className="p-3">{s.year_of_study}</td>
            <td className="p-3 text-cyan-400">{s.student_type}</td>
            <td className="p-3">{s.assigned_staff || "-"}</td>
            <td className="p-3 text-center flex justify-center gap-2">
              {activeTab === "department" ? (
                <button
                  className={`px-3 py-1 rounded-lg font-medium text-white backdrop-blur-sm transition-all ${
                    s.assigned_staff
                      ? "bg-gray-500 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700"
                  }`}
                  onClick={() => !s.assigned_staff && handleAssign(s.id)}
                  disabled={!!s.assigned_staff || processingId === s.id}
                >
                  {processingId === s.id
                    ? "Processing..."
                    : s.assigned_staff
                    ? "Assigned"
                    : "Add"}
                </button>
              ) : (
                <button
                  className="px-3 py-1 rounded-lg font-medium bg-red-600 hover:bg-red-700 text-white backdrop-blur-sm transition-all"
                  onClick={() => handleUnassign(s.id)}
                  disabled={processingId === s.id}
                >
                  {processingId === s.id ? "Processing..." : "Remove"}
                </button>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)}
    </div>
  );
};

export default Students;
