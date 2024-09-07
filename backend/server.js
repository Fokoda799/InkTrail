import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import colors from 'colors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import router from './routes/index.js';

// Load env variables
dotenv.config();

// Create express app
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.get('/', (req, res) => {
  res.status(200).json({'message': 'API is running...'});
});

// Import routes
app.use('/api/v1', router);

// Connect to MongoDB
connectDB();

// Listen
const PORT = process.env.PORT || 8080;
const DEV_MODE = process.env.DEV_MODE || 'development';
app.listen(PORT, () => {
    console.log(`Server is running on ${DEV_MODE} mode, port N ${PORT}`.bgWhite);
});
