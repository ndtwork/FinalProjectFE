export const createSocket = (
  token: string,
  onMessage: (msg: string) => void,
  onOpen?: () => void,
  onClose?: () => void
) => {
  const WS_BASE = import.meta.env.VITE_WS_BASE_URL;
  const socket = new WebSocket(`${WS_BASE}/ws/chat?token=${token}`);

  socket.onopen = () => {
    console.log("WebSocket connected");
    onOpen?.();
  };
  socket.onmessage = (event) => {
    onMessage(event.data);
  };
  socket.onclose = () => {
    console.log("WebSocket disconnected");
    onClose?.();
  };
  return socket;
};
