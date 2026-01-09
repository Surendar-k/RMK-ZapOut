import { useState } from "react";
import { Download, AlertTriangle } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import logo from "../../assets/zaplogo.png";

const mockHistory = [
  {
    id: 1,
    type: "Gate Pass",
    fromDate: "2025-01-10",
    toDate: "2025-01-10",
    returnTime: "22:30",
    status: "Approved",
    violation: true,
    remark: "Returned late by 30 mins",
  },
  {
    id: 2,
    type: "On-Duty",
    fromDate: "2025-01-05",
    toDate: "2025-01-06",
    returnTime: "-",
    status: "Approved",
    violation: false,
    remark: "",
  },
  {
    id: 3,
    type: "Gate Pass",
    fromDate: "2024-12-20",
    toDate: "2024-12-20",
    returnTime: "-",
    status: "Rejected",
    violation: false,
    remark: "Insufficient documents",
  },
];

const formatDate = (dateStr) => {
  if (!dateStr || dateStr === "-") return "-";
  const [year, month, day] = dateStr.split("-");
  return `${day}/${month}/${year}`;
};

export default function StudentHistory() {
  const [typeFilter, setTypeFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  const filteredHistory = mockHistory.filter(
    (r) =>
      (typeFilter === "All" || r.type === typeFilter) &&
      (statusFilter === "All" || r.status === statusFilter)
  );

  const count = (type, status) =>
    mockHistory.filter((r) => r.type === type && r.status === status).length;

  const total = (type) =>
    mockHistory.filter((r) => r.type === type).length;

  const downloadCSV = () => {
    const headers = ["Type", "From Date", "To Date", "Return Time", "Status", "Remarks"];
    const rows = filteredHistory.map((r) => [
      r.type,
      formatDate(r.fromDate),
      formatDate(r.toDate),
      r.returnTime,
      r.status,
      r.remark || "-",
    ]);

    const csv =
      [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "request-history.csv";
    link.click();
  };

  const downloadPDF = () => {
    const doc = new jsPDF();

    doc.addImage(logo, "PNG", 10, 8, 30, 20);
    doc.setFontSize(16);
    doc.text("Request History", 105, 20, { align: "center" });

    autoTable(doc, {
      startY: 35,
      head: [["Type", "Date Range", "Return Time", "Status", "Remarks"]],
      body: filteredHistory.map((r) => [
        r.type,
        `${formatDate(r.fromDate)} → ${formatDate(r.toDate)}`,
        r.returnTime,
        r.status,
        r.remark || "-",
      ]),
      theme: "grid",
      styles: { fontSize: 10 },
      headStyles: { fillColor: [20, 60, 100] },
    });

    doc.save("request-history.pdf");
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl text-cyan-300 font-semibold">Request History</h1>

      <div className="grid grid-cols-6 gap-4">
        <StatCard title="Total Gate Pass" value={total("Gate Pass")} />
        <StatCard title="Gate Pass Approved" value={count("Gate Pass", "Approved")} />
        <StatCard title="Gate Pass Rejected" value={count("Gate Pass", "Rejected")} />

        <StatCard title="Total On-Duty" value={total("On-Duty")} />
        <StatCard title="On-Duty Approved" value={count("On-Duty", "Approved")} />
        <StatCard title="On-Duty Rejected" value={count("On-Duty", "Rejected")} />
    </div>


      {/* FILTER + DOWNLOAD */}
      <div className="glass-card p-4 flex items-center gap-4">
        <select
          className="input text-white"
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
        >
          <option className="text-black">All</option>
          <option className="text-black">Gate Pass</option>
          <option className="text-black">On-Duty</option>
        </select>

        <select
          className="input text-white"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option className="text-black">All</option>
          <option className="text-black">Approved</option>
          <option className="text-black">Rejected</option>
        </select>

        <button
          onClick={downloadPDF}
          className="ml-auto btn-secondary flex items-center gap-2"
        >
          <Download size={16} /> Export PDF
        </button>

        <button
          onClick={downloadCSV}
          className="btn-secondary flex items-center gap-2"
        >
          <Download size={16} /> Export CSV
        </button>
      </div>

      {/* TABLE */}
      <div className="glass-card overflow-x-auto">
        <table className="w-full text-sm text-white">
          <thead className="border-b border-white/20">
            <tr>
              <th className="p-3 text-left">Type</th>
              <th className="p-3 text-left">Date Range</th>
              <th className="p-3 text-left">Return Time</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Remarks</th>
            </tr>
          </thead>
          <tbody>
            {filteredHistory.map((r) => (
              <tr key={r.id} className="border-b border-white/10">
                <td className="p-3">{r.type}</td>
                <td className="p-3">
                  {formatDate(r.fromDate)} → {formatDate(r.toDate)}
                </td>
                <td className="p-3 flex gap-2">
                  {r.returnTime}
                  {r.violation && (
                    <AlertTriangle
                      size={16}
                      className="text-red-400"
                      title={r.remark}
                    />
                  )}
                </td>
                <td className="p-3">
                  <StatusBadge status={r.status} />
                </td>
                <td className="p-3 text-white/70">{r.remark || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StatCard({ title, value }) {
  return (
    <div className="glass-card p-4 text-center bg-white/10 border border-white/20 backdrop-blur-xl">
      <p className="text-sm text-white/70">{title}</p>
      <p className="text-2xl font-bold text-white">{value}</p>
    </div>
  );
}

function StatusBadge({ status }) {
  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-semibold ${
        status === "Approved"
          ? "bg-green-500/20 text-green-400"
          : "bg-red-500/20 text-red-400"
      }`}
    >
      {status}
    </span>
  );
}
