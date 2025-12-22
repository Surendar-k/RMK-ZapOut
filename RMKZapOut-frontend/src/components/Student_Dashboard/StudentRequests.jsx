import { useEffect, useState } from "react";
import { Edit, Trash2, Save, X } from "lucide-react";
import {
  fetchOnDutyRequests,
  cancelOnDutyRequest,
  updateOnDutyRequest,
} from "../../services/onDutyService.jsx";

const glass =
  "bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-xl";

const FILTERS = ["All", "Gate Pass", "On-Duty"];

/* 🔹 Days calculation */
// const calculateDays = (from, to) => {
//   if (!from || !to) return "-";
//   const start = new Date(from);
//   const end = new Date(to);
//   return Math.floor((end - start) / (1000 * 60 * 60 * 24)) + 1;
// };

/* 🔹 Approval stages */
const STAGES = [
  { key: "SUBMITTED", label: "Submitted" },
  { key: "COUNSELLOR_APPROVED", label: "Counsellor" },
  { key: "COORDINATOR_APPROVED", label: "Coordinator" },
  { key: "HOD_APPROVED", label: "HOD" },
  { key: "WARDEN_APPROVED", label: "Warden" },
];

const getStageIndex = (status) => {
  const index = STAGES.findIndex((s) => s.key === status);
  return index === -1 ? 0 : index;
};

const StudentRequests = () => {
  const sessionUser = JSON.parse(localStorage.getItem("user"));

  const [requests, setRequests] = useState([]);
  const [activeFilter, setActiveFilter] = useState("All");
  const [loading, setLoading] = useState(true);

  /* 🔹 Edit states */
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({});

  /* 🔹 Load requests */
  const loadRequests = async () => {
    const res = await fetchOnDutyRequests(sessionUser.id);
    setRequests(res.data.requests || []);
    setLoading(false);
  };

useEffect(() => {
  let isMounted = true; // avoid state updates if component unmounted

  const loadRequests = async () => {
    try {
      const res = await fetchOnDutyRequests(sessionUser.id);
      if (isMounted) {
        setRequests(res.data.requests || []);
        setLoading(false);
      }
    } catch (err) {
      console.error("Failed to load requests:", err);
      if (isMounted) setLoading(false);
    }
  };

  loadRequests();

  return () => {
    isMounted = false; // cleanup
  };
}, [sessionUser.id]);

  /* 🔹 Filters */
  const filteredRequests =
    activeFilter === "All"
      ? requests
      : requests.filter((r) =>
          activeFilter === "Gate Pass"
            ? r.request_type === "GATE_PASS"
            : r.request_type === "ON_DUTY"
        );

  /* 🔹 Edit handlers */
  const handleEdit = (r) => {
    setEditId(r.id);
    setEditData({
      eventType: r.event_type,
      eventName: r.event_name,
      college: r.college,
      location: r.location,
      fromDate: r.from_date?.split("T")[0],
      toDate: r.to_date?.split("T")[0],
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (id) => {
    try {
      const formData = new FormData();

      Object.entries(editData).forEach(([k, v]) =>
        formData.append(k, v)
      );

      await updateOnDutyRequest(id, formData);
      await loadRequests();
      setEditId(null);
    } catch (err) {
      console.error("Update failed:", err.response?.data || err.message);
      alert("Failed to update request");
    }
  };

  if (loading) return <p className="text-white p-6">Loading…</p>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#020617] via-[#041b32] to-[#020617] text-white">

      {/* ================= HEADER ================= */}
      <div className="sticky top-0 z-20 px-10 pt-8 pb-6 bg-gradient-to-b from-[#020617]/95 to-transparent backdrop-blur">
        <h1 className="text-2xl font-semibold mb-4">
          Live <span className="text-[#00d3d1]">{activeFilter}</span> Requests
        </h1>

        <div className="flex gap-4">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-6 py-3 rounded-2xl ${
                activeFilter === f
                  ? "bg-white/25 border border-white/40"
                  : "bg-white/10 border border-white/20 text-[#00d3d1]"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* ================= REQUEST LIST ================= */}
      <div className="px-10 pb-10">
        {filteredRequests.map((r) => {
          const currentStage = getStageIndex(r.status);
          const isEditing = editId === r.id;

          return (
            <div key={r.id} className={`${glass} p-6 mb-8`}>

              {/* ================= INFO GRID ================= */}
              <div className="grid grid-cols-3 gap-6 mb-6">
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
                  type="date"
                  value={
                    isEditing
                      ? editData.fromDate
                      : r.from_date?.split("T")[0]
                  }
                  editable={isEditing}
                  onChange={handleChange}
                />
                <EditableCard
                  label="To Date"
                  name="toDate"
                  type="date"
                  value={
                    isEditing
                      ? editData.toDate
                      : r.to_date?.split("T")[0]
                  }
                  editable={isEditing}
                  onChange={handleChange}
                />
              </div>

              {/* ================= TRACKING (RESTORED) ================= */}
              <h3 className="font-semibold mb-4">Approval Progress</h3>

              <div className="relative mb-6">
                <div className="absolute top-[10px] left-0 right-0 h-[2px] bg-white/10" />
                <div
                  className="absolute top-[10px] h-[2px] bg-cyan-400 transition-all"
                  style={{
                    width: `${(currentStage / (STAGES.length - 1)) * 100}%`,
                  }}
                />

                <div className="flex justify-between relative z-10">
                  {STAGES.map((stage, idx) => {
                    const approved = idx <= currentStage;
                    return (
                      <div key={stage.key} className="flex flex-col items-center">
                        <div
                          className={`w-4 h-4 rounded-full ${
                            approved ? "bg-cyan-400" : "bg-gray-500"
                          }`}
                        />
                        <span className="text-xs mt-2 text-gray-300">
                          {stage.label}
                        </span>
                        <span
                          className={`text-xs ${
                            approved ? "text-green-400" : "text-gray-400"
                          }`}
                        >
                          {approved ? "Approved" : "Pending"}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* ================= ACTIONS ================= */}
              <div className="flex gap-4">
                {r.status === "SUBMITTED" && !isEditing && (
                  <>
                    <button
                      onClick={() => handleEdit(r)}
                      className="flex items-center gap-2 px-5 py-2 rounded bg-yellow-500 text-black"
                    >
                      <Edit size={16} /> Edit
                    </button>

                    <button
                      onClick={() => cancelOnDutyRequest(r.id)}
                      className="flex items-center gap-2 px-5 py-2 rounded bg-red-500/20 text-red-400 border border-red-500/30"
                    >
                      <Trash2 size={16} /> Cancel
                    </button>
                  </>
                )}

                {isEditing && (
                  <>
                    <button
                      onClick={() => handleSave(r.id)}
                      className="flex items-center gap-2 px-5 py-2 rounded bg-green-500 text-black"
                    >
                      <Save size={16} /> Save
                    </button>

                    <button
                      onClick={() => setEditId(null)}
                      className="flex items-center gap-2 px-5 py-2 rounded bg-gray-500/20 text-gray-300"
                    >
                      <X size={16} /> Cancel
                    </button>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

/* ================= EDITABLE CARD ================= */
const EditableCard = ({
  label,
  name,
  value,
  editable,
  onChange,
  type = "text",
}) => (
  <div className="bg-white/10 backdrop-blur border border-white/20 rounded-xl p-4">
    <p className="text-xs text-gray-400 mb-1">{label}</p>

    {editable ? (
      <input
        type={type}
        name={name}
        value={value || ""}
        onChange={onChange}
        className="w-full bg-transparent border border-white/30 rounded px-2 py-1 text-sm text-white"
      />
    ) : (
      <p className="text-sm font-semibold">{value || "-"}</p>
    )}
  </div>
);

export default StudentRequests;
