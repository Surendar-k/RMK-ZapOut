import axios from "axios";

// 🔥 FIXED BASE URL
const API_URL = "http://localhost:5000/auth";

// Step 1: check email
export const checkEmail = (email) =>
  axios.post(`${API_URL}/check-email`, { email });

// Step 2: login
export const loginUser = (email, password) =>
  axios.post(`${API_URL}/login`, { email, password });

// Step 3: update password
export const updatePassword = (email, newPassword) =>
  axios.put(`${API_URL}/update-password`, {
    email,
    newPassword,
  });
