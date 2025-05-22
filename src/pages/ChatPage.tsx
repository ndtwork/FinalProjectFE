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
    const socket = createSocket(token);
    socket.onmessage = (e) => setMessages((prev) => [...prev, JSON.parse(e.data).message]);
    socketRef.current = socket;
    return () => socket.close();
  }, [token]);

  const handleSend = () => {
    if (socketRef.current && input.trim()) {
      socketRef.current.send(JSON.stringify({ message: input }));
      setMessages((prev) => [...prev, `You: ${input}`]);
      setInput("");
    }
  };

  return (
    <div>
      <div>
        {messages.map((msg, i) => (
          <div key={i}>{msg}</div>
        ))}
      </div>
      <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Type a message..." />
      <button onClick={handleSend}>Send</button>
    </div>
  );
}
