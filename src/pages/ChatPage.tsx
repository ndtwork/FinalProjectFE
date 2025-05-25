// ---------------------- src/pages/ChatPage.tsx ----------------------
import { useEffect, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { createSocket } from "../utils/chatSocket";

export default function ChatPage() {
  const { token } = useAuth();
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState("");
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!token) return;
    const socket = createSocket(token, (message) => {
      setMessages((prev) => [...prev, `Bot: ${message}`]);
    });
    socketRef.current = socket;
    return () => socket.close();
  }, [token]);

  const handleSend = () => {
    if (socketRef.current && input.trim()) {
      socketRef.current.send(input);
      setMessages((prev) => [...prev, `You: ${input}`]);
      setInput("");
    }
  };

  return (
    <div>
      <div style={{ maxHeight: "400px", overflowY: "auto" }}>
        {messages.map((msg, i) => (
          <div key={i}>{msg}</div>
        ))}
      </div>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type a message..."
        onKeyDown={(e) => e.key === "Enter" && handleSend()}
      />
      <button onClick={handleSend}>Send</button>
    </div>
  );
}
