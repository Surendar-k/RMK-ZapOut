import { useState } from "react";
import {
  FileText,
  Download,
  Calendar,
  Users,
  CheckCircle,
  XCircle,
} from "lucide-react";

const StatCard = ({ icon, label, value }) => (
  <div className="glass-card flex items-center gap-4 p-5">
    <div className="p-3 rounded-xl bg-white/10">{icon}</div>
    <div>
      <p className="text-sm text-white/60">{label}</p>
      <h3 className="text-xl font-semibold text-white">{value}</h3>
    </div>
  </div>
);

const AdminReports = () => {
  const [type, setType] = useState("ALL");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  return (
    <div className="w-full min-h-screen p-8 text-white">
      {/* ================= HEADER ================= */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-semibold flex items-center gap-2">
          <FileText size={26} />
          Reports & Analytics
        </h1>

        <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 transition">
          <Download size={18} />
          Export Report
        </button>
      </div>

      {/* ================= FILTERS ================= */}
      <div className="glass-card p-6 mb-8 flex flex-wrap gap-6 items-end">
        <div>
          <label className="text-sm text-white/60">Request Type</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="mt-1 w-48 bg-white/5 border border-white/10 rounded-lg px-3 py-2 outline-none"
          >
            <option value="ALL">All</option>
            <option value="GATEPASS">Gate Pass</option>
            <option value="ONDUTY">On-Duty</option>
          </select>
        </div>

        <div>
          <label className="text-sm text-white/60">From Date</label>
          <div className="flex items-center gap-2 mt-1">
            <Calendar size={18} />
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 outline-none"
            />
          </div>
        </div>

        <div>
          <label className="text-sm text-white/60">To Date</label>
          <div className="flex items-center gap-2 mt-1">
            <Calendar size={18} />
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 outline-none"
            />
          </div>
        </div>
      </div>

      {/* ================= STATS ================= */}
      <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-6 mb-10">
        <StatCard
          icon={<Users size={22} />}
          label="Total Requests"
          value="1,248"
        />
        <StatCard
          icon={<CheckCircle size={22} />}
          label="Approved"
          value="812"
        />
        <StatCard
          icon={<XCircle size={22} />}
          label="Rejected"
          value="236"
        />
        <StatCard
          icon={<FileText size={22} />}
          label="Gate Pass"
          value="654"
        />
        <StatCard
          icon={<FileText size={22} />}
          label="On-Duty"
          value="594"
        />
      </div>

      {/* ================= TABLE ================= */}
      <div className="glass-card p-6 overflow-x-auto">
        <h2 className="text-lg font-semibold mb-4">Request Summary</h2>

        <table className="w-full text-sm">
          <thead>
            <tr className="text-white/60 border-b border-white/10">
              <th className="text-left py-3">Student</th>
              <th className="text-left py-3">Type</th>
              <th className="text-left py-3">Department</th>
              <th className="text-left py-3">Date</th>
              <th className="text-left py-3">Status</th>
            </tr>
          </thead>

          <tbody>
            {[
              {
                name: "Arjun Kumar",
                type: "Gate Pass",
                dept: "CSE",
                date: "12/09/2025",
                status: "Approved",
              },
              {
                name: "Priya Sharma",
                type: "On-Duty",
                dept: "ECE",
                date: "13/09/2025",
                status: "Rejected",
              },
            ].map((row, index) => (
              <tr
                key={index}
                className="border-b border-white/5 hover:bg-white/5 transition"
              >
                <td className="py-3">{row.name}</td>
                <td className="py-3">{row.type}</td>
                <td className="py-3">{row.dept}</td>
                <td className="py-3">{row.date}</td>
                <td
                  className={`py-3 font-medium ${
                    row.status === "Approved"
                      ? "text-green-400"
                      : "text-red-400"
                  }`}
                >
                  {row.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminReports;
