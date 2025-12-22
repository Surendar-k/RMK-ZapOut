import { Routes, Route } from "react-router-dom";
import Login from "./components/Login.jsx";
import StudentLayout from "./components/Student_Dashboard/StudentLayout.jsx";
import StudentDashboard from "./components/Student_Dashboard/StudentDashboard.jsx";
import StudentProfile from "./components/Student_Dashboard/StudentProfile.jsx";
import StudentRequests from "./components/Student_Dashboard/StudentRequests.jsx";
import StudentHistory from "./components/Student_Dashboard/StudentHistory.jsx";
import StudentNotifications from "./components/Student_Dashboard/StudentNotifications.jsx";
import NeedHelp from "./components/Student_Dashboard/NeedHelp.jsx";

import "./App.css";
import GatepassForm from "./components/Student_Dashboard/GatepassForm.jsx";
import OnDutyForm from "./components/Student_Dashboard/OnDutyForm.jsx";

const App = () => {
  return (
    <Routes>
      {/* LOGIN */}
      <Route path="/" element={<Login />} />

      {/* STUDENT AREA (LAYOUT WRAPS PAGES) */}
      <Route element={<StudentLayout />}>
        <Route path="/student-dashboard" element={<StudentDashboard />} />
        <Route path="/requests" element={<StudentRequests />} />
        <Route path="/profile" element={<StudentProfile />} />
        <Route path="/history" element={<StudentHistory />} />
        <Route path="/notifications" element={<StudentNotifications />} />
        <Route path="/need-help" element={<NeedHelp />} />
        <Route path="/apply-gatepass" element={<GatepassForm />} />
        <Route path="/apply-od" element={<OnDutyForm />} />
      </Route>
    </Routes>
  );
};

export default App;