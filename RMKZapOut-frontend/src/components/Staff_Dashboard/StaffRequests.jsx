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
} from "lucide-react";
import {
  fetchStaffRequests,
  updateRequestStatus,
} from "../../services/requestService.jsx";

const StaffRequests = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const staffId = user?.id;
  const role = user?.role;

  const [filter, setFilter] = useState("All");
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ================= FETCH REQUESTS =================
  useEffect(() => {
    if (!staffId || !role) {
      setLoading(false);
      return;
    }

    const loadRequests = async () => {
      try {
        setLoading(true);
        const res = await fetchStaffRequests(staffId, role);
        setRequests(res.data.requests || []);
      } catch (err) {
        setError("Unable to load student requests");
      } finally {
        setLoading(false);
      }
    };

    loadRequests();
  }, [staffId, role]);

  // ================= ROLE-BASED APPROVAL =================
  const canApprove = (status) =>
    (role === "COUNSELLOR" && status === "SUBMITTED") ||
    (role === "COORDINATOR" && status === "COUNSELLOR_APPROVED") ||
    (role === "HOD" && status === "COORDINATOR_APPROVED");

  // ================= ACTION =================
  const handleAction = async (id, action) => {
    try {
      const res = await updateRequestStatus(id, role, action);
      setRequests((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: res.data.status } : r))
      );
    } catch {
      alert("Action failed. Try again.");
    }
  };

  const filteredRequests =
    filter === "All"
      ? requests
      : requests.filter(
          (r) => r.request_type.replace("_", "-").toUpperCase() === filter
        );

  const safe = (v) => v || "N/A";

  const statusBadge = (status) => {
    if (status.includes("APPROVED"))
      return "bg-green-500/20 text-green-300";
    if (status.includes("REJECTED"))
      return "bg-red-500/20 text-red-300";
    return "bg-yellow-500/20 text-yellow-300";
  };
const formatDateTime = (date) => {
  if (!date) return "N/A";

  const d = new Date(date);

  return d.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

  // ================= UI =================
  return (
    <div className="w-full p-6 text-white">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl text-green-500 font-bold">Student Requests</h1>
          <p className="text-sm text-green-300">
            Review and approve student requests
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Filter size={18} />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm"
          >
            <option value="All">All Requests</option>
            <option value="GATE-PASS">Gate Pass</option>
            <option value="ON-DUTY">On Duty</option>
          </select>
        </div>
      </div>

      {/* Body */}
      {loading ? (
        <div className="text-center py-12 text-white/70">
          Loading requests...
        </div>
      ) : error ? (
        <div className="text-center py-12 text-red-400">{error}</div>
      ) : filteredRequests.length === 0 ? (
        <div className="text-center py-12 text-white/60">
          No requests available
        </div>
      ) : (
        <div className="space-y-5">
          {filteredRequests.map((req) => (
            <div
              key={req.id}
              className="bg-white/10 border border-white/20 rounded-2xl p-5 flex flex-col lg:flex-row justify-between gap-6"
            >
              {/* LEFT */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <User size={18} className="text-cyan-400" />
                  <h2 className="text-lg font-semibold">
                    {safe(req.student_name)}
                  </h2>
                </div>

                <div className="flex items-center gap-2 text-sm text-white/70">
                  <IdCard size={16} />
                  Register No: {safe(req.register_number)}
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <FileText size={16} className="text-cyan-400" />
                  <span className="font-medium">
                    {req.request_type.replace("_", "-")}
                  </span>
                  •{" "}
                  {req.request_type === "GATE_PASS"
                    ? safe(req.reason)
                    : safe(req.event_name)}
                </div>

                <div className="flex items-center gap-2 text-xs text-white/60">
  <Calendar size={14} />
  <span>
    {req.request_type === "GATE_PASS" ? (
      <>
        <strong>From:</strong> {formatDateTime(req.gp_from_date)} <br />
        <strong>To:</strong> {formatDateTime(req.gp_to_date)}
      </>
    ) : (
      <>
        <strong>From:</strong> {formatDateTime(req.od_from_date)} <br />
        <strong>To:</strong> {formatDateTime(req.od_to_date)}
      </>
    )}
  </span>
</div>


                {req.request_type === "ON_DUTY" && (
                  <div className="flex items-center gap-2 text-xs text-white/60">
                    <MapPin size={14} />
                     {safe(req.college)},{safe(req.location)}
                  </div>
                )}
              </div>

              {/* RIGHT */}
              <div className="flex items-center gap-3">
                {canApprove(req.status) ? (
                  <>
                    <button
                      onClick={() => handleAction(req.id, "APPROVE")}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-green-500/20 text-green-300 hover:bg-green-500/30"
                    >
                      <CheckCircle size={18} /> Approve
                    </button>
                    <button
                      onClick={() => handleAction(req.id, "REJECT")}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/20 text-red-300 hover:bg-red-500/30"
                    >
                      <XCircle size={18} /> Reject
                    </button>
                  </>
                ) : (
                  <span
                    className={`px-4 py-2 rounded-xl text-sm font-medium ${statusBadge(
                      req.status
                    )}`}
                  >
                    {req.status.replace("_", " ")}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StaffRequests;
