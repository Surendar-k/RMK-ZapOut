import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  Bell,
  User,
} from "lucide-react";

import { fetchStudentProfile } from "../../services/studentProfileService.jsx";

const StudentDashboard = () => {
  const navigate = useNavigate();

  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [now, setNow] = useState(new Date());

  const glass =
    "bg-black/40 backdrop-blur-2xl border border-white/25 rounded-2xl shadow-2xl";

  /* ================= LIVE CLOCK ================= */
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  /* ================= FETCH STUDENT PROFILE ================= */
  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      navigate("/");
      return;
    }

    const user = JSON.parse(storedUser);

    fetchStudentProfile(user.id)
      .then((res) => {
        setStudent(res.data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white bg-[#020617]">
        Loading dashboard...
      </div>
    );
  }

  if (!student) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white bg-[#020617]">
        Unable to load dashboard
      </div>
    );
  }

  return (
  <div className="h-full w-full text-white bg-gradient-to-br from-[#020617] via-[#041b32] to-[#020617]">
        <main className="min-h-screen flex flex-col overflow-y-auto px-8 py-6">

        {/* ================= HEADER ================= */}
        <div className="mb-8">
          <h1 className="text-3xl font-semibold">
            Welcome to{" "}
            <span className="text-cyan-300">Student Dashboard</span>
          </h1>
          <p className="text-gray-300 mt-2 max-w-3xl">
            Manage your gate pass and on-duty requests, track approval status,
            and stay informed about your campus activities.
          </p>
        </div>

        {/* ================= GREETING ================= */}
        <div className="flex justify-between items-start mb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-cyan-400/20 flex items-center justify-center">
              <User className="text-cyan-300" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-white">
                Hello,{" "}
                <span className="text-cyan-300">
                  {student.username}
                </span>
              </h1>
              <p className="text-sm text-gray-300 mt-1">
                {student.role} | {student.register_number} |{" "}
                <span className="text-cyan-200">
                  {student.student_type}
                </span>
              </p>
            </div>
          </div>

          <div className="text-right text-sm text-gray-300">
            <p>{now.toDateString()}</p>
            <p className="text-cyan-300 font-semibold">
              {now.toLocaleTimeString()}
            </p>
          </div>
        </div>

        {/* ================= SUMMARY CARDS ================= */}
        <div className="grid grid-cols-4 gap-8 mb-8">
          <SummaryCard
  title="Total Requests"
  value="12"
  icon={<FileText />}
  iconClass="bg-cyan-400/20 text-cyan-300"
/>

<SummaryCard
  title="Pending"
  value="2"
  icon={<Clock />}
  iconClass="bg-yellow-400/20 text-yellow-300"
/>

<SummaryCard
  title="Approved"
  value="9"
  icon={<CheckCircle />}
  iconClass="bg-green-400/20 text-green-300"
/>

<SummaryCard
  title="Rejected"
  value="1"
  icon={<XCircle />}
  iconClass="bg-red-400/20 text-red-300"
/>

        </div>

        {/* ================= APPLY BUTTONS ================= */}
        <div
          className={`grid ${
            student.student_type?.toLowerCase() === "hosteller"
              ? "grid-cols-2"
              : "grid-cols-1"
          } gap-8 mb-10`}
        >
          {student.student_type?.toLowerCase() === "hosteller" && (
            <ApplyCard
              title="Apply Gate Pass"
              onClick={() => navigate("/student/apply-gatepass")}
            />
          )}

          <ApplyCard
            title="Apply On-Duty"
            onClick={() => navigate("/student/apply-od")}
          />
        </div>

        {/* ================= MAIN CONTENT ================= */}
        <div className="grid grid-cols-2 gap-8 flex-1">

          <div className={`${glass} p-6`}>
            <h2 className="flex items-center gap-2 text-xl font-bold text-white mb-6">
              <FileText className="text-cyan-300" />
              Live Requests
            </h2>

            <RequestItem
              title="Gate Pass"
              subtitle="Waiting for Counsellor"
              status="Pending"
            />
            <RequestItem
              title="On-Duty"
              subtitle="Approved by Counsellor"
              status="Approved"
            />
          </div>

          <div className={`${glass} p-6`}>
            <h2 className="flex items-center gap-2 text-xl font-bold text-white mb-6">
              <Bell className="text-cyan-300" />
              Notifications
            </h2>

            <NotificationItem text="Gate Pass request submitted" />
            <NotificationItem text="On-Duty approved by Counsellor" />
          </div>

        </div>
      </main>
    </div>
  );
};

/* ================= COMPONENTS ================= */

const SummaryCard = ({ title, value, icon, iconClass }) => (
  <div className="bg-black/40 backdrop-blur-2xl border border-white/25 rounded-2xl shadow-2xl p-6 flex items-center justify-between">
    <div>
      <p className="text-sm text-gray-300 tracking-wide">{title}</p>
      <p className="text-4xl font-bold text-white mt-1">{value}</p>
    </div>
    <div className={`p-4 rounded-xl ${iconClass}`}>
      {icon}
    </div>
  </div>
);


const ApplyCard = ({ title, onClick }) => (
  <div
    onClick={onClick}
    className="cursor-pointer bg-gradient-to-r from-cyan-300 to-blue-400 text-black rounded-2xl p-6 shadow-2xl hover:scale-[1.03] transition border border-black/20"
  >
    <h3 className="text-xl font-semibold">{title}</h3>
    <p className="text-sm mt-1 opacity-80">
      Click to submit request
    </p>
  </div>
);

const RequestItem = ({ title, subtitle, status }) => (
  <div className="bg-black/30 rounded-xl p-4 mb-4 flex justify-between items-center">
    <div>
      <p className="font-semibold text-cyan-200">{title}</p>
      <p className="text-sm text-gray-300">{subtitle}</p>
    </div>
    <span
      className={
        status === "Approved"
          ? "text-green-400 font-semibold"
          : "text-yellow-400 font-semibold"
      }
    >
      {status}
    </span>
  </div>
);

const NotificationItem = ({ text }) => (
  <div className="bg-black/30 rounded-xl p-4 mb-4 text-sm text-gray-200">
    {text}
  </div>
);

export default StudentDashboard;
