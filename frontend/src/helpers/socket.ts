import { io } from "socket.io-client";

const API_BASE = import.meta.env.DEV_MODE === "development"
  ? import.meta.env.VITE_API_BASE || 'http://localhost:8080/api/v1'
  : import.meta.env.VITE_API_BASE;

// Connect to backend Socket.IO server
export const socket = io(API_BASE, { autoConnect: false });
