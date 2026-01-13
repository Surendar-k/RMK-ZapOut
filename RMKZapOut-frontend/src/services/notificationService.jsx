import axios from "axios";

const API_URL = "http://localhost:5000/api/notifications";

const getNotifications = (userId) =>
  axios.get(`${API_URL}/${userId}`);

const markAsRead = (id) =>
  axios.put(`${API_URL}/read/${id}`);

const markAllAsRead = (userId) =>
  axios.put(`${API_URL}/read-all/${userId}`);

const clearAll = (userId) =>
  axios.delete(`${API_URL}/${userId}`);

export default {
  getNotifications,
  markAsRead,
  markAllAsRead,
  clearAll,
};
