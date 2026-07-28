import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "/api";

const api = axios.create({ baseURL: API_URL });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

let refreshing = null;

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status !== 401 || originalRequest._retry)
      return Promise.reject(error);
    originalRequest._retry = true;
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) return Promise.reject(error);
    if (!refreshing)
      refreshing = (async () => {
        try {
          const res = await axios.post(`${API_URL}/auth/refresh`, {
            refreshToken,
          });
          localStorage.setItem("token", res.data.token);
          if (res.data.refreshToken)
            localStorage.setItem("refreshToken", res.data.refreshToken);
          return true;
        } catch {
          localStorage.removeItem("token");
          localStorage.removeItem("refreshToken");
          localStorage.removeItem("rutago_user");
          window.location.href = "/login";
          return false;
        } finally {
          refreshing = null;
        }
      })();
    const ok = await refreshing;
    if (!ok) return Promise.reject(error);
    originalRequest.headers.Authorization = `Bearer ${localStorage.getItem("token")}`;
    return api(originalRequest);
  },
);

export default api;
