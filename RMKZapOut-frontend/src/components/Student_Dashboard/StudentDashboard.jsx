import { useNavigate } from "react-router-dom";
import { Star } from "lucide-react";
import qrSample from "../../assets/sample-qr.png";

const StudentDashboard = () => {
  const navigate = useNavigate();

  const studentName = "Santhosh";
  const rollNo = "11172220309X";

  const stages = [
    "Submitted",
    "Counsellor",
    "Branch Co-Ordinator",
    "HOD",
    "Warden",
    "Watchman",
  ];

  const currentStageIndex = 1;

  const dotPositionPercent = (index) =>
    (index / (stages.length - 1)) * 100;

  const glass =
    "bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-xl";

  return (
    /* 🔒 HOME PAGE FIXED — NO SCROLL */
    <div className="relative h-screen w-full overflow-hidden text-white bg-gradient-to-br from-[#020617] via-[#041b32] to-[#020617]">

      {/* Bottom-right cyan glow */}
      <div className="pointer-events-none absolute bottom-0 right-0 w-[420px] h-[420px] bg-cyan-400/35 blur-[150px] rounded-full" />

      {/* ================= MAIN ================= */}
      <main className="h-full px-10 py-6 flex flex-col">

        {/* ================= WELCOME HEADER ================= */}
        <div className="mb-8">
          <h1 className="text-3xl font-semibold">
            Welcome to{" "}
            <span className="text-cyan-400">Student Dashboard</span>
          </h1>
          <p className="text-gray-400 mt-2 max-w-3xl">
            Manage your gate pass and on-duty requests, track approval status,
            and stay informed about your campus activities — all in one place.
          </p>
        </div>

        {/* ================= USER INFO ================= */}
        <div className="flex justify-between items-start mb-8">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-full bg-cyan-500/20 flex items-center justify-center font-bold">
              S
            </div>
            <div>
              <h2 className="text-lg font-semibold">
                Hello, <span className="text-cyan-400">{studentName}</span>
                <span className="ml-3 px-3 py-1 text-xs rounded-full bg-green-500/20 text-green-400">
                  Inside Campus
                </span>
              </h2>
              <p className="text-sm text-gray-400">
                IT | 8 Sec B | {rollNo}
              </p>
            </div>
          </div>

          <p className="text-sm text-gray-300">
            Sunday &nbsp;|&nbsp; December 21, 2025
          </p>
        </div>

        {/* ================= SUMMARY CARDS ================= */}
        <div className="grid grid-cols-3 gap-8 mb-8">
          <StatCard title="Active Requests" value="1" />
          <StatCard title="Total Requests" value="12" />
          <StatCard title="Approval Rate" value="92%" />
        </div>

        {/* ================= QUICK ACTIONS ================= */}
        <div className="flex justify-center gap-30 mb-8">
          <ActionButton
            label="Apply Gate Pass"
            onClick={() => navigate("/apply-gatepass")}
          />
          <ActionButton
            label="Apply On-Duty"
            onClick={() => navigate("/apply-od")}
          />
        </div>

        {/* ================= INSIGHT & SCORE ================= */}
        <div className="flex justify-between mb-8">
          <p className="text-gray-300">
            <span className="text-sm text-gray-400">
              Request Pattern Insight
            </span>
            <br />
            You usually apply on Fridays 👍
          </p>

          <div className="text-right">
            <p className="text-sm text-gray-400 mb-1">Behaviour Score</p>
            <div className="flex gap-1 justify-end">
              <Star size={18} className="text-yellow-400 fill-yellow-400" />
              <Star size={18} className="text-yellow-400 fill-yellow-400" />
              <Star size={18} className="text-yellow-400 fill-yellow-400" />
              <Star size={18} className="text-yellow-400 fill-yellow-400" />
              <Star size={18} className="text-yellow-400" />
            </div>
          </div>
        </div>

        {/* ================= REQUEST TRACKER ================= */}
        <div className={`${glass} p-6 mb-6`}>
          <h3 className="font-semibold mb-6">Request Tracker</h3>

          <div className="relative">
            <div className="absolute top-[8px] left-0 right-0 h-[2px] bg-white/10" />

            <div
              className="absolute top-[8px] h-[2px] bg-cyan-400"
              style={{
                left: "0%",
                width: `calc(${dotPositionPercent(currentStageIndex)}% + 8px)`,
              }}
            />

            <div className="flex justify-between relative z-10">
              {stages.map((stage, idx) => (
                <div key={stage} className="flex flex-col items-center">
                  <div
                    className={`w-4 h-4 rounded-full ${
                      idx <= currentStageIndex
                        ? "bg-cyan-400"
                        : "bg-gray-500"
                    }`}
                  />
                  <span className="text-xs mt-1 text-gray-300 text-center">
                    {stage}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ================= QR ================= */}
        <div className={`${glass} px-6 py-4 flex justify-between items-center`}>
          <div>
            <h3 className="font-semibold">Active QR Code</h3>
            <p className="text-sm text-gray-400">
              Valid for approved requests only
            </p>
          </div>
          <img src={qrSample} alt="QR" className="w-20 h-20" />
        </div>

      </main>
    </div>
  );
};

/* ================= COMPONENTS ================= */

const StatCard = ({ title, value }) => (
  <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-xl p-6">
    <p className="text-sm text-gray-400">{title}</p>
    <p className="text-3xl text-cyan-400 mt-2">{value}</p>
  </div>
);

const ActionButton = ({ label, onClick }) => (
  <button
    onClick={onClick}
    className="px-10 py-4 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 text-black font-semibold hover:scale-105 transition"
  >
    {label}
  </button>
);

export default StudentDashboard;
