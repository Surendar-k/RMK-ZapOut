import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { Star } from "lucide-react";
import qrSample from "../../assets/sample-qr.png";

const StudentDashboard = () => {
  const navigate = useNavigate();

  /* ================= STATE ================= */
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  /* ================= REQUEST TRACKER DATA (TEMP STATIC) ================= */
  const stages = [
    "Submitted",
    "Counsellor",
    "Branch Co-Ordinator",
    "HOD",
    "Warden",
    "Watchman",
  ];
  const currentStageIndex = 1;

  const dotPositionPercent = (index) =>
    (index / (stages.length - 1)) * 100;

  const glass =
    "bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-xl";

  /* ================= FETCH USER PROFILE ================= */
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
      navigate("/");
      return;
    }

    axios
      .get(`http://localhost:5000/api/user/profile/${user.id}`)
      .then((res) => {
        setStudent(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [navigate]);

  /* ================= LOADING STATE ================= */
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center text-white bg-[#020617]">
        Loading dashboard...
      </div>
    );
  }

  if (!student) {
    return (
      <div className="h-screen flex items-center justify-center text-white bg-[#020617]">
        Unable to load dashboard
      </div>
    );
  }

  /* ================= RENDER ================= */
  return (
    <div className="relative h-screen w-full overflow-hidden text-white bg-gradient-to-br from-[#020617] via-[#041b32] to-[#020617]">

      {/* Glow */}
      <div className="pointer-events-none absolute bottom-0 right-0 w-[420px] h-[420px] bg-cyan-400/35 blur-[150px] rounded-full" />

      <main className="h-full px-10 py-6 flex flex-col">

        {/* ================= HEADER ================= */}
        <div className="mb-8">
          <h1 className="text-3xl font-semibold">
            Welcome to{" "}
            <span className="text-cyan-400">Student Dashboard</span>
          </h1>
          <p className="text-gray-400 mt-2 max-w-3xl">
            Manage your gate pass and on-duty requests, track approval status,
            and stay informed about your campus activities.
          </p>
        </div>

        {/* ================= USER INFO ================= */}
        <div className="flex justify-between items-start mb-8">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-full bg-cyan-500/20 flex items-center justify-center font-bold">
              {student.username?.charAt(0)}
            </div>
            <div>
              <h2 className="text-lg font-semibold">
                Hello,{" "}
                <span className="text-cyan-400">
                  {student.username}
                </span>
                <span className="ml-3 px-3 py-1 text-xs rounded-full bg-green-500/20 text-green-400">
                  Inside Campus
                </span>
              </h2>
              <p className="text-sm text-gray-400">
                {student.role} | {student.register_number || "—"} |{" "}
                {student.student_type || "—"}
              </p>
            </div>
          </div>

          <p className="text-sm text-gray-300">
            {new Date().toDateString()}
          </p>
        </div>

        {/* ================= SUMMARY ================= */}
        <div className="grid grid-cols-3 gap-8 mb-8">
          <StatCard title="Active Requests" value="1" />
          <StatCard title="Total Requests" value="12" />
          <StatCard title="Approval Rate" value="92%" />
        </div>

        {/* ================= ACTIONS ================= */}
        <div className="flex justify-center gap-20 mb-8">
          <ActionButton
            label="Apply Gate Pass"
            onClick={() => navigate("/apply-gatepass")}
          />
          <ActionButton
            label="Apply On-Duty"
            onClick={() => navigate("/apply-od")}
          />
        </div>

        {/* ================= INSIGHT ================= */}
        <div className="flex justify-between mb-8">
          <p className="text-gray-300">
            <span className="text-sm text-gray-400">
              Request Pattern Insight
            </span>
            <br />
            You usually apply on Fridays 👍
          </p>

          <div className="text-right">
            <p className="text-sm text-gray-400 mb-1">
              Behaviour Score
            </p>
            <div className="flex gap-1 justify-end">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star
                  key={i}
                  size={18}
                  className={
                    i <= 4
                      ? "text-yellow-400 fill-yellow-400"
                      : "text-yellow-400"
                  }
                />
              ))}
            </div>
          </div>
        </div>

        {/* ================= REQUEST TRACKER ================= */}
        <div className={`${glass} p-6 mb-6`}>
          <h3 className="font-semibold mb-6">
            Request Tracker
          </h3>

          <div className="relative">
            <div className="absolute top-[8px] left-0 right-0 h-[2px] bg-white/10" />
            <div
              className="absolute top-[8px] h-[2px] bg-cyan-400"
              style={{
                width: `calc(${dotPositionPercent(
                  currentStageIndex
                )}% + 8px)`,
              }}
            />

            <div className="flex justify-between relative z-10">
              {stages.map((stage, idx) => (
                <div
                  key={stage}
                  className="flex flex-col items-center"
                >
                  <div
                    className={`w-4 h-4 rounded-full ${
                      idx <= currentStageIndex
                        ? "bg-cyan-400"
                        : "bg-gray-500"
                    }`}
                  />
                  <span className="text-xs mt-1 text-gray-300 text-center">
                    {stage}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ================= QR ================= */}
        <div className={`${glass} px-6 py-4 flex justify-between items-center`}>
          <div>
            <h3 className="font-semibold">
              Active QR Code
            </h3>
            <p className="text-sm text-gray-400">
              Valid for approved requests only
            </p>
          </div>
          <img
            src={qrSample}
            alt="QR"
            className="w-20 h-20"
          />
        </div>

      </main>
    </div>
  );
};

/* ================= COMPONENTS ================= */

const StatCard = ({ title, value }) => (
  <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-xl p-6">
    <p className="text-sm text-gray-400">{title}</p>
    <p className="text-3xl text-cyan-400 mt-2">
      {value}
    </p>
  </div>
);

const ActionButton = ({ label, onClick }) => (
  <button
    onClick={onClick}
    className="px-10 py-4 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 text-black font-semibold hover:scale-105 transition"
  >
    {label}
  </button>
);

export default StudentDashboard;