import axios from "axios";

const API_URL = "http://localhost:5000/auth";

const checkRegister = (registerNumber) => {
  return axios.post(`${API_URL}/check-register`, { registerNumber });
};

const loginUser = (registerNumber, password) => {
  return axios.post(`${API_URL}/login`, {
    registerNumber,
    password
  });
};

export { checkRegister, loginUser };
