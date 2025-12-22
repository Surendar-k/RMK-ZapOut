import { Routes, Route } from "react-router-dom";
import Login from "./components/Login.jsx";
import StudentLayout from "./components/Student_Dashboard/StudentLayout.jsx";
import StudentDashboard from "./components/Student_Dashboard/StudentDashboard.jsx";
import StudentProfile from "./components/Student_Dashboard/StudentProfile.jsx";
import StudentRequests from "./components/Student_Dashboard/StudentRequests.jsx";

import "./App.css";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />

      {/* STUDENT LAYOUT WITH SIDEBAR */}
      <Route element={<StudentLayout />}>
        <Route path="/student-dashboard" element={<StudentDashboard />} />
        <Route path="/requests" element={<StudentRequests />} />
        <Route path="/profile" element={<StudentProfile />} />
      </Route>
    </Routes>
  );
};

export default App;
