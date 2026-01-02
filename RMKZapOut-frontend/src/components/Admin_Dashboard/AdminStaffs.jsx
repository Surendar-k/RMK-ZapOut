import { useEffect, useState } from "react";
import { Users, UserPlus, Search, Trash2, X } from "lucide-react";
import {
  fetchStaffs,
  createStaff,
  deleteStaff,
  updateStaff,
} from "../../services/adminStaffService";

/* ---------------- CONSTANTS ---------------- */

const DEPARTMENTS = ["CSE", "IT", "ECE", "EEE", "MECH"];

const EMPTY_FORM = {
  id: null,
  username: "",
  email: "",
  phone: "",
  role: "",          // placeholder state
  department: "",    // placeholder state
  is_active: false,
};

/* ---------------- COMPONENT ---------------- */

const AdminStaffs = () => {
  const loggedInUser = JSON.parse(localStorage.getItem("user"));
  const adminId = loggedInUser?.role === "ADMIN" ? loggedInUser?.id : null;

  /* ---------------- STATE ---------------- */

  const [staffs, setStaffs] = useState([]);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");

  const [showModal, setShowModal] = useState(false);
  const [editStaffId, setEditStaffId] = useState(null);

  const [popupMsg, setPopupMsg] = useState(null);

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteStaffId, setDeleteStaffId] = useState(null);

  const [form, setForm] = useState(EMPTY_FORM);

  /* ---------------- HELPERS ---------------- */

  const showPopup = (msg) => {
    setPopupMsg(msg);
    setTimeout(() => setPopupMsg(""), 2000);
  };

  const loadStaffs = async () => {
    try {
      const res = await fetchStaffs();
      setStaffs(
        res.data.map((s) => ({
          id: s.id,
          username: s.username,
          email: s.email,
          phone: s.phone || "",
          role: s.role,
          department: s.department || "-",
          is_active: s.is_active === 1,
        }))
      );
    } catch (error) {
      console.error(error);
      showPopup(
        error.response?.data?.message || error.message || "Failed to load staffs",
        "error"
      );
    }
  };

  useEffect(() => {
    loadStaffs();
  }, []);

  /* ---------------- CRUD ---------------- */

  const handleSaveStaff = async () => {
    try {
      if (editStaffId) {
        const res = await updateStaff(editStaffId, adminId || loggedInUser?.id, form);
        showPopup(res?.data?.message || "Staff updated successfully");
      } else {
        const res = await createStaff({ adminId, ...form });
        showPopup(res?.data?.message || "Staff added successfully");
      }
      setShowModal(false);
      setEditStaffId(null);
      loadStaffs();
    } catch (error) {
      console.error(error);
      showPopup(
        error.response?.data?.message || error.message || "Something went wrong",
        "error"
      );
    }
    setShowModal(false);
    setEditStaffId(null);
    setForm(EMPTY_FORM);
    loadStaffs();
  };

  const handleDeleteClick = (id) => {
    setDeleteStaffId(id);
    setShowDeleteConfirm(true);
  };

  const confirmDeleteStaff = async () => {
    try {
      const res = await deleteStaff(deleteStaffId, adminId);
      showPopup(res?.data?.message || "Staff deleted successfully");
      setShowDeleteConfirm(false);
      setDeleteStaffId(null);
      loadStaffs();
    } catch (error) {
      console.error(error);
      showPopup(
        error.response?.data?.message || error.message || "Failed to delete staff",
        "error"
      );
    }
  };

  const handleEditStaff = (s) => {
    setForm({
      id: s.id,
      username: s.username,
      email: s.email,
      phone: s.phone,
      role: s.role,
      department: s.department === "-" ? "" : s.department,
      is_active: s.is_active,
    });
    setEditStaffId(s.id);
    setShowModal(true);
  };

  /* ---------------- FILTER ---------------- */

  const filteredStaffs = staffs.filter((s) => {
    const matchSearch =
      s.username.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase());

    const matchRole =
      roleFilter === "All"
        ? true
        : roleFilter === "OTHERS"
        ? !["COUNSELLOR", "COORDINATOR", "HOD"].includes(s.role)
        : s.role === roleFilter;

    return matchSearch && matchRole;
  });

  /* ---------------- UI ---------------- */

  return (
    <div className="p-8 space-y-6 relative">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-white flex gap-2">
          <Users className="text-cyan-400" /> Staff Management
        </h1>

        {adminId && (
          <button
            onClick={() => {
              setEditStaffId(null);
              setForm(EMPTY_FORM);
              setShowModal(true);
            }}
            className="px-4 py-2 rounded-xl bg-cyan-600 text-black font-medium"
          >
            <UserPlus size={16} className="inline mr-1 text-cyan-200" />
            Add Staff
          </button>
        )}
      </div>

      {/* Search + Role Cards */}
      <div className="flex gap-4 items-center flex-wrap">
        <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-xl">
          <Search size={16} />
          <input
            placeholder="Search staff..."
            className="bg-transparent outline-none text-white placeholder-white/40"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex gap-4">
          {[
            { label: "All", value: "All" },
            { label: "Counsellor", value: "COUNSELLOR" },
            { label: "Branch Coordinator", value: "COORDINATOR" },
            { label: "HOD", value: "HOD" },
            { label: "Others", value: "OTHERS" },
          ].map((card) => (
            <div
              key={card.value}
              onClick={() => setRoleFilter(card.value)}
              className={`px-6 py-3 rounded-xl cursor-pointer backdrop-blur-xl border
                ${
                  roleFilter === card.value
                    ? "bg-cyan-500/20 border-cyan-400 text-cyan-300"
                    : "bg-white/5 border-white/10 text-white/70"
                }`}
            >
              {card.label}
            </div>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white/5 backdrop-blur-xl rounded-2xl overflow-hidden relative">
        <table className="w-full text-white text-sm">
          <thead className="bg-white/10">
            <tr>
              <th className="py-4">Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Role</th>
              <th>Department</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredStaffs.map((s) => (
              <tr key={s.id} className="border-t border-white/10 text-center">
                <td className="py-3">{s.username}</td>
                <td>{s.email}</td>
                <td>{s.phone}</td>
                <td className="text-cyan-300">{s.role}</td>
                <td>{s.department}</td>
                <td className="flex justify-center gap-2 py-3">
                  <button
                    onClick={() => handleEditStaff(s)}
                    className="px-3 py-1 rounded bg-yellow-500/30"
                  >
                    Edit
                  </button>
                  {adminId && (
                    <button
                      onClick={() => handleDeleteClick(s.id)}
                      className="px-3 py-1 rounded bg-red-500/30"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {popupMsg && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-6 py-2 rounded-xl bg-cyan-500 text-black font-medium">
            {popupMsg}
          </div>
        )}
      </div>

      {/* ADD / EDIT MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="w-[420px] rounded-2xl bg-gradient-to-br from-[#0b1220] to-[#020617] border border-white/10 p-6">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-lg font-semibold text-white">
                {editStaffId ? "Edit Staff" : "Add Staff"}
                 {popupMsg && (
          <div
            className={`absolute bottom-4 left-1/2 -translate-x-1/2 px-6 py-2 rounded-xl shadow-lg ${
              popupMsg.type === "error"
                ? "bg-red-500 text-white"
                : "bg-cyan-500 text-black"
            }`}
          >
            {popupMsg.text}
          </div>
        )}
              </h2>
              <X
                className="cursor-pointer text-white/70 hover:text-white"
                onClick={() => setShowModal(false)}
              />
            </div>

            <div className="space-y-4">
              {["username", "email", "phone"].map((field) => (
                <div key={field}>
                  <label className="text-xs text-white/60 capitalize">{field}</label>
                  <input
                    className="w-full mt-1 px-3 py-2 rounded-lg bg-white/10 text-white outline-none placeholder-white/40"
                    placeholder={`Enter ${field}`}
                    value={form[field]}
                    onChange={(e) =>
                      setForm({ ...form, [field]: e.target.value })
                    }
                  />
                </div>
              ))}

              <div>
                <label className="text-xs text-white/60">Role</label>
                <select
                  className="w-full mt-1 px-3 py-2 rounded-lg bg-[#0f172a] text-white border border-white/10"
                  value={form.role}
                  onChange={(e) =>
                    setForm({ ...form, role: e.target.value })
                  }
                >
                  <option value="" disabled>Select role</option>
                  <option value="COUNSELLOR">Counsellor</option>
                  <option value="COORDINATOR">Coordinator</option>
                  <option value="HOD">HOD</option>
                  <option value="WARDEN">Warden</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-white/60">Department</label>
                <select
                  className="w-full mt-1 px-3 py-2 rounded-lg bg-[#0f172a] text-white border border-white/10"
                  value={form.department}
                  onChange={(e) =>
                    setForm({ ...form, department: e.target.value })
                  }
                >
                  <option value="" disabled>Select department</option>
                  {DEPARTMENTS.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
            </div>

            <button
              onClick={handleSaveStaff}
              className="w-full mt-6 py-2 rounded-xl bg-cyan-500 text-black font-semibold"
            >
              {editStaffId ? "Update Staff" : "Create Staff"}
            </button>
          </div>
        </div>
      )}

      {/* DELETE CONFIRM MODAL */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="w-[360px] rounded-2xl bg-gradient-to-br from-[#0b1220] to-[#020617] border border-white/10 p-6 text-center">
            <h3 className="text-lg font-semibold text-white mb-3">Delete Staff</h3>
            <p className="text-white/70 mb-6">
              Are you sure you want to delete this staff?
            </p>

            <div className="flex justify-center gap-4">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 rounded-xl bg-white/10 text-white"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteStaff}
                className="px-4 py-2 rounded-xl bg-red-500 text-white"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminStaffs;
