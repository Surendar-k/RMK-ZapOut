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
