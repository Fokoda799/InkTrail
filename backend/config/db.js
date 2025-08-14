import mongoose from 'mongoose';
import colors from 'colors';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // 5 seconds
      socketTimeoutMS: 45000, // 45 seconds
    });

    console.log(`MongoDB connected: ${conn.connection.host}`.bgGreen.bold);
  } catch (error) {
    console.error(`Error: ${error.message}`.bgRed.bold);
    process.exit(1);
  }
}

export default connectDB;