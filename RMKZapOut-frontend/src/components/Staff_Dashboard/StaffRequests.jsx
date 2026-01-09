import { useEffect, useState } from "react";
import {
  CheckCircle,
  XCircle,
  Filter,
  User,
  IdCard,
  Calendar,
  MapPin,
  FileText,
  X,
} from "lucide-react";
import { fetchStaffRequests, updateRequestStatus } from "../../services/requestService.jsx";

const glass =
  "bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-xl";

const FILTERS = ["All", "GATE-PASS", "ON-DUTY"];
const STATUS_LABEL = {
  SUBMITTED: "Waiting for Counsellor",
  COUNSELLOR_APPROVED: "Approved by Counsellor",
  COORDINATOR_APPROVED: "Approved by Coordinator",
  HOD_APPROVED: "Approved by HOD",
  WARDEN_APPROVED: "Approved by Warden",
  REJECTED: "Rejected",
};
const STAGES = ["COUNSELLOR", "COORDINATOR", "HOD", "WARDEN"];

const StaffRequests = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const staffId = user?.id;
  const role = user?.role;

  const [filter, setFilter] = useState("All");
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  // Rejection modal
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState(null);
  const [rejectReason, setRejectReason] = useState("");

  /* ================= FETCH STAFF REQUESTS ================= */
  useEffect(() => {
    if (!staffId || !role) return;

    const load = async () => {
      try {
        setLoading(true);
        const res = await fetchStaffRequests(staffId, role);
        setRequests(res.data.requests || []);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [staffId, role]);

  /* ================= ROLE CHECK ================= */
  const canApprove = (status) =>
    (role === "COUNSELLOR" && status === "SUBMITTED") ||
    (role === "COORDINATOR" && status === "COUNSELLOR_APPROVED") ||
    (role === "HOD" && status === "COORDINATOR_APPROVED");

  /* ================= ACTION HANDLERS ================= */
  const handleApprove = async (id) => {
    try {
      const res = await updateRequestStatus(id, role, "APPROVE");
      setRequests((prev) =>
        prev.map((r) =>
          r.id === id
            ? { ...r, status: res.data.status, current_stage: res.data.current_stage }
            : r
        )
      );
    } catch {
      alert("Approval failed");
    }
  };

  const handleRejectClick = (id) => {
    setSelectedRequestId(id);
    setRejectReason("");
    setShowRejectModal(true);
  };

  const handleRejectSubmit = async () => {
    if (!rejectReason.trim()) {
      alert("Please enter a reason");
      return;
    }

    try {
      const res = await updateRequestStatus(selectedRequestId, role, "REJECT", rejectReason);

      setRequests((prev) =>
        prev.map((r) => (r.id === selectedRequestId ? { ...r, ...res.data } : r))
      );

      setShowRejectModal(false);
    } catch {
      alert("Rejection failed");
    }
  };

  /* ================= FILTER & FORMAT ================= */
  const filtered =
    filter === "All"
      ? requests
      : requests.filter((r) => r.request_type.replace("_", "-") === filter);

  const safe = (v) => v || "N/A";
  const formatDate = (d) =>
    d
      ? new Date(d).toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
      : "N/A";

  /* ================= UI ================= */
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#020617] via-[#041b32] to-[#020617] text-white p-6">
      {/* HEADER */}
      <div className="flex justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Student Requests</h1>
          <p className="text-sm text-white/60">Review & approve requests</p>
        </div>

        <div className="flex items-center gap-2">
          <Filter size={18} />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="bg-white/10 border border-white/20 rounded-lg px-3 py-2"
          >
            {FILTERS.map((f) => (
              <option key={f}>{f}</option>
            ))}
          </select>
        </div>
      </div>

      {/* BODY */}
      {loading ? (
        <p className="text-center text-white/60">Loading...</p>
      ) : filtered.length === 0 ? (
        <p className="text-center text-white/60">No requests</p>
      ) : (
        <div className="space-y-6">
          {filtered.map((r) => (
            <div key={r.id} className={`${glass} p-6`}>
              {/* DETAILS */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <User size={16} />
                  <h2 className="font-semibold">{safe(r.student_name)}</h2>
                </div>
                <div className="flex items-center gap-2 text-sm text-white/70">
                  <IdCard size={14} /> Register No: {safe(r.register_number)}
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <FileText size={14} /> {r.request_type.replace("_", "-")}
                </div>

                {r.request_type === "ON_DUTY" && (
                  <>
                    <div className="flex items-center gap-2 text-sm">
                      <FileText size={14} /> Event Type: {safe(r.event_type)}
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <FileText size={14} /> Event Name: {safe(r.event_name)}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-white/60">
                      <MapPin size={14} /> {safe(r.college)}, {safe(r.location)}
                    </div>
                  </>
                )}

                <div className="flex items-start gap-2 text-xs text-white/60">
                  <Calendar size={14} />
                  {r.request_type === "ON_DUTY" ? (
                    <>
                      From: {formatDate(r.od_from_date)} <br />
                      To: {formatDate(r.od_to_date)} <br />
                      Total Days: {r.od_total_days || "N/A"}
                    </>
                  ) : (
                    <>
                      From: {formatDate(r.gp_from_date)} <br />
                      To: {formatDate(r.gp_to_date)} <br />
                      Total Days: {r.gp_total_days || "N/A"}
                    </>
                  )}
                </div>
              </div>

              {/* APPROVAL TRACK (student-style) */}
              <div className="mt-6">
                <div className="flex items-start">
                  {["SUBMITTED", ...STAGES].map((stage, index) => {
                    const stageOrder = ["SUBMITTED", ...STAGES];
                    const rejectedIndex = r.status === "REJECTED" ? stageOrder.indexOf(r.current_stage) : -1;
                    const currentIndex = r.status === "SUBMITTED" ? 0 : stageOrder.indexOf(r.current_stage);

                    let isCompleted = false;
                    let isCurrent = false;
                    let isRejected = false;

                    if (r.status === "REJECTED") {
                      if (index < rejectedIndex) isCompleted = true;
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

              {/* STATUS */}
              <p className="mt-4 font-semibold">Status: {STATUS_LABEL[r.status]}</p>

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

              {/* ACTION BUTTONS */}
              {canApprove(r.status) && (
                <div className="flex items-center gap-3 mt-4">
                  <button onClick={() => handleApprove(r.id)} className="btn-green">
                    <CheckCircle size={16} /> Approve
                  </button>
                  <button onClick={() => handleRejectClick(r.id)} className="btn-red">
                    <XCircle size={16} /> Reject
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* REJECTION MODAL */}
      {showRejectModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-[#020617] p-6 rounded-2xl w-96 shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-white">Rejection Reason</h2>
              <button onClick={() => setShowRejectModal(false)}>
                <X size={20} className="text-white" />
              </button>
            </div>
            <textarea
              rows={4}
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Enter reason for rejection"
              className="w-full p-2 rounded border border-white/20 bg-white/10 text-white resize-none"
            />
            <div className="flex justify-end gap-3 mt-4">
              <button onClick={() => setShowRejectModal(false)} className="btn-gray">
                Cancel
              </button>
              <button onClick={handleRejectSubmit} className="btn-red">
                Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffRequests;
