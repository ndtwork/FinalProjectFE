// src/context/AuthContext.tsx
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { login as apiLogin, register as apiRegister } from "../api/auth";

interface JwtPayload {
  exp?: number;
  iat?: number;
  sub?: string;
  role?: string;
}

// Hàm tự parse phần payload của JWT mà không cần thư viện ngoài
function parseJwt(token: string): JwtPayload | null {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

interface AuthContextType {
  token: string | null;
  role: string | null;
  login: (username: string, password: string) => Promise<void>;
  register: (
    username: string,
    email: string,
    password: string
  ) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  token: null,
  role: null,
  login: async () => {},
  register: async () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );
  const [role, setRole] = useState<string | null>(
    localStorage.getItem("role")
  );

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
      const payload = parseJwt(token);
      if (payload?.role) {
        setRole(payload.role);
        localStorage.setItem("role", payload.role);
      }
    } else {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      setRole(null);
    }
  }, [token]);

  const login = async (username: string, password: string) => {
    const data = await apiLogin(username, password);
    setToken(data.access_token);
  };

  const register = async (
    username: string,
    email: string,
    password: string
  ) => {
    await apiRegister(username, email, password);
  };

  const logout = () => {
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ token, role, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
