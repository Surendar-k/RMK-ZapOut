import {
  Users,
  UserCheck,
  GraduationCap,
  Shield,
  Building2,
  FileBarChart2,
  Bell,
  Activity,
} from "lucide-react";

const StatCard = ({ icon, title, value, color }) => (
  <div className="backdrop-blur-xl bg-white/10 border border-white/15 rounded-2xl p-5 flex items-center gap-4 hover:bg-white/15 transition">
    <div
      className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}
    >
      {icon}
    </div>
    <div>
      <p className="text-sm text-white/70">{title}</p>
      <h3 className="text-2xl font-bold text-white">{value}</h3>
    </div>
  </div>
);

const SectionCard = ({ title, children }) => (
  <div className="backdrop-blur-xl bg-white/10 border border-white/15 rounded-2xl p-6">
    <h3 className="text-lg font-semibold text-white mb-4">{title}</h3>
    {children}
  </div>
);

const AdminDashboard = () => {
  return (
    <div className="p-8 space-y-8">

      {/* ================= HEADER ================= */}
      <div>
        <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
        <p className="text-white/70 mt-1">
          System overview & administrative controls
        </p>
      </div>

      {/* ================= STATS ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Users"
          value="2,348"
          icon={<Users className="text-white" />}
          color="bg-cyan-500/80"
        />
        <StatCard
          title="Students"
          value="1,820"
          icon={<GraduationCap className="text-white" />}
          color="bg-blue-500/80"
        />
        <StatCard
          title="Staff"
          value="420"
          icon={<UserCheck className="text-white" />}
          color="bg-emerald-500/80"
        />
        <StatCard
          title="Roles"
          value="7"
          icon={<Shield className="text-white" />}
          color="bg-purple-500/80"
        />
      </div>

      {/* ================= MID SECTIONS ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* DEPARTMENTS */}
        <SectionCard title="Departments Overview">
          <div className="flex items-center justify-between mb-3 text-white/80">
            <span className="flex items-center gap-2">
              <Building2 size={18} /> Active Departments
            </span>
            <span className="font-semibold">12</span>
          </div>
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full w-[75%] bg-cyan-400 rounded-full"></div>
          </div>
        </SectionCard>

        {/* REPORTS */}
        <SectionCard title="Reports Summary">
          <div className="space-y-3 text-white/80">
            <div className="flex justify-between">
              <span className="flex items-center gap-2">
                <FileBarChart2 size={16} /> Gate Pass Reports
              </span>
              <span>1,024</span>
            </div>
            <div className="flex justify-between">
              <span className="flex items-center gap-2">
                <FileBarChart2 size={16} /> On-Duty Reports
              </span>
              <span>786</span>
            </div>
          </div>
        </SectionCard>
      </div>

      {/* ================= BOTTOM SECTIONS ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* NOTIFICATIONS */}
        <SectionCard title="Recent Notifications">
          <ul className="space-y-3 text-white/80 text-sm">
            <li className="flex justify-between">
              <span>New student registered</span>
              <Bell size={14} />
            </li>
            <li className="flex justify-between">
              <span>Staff role updated</span>
              <Bell size={14} />
            </li>
            <li className="flex justify-between">
              <span>Department added</span>
              <Bell size={14} />
            </li>
          </ul>
        </SectionCard>

        {/* AUDIT LOGS */}
        <SectionCard title="Audit Logs">
          <ul className="space-y-3 text-white/80 text-sm">
            <li className="flex justify-between">
              <span>Admin updated permissions</span>
              <Activity size={14} />
            </li>
            <li className="flex justify-between">
              <span>HOD approved request</span>
              <Activity size={14} />
            </li>
            <li className="flex justify-between">
              <span>User account disabled</span>
              <Activity size={14} />
            </li>
          </ul>
        </SectionCard>

        {/* SYSTEM STATUS */}
        <SectionCard title="System Status">
          <div className="space-y-3 text-sm">
            <div className="flex justify-between text-white/80">
              <span>Server</span>
              <span className="text-green-400">Online</span>
            </div>
            <div className="flex justify-between text-white/80">
              <span>Database</span>
              <span className="text-green-400">Connected</span>
            </div>
            <div className="flex justify-between text-white/80">
              <span>API Health</span>
              <span className="text-green-400">Stable</span>
            </div>
          </div>
        </SectionCard>
      </div>
    </div>
  );
};

export default AdminDashboard;
