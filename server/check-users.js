import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const checkUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    
    const users = await mongoose.connection.db.collection('users').find({}).toArray();
    console.log('📁 Users in database:');
    users.forEach(user => {
      console.log(`   - ${user.email} (${user.role})`);
      console.log(`     Password hash: ${user.password?.substring(0, 30)}...`);
    });
    
    await mongoose.disconnect();
  } catch (error) {
    console.error('Error:', error);
  }
};

checkUsers();