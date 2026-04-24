import axios from "axios";

// Configure your backend base URL via VITE_API_URL when available.
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
  timeout: 10000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("bb_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Example API wrappers — wire to your backend when ready.
export const AuthAPI = {
  login: (email: string, password: string) => api.post("/auth/login", { email, password }),
  signup: (data: { name: string; email: string; password: string; role: string }) =>
    api.post("/auth/signup", data),
};

export const InventoryAPI = {
  list: () => api.get("/inventory"),
  update: (group: string, units: number) => api.put(`/inventory/${group}`, { units }),
};

export const RequestsAPI = {
  list: () => api.get("/requests"),
  create: (data: unknown) => api.post("/requests", data),
  updateStatus: (id: string, status: string) => api.patch(`/requests/${id}`, { status }),
};
