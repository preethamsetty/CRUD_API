import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const  connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI as string, {
    });
    console.log('MongoDB connected successfully');
  } catch (err:any) {
    console.error('MongoDB connection failed:', err.message);
    process.exit(1); 
  }
};

export default connectDB;
