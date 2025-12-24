import { useEffect, useState } from "react";
import { Edit, Trash2, Save, X, FileText } from "lucide-react";
import { fetchStudentRequests, cancelRequest, updateRequest } from "../../services/requestService.jsx";

const glass = "bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-xl";
const FILTERS = ["All", "Gate Pass", "On-Duty"];

const StudentRequests = () => {
  const sessionUser = JSON.parse(localStorage.getItem("user"));
  const [requests, setRequests] = useState([]);
  const [activeFilter, setActiveFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({});
  const [editFile, setEditFile] = useState(null);

  const totalDays = (data) => {
    if (!data.fromDate || !data.toDate) return "-";
    const from = new Date(data.fromDate);
    const to = new Date(data.toDate);
    return Math.ceil((to - from) / (1000 * 60 * 60 * 24)) + 1;
  };

  const loadRequests = async () => {
    try {
      const res = await fetchStudentRequests(sessionUser.id);
      setRequests(res.data.requests || []);
    } catch (err) {
      console.error("Fetch failed:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (sessionUser?.id) loadRequests();
  }, [sessionUser?.id]);

  const filteredRequests =
    activeFilter === "All"
      ? requests
      : requests.filter((r) =>
          activeFilter === "Gate Pass" ? r.request_type === "GATE_PASS" : r.request_type === "ON_DUTY"
        );

  const handleEdit = (r) => {
    setEditId(r.id);
    if (r.request_type === "ON_DUTY") {
      setEditData({
        eventType: r.event_type,
        eventName: r.event_name,
        college: r.college,
        location: r.location,
        fromDate: r.od_from_date?.split("T")[0],
        toDate: r.od_to_date?.split("T")[0],
      });
    } else if (r.request_type === "GATE_PASS") {
      setEditData({
        reason: r.reason,
        outTime: r.out_time,
        fromDate: r.gp_from_date?.split("T")[0],
        toDate: r.gp_to_date?.split("T")[0],
      });
    }
    setEditFile(null);
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) setEditFile(files[0]);
    else setEditData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (id) => {
    try {
      const formData = new FormData();
      Object.entries(editData).forEach(([k, v]) => formData.append(k, v));
      if (editFile) formData.append("proofFile", editFile);

      await updateRequest(id, formData);
      setEditId(null);
      loadRequests();
    } catch (err) {
      alert(err.response?.data?.message || "Update failed");
      console.error(err);
    }
  };

  const handleCancelRequest = async (id) => {
    if (!confirm("Cancel this request?")) return;
    try {
      await cancelRequest(id);
      loadRequests();
    } catch (err) {
      alert("Cancellation failed");
      console.error(err);
    }
  };

  if (loading) return <p className="text-white p-6">Loading…</p>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#020617] via-[#041b32] to-[#020617] text-white">
      <div className="sticky top-0 z-30 px-10 pt-8 pb-6 bg-[#020617]/95 backdrop-blur border-b border-white/10">
        <h1 className="text-2xl font-semibold mb-4">
          My <span className="text-[#00d3d1]">{activeFilter}</span> Requests
        </h1>
        <div className="flex gap-4">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-6 py-3 rounded-2xl ${
                activeFilter === f ? "bg-white/25" : "bg-white/10 text-[#00d3d1]"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="px-10 pb-10">
        {filteredRequests.map((r) => {
          const isEditing = editId === r.id;

          const statusColors = {
            SUBMITTED: "text-yellow-400",
            COUNSELLOR_APPROVED: "text-blue-400",
            COORDINATOR_APPROVED: "text-purple-400",
            HOD_APPROVED: "text-green-400",
            WARDEN_APPROVED: "text-teal-400",
            REJECTED: "text-red-500",
          };

          const stages = ["COUNSELLOR_APPROVED", "COORDINATOR_APPROVED", "HOD_APPROVED", "WARDEN_APPROVED"];

          return (
            <div key={r.id} className={`${glass} p-6 mb-8`}>
              <div className="grid grid-cols-3 gap-6">
                <Card label="Request Type" value={r.request_type} />

                {r.request_type === "GATE_PASS" && (
                  <>
                    <EditableCard
                      label="Reason"
                      name="reason"
                      value={isEditing ? editData.reason : r.reason}
                      editable={isEditing}
                      onChange={handleChange}
                    />
                    <EditableCard
                      label="Out Time"
                      name="outTime"
                      value={isEditing ? editData.outTime : r.out_time}
                      editable={isEditing}
                      onChange={handleChange}
                    />
                    <EditableCard
                      label="From Date"
                      name="fromDate"
                      value={isEditing ? editData.fromDate : r.gp_from_date?.split("T")[0]}
                      editable={isEditing}
                      onChange={handleChange}
                    />
                    <EditableCard
                      label="To Date"
                      name="toDate"
                      value={isEditing ? editData.toDate : r.gp_to_date?.split("T")[0]}
                      editable={isEditing}
                      onChange={handleChange}
                    />
                    <Card label="Total Days" value={r.gp_total_days || totalDays(editData)} />
                  </>
                )}

                {r.request_type === "ON_DUTY" && (
                  <>
                    <EditableCard
                      label="Event Type"
                      name="eventType"
                      value={isEditing ? editData.eventType : r.event_type}
                      editable={isEditing}
                      onChange={handleChange}
                    />
                    <EditableCard
                      label="Event Name"
                      name="eventName"
                      value={isEditing ? editData.eventName : r.event_name}
                      editable={isEditing}
                      onChange={handleChange}
                    />
                    <EditableCard
                      label="College"
                      name="college"
                      value={isEditing ? editData.college : r.college}
                      editable={isEditing}
                      onChange={handleChange}
                    />
                    <EditableCard
                      label="Location"
                      name="location"
                      value={isEditing ? editData.location : r.location}
                      editable={isEditing}
                      onChange={handleChange}
                    />
                    <EditableCard
                      label="From Date"
                      name="fromDate"
                      value={isEditing ? editData.fromDate : r.od_from_date?.split("T")[0]}
                      editable={isEditing}
                      onChange={handleChange}
                    />
                    <EditableCard
                      label="To Date"
                      name="toDate"
                      value={isEditing ? editData.toDate : r.od_to_date?.split("T")[0]}
                      editable={isEditing}
                      onChange={handleChange}
                    />
                    <Card label="Total Days" value={r.od_total_days} />
                  </>
                )}
              </div>

              {r.request_type === "ON_DUTY" && r.proof_file && !isEditing && (
                <div className="flex gap-2 mt-4">
                  <FileText size={16} />
                  <a
                    href={`http://localhost:5000/uploads/${r.proof_file}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#00d3d1]"
                  >
                    View Proof
                  </a>
                </div>
              )}

              <div className="flex gap-4 mt-6">
                {!isEditing && r.status === "SUBMITTED" && (
                  <>
                    <button onClick={() => handleEdit(r)} className="btn-yellow">
                      <Edit size={16} /> Edit
                    </button>
                    <button onClick={() => handleCancelRequest(r.id)} className="btn-red">
                      <Trash2 size={16} /> Cancel
                    </button>
                  </>
                )}
                {isEditing && (
                  <>
                    <button onClick={() => handleSave(r.id)} className="btn-green">
                      <Save size={16} /> Save
                    </button>
                    <button onClick={() => setEditId(null)} className="btn-gray">
                      <X size={16} /> Cancel
                    </button>
                  </>
                )}
              </div>

              {/* Approval Status Track */}
              <div className="mt-4 flex items-center gap-4">
                {stages.map((stage, index) => {
                  const stageDone =
                    r.status === stage ||
                    stages.indexOf(r.status) >= index; // all previous stages approved

                  return (
                    <div key={stage} className="flex items-center gap-2">
                      <div
                        className={`w-5 h-5 rounded-full border-2 ${
                          stageDone ? "bg-green-400 border-green-400" : "border-white/30"
                        }`}
                      ></div>
                      {index < stages.length - 1 && (
                        <div className={`w-8 h-1 ${stageDone ? "bg-green-400" : "bg-white/30"}`}></div>
                      )}
                    </div>
                  );
                })}
              </div>
              <p className="text-xs text-gray-400 mt-1">
                Counsellor → Coordinator → HOD → Warden
              </p>

              <p className={`mt-4 font-semibold ${statusColors[r.status] || "text-white"}`}>
                Status: {r.status.replaceAll("_", " ")}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const Card = ({ label, value }) => (
  <div className="bg-white/10 rounded-xl p-4">
    <p className="text-xs text-gray-400">{label}</p>
    <p className="text-sm font-semibold">{value || "-"}</p>
  </div>
);

const EditableCard = ({ label, name, value, editable, onChange }) => {
  // Determine input type
  let inputType = "text";
  if (name.toLowerCase().includes("date")) inputType = "date";
  else if (name.toLowerCase().includes("time")) inputType = "time";

  return (
    <div className="bg-white/10 rounded-xl p-4">
      <p className="text-xs text-gray-400">{label}</p>
      {editable ? (
        <input
          name={name}
          value={value || ""}
          onChange={onChange}
          type={inputType} // <-- set type dynamically
          className="w-full bg-transparent border border-white/30 rounded px-2 py-1"
        />
      ) : (
        <p className="text-sm font-semibold">{value || "-"}</p>
      )}
    </div>
  );
};

export default StudentRequests;
