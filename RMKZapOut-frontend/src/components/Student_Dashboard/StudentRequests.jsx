import { useEffect, useState } from "react";
import { Edit, Trash2 } from "lucide-react";
import {
  fetchOnDutyRequests,
  cancelOnDutyRequest,
} from "../../services/onDutyService.jsx";

const glass =
  "bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-xl";

const FILTERS = ["All", "Gate Pass", "On-Duty"];

/* 🔹 Days calculation */
const calculateDays = (from, to) => {
  if (!from || !to) return "-";
  const start = new Date(from);
  const end = new Date(to);
  return Math.floor((end - start) / (1000 * 60 * 60 * 24)) + 1;
};

const StudentRequests = () => {
  const sessionUser = JSON.parse(localStorage.getItem("user"));
  const [requests, setRequests] = useState([]);
  const [activeFilter, setActiveFilter] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const res = await fetchOnDutyRequests(sessionUser.id);
      setRequests(res.data.requests || []);
      setLoading(false);
    };
    load();
  }, [sessionUser.id]);

  const filteredRequests =
    activeFilter === "All"
      ? requests
      : requests.filter((r) =>
          activeFilter === "Gate Pass"
            ? r.request_type === "GATE_PASS"
            : r.request_type === "ON_DUTY"
        );

  /* 🔹 HEADER TEXT LOGIC */
  const renderHeaderText = () => {
    if (activeFilter === "Gate Pass") {
       return (
        <>
        <span className="text-white">Live </span>
        <span className="text-[#00d3d1]">Gate Pass </span>
        <span className="text-white">Requests </span>

        </>
      )
    }
    if (activeFilter === "On-Duty") {
      return (
        <>
        <span className="text-white">Live </span>
        <span className="text-[#00d3d1]">On-Duty </span>
        <span className="text-white"> Requests </span>

        </>
      );
      
    }
    return (
      <>
        <span className="text-white">Live </span>
        <span className="text-[#00d3d1]">Requests</span>
      </>
    );
  };

  if (loading) return <p className="text-white p-6">Loading…</p>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#020617] via-[#041b32] to-[#020617] text-white">

      {/* ================= STATIC HEADER ================= */}
      <div className="sticky top-0 z-20 px-10 pt-8 pb-6 bg-gradient-to-b from-[#020617]/95 to-transparent backdrop-blur">

        <h1 className="text-2xl font-semibold mb-4">
          {renderHeaderText()}
        </h1>

        <div className="flex gap-4">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-6 py-3 rounded-2xl text-sm font-medium transition ${
                activeFilter === f
                  ? "bg-white/25 border border-white/40 text-white"
                  : "bg-white/10 border border-white/20 text-[#00d3d1]"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* ================= REQUEST LIST ================= */}
      <div className="px-10 pb-10">
        {filteredRequests.map((r) => (
          <div key={r.id} className={`${glass} p-6 mb-8`}>

            {/* INNER INFO CARDS */}
            <div className="grid grid-cols-3 gap-6 mb-6">
              <InfoCard label="Event Type" value={r.event_type} />
              <InfoCard label="Event Name" value={r.event_name} />
              <InfoCard label="College" value={r.college} />
              <InfoCard label="Location" value={r.location} />
              <InfoCard
                label="Duration"
                value={`${r.from_date?.split("T")[0]} → ${r.to_date?.split("T")[0]}`}
              />
              <InfoCard
                label="No. of Days"
                value={`${calculateDays(r.from_date, r.to_date)} Days`}
              />
            </div>

            {/* APPROVAL PROGRESS (UNCHANGED) */}
            <h3 className="font-semibold mb-4">Approval Progress</h3>

            <div className="relative mb-6">
              <div className="absolute top-[10px] left-0 right-0 h-[2px] bg-white/10" />
              <div className="flex justify-between relative z-10">
                {["Submitted", "Counsellor", "Coordinator", "HOD", "Warden"].map(
                  (s) => (
                    <div key={s} className="flex flex-col items-center">
                      <div className="w-4 h-4 rounded-full bg-cyan-400" />
                      <span className="text-xs mt-2 text-gray-300">{s}</span>
                      <span className="text-xs text-gray-400">Pending</span>
                    </div>
                  )
                )}
              </div>
            </div>

            {/* ACTIONS */}
            <div className="flex gap-4">
              <button className="flex items-center gap-2 px-5 py-2 rounded bg-yellow-500 text-black">
                <Edit size={16} /> Edit
              </button>
              <button
                onClick={() => cancelOnDutyRequest(r.id)}
                className="flex items-center gap-2 px-5 py-2 rounded bg-red-500/20 text-red-400 border border-red-500/30"
              >
                <Trash2 size={16} /> Cancel
              </button>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
};

const InfoCard = ({ label, value }) => (
  <div className="bg-white/10 backdrop-blur border border-white/20 rounded-xl p-4">
    <p className="text-xs text-gray-400 mb-1">{label}</p>
    <p className="text-sm font-semibold">{value || "-"}</p>
  </div>
);

export default StudentRequests;
