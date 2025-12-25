import { useState } from "react";
import {
  Users,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  Plus,
} from "lucide-react";

const studentsData = [
  {
    id: "RMK2023001",
    name: "Arun Kumar",
    dept: "CSE",
    year: "3",
    type: "Hosteller",
    counsellor: "Dr. Suresh",
    status: "Active",
  },
  {
    id: "RMK2023002",
    name: "Priya Sharma",
    dept: "IT",
    year: "2",
    type: "Dayscholar",
    counsellor: "Ms. Kavitha",
    status: "Active",
  },
  {
    id: "RMK2023003",
    name: "Rahul Verma",
    dept: "ECE",
    year: "4",
    type: "Hosteller",
    counsellor: "Dr. Anand",
    status: "Inactive",
  },
];

const AdminStudents = () => {
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("All");

  const filteredStudents = studentsData.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.id.toLowerCase().includes(search.toLowerCase());

    const matchesFilter =
      filterType === "All" || s.type === filterType;

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="p-8 space-y-6">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Users className="w-7 h-7 text-cyan-400" />
          <h1 className="text-2xl font-semibold">Students Management</h1>
        </div>

        <button className="flex items-center gap-2 px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-600 transition text-black font-medium">
          <Plus className="w-4 h-4" />
          Add Student
        </button>
      </div>

      {/* CONTROLS */}
      <div className="flex flex-wrap gap-4">
        {/* SEARCH */}
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 border border-white/20 backdrop-blur-md">
          <Search className="w-4 h-4 text-white/60" />
          <input
            type="text"
            placeholder="Search by name or ID"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent outline-none text-sm text-white placeholder-white/50"
          />
        </div>

        {/* FILTER */}
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 border border-white/20 backdrop-blur-md">
          <Filter className="w-4 h-4 text-white/60" />
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="bg-transparent outline-none text-sm text-white"
          >
            <option className="text-black">All</option>
            <option className="text-black">Hosteller</option>
            <option className="text-black">Dayscholar</option>
          </select>
        </div>
      </div>

      {/* TABLE CARD */}
      <div className="rounded-2xl bg-white/10 border border-white/20 backdrop-blur-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-white/10">
            <tr className="text-left text-white/70">
              <th className="px-5 py-4">Student ID</th>
              <th>Name</th>
              <th>Dept</th>
              <th>Year</th>
              <th>Type</th>
              <th>Counsellor</th>
              <th>Status</th>
              <th className="px-5">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredStudents.map((s) => (
              <tr
                key={s.id}
                className="border-t border-white/10 hover:bg-white/5 transition"
              >
                <td className="px-5 py-4">{s.id}</td>
                <td>{s.name}</td>
                <td>{s.dept}</td>
                <td>{s.year}</td>
                <td>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium
                    ${
                      s.type === "Hosteller"
                        ? "bg-cyan-500/20 text-cyan-300"
                        : "bg-purple-500/20 text-purple-300"
                    }`}
                  >
                    {s.type}
                  </span>
                </td>
                <td>{s.counsellor}</td>
                <td>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium
                    ${
                      s.status === "Active"
                        ? "bg-green-500/20 text-green-300"
                        : "bg-red-500/20 text-red-300"
                    }`}
                  >
                    {s.status}
                  </span>
                </td>
                <td className="px-5">
                  <div className="flex gap-3">
                    <button className="text-cyan-400 hover:text-cyan-300">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="text-yellow-400 hover:text-yellow-300">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="text-red-400 hover:text-red-300">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {filteredStudents.length === 0 && (
              <tr>
                <td
                  colSpan="8"
                  className="text-center py-10 text-white/50"
                >
                  No students found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminStudents;
