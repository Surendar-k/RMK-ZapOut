import { useEffect, useState } from "react";
import { Download, FileX } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import logo from "../../assets/zaplogo.png";
import { getStudentHistory } from "../../services/historyService.jsx";

// Format date as dd/mm/yyyy
const formatDate = (dateStr) => {
  if (!dateStr) return "-";
  const date = new Date(dateStr);
  if (isNaN(date)) return "-";
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

export default function StudentHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  const userId = JSON.parse(localStorage.getItem("user"))?.id;

  useEffect(() => {
    if (userId) fetchHistory();
    else setLoading(false);
  }, [userId]);

  const fetchHistory = async () => {
    try {
      const res = await getStudentHistory(userId);
      setHistory(res.data || []);
    } catch (err) {
      console.error("History Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Filter based on type and status
  const filteredHistory = history.filter(
    (r) =>
      (typeFilter === "All" || r.type === typeFilter) &&
      (statusFilter === "All" || r.status === statusFilter)
  );

  // Stats helpers
  const countStatus = (type, status) =>
    history.filter((r) => r.type === type && r.status === status).length;

  const totalByType = (type) =>
    history.filter((r) => r.type === type).length;

  // CSV Export
  const downloadCSV = () => {
    if (!filteredHistory.length) return;

    const headers = [
      "Type",
      "Date Range",
      "Total Days",
      "Event",
      "Status",
      "Remarks",
    ];

    const rows = filteredHistory.map((r) => [
      r.type,
      r.type === "Gate Pass"
        ? `${formatDate(r.gp_from)} → ${formatDate(r.gp_to)}`
        : `${formatDate(r.od_from)} → ${formatDate(r.od_to)}`,
      r.type === "Gate Pass" ? `${r.gp_days || "-"} day(s)` : `${r.od_days || "-"} day(s)`,
      r.type === "Gate Pass" ? r.gp_reason || "-" : r.od_event_name || "-",
      r.status,
      r.remark || "-",
    ]);

    const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "request-history.csv";
    link.click();
  };

  // PDF Export
  const downloadPDF = () => {
    if (!filteredHistory.length) return;

    const doc = new jsPDF();
    doc.addImage(logo, "PNG", 10, 8, 28, 18);
    doc.setFontSize(16);
    doc.text("Student Request History", 105, 18, { align: "center" });

    autoTable(doc, {
      startY: 32,
      head: [["Type", "Date Range", "Total Days", "Event", "Status", "Remarks"]],
      body: filteredHistory.map((r) => [
        r.type,
        r.type === "Gate Pass"
          ? `${formatDate(r.gp_from)} → ${formatDate(r.gp_to)}`
          : `${formatDate(r.od_from)} → ${formatDate(r.od_to)}`,
        r.type === "Gate Pass" ? `${r.gp_days || "-"} day(s)` : `${r.od_days || "-"} day(s)`,
        r.type === "Gate Pass" ? r.gp_reason || "-" : r.od_event_name || "-",
        r.status,
        r.remark || "-",
      ]),
      theme: "grid",
      styles: { fontSize: 10 },
      headStyles: { fillColor: [6, 182, 212] },
    });

    doc.save("request-history.pdf");
  };

  if (loading)
    return <p className="text-white text-center">Loading history...</p>;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl text-cyan-300 font-semibold">
        Student Request History
      </h1>

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <StatCard title="Total Gate Pass" value={totalByType("Gate Pass")} />
        <StatCard title="Gate Pass Approved" value={countStatus("Gate Pass", "Approved")} />
        <StatCard title="Gate Pass Rejected" value={countStatus("Gate Pass", "Rejected")} />
        <StatCard title="Total On-Duty" value={totalByType("On-Duty")} />
        <StatCard title="On-Duty Approved" value={countStatus("On-Duty", "Approved")} />
        <StatCard title="On-Duty Rejected" value={countStatus("On-Duty", "Rejected")} />
      </div>

      {/* FILTER + EXPORT */}
      <div className="glass-card p-4 flex flex-wrap items-center gap-4">
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
          <option className="text-black">Pending</option>
        </select>

        <button
          onClick={downloadPDF}
          disabled={!filteredHistory.length}
          className="ml-auto btn-secondary flex items-center gap-2 disabled:opacity-40"
        >
          <Download size={16} /> Export PDF
        </button>

        <button
          onClick={downloadCSV}
          disabled={!filteredHistory.length}
          className="btn-secondary flex items-center gap-2 disabled:opacity-40"
        >
          <Download size={16} /> Export CSV
        </button>
      </div>

      {/* EMPTY STATE */}
      {!filteredHistory.length ? (
        <div className="glass-card p-10 text-center text-white/70 flex flex-col items-center gap-3">
          <FileX size={42} />
          <p>No request history found.</p>
        </div>
      ) : (
        <div className="glass-card overflow-x-auto">
          <table className="w-full text-sm text-white">
            <thead className="border-b border-white/20">
              <tr>
                <th className="p-3 text-left">Type</th>
                <th className="p-3 text-left">Date Range</th>
                <th className="p-3 text-left">Total Days</th>
                <th className="p-3 text-left">Event</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Remarks</th>
              </tr>
            </thead>
            <tbody>
              {filteredHistory.map((r) => (
                <tr key={r.id} className="border-b border-white/10">
                  <td className="p-3">{r.type}</td>
                  <td className="p-3">
                    {r.type === "Gate Pass"
                      ? `${formatDate(r.gp_from)} → ${formatDate(r.gp_to)}`
                      : `${formatDate(r.od_from)} → ${formatDate(r.od_to)}`}
                  </td>
                  <td className="p-3">
                    {r.type === "Gate Pass"
                      ? r.gp_days
                        ? `${r.gp_days} day(s)`
                        : "-"
                      : r.od_days
                      ? `${r.od_days} day(s)`
                      : "-"}
                  </td>
                  <td className="p-3">
                    {r.type === "Gate Pass" ? r.gp_reason || "-" : r.od_event_name || "-"}
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
      )}
    </div>
  );
}

/* -------------------- Reusable Components -------------------- */
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
          : status === "Rejected"
          ? "bg-red-500/20 text-red-400"
          : "bg-yellow-500/20 text-yellow-400"
      }`}
    >
      {status}
    </span>
  );
}
