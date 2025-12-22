import { Outlet, useNavigate } from "react-router-dom";
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

const SIDEBAR_WIDTH = "260px";

const StudentLayout = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full text-white bg-gradient-to-br from-[#020617] via-[#041b32] to-[#020617]">

      {/* ================= FIXED SIDEBAR ================= */}
      <aside
        className="fixed top-0 left-0 h-screen bg-gradient-to-b from-[#071c2f] to-[#04111f] px-6 py-6 flex flex-col justify-between border-r border-white/10"
        style={{ width: SIDEBAR_WIDTH }}
      >
        {/* LOGO */}
        <div className="mb-10 flex justify-center">
          <img
            src={logo}
            alt="RMK ZapOut"
            className="w-44 object-contain"
          />
        </div>

        {/* NAVIGATION */}
        <nav className="space-y-2 flex-1">
          <SidebarItem
            icon={<Home size={18} />}
            label="Home"
            onClick={() => navigate("/student-dashboard")}
          />
          <SidebarItem
            icon={<FileText size={18} />}
            label="Requests"
            onClick={() => navigate("/requests")}
          />
          <SidebarItem
            icon={<History size={18} />}
            label="History"
            onClick={() => navigate("/history")}
          />
          <SidebarItem
            icon={<Bell size={18} />}
            label="Notifications"
            onClick={() => navigate("/notifications")}
          />
          <SidebarItem
            icon={<User size={18} />}
            label="Profile"
            onClick={() => navigate("/profile")}
          />
          <SidebarItem
            icon={<HelpCircle size={18} />}
            label="Need Help"
            onClick={() => navigate("/need-help")}
          />
        </nav>

        {/* LOGOUT */}
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-3 bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl hover:bg-red-500/20 transition"
        >
          <LogOut size={18} />
          Logout
        </button>
      </aside>

      {/* ================= PAGE CONTENT (SCROLLS) ================= */}
      <main
        className="min-h-screen overflow-y-auto p-6"
        style={{ marginLeft: SIDEBAR_WIDTH }}
      >
        <Outlet />
      </main>

    </div>
  );
};

/* ================= SIDEBAR ITEM ================= */

const SidebarItem = ({ icon, label, onClick }) => (
  <button
    onClick={onClick}
    className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-gray-300 hover:bg-white/10 transition"
  >
    {icon}
    <span>{label}</span>
  </button>
);

export default StudentLayout;
