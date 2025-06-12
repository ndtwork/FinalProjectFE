const BASE = import.meta.env.VITE_API_BASE_URL;

export const login = async (username: string, password: string) => {
  const res = await fetch(`${BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();  // { access_token, token_type }
};

export const register = async (username: string, email: string, password: string) => {
  const res = await fetch(`${BASE}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, email, password }),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();  // user object
};
