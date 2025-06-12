// src/api/auth.ts
import { LoginResponse, User } from "../types";

const BASE = import.meta.env.VITE_API_BASE_URL;

export interface LoginResponse {
  access_token: string;
  token_type: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  role: string;
}

export const login = async (username: string, password: string): Promise<LoginResponse> => {
  const res = await fetch(`${BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
};

export const register = async (username: string, email: string, password: string): Promise<User> => {
  const res = await fetch(`${BASE}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, email, password }),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
};

