import { Users, FileText, Clock, CheckCircle, XCircle, Bell } from "lucide-react";

const StatCard = ({ title, value, icon, color }) => (
  <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 flex items-center justify-between hover:bg-white/15 transition">
    <div>
      <p className="text-sm text-cyan-300">{title}</p>
      <h2 className="text-3xl font-bold text-white mt-1">{value}</h2>
    </div>
    <div className={`p-4 rounded-xl ${color}`}>
      {icon}
    </div>
  </div>
);

const StaffDashboard = ({ role = "counsellor" }) => {
  return (
    <div className="flex-1 p-8 overflow-y-auto text-white">

      {/* ================= HEADER ================= */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          {role === "hod"
            ? "HOD Dashboard"
            : role === "branch_coordinator"
            ? "Branch Coordinator Dashboard"
            : "Counsellor Dashboard"}
        </h1>
        <p className="text-cyan-300 mt-1">
          Manage students, approvals, and live requests
        </p>
      </div>

      {/* ================= STATS ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <StatCard
          title="Total Students"
          value="320"
          icon={<Users className="w-6 h-6 text-white" />}
          color="bg-cyan-600/40"
        />
        <StatCard
          title="Pending Requests"
          value="18"
          icon={<Clock className="w-6 h-6 text-white" />}
          color="bg-yellow-600/40"
        />
        <StatCard
          title="Approved"
          value="142"
          icon={<CheckCircle className="w-6 h-6 text-white" />}
          color="bg-green-600/40"
        />
        <StatCard
          title="Rejected"
          value="9"
          icon={<XCircle className="w-6 h-6 text-white" />}
          color="bg-red-600/40"
        />
      </div>

      {/* ================= LIVE REQUESTS ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* Requests */}
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-cyan-300" />
            Live Requests
          </h2>

          <div className="space-y-4">
            {[
              { name: "Arjun S", type: "Gate Pass", status: "Pending" },
              { name: "Kavya R", type: "On-Duty", status: "Pending" },
              { name: "Rahul M", type: "Gate Pass", status: "Pending" },
            ].map((req, i) => (
              <div
                key={i}
                className="flex justify-between items-center p-4 rounded-xl bg-white/5 hover:bg-white/10 transition"
              >
                <div>
                  <p className="font-semibold">{req.name}</p>
                  <p className="text-sm text-cyan-300">{req.type}</p>
                </div>
                <span className="text-yellow-300 text-sm font-medium">
                  {req.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Notifications */}
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Bell className="w-5 h-5 text-cyan-300" />
            Notifications
          </h2>

          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-white/5">
              <p className="text-sm">
                🔔 New Gate Pass request from <b>Arjun S</b>
              </p>
            </div>
            <div className="p-4 rounded-xl bg-white/5">
              <p className="text-sm">
                ✅ OD request approved for <b>Kavya R</b>
              </p>
            </div>
            <div className="p-4 rounded-xl bg-white/5">
              <p className="text-sm">
                ⏰ Return time nearing for <b>Rahul M</b>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ================= ROLE NOTE ================= */}
      {role === "hod" && (
        <div className="mt-10 backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-cyan-300 mb-2">
            HOD Privileges
          </h2>
          <ul className="list-disc ml-6 text-sm space-y-1 text-white/80">
            <li>Final authority on Gate Pass & On-Duty approvals</li>
            <li>View department-wide analytics</li>
            <li>Override approvals in special cases</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default StaffDashboard;
