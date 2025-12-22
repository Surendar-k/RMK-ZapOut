import { Routes, Route } from "react-router-dom";
import Login from "./components/Login.jsx";
import StudentDashboard from "./components/Student_Dashboard/StudentDashboard.jsx";
import StudentProfile from "./components/Student_Dashboard/StudentProfile.jsx";

import "./App.css";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />

      {/* Student Routes */}
      <Route path="/student-dashboard" element={<StudentDashboard />} />
      <Route path="/profile" element={<StudentProfile />} />

      {/* Future routes (keep commented) */}
      {/* <Route path="/staff-dashboard" element={<StaffDashboard />} /> */}
      {/* <Route path="/admin-dashboard" element={<AdminDashboard />} /> */}
    </Routes>
  );
};

export default App;
