import { useEffect, useState } from "react";
import axios from "axios";
import { Plus, Edit, Trash2 } from "lucide-react";

const API = "http://localhost:5000/api/admin";

const AdminStudents = () => {
  const [students, setStudents] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [counsellors, setCounsellors] = useState([]);
  const [open, setOpen] = useState(false);
  const [editData, setEditData] = useState(null);

  const [form, setForm] = useState({
    username: "",
    register_number: "",
    email: "",
    phone: "",
    student_type: "HOSTELLER",
    department_id: "",
    counsellor_id: "",
    year_of_study: "",
  });

  /* ================= LOAD INITIAL DATA ================= */
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [studentsRes, deptRes] = await Promise.all([
          axios.get(`${API}/students`),
          axios.get(`${API}/departments`),
        ]);

        setStudents(studentsRes.data);
        setDepartments(deptRes.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchInitialData();
  }, []);

  /* ============ LOAD COUNSELLORS WHEN DEPT CHANGES ============ */
  useEffect(() => {
    const fetchCounsellors = async () => {
      if (!form.department_id) {
        setCounsellors([]);
        return;
      }

      try {
        const res = await axios.get(
          `${API}/counsellors/${form.department_id}`
        );
        setCounsellors(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchCounsellors();
  }, [form.department_id]);

  /* ================= HANDLERS ================= */
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleDepartmentChange = (e) => {
    setForm({
      ...form,
      department_id: e.target.value,
      counsellor_id: "",
    });
  };

  const handleSubmit = async () => {
    try {
      if (editData) {
        await axios.put(
          `${API}/students/${editData.student_id}`,
          form
        );
      } else {
        await axios.post(`${API}/students`, form);
      }

      const res = await axios.get(`${API}/students`);
      setStudents(res.data);

      setOpen(false);
      setEditData(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (s) => {
    setEditData(s);
    setForm({
      username: s.username,
      register_number: s.register_number,
      email: s.email,
      phone: s.phone || "",
      student_type: s.student_type,
      department_id: s.department_id,
      counsellor_id: s.counsellor_id,
      year_of_study: s.year_of_study,
    });
    setOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this student?")) return;

    try {
      await axios.delete(`${API}/students/${id}`);
      setStudents((prev) =>
        prev.filter((s) => s.student_id !== id)
      );
    } catch (err) {
      console.error(err);
    }
  };

  /* ================= UI ================= */
  return (
    <div className="p-8">
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-semibold">Students Management</h1>
        <button
          onClick={() => {
            setEditData(null);
            setForm({
              username: "",
              register_number: "",
              email: "",
              phone: "",
              student_type: "HOSTELLER",
              department_id: "",
              counsellor_id: "",
              year_of_study: "",
            });
            setOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-cyan-500 text-black rounded"
        >
          <Plus size={16} /> Add Student
        </button>
      </div>

      <table className="w-full text-sm bg-white/10 rounded-xl">
        <thead className="bg-white/20">
          <tr>
            <th>Name</th>
            <th>Register</th>
            <th>Email</th>
            <th>Dept</th>
            <th>Year</th>
            <th>Type</th>
            <th>Counsellor</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {students.map((s) => (
            <tr key={s.student_id}>
              <td>{s.username}</td>
              <td>{s.register_number}</td>
              <td>{s.email}</td>
              <td>{s.department}</td>
              <td>{s.year_of_study}</td>
              <td>{s.student_type}</td>
              <td>{s.counsellor}</td>
              <td className="flex gap-3">
                <Edit size={16} onClick={() => handleEdit(s)} />
                <Trash2
                  size={16}
                  onClick={() => handleDelete(s.student_id)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {open && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center">
          <div className="bg-zinc-900 p-6 rounded-xl w-[420px] space-y-3">
            <input name="username" placeholder="Name" className="input" value={form.username} onChange={handleChange} />
            <input name="register_number" placeholder="Register" className="input" value={form.register_number} onChange={handleChange} />
            <input name="email" placeholder="Email" className="input" value={form.email} onChange={handleChange} />
            <input name="phone" placeholder="Phone" className="input" value={form.phone} onChange={handleChange} />

            <select name="student_type" className="input" value={form.student_type} onChange={handleChange}>
              <option value="HOSTELLER">Hosteller</option>
              <option value="DAYSCHOLAR">Dayscholar</option>
            </select>

            <select className="input" value={form.department_id} onChange={handleDepartmentChange}>
              <option value="">Select Department</option>
              {departments.map((d) => (
                <option key={d.id} value={d.id}>{d.display_name}</option>
              ))}
            </select>

            <select name="counsellor_id" className="input" value={form.counsellor_id} onChange={handleChange}>
              <option value="">Select Counsellor</option>
              {counsellors.map((c) => (
                <option key={c.id} value={c.id}>{c.username}</option>
              ))}
            </select>

            <input name="year_of_study" placeholder="Year" className="input" value={form.year_of_study} onChange={handleChange} />

            <div className="flex justify-end gap-3">
              <button onClick={() => setOpen(false)}>Cancel</button>
              <button onClick={handleSubmit} className="bg-cyan-500 px-4 py-2 rounded text-black">
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminStudents;
