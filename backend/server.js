import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import colors from 'colors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import connectDB from './config/db.js';
import {userRouter, authRouter, adminRouter} from './routes/userRoutes.js';
import blogRouter from './routes/blogRoutes.js';
import error from './middlewares/error.js';

// Load env variables
dotenv.config();

// Create express app
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
app.use(cookieParser());

// Routes
app.get('/', (req, res) => {
  res.status(200).json({'message': 'API is running...'});
});

// Import routes
app.use('/api/v1/user', userRouter);
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/admin', adminRouter);
app.use('/api/v1/blogs', blogRouter);

// Centralized error handling middleware
app.use(error);

// Connect to MongoDB
connectDB();

// Listen
const PORT = process.env.PORT || 8080;
const DEV_MODE = process.env.DEV_MODE || 'development';
app.listen(PORT, () => {
    console.log(`Server is running on ${DEV_MODE} mode, port ${PORT}`.bgWhite);
});
