import axios from "axios";

const api = axios.create({ baseURL: "http://localhost:5000/api" });
api.interceptors.request.use(config => {
  const token = localStorage.getItem("estate_admin_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
api.interceptors.response.use(r => r, error => {
  if (error.response?.status === 401 || error.response?.status === 403) {
    localStorage.removeItem("estate_admin_token");
    localStorage.removeItem("estate_admin_user");
    window.dispatchEvent(new Event("estate-admin-logout"));
  }
  return Promise.reject(error);
});
export default api;
