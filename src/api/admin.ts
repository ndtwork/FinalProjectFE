// src/api/admin.ts
const BASE = import.meta.env.VITE_API_BASE_URL;

// GET all collections
export const getCollections = async (token: string): Promise<string[]> => {
  const res = await fetch(`${BASE}/admin/collections`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(await res.text());
  // JSON trả về { collections: string[] }
  const data: { collections: string[] } = await res.json();
  return data.collections;
};

// POST create
export const createCollection = async (
  token: string,
  name: string,
  vectorSize = 768,
  distance = "COSINE"
) => {
  const form = new URLSearchParams({ name, vector_size: String(vectorSize), distance });
  const res = await fetch(`${BASE}/admin/collections`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Bearer ${token}`,
    },
    body: form,
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
};

// DELETE collection
export const deleteCollection = async (token: string, name: string) => {
  const res = await fetch(`${BASE}/admin/collections/${name}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
};

// GET active
export const getActiveCollection = async (token: string): Promise<{ active_collection: string }> => {
  const res = await fetch(`${BASE}/admin/settings/active_collection`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
};

// PUT set active
export const setActiveCollection = async (token: string, name: string) => {
  const form = new URLSearchParams({ name });
  const res = await fetch(`${BASE}/admin/settings/active_collection`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Bearer ${token}`,
    },
    body: form,
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
};

// POST ingest đúng đường dẫn
export const ingestFile = async (
  token: string,
  collectionName: string,
  documentType: string,
  file: File
) => {
  const form = new FormData();
  form.append("document_type", documentType);
  form.append("file", file);
  const res = await fetch(`${BASE}/admin/collections/${collectionName}/ingest`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: form,
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
};
