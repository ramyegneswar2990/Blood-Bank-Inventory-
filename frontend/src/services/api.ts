import axios from "axios";

// All /api calls are proxied to http://localhost:8081 by Vite dev server.
export const api = axios.create({
  baseURL: "/api",
  timeout: 10000,
});

// Attach JWT token to every request automatically.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("bb_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ─── Auth ─────────────────────────────────────────────────────────────────
// POST /api/auth/login      { email, password }  → { token, role, name }
// POST /api/auth/signup     { name, email, password, role, location,
//                             bloodGroup?, lastDonationDate?, latitude?, longitude? }
//                           → { token, role, name }
export const AuthAPI = {
  login: (email: string, password: string) =>
    api.post<{ token: string; role: string; name: string }>("/auth/login", { email, password }),

  signup: (data: {
    name: string;
    email: string;
    password: string;
    role: string;          // DONOR | RECEIVER | ADMIN
    location: string;
    bloodGroup?: string;
    lastDonationDate?: string | null;
    latitude?: number | null;
    longitude?: number | null;
  }) => api.post<{ token: string; role: string; name: string }>("/auth/signup", data),
};

// ─── Inventory ────────────────────────────────────────────────────────────
// GET  /api/blood/check?group=O%2B  → BloodInventory[]   (public)
// GET  /api/blood/admin/all         → BloodInventory[]   (ADMIN)
// POST /api/blood/admin/add         → BloodInventory     (ADMIN)
// DELETE /api/blood/admin/{id}                           (ADMIN)
export interface BloodInventoryItem {
  id?: number;
  bloodGroup: string;
  units: number;
  hospitalName: string;
  location: string;
}

export const InventoryAPI = {
  check: (group: string) =>
    api.get<BloodInventoryItem[]>("/blood/check", { params: { group } }),

  getAll: () =>
    api.get<BloodInventoryItem[]>("/blood/admin/all"),

  add: (data: BloodInventoryItem) =>
    api.post<BloodInventoryItem>("/blood/admin/add", data),

  remove: (id: number) =>
    api.delete(`/blood/admin/${id}`),
};

// ─── Requests ─────────────────────────────────────────────────────────────
// POST /api/request/create  { bloodGroup, urgencyLevel, location, requiredUnits }
// GET  /api/request/status/{id}
export interface BloodRequestPayload {
  bloodGroup: string;
  urgencyLevel: string;   // HIGH | MEDIUM | LOW
  location: string;
  requiredUnits: number;
}

export interface BloodRequestResponse {
  id: number;
  bloodGroup: string;
  urgencyLevel: string;
  location: string;
  requiredUnits: number;
  status: string;         // PENDING | ACCEPTED | FULFILLED | REJECTED
  createdAt: string;
}

export const RequestsAPI = {
  create: (data: BloodRequestPayload) =>
    api.post<BloodRequestResponse>("/request/create", data),

  getStatus: (id: number) =>
    api.get<BloodRequestResponse>(`/request/status/${id}`),
};
