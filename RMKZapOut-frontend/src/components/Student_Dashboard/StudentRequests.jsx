import { Download, Trash2 } from "lucide-react";

const LIVE_REQUEST = {
  type: "Gate Pass",
  reason: "Family Function",
  appliedOn: "20 Jan 2025",
  status: "Pending",
  currentStage: 2, // 0-based index
  stages: [
    { label: "Submitted", status: "Approved" },
    { label: "Counsellor", status: "Approved" },
    { label: "HOD", status: "Pending" },
    { label: "Warden", status: "Pending" },
    { label: "Watchman", status: "Pending" }
  ]
};

const STATUS_COLOR = {
  Approved: "text-green-400",
  Pending: "text-yellow-400",
  Rejected: "text-red-400"
};

const glass =
  "bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-xl";

const StudentRequests = () => {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#020617] via-[#041b32] to-[#020617] text-white p-10">

      {/* ================= HEADING ================= */}
      <div className="mb-8">
        <h1 className="text-3xl font-semibold">
          Live Application Status
        </h1>
        <p className="text-gray-400 mt-2 max-w-2xl">
          Track the real-time approval progress of your most recently applied
          request.
        </p>
      </div>

      {/* ================= REQUEST SUMMARY ================= */}
      <div className={`${glass} p-6 mb-8 flex justify-between items-center`}>
        <div>
          <h2 className="text-xl font-semibold text-cyan-400">
            {LIVE_REQUEST.type}
          </h2>
          <p className="text-gray-300 mt-1">{LIVE_REQUEST.reason}</p>
          <p className="text-sm text-gray-400 mt-1">
            Applied on: {LIVE_REQUEST.appliedOn}
          </p>
        </div>

        <div className="text-right">
          <p className="text-sm text-gray-400">Current Status</p>
          <p className={`text-lg font-semibold ${STATUS_COLOR[LIVE_REQUEST.status]}`}>
            {LIVE_REQUEST.status}
          </p>
        </div>
      </div>

      {/* ================= LIVE TRACKER ================= */}
      <div className={`${glass} p-6 mb-8`}>
        <h3 className="font-semibold mb-6">Approval Progress</h3>

        <div className="relative">
          <div className="absolute top-[10px] left-0 right-0 h-[2px] bg-white/10" />

          <div
            className="absolute top-[10px] h-[2px] bg-cyan-400"
            style={{
              width: `${(LIVE_REQUEST.currentStage /
                (LIVE_REQUEST.stages.length - 1)) * 100}%`
            }}
          />

          <div className="flex justify-between relative z-10">
            {LIVE_REQUEST.stages.map((stage, idx) => (
              <div key={stage.label} className="flex flex-col items-center">
                <div
                  className={`w-4 h-4 rounded-full ${
                    idx <= LIVE_REQUEST.currentStage
                      ? "bg-cyan-400"
                      : "bg-gray-500"
                  }`}
                />
                <span className="text-xs mt-2 text-center text-gray-300">
                  {stage.label}
                </span>
                <span className={`text-xs mt-1 ${STATUS_COLOR[stage.status]}`}>
                  {stage.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ================= ACTIONS ================= */}
      <div className="flex gap-6 justify-end">
        {LIVE_REQUEST.status === "Approved" && (
          <button className="flex items-center gap-2 px-6 py-3 rounded-xl bg-green-500/20 text-green-400 border border-green-500/30 hover:bg-green-500/30 transition">
            <Download size={18} />
            Download Pass
          </button>
        )}

        {LIVE_REQUEST.status === "Pending" && (
          <button className="flex items-center gap-2 px-6 py-3 rounded-xl bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500/20 transition">
            <Trash2 size={18} />
            Cancel Request
          </button>
        )}
      </div>

    </div>
  );
};

export default StudentRequests;
