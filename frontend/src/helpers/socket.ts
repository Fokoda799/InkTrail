import { io } from "socket.io-client";

// Connect to backend Socket.IO server
export const socket = io("http://localhost:8080", { autoConnect: false });
