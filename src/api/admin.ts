// src/api/admin.ts
const BASE = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000';

// GET tất cả collections
export const getCollections = async (token: string): Promise<string[]> => {
  const res = await fetch(`${BASE}/admin/collections`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(await res.text());
  // API trả về JSON: { collections: string[] }
  const data: { collections: string[] } = await res.json();
  return data.collections;
};

// Tạo collection mới
export const createCollection = async (
  token: string,
  name: string,
  vector_size: number = 768,
  distance: string = 'cosine'
) => {
  const form = new FormData();
  form.append('name', name);
  form.append('vector_size', vector_size.toString());
  form.append('distance', distance);
  const res = await fetch(`${BASE}/admin/collections`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: form,
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
};

// Xóa collection
export const deleteCollection = async (token: string, name: string) => {
  const res = await fetch(
    `${BASE}/admin/collections/${encodeURIComponent(name)}`,
    {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  if (!res.ok) throw new Error(await res.text());
  return res.json();
};

// Lấy collection đang active
export const getActiveCollection = async (
  token: string
): Promise<{ active_collection: string }> => {
  const res = await fetch(`${BASE}/admin/settings/active_collection`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
};

// Đặt lại collection active
export const setActiveCollection = async (token: string, name: string) => {
  const form = new URLSearchParams({ name });
  const res = await fetch(`${BASE}/admin/settings/active_collection`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Bearer ${token}`,
    },
    body: form,
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
};

// Ingest file vào collection
export const ingestFile = async (
  token: string,
  collectionName: string,
  documentType: string,
  file: File
) => {
  const form = new FormData();
  form.append('document_type', documentType);
  form.append('file', file);
  const res = await fetch(
    `${BASE}/admin/collections/${encodeURIComponent(
      collectionName
    )}/ingest`,
    {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: form,
    }
  );
  if (!res.ok) throw new Error(await res.text());
  return res.json();
};
