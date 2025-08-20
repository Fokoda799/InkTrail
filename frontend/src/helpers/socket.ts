import { io } from "socket.io-client";

// Connect to backend Socket.IO server
export const socket = io("https://inktrail.onrender.com", {
  autoConnect: false,
  transports: ["websocket"], // skip long-polling if possible
  withCredentials: true,
  auth: {
    token: localStorage.getItem("token"), // send token if backend expects auth
  },
});
