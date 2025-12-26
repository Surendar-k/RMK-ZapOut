import { useEffect, useState } from "react";
import { Users, UserPlus, Search, Trash2, X } from "lucide-react";
import { fetchStaffs, createStaff, deleteStaff, updateStaff } from "../../services/adminStaffService";

const glass = "bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl";
const DEPARTMENTS = ["CSE", "IT", "ECE", "EEE", "MECH"];

const AdminStaffs = () => {
  const loggedInUser = JSON.parse(localStorage.getItem("user"));
  const adminId = loggedInUser?.role === "ADMIN" ? loggedInUser?.id : null;

  const [staffs, setStaffs] = useState([]);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [editStaffId, setEditStaffId] = useState(null);
  const [form, setForm] = useState({
    id: null,
    username: "",
    email: "",
    phone: "",
    role: "COUNSELLOR",
    department: "CSE",
    is_active: false, // track active status
  });

  /* Load all staff */
  const loadStaffs = async () => {
    const res = await fetchStaffs();
    setStaffs(res.data.map(s => ({
      id: s.id,
      username: s.username,
      email: s.email,
      phone: s.phone || "",
      role: s.role,
      department: s.department || "-",
      is_active: s.is_active === 1,
    })));
  };
useEffect(() => {
  const fetchData = async () => {
    try {
      const res = await fetchStaffs();
      setStaffs(
        res.data.map(s => ({
          id: s.id,
          username: s.username,
          email: s.email,
          phone: s.phone || "",
          role: s.role,
          department: s.department || "-",
          is_active: s.is_active === 1,
        }))
      );
    } catch (err) {
      console.error("Failed to fetch staffs", err);
    }
  };

  fetchData();
}, []);


  /* Save Staff (create/update) */
  const handleSaveStaff = async () => {
    if (editStaffId) {
      await updateStaff(editStaffId, adminId || loggedInUser?.id, form);
    } else {
      await createStaff({ adminId, ...form });
    }
    setShowModal(false);
    setEditStaffId(null);
    setForm({ id: null, username: "", email: "", phone: "", role: "COUNSELLOR", department: "CSE", is_active: false });
    loadStaffs();
  };

  /* Delete staff */
  const handleDeleteStaff = async (staffId) => {
    if (!window.confirm("Delete this staff permanently?")) return;
    await deleteStaff(staffId, adminId);
    loadStaffs();
  };

  /* Edit staff */
  const handleEditStaff = (staff) => {
    setForm({
      id: staff.id,
      username: staff.username,
      email: staff.email,
      phone: staff.phone,
      role: staff.role,
      department: staff.department === "-" ? "CSE" : staff.department,
      is_active: staff.is_active,
    });
    setEditStaffId(staff.id);
    setShowModal(true);
  };

  /* Filter staff */
  const filteredStaffs = staffs.filter((s) => {
    const matchesSearch = s.username.toLowerCase().includes(search.toLowerCase()) || s.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === "All" || s.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-white flex items-center gap-2">
          <Users className="text-cyan-400" />
          Staff Management
        </h1>
        {adminId && (
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30"
          >
            <UserPlus size={18} />
            Add Staff
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-4 py-2">
          <Search size={18} className="text-white/60" />
          <input
            placeholder="Search..."
            className="bg-transparent outline-none text-white"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select
          className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white"
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
        >
          <option value="All">All Roles</option>
          <option value="COUNSELLOR">Counsellor</option>
          <option value="COORDINATOR">Coordinator</option>
          <option value="HOD">HOD</option>
          <option value="WARDEN">Warden</option>
        </select>
      </div>

      {/* Staff Table */}
  <div className={`${glass} overflow-x-auto`}>
  <table className="w-full text-white text-sm table-fixed border-collapse">
    <thead className="bg-white/10">
      <tr>
        <th className="px-6 py-4 w-[150px] text-center">Name</th>
        <th className="px-6 py-4 w-[200px] text-center">Email</th>
        <th className="px-6 py-4 w-[120px] text-center">Phone</th>
        <th className="px-6 py-4 w-[120px] text-center">Role</th>
        <th className="px-6 py-4 w-[120px] text-center">Department</th>
        <th className="px-6 py-4 w-[160px] text-center">Action</th>
      </tr>
    </thead>
    <tbody>
      {filteredStaffs.map((s) => (
        <tr key={s.id} className="border-t border-white/10">
          <td className="px-6 py-4 max-w-[150px] overflow-hidden text-ellipsis whitespace-nowrap text-center">{s.username}</td>
          <td className="px-6 py-4 max-w-[200px] overflow-hidden text-ellipsis whitespace-nowrap text-center">{s.email}</td>
          <td className="px-6 py-4 max-w-[120px] overflow-hidden text-ellipsis whitespace-nowrap text-center">{s.phone}</td>
          <td className="px-6 py-4 max-w-[120px] overflow-hidden text-ellipsis whitespace-nowrap text-center text-cyan-300">{s.role}</td>
          <td className="px-6 py-4 max-w-[120px] overflow-hidden text-ellipsis whitespace-nowrap text-center">{s.department}</td>
          <td className="px-6 py-4 flex justify-center gap-2">
            {(adminId || (s.is_active && s.id === loggedInUser?.id)) && (
              <button
                onClick={() => handleEditStaff(s)}
                className="flex items-center gap-1 px-3 py-1 rounded-lg bg-yellow-500/20 text-yellow-300 hover:bg-yellow-500/30"
              >
                Edit
              </button>
            )}
            {adminId && (
              <button
                onClick={() => handleDeleteStaff(s.id)}
                className="flex items-center gap-1 px-3 py-1 rounded-lg bg-red-500/20 text-red-300 hover:bg-red-500/30"
              >
                <Trash2 size={14} /> Delete
              </button>
            )}
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>


      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
          <div className="bg-[#0f172a] p-6 rounded-2xl w-96 space-y-3">
            <div className="flex justify-between">
              <h2 className="text-white font-semibold">{editStaffId ? "Edit Staff" : "Add Staff"}</h2>
              <X
                onClick={() => {
                  setShowModal(false);
                  setEditStaffId(null);
                  setForm({ id: null, username: "", email: "", phone: "", role: "COUNSELLOR", department: "CSE", is_active: false });
                }}
                className="cursor-pointer"
              />
            </div>

            {/* Input fields */}
            {["username", "email", "phone"].map((f) => (
              <input
                key={f}
                placeholder={f.replace("_", " ")}
                className="w-full p-2 rounded bg-white/10 text-white"
                value={form[f]}
                onChange={(e) => setForm({ ...form, [f]: e.target.value })}
                disabled={
                  !adminId &&
                  (!form.is_active || form.id !== loggedInUser?.id)
                }
              />
            ))}

            {/* Only Admin can edit role & department */}
            {adminId && (
              <>
                <select
                  className="w-full p-2 rounded bg-white/10 text-white"
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                >
                  <option value="COUNSELLOR">Counsellor</option>
                  <option value="COORDINATOR">Coordinator</option>
                  <option value="HOD">HOD</option>
                  <option value="WARDEN">Warden</option>
                </select>

                <select
                  className="w-full p-2 rounded bg-white/10 text-white"
                  value={form.department}
                  onChange={(e) => setForm({ ...form, department: e.target.value })}
                >
                  {DEPARTMENTS.map((d) => (
                    <option key={d}>{d}</option>
                  ))}
                </select>
              </>
            )}

            <button
              onClick={handleSaveStaff}
              className="w-full py-2 rounded bg-cyan-500 text-black font-semibold"
            >
              {editStaffId ? "Update Staff" : "Create Staff"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminStaffs;
