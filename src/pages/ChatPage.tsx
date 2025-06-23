// src/pages/ChatPage.tsx
import React, { useEffect, useRef, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  getConversations,
  getMessages,
  deleteConversation,
  createConversation,
  Conversation,
  Message,
} from '../api/chat';
import { createSocket } from '../utils/chatSocket';

type ChatEntry = { question: string; answer: string };

export default function ChatPage() {
  const { token } = useAuth();
  const [convs, setConvs] = useState<Conversation[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [chat, setChat] = useState<ChatEntry[]>([]);
  const [messageInput, setMessageInput] = useState<string>('');
  const wsRef = useRef<WebSocket | null>(null);

  // 1. Load conversations
  useEffect(() => {
    if (!token) return;
    getConversations(token).then(setConvs).catch(console.error);
  }, [token]);

  // 2. Load messages when a conversation is selected
  useEffect(() => {
    if (!token || selected === null) {
      setChat([]);
      return;
    }
    getMessages(token, selected)
      .then((msgs: Message[]) => {
        setChat(
          msgs.map((m) => ({
            question: m.sender === 'user' ? m.text : '',
            answer: m.sender !== 'user' ? m.text : '',
          }))
        );
      })
      .catch(console.error);
  }, [token, selected]);

  // 3. WebSocket setup
  useEffect(() => {
    if (!token) return;
    wsRef.current?.close();
    wsRef.current = createSocket(token, (botMsg: string) => {
      setChat((prev) => [...prev, { question: '', answer: botMsg }]);
    });
    return () => {
      wsRef.current?.close();
    };
  }, [token, selected]);

  // 4. Send message
  const handleSend = () => {
    if (!wsRef.current || !messageInput.trim()) return;
    wsRef.current.send(messageInput);
    setChat((prev) => [...prev, { question: messageInput, answer: '' }]);
    setMessageInput('');
  };

  // 5. Create a new conversation on the backend, then select it
  const handleNew = async () => {
    if (!token) return;
    try {
      // Here we use createConversation imported from api/chat.ts
      const conv = await createConversation(token, `Session${convs.length + 1}`);
      setConvs((prev) => [conv, ...prev]);
      setSelected(conv.id);
      setChat([]);
    } catch (err) {
      console.error('Tạo conversation mới thất bại', err);
    }
  };

  // 6. Delete conversation
  const handleDelete = (id: number) => {
    if (!token) return;
    deleteConversation(token, id)
      .then(() => {
        setConvs((c) => c.filter((x) => x.id !== id));
        if (selected === id) {
          setSelected(null);
          setChat([]);
        }
      })
      .catch(console.error);
  };

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      {/* Sidebar */}
      <div style={{ width: 240, borderRight: '1px solid #ccc', padding: 16 }}>
        <button onClick={handleNew} style={{ width: '100%', marginBottom: 12 }}>
          + New Conversation
        </button>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {convs.map((c) => (
            <li key={c.id} style={{ marginBottom: 8 }}>
              <span
                onClick={() => setSelected(c.id)}
                style={{
                  cursor: 'pointer',
                  fontWeight: selected === c.id ? 'bold' : 'normal',
                }}
              >
                {c.title ?? `Session ${c.id}`}
              </span>
              <button onClick={() => handleDelete(c.id)} style={{ marginLeft: 8 }}>
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
          display: 'flex',
          flexDirection: 'column',
          padding: 16,
        }}
      >
        <h2>Chat {selected !== null ? `#${selected}` : '(new)'}</h2>
        <div
          style={{
            flex: 1,
            border: '1px solid #ccc',
            padding: 12,
            overflowY: 'auto',
            marginBottom: 12,
          }}
        >
          {chat.map((entry, idx) => (
            <div key={idx} style={{ margin: '8px 0' }}>
              {entry.question && (
                <div style={{ textAlign: 'right' }}>
                  <strong>Bạn:</strong> {entry.question}
                </div>
              )}
              {entry.answer && (
                <div style={{ textAlign: 'left' }}>
                  <strong>Bot:</strong> {entry.answer}
                </div>
              )}
            </div>
          ))}
        </div>
        <div style={{ display: 'flex' }}>
          <input
            style={{ flex: 1, padding: 8 }}
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Nhập câu hỏi..."
          />
          <button onClick={handleSend} style={{ marginLeft: 8, padding: '0 16px' }}>
            Gửi
          </button>
        </div>
      </div>
    </div>
  );
}
