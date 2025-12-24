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
    "bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-xl";

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

  /* ================= ROLE LOGIC ================= */

  return (
    <div className="h-full w-full text-white bg-gradient-to-br from-[#020617] via-[#041b32] to-[#020617]">

      <main className="h-full px-10 py-6 flex flex-col overflow-y-auto">

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

        {/* ================= GREETING ================= */}
        <div className="flex justify-between items-start mb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-cyan-500/20 flex items-center justify-center">
              <User className="text-cyan-400" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold">
                Hello,{" "}
                <span className="text-cyan-400">
                  {student.username}
                </span>
              </h1>
              <p className="text-sm text-gray-400 mt-1">
                {student.role} | {student.register_number} |{" "}
                <span className="text-cyan-300">
                  {student.student_type}
                </span>
              </p>
            </div>
          </div>

          <div className="text-right text-sm text-gray-300">
            <p>{now.toDateString()}</p>
            <p className="text-cyan-400 font-medium">
              {now.toLocaleTimeString()}
            </p>
          </div>
        </div>

        {/* ================= SUMMARY CARDS ================= */}
        <div className="grid grid-cols-4 gap-8 mb-8">
          <SummaryCard title="Total Requests" value="12" icon={<FileText />} />
          <SummaryCard title="Pending" value="2" icon={<Clock />} />
          <SummaryCard title="Approved" value="9" icon={<CheckCircle />} />
          <SummaryCard title="Rejected" value="1" icon={<XCircle />} />
        </div>

        {/* ================= APPLY BUTTONS ================= */}
     
<div className={`grid ${student.student_type?.toLowerCase() === "hosteller" ? "grid-cols-2" : "grid-cols-1"} gap-8 mb-10`}>
  {/* Gate Pass → Only for Hosteller */}
  {student.student_type?.toLowerCase() === "hosteller" && (
    <ApplyCard
      title="Apply Gate Pass"
      onClick={() => navigate("/student/apply-gatepass")}
    />
  )}

  {/* On-Duty → For all students */}
  <ApplyCard
    title="Apply On-Duty"
    onClick={() => navigate("/student/apply-od")}
  />
</div>


        {/* ================= MAIN CONTENT ================= */}
        <div className="grid grid-cols-2 gap-8 flex-1">

          <div className={`${glass} p-6`}>
            <h2 className="flex items-center gap-2 text-lg font-semibold mb-6">
              <FileText className="text-cyan-400" />
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
            <h2 className="flex items-center gap-2 text-lg font-semibold mb-6">
              <Bell className="text-cyan-400" />
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

const SummaryCard = ({ title, value, icon }) => (
  <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-xl p-6 flex items-center justify-between">
    <div>
      <p className="text-sm text-gray-400">{title}</p>
      <p className="text-3xl mt-1">{value}</p>
    </div>
    <div className="p-4 rounded-xl bg-white/10 text-cyan-400">
      {icon}
    </div>
  </div>
);

const ApplyCard = ({ title, onClick }) => (
  <div
    onClick={onClick}
    className="cursor-pointer bg-gradient-to-r from-cyan-400 to-blue-500 text-black rounded-2xl p-6 shadow-xl hover:scale-105 transition"
  >
    <h3 className="text-xl font-semibold">{title}</h3>
    <p className="text-sm mt-1 opacity-80">
      Click to submit request
    </p>
  </div>
);

const RequestItem = ({ title, subtitle, status }) => (
  <div className="bg-white/5 rounded-xl p-4 mb-4 flex justify-between items-center">
    <div>
      <p className="font-medium text-cyan-300">{title}</p>
      <p className="text-sm text-gray-400">{subtitle}</p>
    </div>
    <span
      className={
        status === "Approved"
          ? "text-green-400"
          : "text-yellow-400"
      }
    >
      {status}
    </span>
  </div>
);

const NotificationItem = ({ text }) => (
  <div className="bg-white/5 rounded-xl p-4 mb-4 text-sm">
    {text}
  </div>
);

export default StudentDashboard;
