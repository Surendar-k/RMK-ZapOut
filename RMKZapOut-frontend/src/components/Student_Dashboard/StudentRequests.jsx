import { useEffect, useState } from "react";
import { Edit, Trash2, Save, X, FileText } from "lucide-react";
import {
  fetchStudentRequests,
  cancelRequest,
  updateRequest,
} from "../../services/requestService.jsx";

const glass =
  "bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-xl";

const FILTERS = ["All", "Gate Pass", "On-Duty"];

const STATUS_LABEL = {
  SUBMITTED: "Waiting for Counsellor",
  COUNSELLOR_APPROVED: "Approved by Counsellor",
  COORDINATOR_APPROVED: "Approved by Coordinator",
  HOD_APPROVED: "Approved by HOD",
  WARDEN_APPROVED: "Approved by Warden",
  REJECTED: "Rejected",
};

const STAGES = ["COUNSELLOR", "COORDINATOR", "HOD", "WARDEN"];


const StudentRequests = () => {
  const sessionUser = JSON.parse(localStorage.getItem("user"));
  const [requests, setRequests] = useState([]);
  const [activeFilter, setActiveFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({});
  const [editFile, setEditFile] = useState(null);

  const loadRequests = async () => {
    try {
      const res = await fetchStudentRequests(sessionUser.id);
      setRequests(res.data.requests || []);
    } catch (err) {
      console.error(err);
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
          activeFilter === "Gate Pass"
            ? r.request_type === "GATE_PASS"
            : r.request_type === "ON_DUTY"
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
    } else {
      setEditData({
        reason: r.reason,
        outTime: r.out_time,
        inTime: r.in_time,
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
    }
  };

  const handleCancelRequest = async (id) => {
    if (!confirm("Cancel this request?")) return;
    try {
      await cancelRequest(id);
      loadRequests();
    } catch (err) {
      alert(err.response?.data?.message || "Cancellation failed");
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
                activeFilter === f
                  ? "bg-white/25"
                  : "bg-white/10 text-[#00d3d1]"
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

          return (
            <div key={r.id} className={`${glass} p-6 mb-8`}>
              <div className="grid grid-cols-3 gap-6">
                <Card label="Request Type" value={r.request_type} />

                {r.request_type === "ON_DUTY" && (
                  <>
                    <EditableCard label="Event Type" name="eventType" value={isEditing ? editData.eventType : r.event_type} editable={isEditing} onChange={handleChange} />
                    <EditableCard label="Event Name" name="eventName" value={isEditing ? editData.eventName : r.event_name} editable={isEditing} onChange={handleChange} />
                    <EditableCard label="College" name="college" value={isEditing ? editData.college : r.college} editable={isEditing} onChange={handleChange} />
                    <EditableCard label="Location" name="location" value={isEditing ? editData.location : r.location} editable={isEditing} onChange={handleChange} />
                    <EditableCard label="From Date" name="fromDate" value={isEditing ? editData.fromDate : r.od_from_date?.split("T")[0]} editable={isEditing} onChange={handleChange} />
                    <EditableCard label="To Date" name="toDate" value={isEditing ? editData.toDate : r.od_to_date?.split("T")[0]} editable={isEditing} onChange={handleChange} />
                    <Card label="Total Days" value={r.od_total_days} />
                  </>
                )}

                {r.request_type === "GATE_PASS" && (
                  <>
                    <EditableCard label="Reason" name="reason" value={isEditing ? editData.reason : r.reason} editable={isEditing} onChange={handleChange} />
                    <EditableCard label="Out Time" name="outTime" value={isEditing ? editData.outTime : r.out_time} editable={isEditing} onChange={handleChange} />
                    <EditableCard label="In Time" name="inTime" value={isEditing ? editData.inTime : r.in_time} editable={isEditing} onChange={handleChange} />
                    <EditableCard label="From Date" name="fromDate" value={isEditing ? editData.fromDate : r.gp_from_date?.split("T")[0]} editable={isEditing} onChange={handleChange} />
                    <EditableCard label="To Date" name="toDate" value={isEditing ? editData.toDate : r.gp_to_date?.split("T")[0]} editable={isEditing} onChange={handleChange} />
                    <Card label="Total Days" value={r.gp_total_days} />
                  </>
                )}
              </div>

              {r.proof_file && !isEditing && (
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

              {/* ACTIONS */}
              <div className="flex gap-4 mt-6">
                {!isEditing &&
                  r.status === "SUBMITTED" &&
                  r.current_stage === "COUNSELLOR" && (
                    <>
                      <button onClick={() => handleEdit(r)} className="btn-yellow">
                        <Edit size={16} /> Edit
                      </button>
                      <button
                        onClick={() => handleCancelRequest(r.id)}
                        className="btn-red"
                      >
                        <Trash2 size={16} /> Cancel
                      </button>
                    </>
                  )}

                {isEditing && (
                  <>
                    <button onClick={() => handleSave(r.id)} className="btn-green">
                      <Save size={16} /> Save
                    </button>
                    <button
                      onClick={() => setEditId(null)}
                      className="btn-gray"
                    >
                      <X size={16} /> Cancel
                    </button>
                  </>
                )}
              </div>

              {/* APPROVAL TRACK */}
<div className="mt-6">
  <div className="flex items-start">
    {["SUBMITTED", ...STAGES].map((stage, index) => {
      const stageOrder = ["SUBMITTED", ...STAGES];
      const rejectedIndex = r.status === "REJECTED" ? stageOrder.indexOf(r.current_stage) : -1;
      const currentIndex =
        r.status === "SUBMITTED"
          ? 0
          : stageOrder.indexOf(r.current_stage);

      let isCompleted = false;
      let isCurrent = false;
      let isRejected = false;

      if (r.status === "REJECTED") {
        if (index < rejectedIndex) isCompleted = true; // approved before rejection
        else if (index === rejectedIndex) isRejected = true;
      } else if (r.status === "SUBMITTED") {
        isCompleted = index === 0;
        isCurrent = index === 1;
      } else {
        isCompleted = index < currentIndex;
        isCurrent = index === currentIndex;
      }

      return (
        <div key={stage} className="flex flex-1 items-center">
          <div className="flex flex-col items-center">
            <div
              className={`w-5 h-5 rounded-full border-2 ${
                isRejected
                  ? "bg-red-500 border-red-500"
                  : isCompleted
                  ? "bg-green-400 border-green-400"
                  : isCurrent
                  ? "border-[#00d3d1]"
                  : "border-white/30"
              }`}
            />
            <p
              className={`mt-2 text-xs font-semibold text-center ${
                isRejected
                  ? "text-red-400"
                  : isCompleted
                  ? "text-green-400"
                  : isCurrent
                  ? "text-[#00d3d1]"
                  : "text-gray-400"
              }`}
            >
              {stage === "SUBMITTED" ? "Submitted" : stage}
            </p>
          </div>

          {index < STAGES.length && (
            <div
              className={`flex-1 h-1 mx-2 mt-2 ${
                isCompleted ? "bg-green-400" : "bg-white/30"
              }`}
            />
          )}
        </div>
      );
    })}
  </div>

  <p className="mt-3 text-xs text-gray-400 text-center">
    Submitted → Counsellor → Coordinator → HOD → Warden
  </p>
</div>






              <p className="mt-4 font-semibold">
                Status: {STATUS_LABEL[r.status]}
              </p>

              {r.status === "REJECTED" && (
                <div className="mt-3 p-3 rounded-xl bg-red-500/10 border border-red-500/30">
                  <p className="text-red-400 font-semibold">
                    Rejected by: {r.rejected_by}
                  </p>
                  <p className="text-gray-300">
                    Reason: {r.rejection_reason || "No reason provided"}
                  </p>
                </div>
              )}
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
  let type = "text";
  if (name.toLowerCase().includes("date")) type = "date";
  if (name.toLowerCase().includes("time")) type = "time";

  return (
    <div className="bg-white/10 rounded-xl p-4">
      <p className="text-xs text-gray-400">{label}</p>
      {editable ? (
        <input
          name={name}
          type={type}
          value={value || ""}
          onChange={onChange}
          className="w-full bg-transparent border border-white/30 rounded px-2 py-1"
        />
      ) : (
        <p className="text-sm font-semibold">{value || "-"}</p>
      )}
    </div>
  );
};

export default StudentRequests;
