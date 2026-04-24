import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import type { Role, BloodGroup } from "@/lib/mockData";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  bloodGroup?: BloodGroup;
  city?: string;
  available?: boolean;
}

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string, role: Role) => Promise<void>;
  signup: (data: Omit<AuthUser, "id"> & { password: string }) => Promise<void>;
  logout: () => void;
  updateUser: (patch: Partial<AuthUser>) => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const STORAGE_KEY = "bb_user";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try { setUser(JSON.parse(raw)); } catch { /* noop */ }
    }
    setLoading(false);
  }, []);

  const persist = (u: AuthUser | null) => {
    setUser(u);
    if (u) localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
    else localStorage.removeItem(STORAGE_KEY);
  };

  const login: AuthContextValue["login"] = async (email, _password, role) => {
    // Mock login — replace with AuthAPI.login when backend is ready.
    await new Promise((r) => setTimeout(r, 600));
    const mock: AuthUser = {
      id: crypto.randomUUID(),
      name: email.split("@")[0].replace(/\b\w/g, (c) => c.toUpperCase()),
      email,
      role,
      bloodGroup: "O+",
      city: "Mumbai",
      available: true,
    };
    persist(mock);
  };

  const signup: AuthContextValue["signup"] = async (data) => {
    await new Promise((r) => setTimeout(r, 600));
    const mock: AuthUser = {
      id: crypto.randomUUID(),
      name: data.name,
      email: data.email,
      role: data.role,
      bloodGroup: data.bloodGroup,
      city: data.city,
      available: true,
    };
    persist(mock);
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
