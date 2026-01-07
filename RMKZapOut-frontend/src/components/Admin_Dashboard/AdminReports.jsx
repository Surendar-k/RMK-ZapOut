import { useState } from "react";
import {
  FileText,
  Download,
  Calendar,
  Users,
  CheckCircle,
  XCircle,
} from "lucide-react";

const summaryData = [
  {
    student: "Arjun Kumar",
    type: "Gate Pass",
    department: "CSE",
    date: "12/09/2025",
    status: "Approved",
  },
  {
    student: "Priya Sharma",
    type: "On-Duty",
    department: "ECE",
    date: "13/09/2025",
    status: "Rejected",
  },
];

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
  const [showExport, setShowExport] = useState(false);

  /* ================= CSV EXPORT ================= */
  const exportCSV = () => {
    const headers = ["Student", "Type", "Department", "Date", "Status"];
    const rows = summaryData.map((r) =>
      [r.student, r.type, r.department, r.date, r.status].join(",")
    );

    const csvContent = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "Request_Summary_Report.csv";
    link.click();

    URL.revokeObjectURL(url);
    setShowExport(false);
  };

  /* ================= PDF EXPORT ================= */
  const exportPDF = () => {
    const win = window.open("", "_blank");

    win.document.write(`
      <html>
        <head>
          <title>Request Summary Report</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h2 { text-align: center; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #333; padding: 8px; text-align: left; }
            th { background: #f0f0f0; }
          </style>
        </head>
        <body>
          <h2>Request Summary Report</h2>
          <table>
            <thead>
              <tr>
                <th>Student</th>
                <th>Type</th>
                <th>Department</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${summaryData
                .map(
                  (r) => `
                <tr>
                  <td>${r.student}</td>
                  <td>${r.type}</td>
                  <td>${r.department}</td>
                  <td>${r.date}</td>
                  <td>${r.status}</td>
                </tr>
              `
                )
                .join("")}
            </tbody>
          </table>
        </body>
      </html>
    `);

    win.document.close();
    win.focus();
    win.print();
    setShowExport(false);
  };

  return (
    <div className="w-full min-h-screen p-8 text-white relative">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-8">
<h1 className="text-2xl font-semibold flex items-center gap-2 text-red-500">
          <FileText size={26} />
          Reports & Analytics
        </h1>

        <button
          onClick={() => setShowExport(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 transition"
        >
          <Download size={18} />
          Export Report
        </button>
      </div>

      {/* FILTERS */}
      <div className="glass-card p-6 mb-8 flex flex-wrap gap-6 items-end">
        <div>
          <label className="text-sm text-white/60">Request Type</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="mt-1 w-48 bg-[#081827] text-white border border-white/20 rounded-lg px-3 py-2 outline-none"
          >
            <option value="ALL">All</option>
            <option value="GATEPASS">Gate Pass</option>
            <option value="ONDUTY">On-Duty</option>
          </select>
        </div>

        <div>
          <label className="text-sm text-white/60">From Date</label>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="date-input"
          />
        </div>

        <div>
          <label className="text-sm text-white/60">To Date</label>
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="date-input"
          />
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-6 mb-10">
        <StatCard icon={<Users size={22} />} label="Total Requests" value="1,248" />
        <StatCard icon={<CheckCircle size={22} />} label="Approved" value="812" />
        <StatCard icon={<XCircle size={22} />} label="Rejected" value="236" />
        <StatCard icon={<FileText size={22} />} label="Gate Pass" value="654" />
        <StatCard icon={<FileText size={22} />} label="On-Duty" value="594" />
      </div>

      {/* REQUEST SUMMARY */}
      <div className="glass-card p-6 bg-white/5 border border-white/10">
        <h2 className="text-lg font-semibold mb-4">Request Summary</h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-white/60 border-b border-white/20">
              <th className="text-left py-3">Student</th>
              <th className="text-left py-3">Type</th>
              <th className="text-left py-3">Department</th>
              <th className="text-left py-3">Date</th>
              <th className="text-left py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {summaryData.map((r, i) => (
              <tr key={i} className="border-b border-white/10">
                <td className="py-3">{r.student}</td>
                <td className="py-3">{r.type}</td>
                <td className="py-3">{r.department}</td>
                <td className="py-3">{r.date}</td>
                <td
                  className={`py-3 ${
                    r.status === "Approved"
                      ? "text-green-400"
                      : "text-red-400"
                  }`}
                >
                  {r.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* EXPORT MODAL */}
      {showExport && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-[#071827]/90 backdrop-blur-xl border border-white/20 rounded-2xl w-[360px] p-6 text-center">
            <h3 className="text-lg font-semibold text-white mb-2">
              Export Report
            </h3>
            <p className="text-sm text-white/60 mb-6">
              Choose export format
            </p>

            <div className="flex justify-center gap-4">
              <button
                onClick={exportPDF}
                className="px-5 py-2 rounded-lg bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 transition"
              >
                PDF
              </button>
              <button
                onClick={exportCSV}
                className="px-5 py-2 rounded-lg bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 transition"
              >
                CSV
              </button>
            </div>

            <button
              onClick={() => setShowExport(false)}
              className="mt-6 text-sm text-white/50 hover:text-white"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <style>{`
        .date-input {
          background-color: #081827;
          color: white;
          border: 1px solid rgba(255,255,255,0.2);
          border-radius: 0.5rem;
          padding: 0.5rem 0.75rem;
        }
      `}</style>
    </div>
  );
};

export default AdminReports;
