// src/api/admin.ts
const ADMIN_BASE = import.meta.env.VITE_API_BASE_URL;

export const createCollection = async (name: string, vectorSize = 768, distance = "COSINE") => {
  const form = new URLSearchParams({ name, vector_size: String(vectorSize), distance });
  const res = await fetch(`${ADMIN_BASE}/admin/collections`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: form,
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
};

export const deleteCollection = async (name: string) => {
  const res = await fetch(`${ADMIN_BASE}/admin/collections/${name}`, { method: "DELETE" });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
};

export const getActiveCollection = async () => {
  const res = await fetch(`${ADMIN_BASE}/admin/settings/active_collection`);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
};

export const setActiveCollection = async (name: string) => {
  const form = new URLSearchParams({ name });
  const res = await fetch(`${ADMIN_BASE}/admin/settings/active_collection`, {
    method: "PUT",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: form,
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
};

export const ingestFile = async (collectionName: string, documentType: string, file: File) => {
  const form = new FormData();
  form.append("name", collectionName);
  form.append("document_type", documentType);
  form.append("file", file);
  const res = await fetch(`${ADMIN_BASE}/admin/ingest`, {
    method: "POST",
    body: form,
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
};