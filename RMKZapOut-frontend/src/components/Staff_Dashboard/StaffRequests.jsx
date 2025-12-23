import { useState } from "react";
import { CheckCircle, XCircle, Filter } from "lucide-react";

const dummyRequests = [
  {
    id: 1,
    studentName: "Arun Kumar",
    registerNo: "21IT045",
    type: "Gate Pass",
    reason: "Medical visit",
    from: "12/01/2025",
    to: "12/01/2025",
    status: "Pending",
  },
  {
    id: 2,
    studentName: "Priya Sharma",
    registerNo: "21CS102",
    type: "On-Duty",
    reason: "Hackathon participation",
    from: "13/01/2025",
    to: "15/01/2025",
    status: "Pending",
  },
];

const StaffRequests = () => {
  const [filter, setFilter] = useState("All");
  const [requests, setRequests] = useState(dummyRequests);

  const handleAction = (id, action) => {
    setRequests((prev) =>
      prev.map((req) =>
        req.id === id ? { ...req, status: action } : req
      )
    );
  };

  const filteredRequests =
    filter === "All"
      ? requests
      : requests.filter((r) => r.type === filter);

  return (
    <div className="w-full p-6 text-white">

      {/* ================= HEADER ================= */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Live Student Requests</h1>

        <div className="flex items-center gap-3">
          <Filter size={18} />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg px-3 py-2 text-sm outline-none"
          >
            <option value="All">All</option>
            <option value="Gate Pass">Gate Pass</option>
            <option value="On-Duty">On-Duty</option>
          </select>
        </div>
      </div>

      {/* ================= REQUEST LIST ================= */}
      <div className="space-y-4">
        {filteredRequests.length === 0 && (
          <div className="text-center text-white/60 py-10">
            No pending requests
          </div>
        )}

        {filteredRequests.map((req) => (
          <div
            key={req.id}
            className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-5 flex flex-col lg:flex-row justify-between gap-4"
          >
            {/* LEFT DETAILS */}
            <div className="space-y-1">
              <h2 className="text-lg font-semibold">
                {req.studentName}
              </h2>
              <p className="text-sm text-white/70">
                Reg No: {req.registerNo}
              </p>
              <p className="text-sm">
                <span className="text-cyan-400">{req.type}</span> • {req.reason}
              </p>
              <p className="text-xs text-white/60">
                {req.from} → {req.to}
              </p>
            </div>

            {/* RIGHT ACTIONS */}
            <div className="flex items-center gap-3">
              {req.status === "Pending" ? (
                <>
                  <button
                    onClick={() => handleAction(req.id, "Approved")}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-green-500/20 text-green-300 hover:bg-green-500/30 transition"
                  >
                    <CheckCircle size={18} />
                    Approve
                  </button>

                  <button
                    onClick={() => handleAction(req.id, "Rejected")}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/20 text-red-300 hover:bg-red-500/30 transition"
                  >
                    <XCircle size={18} />
                    Reject
                  </button>
                </>
              ) : (
                <span
                  className={`px-4 py-2 rounded-xl text-sm font-medium ${
                    req.status === "Approved"
                      ? "bg-green-500/20 text-green-300"
                      : "bg-red-500/20 text-red-300"
                  }`}
                >
                  {req.status}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StaffRequests;
