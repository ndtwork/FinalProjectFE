// src/api/chat.ts

// 1. Định nghĩa các kiểu trả về của BE
export interface Conversation {
  id: number;
  title: string | null;
  created_at: string;  // ISO datetime string
}

export interface ConversationMessage {
  id: number;
  conversation_id: number;
  timestamp: string;   // ISO datetime string
  question: string;
  answer: string;
  rag_context: string;
}

const BASE = import.meta.env.VITE_API_BASE_URL;

/**
 * GET /chat/conversations
 * Trả về danh sách conversation metadata.
 */
export async function getConversations(token: string): Promise<Conversation[]> {
  const res = await fetch(`${BASE}/chat/conversations`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

/**
 * GET /chat/conversations/{id}/messages
 * Trả về lịch sử message cho conversation đó.
 */
export async function getMessages(
  token: string,
  conversationId: number,
  skip = 0,
  limit = 50
): Promise<ConversationMessage[]> {
  const url = `${BASE}/chat/conversations/${conversationId}/messages?skip=${skip}&value=${limit}`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

/**
 * DELETE /chat/conversations/{id}
 * Xóa conversation và toàn bộ history của nó.
 */
export async function deleteConversation(
  token: string,
  conversationId: number
): Promise<void> {
  const res = await fetch(`${BASE}/chat/conversations/${conversationId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(await res.text());
}

/**
 * (Tùy chọn) GET /chat/history
 * Nếu bạn cần lấy tất cả conversation kèm messages theo batch.
 */
export async function getHistory(
  token: string,
  skip = 0,
  limit = 20
): Promise<{ id: number; messages: ConversationMessage[] }[]> {
  const res = await fetch(
    `${BASE}/chat/history?skip=${skip}&limit=${limit}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}
