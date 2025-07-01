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
    <div className="flex h-screen bg-gradient-to-br from-teal-200 via-blue-200 to-blue-300">
      {/* Sidebar */}
      <aside className="w-64 min-w-[220px] max-w-[300px] border-r border-blue-100 bg-white/80 shadow-lg flex flex-col p-4">
        <button
          onClick={handleNew}
          className="w-full py-2 mb-5 rounded-xl text-white font-semibold bg-gradient-to-r from-teal-400 to-blue-500 shadow hover:scale-105 hover:shadow-xl transition-all flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4" strokeLinecap="round" strokeLinejoin="round" /></svg>
          Cuộc hội thoại mới
        </button>
        <ul className="flex-1 overflow-y-auto space-y-2">
          {convs.map((c) => (
            <li key={c.id} className="flex items-center group">
              <button
                onClick={() => setSelected(c.id)}
                className={`flex-1 text-left px-3 py-2 rounded-lg transition-all truncate ${selected === c.id
                    ? "bg-blue-100 font-bold text-blue-700"
                    : "hover:bg-blue-50"
                  }`}
                title={c.title ?? `Session ${c.id}`}
              >
                {c.title ?? `Session ${c.id}`}
              </button>
              <button
                onClick={() => handleDelete(c.id)}
                className="ml-2 p-1 text-gray-400 hover:text-red-500 opacity-60 group-hover:opacity-100 transition"
                title="Xóa"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </li>
          ))}
        </ul>
      </aside>

      {/* Main chat area */}
      <main className="flex-1 flex flex-col justify-between p-6 overflow-hidden">
        <h2 className="text-xl font-bold text-blue-600 mb-2">
          Chat {selected !== null ? `#${selected}` : "(new)"}
        </h2>
        <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-4">
          {chat.map((entry, idx) => (
            <div key={idx} className="space-y-2">
              {entry.question && (
                <div className="flex justify-end">
                  <div className="max-w-[60%] bg-blue-100 text-blue-900 rounded-2xl px-4 py-2 shadow font-medium">
                    <strong>Bạn:</strong> {entry.question}
                  </div>
                </div>
              )}
              {entry.answer && (
                <div className="flex justify-start">
                  <div className="max-w-[70%] bg-teal-100 text-teal-900 rounded-2xl px-4 py-2 shadow">
                    <strong>Bot:</strong> {entry.answer}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="flex items-center gap-3 mt-2">
          <input
            className="flex-1 text-lg rounded-xl border border-gray-200 px-5 py-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Nhập câu hỏi..."
          />
          <button
            onClick={handleSend}
            className="py-3 px-8 text-lg font-bold text-white rounded-2xl bg-gradient-to-r from-teal-400 to-blue-500 shadow-lg transition-all duration-150 hover:scale-105 hover:shadow-2xl"
          >
            Gửi
          </button>
        </div>
      </main>

      {/* Sidebar phải: Câu hỏi gợi ý */}
      <aside className="w-64 min-w-[200px] border-l border-blue-100 bg-white/80 shadow-lg flex flex-col p-4 space-y-2 overflow-y-auto">
        <h3 className="text-lg font-semibold text-blue-700 mb-2">Gợi ý câu hỏi</h3>
        {[
          "Cấu trúc 1 năm học",
          "CPA = 3.0 thì khi tốt nghiệp tôi sẽ nhận bằng loại gì",
          "tôi muốn hoàn thành chương trình kỹ sư thì cần học bao nhiêu tín chỉ",
        ].map((q, idx) => (
          <button
            key={idx}
            onClick={() => setInput(q)}
            className="text-left w-full px-3 py-2 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-800 transition-all shadow-sm"
          >
            {q}
          </button>
        ))}
      </aside>
    </div>
  );

}
