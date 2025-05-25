// ---------------------- src/utils/chatSocket.ts ----------------------
export const createSocket = (token: string, onMessage: (msg: string) => void) => {
  const socket = new WebSocket(`ws://localhost:8000/ws/chat?token=${token}`);

  socket.onopen = () => console.log("WebSocket connected");
  socket.onmessage = (event) => {
    const data = event.data;
    console.log("Server:", data);
    onMessage(data);
  };
  socket.onerror = (e) => console.error("WebSocket error:", e);

  return socket;
};