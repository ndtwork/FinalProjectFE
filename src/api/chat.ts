// src/api/chat.ts
const CHAT_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000';

export interface Conversation {
  id: number;
  title: string;
  created_at: string;
}

export interface Message {
  id: number;
  sender: string;
  text: string;
  timestamp: string;
}

function authHeader(token: string): Record<string, string> {
  return { Authorization: `Bearer ${token}` };
}

export async function getConversations(token: string): Promise<Conversation[]> {
  const res = await fetch(`${CHAT_BASE_URL}/chat/conversations`, {
    method: 'GET',
    headers: authHeader(token),
  });
  if (!res.ok) throw new Error(`Fetch conversations failed: ${res.status} ${res.statusText}`);
  return res.json();
}

export async function getMessages(
  token: string,
  conversationId: number,
  skip = 0,
  value = 50
): Promise<Message[]> {
  const params = new URLSearchParams({ skip: skip.toString(), value: value.toString() });
  const res = await fetch(
    `${CHAT_BASE_URL}/chat/conversations/${conversationId}/messages?${params.toString()}`,
    {
      method: 'GET',
      headers: authHeader(token),
    }
  );
  if (!res.ok) throw new Error(`Fetch messages failed: ${res.status} ${res.statusText}`);
  return res.json();
}

export async function createConversation(
  token: string,
  title: string
): Promise<Conversation> {
  const res = await fetch(
    `${CHAT_BASE_URL}/chat/conversations?title=${encodeURIComponent(title)}`,
    {
      method: 'POST',
      headers: authHeader(token),
    }
  );
  if (!res.ok) throw new Error(`Create conversation failed: ${res.status} ${res.statusText}`);
  return res.json();
}

export async function deleteConversation(
  token: string,
  conversationId: number
): Promise<void> {
  const res = await fetch(`${CHAT_BASE_URL}/chat/conversations/${conversationId}`, {
    method: 'DELETE',
    headers: authHeader(token),
  });
  if (!res.ok) throw new Error(`Delete conversation failed: ${res.status} ${res.statusText}`);
}

export async function getHistory(
  token: string,
  skip = 0,
  limit = 20
): Promise<{ id: number; messages: Message[] }[]> {
  const res = await fetch(
    `${CHAT_BASE_URL}/chat/history?skip=${skip}&limit=${limit}`,
    {
      headers: authHeader(token),
    }
  );
  if (!res.ok) throw new Error(`Fetch history failed: ${res.status} ${res.statusText}`);
  return res.json();
}
