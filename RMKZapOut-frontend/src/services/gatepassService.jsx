import axios from "axios";

const API_URL = "http://localhost:5000/api/gatepass";

// Fetch student info
export const fetchStudentInfo = (studentId) =>
  axios.get(`${API_URL}/student/${studentId}`);

// Submit gatepass
export const submitGatepass = (data) =>
  axios.post(`${API_URL}/apply`, data);
