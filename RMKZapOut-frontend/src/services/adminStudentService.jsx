import axios from "axios";

const API = "http://localhost:5000/api/admin";

/* ================= DEPARTMENTS ================= */
export const fetchDepartments = () =>
  axios.get(`${API}/departments`);

/* ================= COUNSELLORS ================= */
export const fetchCounsellorsByDept = (deptId) =>
  axios.get(`${API}/counsellors/${deptId}`);

/* ================= STUDENTS ================= */
export const fetchStudents = () =>
  axios.get(`${API}/students`);

export const createStudent = (data) =>
  axios.post(`${API}/students`, data);

export const updateStudent = (id, data) =>
  axios.put(`${API}/students/${id}`, data);

export const deleteStudent = (id) =>
  axios.delete(`${API}/students/${id}`);
