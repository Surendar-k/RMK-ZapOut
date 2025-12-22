import { useNavigate } from "react-router-dom";
import {
  Home,
  FileText,
  History,
  Bell,
  User,
  HelpCircle,
  LogOut,
  Star,
} from "lucide-react";

import logo from "../../assets/zaplogo.png";
import qrSample from "../../assets/sample-qr.png";

const StudentDashboard = () => {
  const navigate = useNavigate();

  const studentName = "Santhosh"; // ✅ V removed
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
    <div className="relative h-screen w-full flex overflow-hidden text-white bg-gradient-to-br from-[#020617] via-[#041b32] to-[#020617]">

      {/* Bottom-right cyan glow */}
      <div className="pointer-events-none absolute bottom-0 right-0 w-[420px] h-[420px] bg-cyan-400/35 blur-[150px] rounded-full" />

      {/* ================= SIDEBAR ================= */}
      <aside className="w-[260px] bg-gradient-to-b from-[#071c2f] to-[#04111f] px-6 py-6 flex flex-col justify-between">
        <div>
          <img src={logo} alt="RMK ZapOut" className="w-44 mb-10" />

          <nav className="space-y-2">
            <SidebarItem icon={<Home size={18} />} label="Home" active onClick={() => navigate("/student-dashboard")} />
            <SidebarItem icon={<FileText size={18} />} label="Requests" onClick={() => navigate("/requests")} />
            <SidebarItem icon={<History size={18} />} label="History" onClick={() => navigate("/history")} />
            <SidebarItem icon={<Bell size={18} />} label="Notifications" onClick={() => navigate("/notifications")} />
            <SidebarItem icon={<User size={18} />} label="Profile" onClick={() => navigate("/profile")} />
            <SidebarItem icon={<HelpCircle size={18} />} label="Need Help" onClick={() => navigate("/need-help")} />
          </nav>
        </div>

        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-3 bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl hover:bg-red-500/20 transition"
        >
          <LogOut size={18} />
          Logout
        </button>
      </aside>

      {/* ================= MAIN ================= */}
      <main className="flex-1 px-10 py-6">

        {/* Header */}
        <div className="flex justify-between items-start mb-10">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-full bg-cyan-500/20 flex items-center justify-center font-bold">
              S
            </div>
            <div>
              <h1 className="text-xl font-semibold">
                Hello! <span className="text-cyan-400">{studentName}</span>
                <span className="ml-3 px-3 py-1 text-xs rounded-full bg-green-500/20 text-green-400">
                  Inside Campus
                </span>
              </h1>
              <p className="text-sm text-gray-400">
                IT | 8 Sec B | {rollNo}
              </p>
            </div>
          </div>

          <p className="text-sm text-gray-300">
            Sunday &nbsp;|&nbsp; December 21, 2025
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-8 mb-10">
          <StatCard title="Active Requests" value="1" />
          <StatCard title="Total Requests" value="12" />
          <StatCard title="Approval Rate" value="92%" />
        </div>

        {/* Actions */}
        <div className="flex justify-center gap-30 mb-8">
          <ActionButton label="Apply Gate Pass" onClick={() => navigate("/apply-gatepass")} />
          <ActionButton label="Apply On-Duty" onClick={() => navigate("/apply-od")} />
        </div>

        {/* Insight + Behaviour */}
        <div className="flex justify-between mb-8">
          <p className="text-gray-300">
            <span className="text-sm text-gray-400">Request Pattern Insight</span><br />
            You usually apply on Fridays 👍
          </p>

          {/* ⭐ REAL STARS */}
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
                left: `0%`,
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

        {/* QR */}
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

const SidebarItem = ({ icon, label, onClick, active }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl transition ${
      active
        ? "bg-blue-500/20 text-blue-400"
        : "text-gray-300 hover:bg-white/5"
    }`}
  >
    {icon}
    {label}
  </button>
);

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

