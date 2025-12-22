// src/services/onDutyService.js
import axios from "axios";

const API_URL = "http://localhost:5000/api/onduty";

export const fetchStudentProfile = (userId) =>
  axios.get(`${API_URL}/profile/${userId}`);

export const applyOnDuty = (formData) =>
  axios.post(`${API_URL}/apply`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
