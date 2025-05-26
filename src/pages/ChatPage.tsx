// ---------------------- src/pages/ChatPage.tsx ----------------------
import { useEffect, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { createSocket } from "../utils/chatSocket";
import { ScrollArea } from "../components/ui/scroll-area";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Send } from "lucide-react";

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
    <div className="flex h-screen w-full">
      {/* Sidebar */}
      <div className="w-1/4 border-r p-4 bg-gray-50">
        <div className="flex items-center justify-between mb-4">
          <img src="/hust-logo.png" alt="HUST" className="w-10 h-10" />
          <h2 className="text-lg font-bold">HUST ChatBot</h2>
        </div>
        <div className="space-y-2">
          <div className="p-2 bg-white rounded shadow cursor-pointer hover:bg-gray-100">Lịch sử 1</div>
          <div className="p-2 bg-white rounded shadow cursor-pointer hover:bg-gray-100">Lịch sử 2</div>
        </div>
      </div>

      {/* Main chat */}
      <div className="flex flex-col flex-1 justify-between bg-white">
        <ScrollArea className="flex-1 p-4 space-y-2 overflow-y-auto">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`max-w-md px-4 py-2 rounded-xl shadow text-sm whitespace-pre-line ${
                msg.startsWith("You") ? "ml-auto bg-blue-100 text-right" : "mr-auto bg-gray-100"
              }`}
            >
              {msg}
            </div>
          ))}
        </ScrollArea>

        <div className="flex items-center gap-2 p-4 border-t">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Nhập tin nhắn..."
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            className="flex-1"
          />
          <Button onClick={handleSend} size="icon">
            <Send className="w-4 h-4" />
          </Button>
          <img src="/user-avatar.png" alt="User" className="w-8 h-8 rounded-full ml-2" />
        </div>
      </div>
    </div>
  );
}
