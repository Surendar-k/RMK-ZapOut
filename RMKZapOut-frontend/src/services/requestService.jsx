import axios from "axios";

const API = "http://localhost:5000/api/requests";

export const fetchStudentRequests = (userId) =>
  axios.get(`${API}/student/${userId}`);

export const cancelRequest = (requestId) =>
  axios.delete(`${API}/${requestId}`);

export const updateRequest = (requestId, data) =>
  axios.put(`${API}/${requestId}`, data, {
    headers: { "Content-Type": "multipart/form-data" },
  });


  // ================= STAFF APIS =================

export const fetchStaffRequests = (staffId, role) => {
  if (!staffId || !role) {
    console.warn("Blocked API call: staffId/role missing");
    return Promise.resolve({ data: { requests: [] } });
  }

  return axios.get(`${API}/staff/${staffId}/${role}`);
};

export const updateRequestStatus = (requestId, role, action) =>
  axios.put(`${API}/staff/request/${requestId}/status`, { role, action });