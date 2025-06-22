// src/api/admin.ts
const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000';

export interface Collection {
  name: string;
  vector_size: number;
  distance: string;
  created_at: string;
  status: string;
}

export interface IngestResponse {
  collection: string;
  ingested: number;
  errors: unknown[];
}

function authHeader(token: string): Record<string, string> {
  return { Authorization: `Bearer ${token}` };
}

/**
 * Fetch the list of collection names.
 */
export async function getCollections(token: string): Promise<string[]> {
  const res = await fetch(`${BASE_URL}/admin/collections`, {
    method: 'GET',
    headers: authHeader(token),
  });
  if (!res.ok) {
    throw new Error(`Fetch collections failed: ${res.status} ${res.statusText}`);
  }
  const data = await res.json();
  // API may return Collection[] or { collections: Collection[] }
  const arr: Collection[] = Array.isArray(data)
    ? data
    : data.collections ?? [];
  return arr.map(c => c.name);
}

/**
 * Create a new collection. vector_size and distance have sensible defaults.
 */
export async function createCollection(
  token: string,
  name: string,
  vector_size = 768,
  distance = 'cosine'
): Promise<Collection> {
  const form = new FormData();
  form.append('name', name);
  form.append('vector_size', vector_size.toString());
  form.append('distance', distance);

  const res = await fetch(`${BASE_URL}/admin/collections`, {
    method: 'POST',
    headers: authHeader(token),
    body: form,
  });
  if (!res.ok) {
    throw new Error(`Create collection failed: ${res.status} ${res.statusText}`);
  }
  return res.json();
}

/**
 * Delete the given collection.
 */
export async function deleteCollection(token: string, name: string): Promise<void> {
  const res = await fetch(
    `${BASE_URL}/admin/collections/${encodeURIComponent(name)}`,
    {
      method: 'DELETE',
      headers: authHeader(token),
    }
  );
  if (!res.ok) {
    throw new Error(`Delete collection failed: ${res.status} ${res.statusText}`);
  }
}

/**
 * Ingest a file into the given collection.
 */
export async function ingestFile(
  token: string,
  collectionName: string,
  document_type: string,
  file: File
): Promise<IngestResponse> {
  const form = new FormData();
  form.append('document_type', document_type);
  form.append('file', file);

  const res = await fetch(
    `${BASE_URL}/admin/collections/${encodeURIComponent(collectionName)}/ingest`,
    {
      method: 'POST',
      headers: authHeader(token),
      body: form,
    }
  );
  if (!res.ok) {
    throw new Error(`Ingest file failed: ${res.status} ${res.statusText}`);
  }
  return res.json();
}

/**
 * Get the name of the active collection.
 */
export async function getActiveCollection(token: string): Promise<string> {
  const res = await fetch(`${BASE_URL}/admin/settings/active_collection`, {
    method: 'GET',
    headers: authHeader(token),
  });
  if (!res.ok) {
    throw new Error(`Fetch active collection failed: ${res.status} ${res.statusText}`);
  }
  const data: { active_collection: string } = await res.json();
  return data.active_collection;
}

/**
 * Set the active collection by name.
 */
export async function setActiveCollection(token: string, name: string): Promise<string> {
  const form = new FormData();
  form.append('name', name);

  const res = await fetch(`${BASE_URL}/admin/settings/active_collection`, {
    method: 'PUT',
    headers: authHeader(token),
    body: form,
  });
  if (!res.ok) {
    throw new Error(`Set active collection failed: ${res.status} ${res.statusText}`);
  }
  const data: { active_collection: string } = await res.json();
  return data.active_collection;
}
