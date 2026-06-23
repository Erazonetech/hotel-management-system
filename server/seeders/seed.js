import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '..', '.env') });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/hotel-menu-system';

const importData = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected!\n');

    // Define schemas directly in the seeder
    const userSchema = new mongoose.Schema({
      name: String, email: String, password: String, role: String, phone: String, isActive: Boolean
    });
    const categorySchema = new mongoose.Schema({
      name: String, description: String, icon: String, displayOrder: Number, isActive: Boolean
    });
    const menuItemSchema = new mongoose.Schema({
      name: String, description: String, price: Number, category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
      images: [String], ingredients: Array, allergens: Array, dietary: Object, spicyLevel: Number,
      preparationTime: Number, isAvailable: Boolean, isPopular: Boolean, isNewArrival: Boolean,
      discount: Number, stock: Number
    });
    const tableSchema = new mongoose.Schema({
      tableNumber: Number, capacity: Number, section: String, status: String
    });

    const User = mongoose.model('User', userSchema);
    const Category = mongoose.model('Category', categorySchema);
    const MenuItem = mongoose.model('MenuItem', menuItemSchema);
    const Table = mongoose.model('Table', tableSchema);

    // Clear existing
    await User.deleteMany();
    await Category.deleteMany();
    await MenuItem.deleteMany();
    await Table.deleteMany();
    console.log('Cleared collections\n');

    // Create users with hashed passwords
    const users = [
      { name: 'Admin User', email: 'admin@hotel.com', password: await bcrypt.hash('Admin@123456', 10), role: 'admin', phone: '+1234567890', isActive: true },
      { name: 'Cashier User', email: 'cashier@hotel.com', password: await bcrypt.hash('Cashier@123456', 10), role: 'cashier', phone: '+1234567891', isActive: true },
      { name: 'John Waiter', email: 'waiter@hotel.com', password: await bcrypt.hash('Waiter@123', 10), role: 'waiter', phone: '+1234567891', isActive: true },
      { name: 'Chef Kitchen', email: 'kitchen@hotel.com', password: await bcrypt.hash('Kitchen@123', 10), role: 'kitchen', phone: '+1234567892', isActive: true },
      { name: 'Demo Customer', email: 'customer@hotel.com', password: await bcrypt.hash('Customer@123', 10), role: 'customer', phone: '+1234567893', isActive: true }
    ];
    await User.create(users);
    console.log('Users created');

    // Create categories
    const categories = [
      { name: 'Appetizers', description: 'Starters', icon: '🍤', displayOrder: 1, isActive: true },
      { name: 'Main Course', description: 'Main dishes', icon: '🍛', displayOrder: 2, isActive: true },
      { name: 'Beverages', description: 'Drinks', icon: '🥤', displayOrder: 3, isActive: true }
    ];
    const createdCategories = await Category.create(categories);
    console.log('Categories created');

    // Create tables
    const tables = [
      { tableNumber: 1, capacity: 2, section: 'indoor', status: 'available' },
      { tableNumber: 2, capacity: 4, section: 'indoor', status: 'available' },
      { tableNumber: 3, capacity: 4, section: 'indoor', status: 'available' }
    ];
    await Table.create(tables);
    console.log('Tables created');

    console.log('\n✅ All data imported successfully!\n');
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
};

importData();