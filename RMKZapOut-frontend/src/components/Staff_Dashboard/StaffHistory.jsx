import { useState } from "react";
import {
  FileText,
  Download,
  CheckCircle,
  XCircle,
  Calendar,
} from "lucide-react";
import logo from "../../assets/zaplogo.png";

const dummyData = [
  {
    id: 1,
    student: "Arun Kumar",
    type: "Gate Pass",
    reason: "Family Function",
    appliedDate: "12/12/2025",
    status: "Approved",
  },
  {
    id: 2,
    student: "Priya S",
    type: "On-Duty",
    reason: "Hackathon",
    appliedDate: "13/12/2025",
    status: "Rejected",
  },
  {
    id: 3,
    student: "Vignesh R",
    type: "Gate Pass",
    reason: "Medical",
    appliedDate: "14/12/2025",
    status: "Approved",
  },
];

const StaffHistory = () => {
  const [filter, setFilter] = useState("All");

  const filteredData = dummyData.filter((item) => {
    if (filter === "All") return true;
    if (filter === "Gate Pass") return item.type === "Gate Pass";
    if (filter === "On-Duty") return item.type === "On-Duty";
    if (filter === "Approved") return item.status === "Approved";
    if (filter === "Rejected") return item.status === "Rejected";
    return true;
  });

  const count = (type, status) =>
    dummyData.filter(
      (d) =>
        (!type || d.type === type) &&
        (!status || d.status === status)
    ).length;

  return (
    <div className="p-6 text-white">
      {/* HEADER */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Request History</h1>
        <p className="text-sm text-cyan-300">
          Complete record of student requests
        </p>
      </div>

      {/* COUNT CARDS */}
      <div className="grid grid-cols-6 gap-4 mb-6">
        <StatCard title="Gate Pass" value={count("Gate Pass")} />
        <StatCard
          title="Approved"
          value={count("Gate Pass", "Approved")}
          color="green"
        />
        <StatCard
          title="Rejected"
          value={count("Gate Pass", "Rejected")}
          color="red"
        />
        <StatCard title="On-Duty" value={count("On-Duty")} />
        <StatCard
          title="Approved"
          value={count("On-Duty", "Approved")}
          color="green"
        />
        <StatCard
          title="Rejected"
          value={count("On-Duty", "Rejected")}
          color="red"
        />
      </div>

      {/* FILTER + DOWNLOAD */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-2">
          {["All", "Gate Pass", "On-Duty", "Approved", "Rejected"].map(
            (f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-lg backdrop-blur-md border
                ${
                  filter === f
                    ? "bg-white/20 border-cyan-400"
                    : "border-white/10 text-cyan-300"
                }`}
              >
                {f}
              </button>
            )
          )}
        </div>

        <div className="flex gap-2">
          <button className="glass-btn">
            <Download size={16} /> CSV
          </button>
          <button className="glass-btn">
            <FileText size={16} /> PDF
          </button>
        </div>
      </div>

      {/* TABLE */}
      <div className="overflow-hidden rounded-xl border border-white/10 backdrop-blur-xl">
        <table className="w-full text-sm">
          <thead className="bg-white/10 text-cyan-300">
            <tr>
              <th className="p-3 text-left">Student</th>
              <th className="p-3">Type</th>
              <th className="p-3">Reason</th>
              <th className="p-3">
                <Calendar size={14} className="inline" /> Date
              </th>
              <th className="p-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((req) => (
              <tr
                key={req.id}
                className="border-t border-white/5 hover:bg-white/5"
              >
                <td className="p-3">{req.student}</td>
                <td className="p-3">{req.type}</td>
                <td className="p-3">{req.reason}</td>
                <td className="p-3">{req.appliedDate}</td>
                <td className="p-3">
                  {req.status === "Approved" ? (
                    <span className="text-green-400 flex items-center gap-1">
                      <CheckCircle size={14} /> Approved
                    </span>
                  ) : (
                    <span className="text-red-400 flex items-center gap-1">
                      <XCircle size={14} /> Rejected
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

/* ===== SMALL COMPONENTS ===== */

const StatCard = ({ title, value, color }) => (
  <div
    className={`rounded-xl p-4 text-center backdrop-blur-xl border border-white/10
    ${color === "green" && "text-green-400"}
    ${color === "red" && "text-red-400"}`}
  >
    <p className="text-xs text-cyan-300">{title}</p>
    <h2 className="text-xl font-semibold">{value}</h2>
  </div>
);

export default StaffHistory;
