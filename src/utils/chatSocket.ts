export const createSocket = (token: string) => {
    const socket = new WebSocket(`ws://localhost:8000/ws/chat?token=${token}`);
  
    socket.onopen = () => console.log("WebSocket connected");
    socket.onmessage = (event) => console.log("Server:", JSON.parse(event.data));
    socket.onerror = (e) => console.error("WebSocket error:", e);
  
    return socket;
  };
  