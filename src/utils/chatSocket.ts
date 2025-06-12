// src/utils/chatSocket.ts
export const createSocket = (token: string, onMessage: (msg: string) => void) => {
  const WS_BASE = import.meta.env.VITE_WS_BASE_URL;
  const socket = new WebSocket(`${WS_BASE}/ws/chat?token=${token}`);
  socket.onmessage = (event) => onMessage(event.data);
  return socket;
};