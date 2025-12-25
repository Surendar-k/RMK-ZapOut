import { useState } from "react";
import { Plus, Edit2, Trash2, Building2 } from "lucide-react";

const Departments = () => {
  const [departments, setDepartments] = useState([
    { id: 1, name: "Computer Science", code: "CSE", hod: "Dr. Kumar" },
    { id: 2, name: "Information Technology", code: "IT", hod: "Dr. Priya" },
    { id: 3, name: "Electronics", code: "ECE", hod: "Dr. Ravi" },
  ]);

  const [form, setForm] = useState({ name: "", code: "", hod: "" });
  const [editingId, setEditingId] = useState(null);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleAddOrUpdate = () => {
    if (!form.name || !form.code || !form.hod) return;

    if (editingId) {
      setDepartments((prev) =>
        prev.map((d) =>
          d.id === editingId ? { ...d, ...form } : d
        )
      );
      setEditingId(null);
    } else {
      setDepartments((prev) => [
        ...prev,
        { id: Date.now(), ...form },
      ]);
    }

    setForm({ name: "", code: "", hod: "" });
  };

  const handleEdit = (dept) => {
    setForm(dept);
    setEditingId(dept.id);
  };

  const handleDelete = (id) =>
    setDepartments((prev) => prev.filter((d) => d.id !== id));

  return (
    <div className="p-6 text-white">
      <h1 className="text-2xl font-semibold mb-6 flex items-center gap-2">
        <Building2 className="text-cyan-400" />
        Departments
      </h1>

      {/* ADD / EDIT CARD */}
      <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 mb-8 border border-white/20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Department Name"
            className="bg-white/10 rounded-xl px-4 py-3 outline-none"
          />
          <input
            name="code"
            value={form.code}
            onChange={handleChange}
            placeholder="Department Code"
            className="bg-white/10 rounded-xl px-4 py-3 outline-none"
          />
          <input
            name="hod"
            value={form.hod}
            onChange={handleChange}
            placeholder="HOD Name"
            className="bg-white/10 rounded-xl px-4 py-3 outline-none"
          />
        </div>

        <button
          onClick={handleAddOrUpdate}
          className="mt-5 bg-cyan-500 hover:bg-cyan-400 transition px-6 py-3 rounded-xl flex items-center gap-2"
        >
          <Plus size={18} />
          {editingId ? "Update Department" : "Add Department"}
        </button>
      </div>

      {/* DEPARTMENT LIST */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {departments.map((dept) => (
          <div
            key={dept.id}
            className="bg-white/10 backdrop-blur-xl rounded-2xl p-5 border border-white/20"
          >
            <h2 className="text-lg font-semibold">{dept.name}</h2>
            <p className="text-sm text-cyan-300 mt-1">
              Code: {dept.code}
            </p>
            <p className="text-sm mt-2">HOD: {dept.hod}</p>

            <div className="flex gap-3 mt-4">
              <button
                onClick={() => handleEdit(dept)}
                className="flex items-center gap-1 px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20"
              >
                <Edit2 size={16} /> Edit
              </button>
              <button
                onClick={() => handleDelete(dept.id)}
                className="flex items-center gap-1 px-4 py-2 bg-red-500/20 text-red-300 rounded-lg hover:bg-red-500/30"
              >
                <Trash2 size={16} /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Departments;
