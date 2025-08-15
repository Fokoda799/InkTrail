import { io } from "socket.io-client";

// Connect to backend Socket.IO server
export const socket = io("https://inktrail.onrender.com/", { autoConnect: false });
