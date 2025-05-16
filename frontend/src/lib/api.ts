import axios from "axios";
import { logout } from "./auth";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:8080",
});

api.interceptors.request.use((cfg) => {
  const token = localStorage.getItem("token");
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

/* forces logout if 401 or 403 */
api.interceptors.response.use(
  (r) => r,
  (err) => {
    if ([401, 403].includes(err?.response?.status)) logout();
    return Promise.reject(err);
  }
);

export default api;
