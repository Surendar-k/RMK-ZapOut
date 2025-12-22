import axios from "axios";

const API_URL = "http://localhost:5000/api/onduty";

/* ================= STUDENT ================= */

export const fetchStudentProfile = (userId) =>
  axios.get(`${API_URL}/profile/${userId}`);

export const fetchOnDutyRequests = (userId) =>
  axios.get(`${API_URL}/requests/${userId}`);

export const fetchRequestDetail = (requestId) =>
  axios.get(`${API_URL}/request/${requestId}`);

export const applyOnDuty = (formData) =>
  axios.post(`${API_URL}/apply`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

/* ✅ UPDATE → JSON PAYLOAD */
export const updateOnDutyRequest = (requestId, data) =>
  axios.put(`${API_URL}/request/${requestId}`, data);

export const cancelOnDutyRequest = (requestId) =>
  axios.delete(`${API_URL}/cancel/${requestId}`);
