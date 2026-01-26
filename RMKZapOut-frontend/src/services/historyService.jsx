// src/services/historyService.jsx
import axios from "axios";

// Base URL of your backend API
const API_URL = "http://localhost:5000/api/history";

/**
 * Fetch the request history of a student
 * @param {number|string} studentId - ID of the student
 * @returns {Promise} Axios promise with the history data
 */
export const getStudentHistory = (studentId) => {
  return axios.get(`${API_URL}/${studentId}`);
};
