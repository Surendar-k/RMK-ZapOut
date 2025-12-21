import { useNavigate } from "react-router-dom";
import {
  Home,
  FileText,
  History,
  Bell,
  User,
  HelpCircle,
  LogOut,
} from "lucide-react";
import logo from "../../assets/zaplogo.png";
import qrSample from "../../assets/sample-qr.png";

const StudentDashboard = () => {
  const navigate = useNavigate();

  const studentName = "Santhosh V";
  const studentInfo = "IT | 8 Sec B | 11172220309X";

  const today = new Date();
  const day = today.toLocaleDateString("en-US", { weekday: "long" });
  const date = today.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const stages = [
    "Submitted",
    "Counsellor",
    "Branch Co-Ordinator",
    "HOD",
    "Warden",
    "Watchman",
  ];
  const activeStageIndex = 1;

  return (
    <div className="h-screen w-screen overflow-hidden flex text-white
      bg-gradient-to-br from-[#020617] via-[#031b34] to-[#020617] relative">

      {/* enhanced corner glow */}
      <div className="absolute -top-48 -left-48 w-[500px] h-[500px] bg-cyan-400/30 blur-[200px]" />
      <div className="absolute -bottom-48 -right-48 w-[500px] h-[500px] bg-blue-500/30 blur-[200px]" />

      {/* ================= SIDEBAR ================= */}
      <aside className="relative z-10 w-64 bg-gradient-to-b from-[#0b1e2d] to-[#071624]
        flex flex-col px-5 py-6">
        <img src={logo} alt="RMK ZapOut" className="w-44 mb-10" />

        <nav className="flex-1 space-y-2 text-sm">
          <SideItem icon={Home} label="Home" active onClick={() => navigate("/student-dashboard")} />
          <SideItem icon={FileText} label="Requests" />
          <SideItem icon={History} label="History" />
          <SideItem icon={Bell} label="Notifications" />
          <SideItem icon={User} label="Profile" />
          <SideItem icon={HelpCircle} label="Need Help" />
        </nav>

        <button
          onClick={() => navigate("/")}
          className="mt-6 flex items-center gap-2 justify-center
            py-3 rounded-lg bg-red-500/20
            border border-red-400/40 text-red-400"
        >
          <LogOut size={16} /> Logout
        </button>
      </aside>

      {/* ================= MAIN ================= */}
      <main className="relative z-10 flex-1 px-10 py-8">

        {/* HEADER */}
        <div className="flex justify-between items-start mb-16">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-cyan-500/20
              flex items-center justify-center text-lg">
              S
            </div>
            <div>
              <h1 className="text-lg font-semibold">
                Hello! <span className="text-cyan-400">{studentName}</span>
              </h1>
              <p className="text-sm text-white/60">{studentInfo}</p>
            </div>
          </div>

          <div className="text-sm text-white/70">
            {day} <span className="opacity-40 mx-2">|</span> {date}
          </div>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-3 gap-10 mb-14">
          <GlassStat title="Active Requests" value="1" />
          <GlassStat title="Total Requests" value="12" />
          <GlassStat title="Approval Rate" value="92%" />
        </div>

        {/* APPLY */}
        <div className="flex justify-center gap-12 mb-14">
          <ActionButton text="Apply Gate Pass" />
          <ActionButton text="Apply On-Duty" />
        </div>

        {/* REQUEST TRACKER (GLASS CARD FIXED) */}
        <div className="glass-card mb-6">
          <h3 className="text-lg mb-6">Request Tracker</h3>

          <div className="relative flex justify-between items-center">
            {/* base line (centered on dots) */}
            <div className="absolute left-0 right-0 top-1/2
              h-[2px] bg-white/15 -translate-y-1/2" />

            {/* active line dot ➜ dot */}
            <div
              className="absolute top-1/2 h-[2px] bg-cyan-400 -translate-y-1/2"
              style={{
                width: `${(activeStageIndex / (stages.length - 1)) * 100}%`,
              }}
            />

            {stages.map((stage, index) => (
              <div key={stage} className="relative z-10 text-center">
                <div
                  className={`w-3 h-3 rounded-full ${
                    index <= activeStageIndex
                      ? "bg-cyan-400"
                      : "bg-white/30"
                  }`}
                />
                <p className="text-xs mt-2 text-white/70 whitespace-nowrap">
                  {stage}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* GAP BELOW TRACKER */}
        <div className="h-4" />

        {/* QR */}
        <div className="glass-card flex justify-between items-center">
          <div>
            <h3 className="text-lg">Active QR Code</h3>
            <p className="text-sm text-white/60">
              Valid for approved requests only
            </p>
          </div>
          <img
            src={qrSample}
            alt="QR"
            className="w-24 h-24 border border-cyan-400/40 rounded-lg"
          />
        </div>
      </main>
    </div>
  );
};

/* ===== REUSABLES ===== */

const SideItem = ({ icon: Icon, label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg
      transition ${
        active ? "bg-blue-500/20 text-blue-400" : "hover:bg-white/5"
      }`}
  >
    <Icon size={18} /> {label}
  </button>
);

const GlassStat = ({ title, value }) => (
  <div className="rounded-2xl p-6 bg-white/10
    backdrop-blur-md border border-white/20">
    <p className="text-white/60">{title}</p>
    <p className="text-3xl text-cyan-400 mt-2">{value}</p>
  </div>
);

const ActionButton = ({ text }) => (
  <button
    className="px-12 py-4 rounded-xl
      bg-gradient-to-r from-cyan-400 to-blue-500
      text-black font-semibold"
  >
    {text}
  </button>
);

export default StudentDashboard;
