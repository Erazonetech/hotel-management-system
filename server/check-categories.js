import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const checkCategories = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const categories = await mongoose.connection.db.collection('categories').find({}).toArray();
    console.log('📁 Categories in database:');
    categories.forEach(cat => {
      console.log(`   - ${cat.name} (ID: ${cat._id})`);
    });
    await mongoose.disconnect();
  } catch (error) {
    console.error('Error:', error);
  }
};

checkCategories();