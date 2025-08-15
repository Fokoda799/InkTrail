import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';
import colors from 'colors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import connectDB from './config/db.js';
import {
  userRouter,
  authRouter,
  adminRouter,
} from './routes/userRoutes.js';
import blogRouter from './routes/blogRoutes.js';
import searchRouter from './routes/searchRoutes.js';
import notificationRouter from './routes/notificationRoutes.js';
import error from './middlewares/error.js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Load env variables
dotenv.config();

// Create express app
const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: 'https://ink-trail-rouge.vercel.app/',
    methods: ['GET', 'POST'],
    credentials: true,
  }
})

app.set("io", io);

// Store connected users
let connectedUsers = {};

io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  socket.on("registerUser", (userId) => {
    connectedUsers[userId] = socket.id;
    socket.join(userId.toString());
    console.log(`User ${userId} joined their notification room`);
  });

  socket.on("disconnect", () => {
    for (const [userId, id] of Object.entries(connectedUsers)) {
      if (id === socket.id) {
        delete connectedUsers[userId];
        console.log(`User ${userId} disconnected`);
        break;
      }
    }
  });
});

export { io, connectedUsers }; // Export the io instance for use in other files

// Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
app.use(cookieParser());

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Routes
app.get('/', (req, res) => {
  res.status(200).json({'message': 'API is running...'});
});

// Import routes
app.use('/api/v1/user', userRouter);
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/admin', adminRouter);
app.use('/api/v1/blogs', blogRouter);
app.use('/api/v1/search', searchRouter);
app.use('/api/v1/notifications', notificationRouter);

// Centralized error handling middleware
app.use(error);

// Connect to MongoDB
connectDB();

// Listen
const PORT = process.env.PORT || 8080;
const DEV_MODE = process.env.DEV_MODE || 'development';

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(join(__dirname, '../frontend/build')));
  app.get('*', (req, res) => {
    res.sendFile(join(__dirname, '../frontend/build', 'index.html'));
  });
}

if (DEV_MODE === 'development') {
  console.log('Running in development mode'.bgYellow);
}

server.listen(PORT, () => {
  console.log(`Socket.IO server is running on port ${PORT}`.bgBlue);
});