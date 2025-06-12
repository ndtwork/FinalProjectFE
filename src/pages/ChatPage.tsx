import { useEffect, useRef, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { createSocket } from '../utils/chatSocket';
import { ScrollArea } from '../components/ui/scroll-area';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Send } from 'lucide-react';

export default function ChatPage() {
  const { token } = useAuth();
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState('');
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!token) return;
    socketRef.current = createSocket(token, msg => {
      setMessages(m => [...m, msg]);
    });
    return () => socketRef.current?.close();
  }, [token]);

  const handleSend = () => {
    if (!socketRef.current || !input.trim()) return;
    socketRef.current.send(input);
    setMessages(m => [...m, `Bạn: ${input}`]);
    setInput('');
  };

  return (
    <div className="p-4 flex flex-col h-screen">
      <h2 className="text-2xl mb-4">Chat với Bot</h2>
      <ScrollArea className="flex-1 mb-4 border p-2">
        {messages.map((m, i) => (
          <div key={i} className="mb-2">{m}</div>
        ))}
      </ScrollArea>
      <div className="flex space-x-2">
        <Input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
          placeholder="Nhập tin nhắn..."
          className="flex-1"
        />
        <Button onClick={handleSend} size="icon">
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
