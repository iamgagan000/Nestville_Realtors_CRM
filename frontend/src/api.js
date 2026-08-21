import axios from "axios";

const api = axios.create({
  baseURL: "https://nestville-realtors-crm.onrender.com/api"
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("estate_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
