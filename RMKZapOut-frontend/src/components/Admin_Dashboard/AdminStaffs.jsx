import { useState } from "react";
import {
  Users,
  UserPlus,
  Search,
  ShieldCheck,
  ShieldOff,
} from "lucide-react";

const staffData = [
  {
    id: 1,
    name: "Dr. Ravi Kumar",
    email: "ravi@rmk.edu.in",
    role: "HOD",
    department: "IT",
    status: "Active",
  },
  {
    id: 2,
    name: "Ms. Anitha",
    email: "anitha@rmk.edu.in",
    role: "Counsellor",
    department: "CSE",
    status: "Inactive",
  },
  {
    id: 3,
    name: "Mr. Suresh",
    email: "suresh@rmk.edu.in",
    role: "Branch Coordinator",
    department: "ECE",
    status: "Active",
  },
];

const AdminStaffs = () => {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [staffs, setStaffs] = useState(staffData);

  const toggleStatus = (id) => {
    setStaffs((prev) =>
      prev.map((s) =>
        s.id === id
          ? { ...s, status: s.status === "Active" ? "Inactive" : "Active" }
          : s
      )
    );
  };

  const filteredStaffs = staffs.filter((staff) => {
    const matchesSearch =
      staff.name.toLowerCase().includes(search.toLowerCase()) ||
      staff.email.toLowerCase().includes(search.toLowerCase());

    const matchesRole =
      roleFilter === "All" || staff.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  return (
    <div className="p-8 space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-white flex items-center gap-2">
          <Users className="text-cyan-400" />
          Staff Management
        </h1>

        <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 transition">
          <UserPlus size={18} />
          Add Staff
        </button>
      </div>

      {/* FILTERS */}
      <div className="flex flex-wrap gap-4">
        <div className="flex items-center gap-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl px-4 py-2">
          <Search size={18} className="text-white/60" />
          <input
            type="text"
            placeholder="Search staff..."
            className="bg-transparent outline-none text-white placeholder-white/40"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select
          className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl px-4 py-2 text-white"
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
        >
          <option value="All">All Roles</option>
          <option value="Counsellor">Counsellor</option>
          <option value="Branch Coordinator">Branch Coordinator</option>
          <option value="HOD">HOD</option>
          <option value="Warden">Warden</option>
          <option value="Watchman">Watchman</option>
        </select>
      </div>

      {/* STAFF TABLE */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden">
        <table className="w-full text-left text-sm text-white">
          <thead className="bg-white/10 text-white/80">
            <tr>
              <th className="px-6 py-4">Name</th>
              <th className="px-6 py-4">Email</th>
              <th className="px-6 py-4">Role</th>
              <th className="px-6 py-4">Department</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredStaffs.length === 0 && (
              <tr>
                <td
                  colSpan="6"
                  className="text-center py-6 text-white/50"
                >
                  No staff found
                </td>
              </tr>
            )}

            {filteredStaffs.map((staff) => (
              <tr
                key={staff.id}
                className="border-t border-white/10 hover:bg-white/5 transition"
              >
                <td className="px-6 py-4">{staff.name}</td>
                <td className="px-6 py-4">{staff.email}</td>
                <td className="px-6 py-4 text-cyan-300">
                  {staff.role}
                </td>
                <td className="px-6 py-4">{staff.department}</td>
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs ${
                      staff.status === "Active"
                        ? "bg-green-500/20 text-green-300"
                        : "bg-red-500/20 text-red-300"
                    }`}
                  >
                    {staff.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => toggleStatus(staff.id)}
                    className="flex items-center gap-1 text-sm px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 transition"
                  >
                    {staff.status === "Active" ? (
                      <>
                        <ShieldOff size={14} />
                        Deactivate
                      </>
                    ) : (
                      <>
                        <ShieldCheck size={14} />
                        Activate
                      </>
                    )}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminStaffs;
