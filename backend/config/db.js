import mongoose from 'mongoose';
import colors from 'colors';

// Connect to MongoDB
const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/blogifyDB';
const connectDB = async () => {
  try {
      const conn = await mongoose.connect(uri);
      console.log(`MongoDB connected: ${conn.connection.host}`.bgGreen.bold);      
  } catch (error) {
      console.error(`Error: ${error.message}`.bgRed.bold);
      process.exit(1);
  }
}

export default connectDB;