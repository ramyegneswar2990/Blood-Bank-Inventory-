import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { AuthAPI } from "@/services/api";
import type { BloodGroup } from "@/lib/mockData";

// Backend returns DONOR | RECEIVER | ADMIN (uppercase).
// We store lowercase internally for route matching.
export type Role = "donor" | "receiver" | "admin";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  bloodGroup?: BloodGroup;
  location?: string;
  available?: boolean;
}

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (data: {
    name: string;
    email: string;
    password: string;
    role: Role;
    location: string;
    bloodGroup?: BloodGroup;
  }) => Promise<void>;
  logout: () => void;
  updateUser: (patch: Partial<AuthUser>) => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const STORAGE_KEY = "bb_user";
const TOKEN_KEY = "bb_token";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        setUser(JSON.parse(raw));
      } catch {
        /* noop */
      }
    }
    setLoading(false);
  }, []);

  const persist = (u: AuthUser | null) => {
    setUser(u);
    if (u) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
    } else {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(TOKEN_KEY);
    }
  };

  const login: AuthContextValue["login"] = async (email, password) => {
    const { data } = await AuthAPI.login(email, password);
    localStorage.setItem(TOKEN_KEY, data.token);
    const role = data.role.toLowerCase() as Role;
    const authUser: AuthUser = {
      id: crypto.randomUUID(), // backend doesn't return id in AuthResponse
      name: data.name,
      email,
      role,
    };
    persist(authUser);
  };

  const signup: AuthContextValue["signup"] = async (formData) => {
    const payload = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      role: formData.role.toUpperCase(),           // backend expects DONOR/RECEIVER/ADMIN
      location: formData.location,
      bloodGroup: formData.bloodGroup ?? null,
      lastDonationDate: null,
      latitude: null,
      longitude: null,
    };
    const { data } = await AuthAPI.signup(payload);
    localStorage.setItem(TOKEN_KEY, data.token);
    const role = data.role.toLowerCase() as Role;
    const authUser: AuthUser = {
      id: crypto.randomUUID(),
      name: data.name,
      email: formData.email,
      role,
      bloodGroup: formData.bloodGroup,
      location: formData.location,
      available: true,
    };
    persist(authUser);
  };

  const logout = () => persist(null);

  const updateUser = (patch: Partial<AuthUser>) => {
    setUser((prev) => {
      if (!prev) return prev;
      const next = { ...prev, ...patch };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
