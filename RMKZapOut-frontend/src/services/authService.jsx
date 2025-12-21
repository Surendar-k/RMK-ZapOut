import axios from "axios";

const API_URL = "http://localhost:5000/auth";

const checkEmail = (email) => axios.post(`${API_URL}/check-email`, { email });
const loginUser = (email, password) => axios.post(`${API_URL}/login`, { email, password });
const updatePassword = (email, newPassword) => axios.put(`${API_URL}/update-password`, { email, newPassword });

// Attach to loginUser for easy frontend use
loginUser.updatePassword = updatePassword;

export { checkEmail, loginUser };
