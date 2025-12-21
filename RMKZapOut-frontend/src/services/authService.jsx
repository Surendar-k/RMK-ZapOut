import axios from "axios";

const API_URL = "http://localhost:5000/auth";

const checkEmail = (email) => {
  return axios.post(`${API_URL}/check-email`, { email });
};

const loginUser = (email, password) => {
  return axios.post(`${API_URL}/login`, {
    email,
    password,
  });
};

export { checkEmail, loginUser };
