import { Routes, Route } from "react-router-dom";
import Login from "./components/Login.jsx";
import StudentDashboard from "./components/Student_Dashboard/StudentDashboard.jsx";
// import StaffDashboard and AdminDashboard if you have them

import "./App.css";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/student-dashboard" element={<StudentDashboard />} />
      {/* Add routes for staff/admin if needed */}
    </Routes>
  );
};

export default App;