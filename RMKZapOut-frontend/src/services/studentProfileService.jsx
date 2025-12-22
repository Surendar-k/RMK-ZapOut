import axios from "axios";

const API = "http://localhost:5000/api/student/profile";

export const fetchStudentProfile = (userId) =>
  axios.get(`${API}/${userId}`);

export const updateStudentProfile = (userId, data) =>
  axios.put(`${API}/${userId}`, data);
