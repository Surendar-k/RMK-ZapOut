import axios from "axios";

const API_URL = "http://localhost:5000/api/onduty";

export const fetchStudentProfile = (userId) => {
  return axios.get(`${API_URL}/profile/${userId}`);
};

export const applyOnDuty = (formData) => {
  return axios.post(`${API_URL}/apply`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const fetchOnDutyRequests = (userId) => {
  return axios.get(`${API_URL}/requests/${userId}`);
};

export const cancelOnDutyRequest = (requestId) => {
  return axios.delete(`${API_URL}/cancel/${requestId}`);
};

export const fetchRequestDetail = (requestId) => {
  return axios.get(`${API_URL}/request/${requestId}`);
};

export const updateOnDutyRequest = (requestId, formData) => {
  return axios.put(`${API_URL}/request/${requestId}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};
