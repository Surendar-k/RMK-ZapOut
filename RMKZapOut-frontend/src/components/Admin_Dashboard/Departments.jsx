import { useEffect, useState, useMemo } from "react";
import { Plus, Edit2, Trash2, Building2, Search } from "lucide-react";
import {
  fetchDepartments,
  createDepartment,
  updateDepartment,
  deleteDepartment,
} from "../../services/departmentService";

const Departments = () => {
  const [departments, setDepartments] = useState([]);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({
    name: "",
    display_name: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  /* ================= LOAD DEPARTMENTS ================= */
  useEffect(() => {
    const loadDepartments = async () => {
      try {
        setLoading(true);
        const res = await fetchDepartments();
        setDepartments(res.data);
      } catch (err) {
        console.error("Failed to load departments", err);
      } finally {
        setLoading(false);
      }
    };

    loadDepartments();
  }, []);

  /* ================= ADD / UPDATE ================= */
  const handleSubmit = async () => {
    if (!form.name.trim() || !form.display_name.trim()) return;

    try {
      if (editingId) {
        await updateDepartment(editingId, form);
      } else {
        await createDepartment(form);
      }

      setForm({ name: "", display_name: "" });
      setEditingId(null);

      const res = await fetchDepartments();
      setDepartments(res.data);
    } catch (err) {
      console.error("Save failed", err);
    }
  };

  /* ================= EDIT ================= */
  const handleEdit = (dept) => {
    setForm({
      name: dept.name,
      display_name: dept.display_name,
    });
    setEditingId(dept.id);
  };

  /* ================= DELETE ================= */
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this department?")) return;

    try {
      await deleteDepartment(id);
      setDepartments((prev) => prev.filter((d) => d.id !== id));
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  /* ================= FILTER (MEMOIZED) ================= */
  const filteredDepartments = useMemo(() => {
    return departments.filter((dept) =>
      `${dept.name} ${dept.display_name}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [departments, search]);

  return (
    <div className="p-6 text-white">
      <h1 className="text-2xl font-semibold mb-6 flex items-center gap-2">
        <Building2 className="text-red-500" /> <text className="text-red-500">Departments</text>
      </h1>

      {/* SEARCH */}
      <div className="mb-6 relative max-w-md">
        <Search
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-white/60"
        />
        <input
          placeholder="Search department..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-11 pr-4 py-3 bg-white/10 rounded-xl outline-none"
        />
      </div>

      {/* ADD / EDIT */}
      <div className="bg-white/10 rounded-2xl p-6 mb-8 border border-white/20">
        <div className="grid md:grid-cols-2 gap-4">
          <input
            placeholder="Short Name (CSE)"
            value={form.name}
            onChange={(e) =>
              setForm({ ...form, name: e.target.value.toUpperCase() })
            }
            className="bg-white/10 rounded-xl px-4 py-3 outline-none"
          />

          <input
            placeholder="Full Name (Computer Science and Engineering)"
            value={form.display_name}
            onChange={(e) =>
              setForm({ ...form, display_name: e.target.value })
            }
            className="bg-white/10 rounded-xl px-4 py-3 outline-none"
          />
        </div>

        <button
          onClick={handleSubmit}
          className="mt-5 bg-cyan-500 px-6 py-3 rounded-xl flex items-center gap-2"
        >
          <Plus size={18} />
          {editingId ? "Update Department" : "Add Department"}
        </button>
      </div>

      {/* LIST */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {loading ? (
          <p className="text-white/60 col-span-full">Loading...</p>
        ) : filteredDepartments.length > 0 ? (
          filteredDepartments.map((dept) => (
            <div
              key={dept.id}
              className="bg-white/10 rounded-2xl p-5 border border-white/20"
            >
              <h2 className="text-lg font-semibold">
                {dept.display_name}
              </h2>
              <p className="text-sm text-cyan-300 mt-1">
                ({dept.name})
              </p>

              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => handleEdit(dept)}
                  className="px-4 py-2 bg-white/10 rounded-lg"
                >
                  <Edit2 size={16} /> Edit
                </button>
                <button
                  onClick={() => handleDelete(dept.id)}
                  className="px-4 py-2 bg-red-500/20 text-red-300 rounded-lg"
                >
                  <Trash2 size={16} /> Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-white/60 col-span-full">
            No departments found
          </p>
        )}
      </div>
    </div>
  );
};

export default Departments;
