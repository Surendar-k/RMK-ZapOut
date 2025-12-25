import axios from "axios";

const API_URL = "http://localhost:5000/api/staff/profile";

export const fetchStaffProfile = (userId) =>
  axios.get(`${API_URL}/${userId}`);

export const updateStaffProfile = (userId, data) =>
  axios.put(`${API_URL}/${userId}`, data);
