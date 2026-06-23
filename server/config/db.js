import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      console.error('❌ MONGODB_URI is not defined in environment variables');
      console.log('\n📝 Please add MONGODB_URI to your .env file:');
      console.log('MONGODB_URI=mongodb://localhost:27017/hotel-menu-system\n');
      process.exit(1);
    }

    console.log('🔗 Connecting to MongoDB...');
    
    // FIXED: Removed deprecated options
    const conn = await mongoose.connect(process.env.MONGODB_URI);

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📁 Database Name: ${conn.connection.name}`);
    
    return conn;
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    console.log('\n💡 Troubleshooting:');
    console.log('1. Make sure MongoDB is installed and running');
    console.log('2. Check if .env file exists in the correct directory');
    console.log('3. Verify MONGODB_URI is spelled correctly in .env');
    console.log('4. Try running: net start MongoDB (as Administrator)\n');
    process.exit(1);
  }
};

export default connectDB;