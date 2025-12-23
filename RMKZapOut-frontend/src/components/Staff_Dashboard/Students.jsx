import { useState } from "react";
import {
  Search,
  UserPlus,
  Eye,
  GraduationCap,
  Mail,
  Phone,
} from "lucide-react";

const mockStudents = [
  {
    id: 1,
    name: "Arun Kumar",
    registerNo: "21IT001",
    department: "IT",
    year: "3rd Year",
    type: "Hosteller",
    email: "arun.it@rmk.edu.in",
    phone: "9876543210",
  },
  {
    id: 2,
    name: "Priya Sharma",
    registerNo: "21CSE014",
    department: "CSE",
    year: "3rd Year",
    type: "Day Scholar",
    email: "priya.cse@rmk.edu.in",
    phone: "9123456780",
  },
];

const Students = () => {
  const [search, setSearch] = useState("");

  const filteredStudents = mockStudents.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.registerNo.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      {/* ================= HEADER ================= */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-2xl font-semibold text-white">Students</h1>

        <button className="flex items-center gap-2 px-4 py-2 rounded-xl
          bg-[#00d3d1]/20 text-[#00d3d1] hover:bg-[#00d3d1]/30 transition">
          <UserPlus size={18} />
          Add Student
        </button>
      </div>

      {/* ================= SEARCH ================= */}
      <div className="relative max-w-md">
        <Search
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50"
        />
        <input
          type="text"
          placeholder="Search by name or register number"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-11 pr-4 py-3 rounded-xl
          bg-white/5 border border-white/10 text-white
          placeholder-white/50 focus:outline-none focus:ring-1 focus:ring-[#00d3d1]"
        />
      </div>

      {/* ================= STUDENT CARDS ================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredStudents.map((student) => (
          <div
            key={student.id}
            className="rounded-2xl p-5 bg-white/5 border border-white/10
            backdrop-blur-xl hover:bg-white/10 transition"
          >
            {/* TOP */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-[#00d3d1]/20
                  flex items-center justify-center text-[#00d3d1]">
                  <GraduationCap />
                </div>
                <div>
                  <p className="text-white font-medium">{student.name}</p>
                  <p className="text-xs text-white/60">
                    {student.registerNo}
                  </p>
                </div>
              </div>

              <span
                className={`text-xs px-3 py-1 rounded-full
                ${
                  student.type === "Hosteller"
                    ? "bg-green-500/20 text-green-400"
                    : "bg-blue-500/20 text-blue-400"
                }`}
              >
                {student.type}
              </span>
            </div>

            {/* DETAILS */}
            <div className="space-y-2 text-sm text-white/70">
              <p>{student.department} • {student.year}</p>

              <div className="flex items-center gap-2">
                <Mail size={14} />
                <span>{student.email}</span>
              </div>

              <div className="flex items-center gap-2">
                <Phone size={14} />
                <span>{student.phone}</span>
              </div>
            </div>

            {/* ACTION */}
            <button
              className="mt-4 w-full flex items-center justify-center gap-2
              py-2 rounded-xl bg-white/10 hover:bg-white/20
              text-white transition"
            >
              <Eye size={16} />
              View Profile
            </button>
          </div>
        ))}
      </div>

      {/* ================= EMPTY STATE ================= */}
      {filteredStudents.length === 0 && (
        <div className="text-center text-white/60 py-10">
          No students found
        </div>
      )}
    </div>
  );
};

export default Students;
