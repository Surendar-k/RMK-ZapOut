import { useState } from "react";
import { Plus, Search, Trash2 } from "lucide-react";

const roles = [
  "Student",
  "Counsellor",
  "Branch Coordinator",
  "HOD",
  "Admin",
];

const Users = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
    department: "",
    status: "Active",
  });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const addUser = () => {
    if (!formData.name || !formData.email || !formData.role) return;
    setUsers([...users, { ...formData, id: Date.now() }]);
    setFormData({
      name: "",
      email: "",
      role: "",
      department: "",
      status: "Active",
    });
    setShowModal(false);
  };

  const deleteUser = (id) =>
    setUsers(users.filter((u) => u.id !== id));

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-8 text-white">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Users Management</h1>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-medium"
        >
          <Plus size={18} /> Add User
        </button>
      </div>

      {/* SEARCH */}
      <div className="mb-6 relative w-80">
        <Search className="absolute left-3 top-3 text-white/50" size={18} />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search users..."
          className="w-full pl-10 pr-4 py-2 rounded-xl bg-white/10 backdrop-blur border border-white/10 focus:outline-none"
        />
      </div>

      {/* USERS TABLE */}
      <div className="bg-white/10 backdrop-blur rounded-2xl border border-white/10 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-white/10">
            <tr>
              <th className="p-4 text-left">Name</th>
              <th className="p-4 text-left">Email</th>
              <th className="p-4 text-left">Role</th>
              <th className="p-4 text-left">Department</th>
              <th className="p-4 text-left">Status</th>
              <th className="p-4 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan="6" className="p-6 text-center text-white/60">
                  No users found
                </td>
              </tr>
            ) : (
              filteredUsers.map((u) => (
                <tr
                  key={u.id}
                  className="border-t border-white/10 hover:bg-white/5"
                >
                  <td className="p-4">{u.name}</td>
                  <td className="p-4">{u.email}</td>
                  <td className="p-4">{u.role}</td>
                  <td className="p-4">{u.department || "-"}</td>
                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        u.status === "Active"
                          ? "bg-green-500/20 text-green-400"
                          : "bg-red-500/20 text-red-400"
                      }`}
                    >
                      {u.status}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <button
                      onClick={() => deleteUser(u.id)}
                      className="text-red-400 hover:text-red-300"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ADD USER MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="w-[420px] bg-[#020617] rounded-2xl p-6 border border-white/10">
            <h2 className="text-lg font-semibold mb-4">Add New User</h2>

            <div className="space-y-4">
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Full Name"
                className="w-full px-4 py-2 rounded-xl bg-white/10 border border-white/10 focus:outline-none"
              />

              <input
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email Address"
                className="w-full px-4 py-2 rounded-xl bg-white/10 border border-white/10 focus:outline-none"
              />

              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-xl bg-white/10 border border-white/10 focus:outline-none"
              >
                <option value="">Select Role</option>
                {roles.map((r) => (
                  <option key={r} value={r} className="text-black">
                    {r}
                  </option>
                ))}
              </select>

              <input
                name="department"
                value={formData.department}
                onChange={handleChange}
                placeholder="Department (optional)"
                className="w-full px-4 py-2 rounded-xl bg-white/10 border border-white/10 focus:outline-none"
              />
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20"
              >
                Cancel
              </button>
              <button
                onClick={addUser}
                className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-medium"
              >
                Add User
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
