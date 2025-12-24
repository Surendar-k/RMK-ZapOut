import axios from "axios";

const ON_DUTY_API = "http://localhost:5000/api/onduty";

// ✅ This URL now matches the router
export const fetchStudentProfile = (userId) =>
  axios.get(`${ON_DUTY_API}/profile/${userId}`);

// Apply on-duty
export const applyOnDuty = (formData) =>
  axios.post(`${ON_DUTY_API}/apply`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
