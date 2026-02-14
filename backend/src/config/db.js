import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/placement_system', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`✓ MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.warn(`⚠ Warning: MongoDB connection failed - ${error.message}`);
    console.log('📌 Running in demo mode. Install MongoDB or configure MongoDB Atlas.');
    console.log('📌 To use MongoDB Atlas: Create cluster at https://www.mongodb.com/cloud/atlas');
    console.log('📌 Then add connection string to .env as MONGODB_URI=your_connection_string');
  }
};
