import { io } from "socket.io-client";

const SERVER_URL =
  import.meta.env.VITE_SOCKET_URL || "http://localhost:3001";

export const socket = io(SERVER_URL, {
  autoConnect: false,
  reconnectionAttempts: 5,
  timeout: 5000
});
