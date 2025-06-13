// src/pages/ChatPage.tsx
import React, { useEffect, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";
import {
  getConversations,
  getMessages,
  deleteConversation,
  Conversation,
  ConversationMessage,
} from "../api/chat";
import { createSocket } from "../utils/chatSocket";

// Chỉ chứa question + answer để render
type ChatEntry = { question: string; answer: string };

export default function ChatPage() {
  const { token } = useAuth();
  const [convs, setConvs] = useState<Conversation[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [chat, setChat] = useState<ChatEntry[]>([]);
  const [input, setInput] = useState("");

  // Giữ WebSocket instance ở đây
  const wsRef = useRef<WebSocket | null>(null);

  // 1. Load danh sách conversations
  useEffect(() => {
    if (!token) return;
    getConversations(token).then(setConvs).catch(console.error);
  }, [token]);

  // 2. Khi chọn conversation, fetch messages + chỉ lấy question/answer
  useEffect(() => {
    if (!token || selected === null) {
      setChat([]);
      return;
    }
    getMessages(token, selected)
      .then((msgs: ConversationMessage[]) => {
        const entries = msgs.map((m) => ({
          question: m.question,
          answer: m.answer,
        }));
        setChat(entries);
      })
      .catch(console.error);
  }, [token, selected]);

  // 3. Mở WebSocket mỗi khi token hoặc selected thay đổi
  useEffect(() => {
    if (!token) return;
    // Đóng socket cũ nếu có
    wsRef.current?.close();
    // Mở socket mới
    wsRef.current = createSocket(token, (botMsg) => {
      setChat((prev) => [...prev, { question: "", answer: botMsg }]);
    });
    return () => {
      wsRef.current?.close();
    };
  }, [token, selected]);

  // 4. Gửi tin nhắn qua WebSocket
  const handleSend = () => {
    if (!wsRef.current || !input.trim()) return;
    wsRef.current.send(input);
    setChat((prev) => [...prev, { question: input, answer: "" }]);
    setInput("");
  };

  // 5. Tạo conversation mới
  const handleNew = () => {
    setSelected(null);
    setChat([]);
  };

  // 6. Xóa conversation
  const handleDelete = (id: number) => {
    if (!token) return;
    deleteConversation(token, id)
      .then(() => {
        setConvs((c) => c.filter((x) => x.id !== id));
        if (selected === id) handleNew();
      })
      .catch(console.error);
  };

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      {/* Sidebar */}
      <div style={{ width: 240, borderRight: "1px solid #ccc", padding: 16 }}>
        <button
          onClick={handleNew}
          style={{ width: "100%", marginBottom: 12 }}
        >
          + New Conversation
        </button>
        <ul style={{ listStyle: "none", padding: 0 }}>
          {convs.map((c) => (
            <li key={c.id} style={{ marginBottom: 8 }}>
              <span
                onClick={() => setSelected(c.id)}
                style={{
                  cursor: "pointer",
                  fontWeight: selected === c.id ? "bold" : "normal",
                }}
              >
                {c.title ?? `Session ${c.id}`}
              </span>
              <button
                onClick={() => handleDelete(c.id)}
                style={{ marginLeft: 8 }}
              >
                🗑
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Main chat area */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          padding: 16,
        }}
      >
        <h2>Chat {selected !== null ? `#${selected}` : "(new)"}</h2>
        <div
          style={{
            flex: 1,
            border: "1px solid #ccc",
            padding: 12,
            overflowY: "auto",
            marginBottom: 12,
          }}
        >
          {chat.map((entry, idx) => (
            <div key={idx} style={{ margin: "8px 0" }}>
              {entry.question && (
                <div style={{ textAlign: "right" }}>
                  <strong>Bạn:</strong> {entry.question}
                </div>
              )}
              {entry.answer && (
                <div style={{ textAlign: "left" }}>
                  <strong>Bot:</strong> {entry.answer}
                </div>
              )}
            </div>
          ))}
        </div>
        <div style={{ display: "flex" }}>
          <input
            style={{ flex: 1, padding: 8 }}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Nhập câu hỏi..."
          />
          <button
            onClick={handleSend}
            style={{ marginLeft: 8, padding: "0 16px" }}
          >
            Gửi
          </button>
        </div>
      </div>
    </div>
  );
}
