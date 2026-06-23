import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import User from '../models/User.js';
import Category from '../models/Category.js';
import MenuItem from '../models/MenuItem.js';
import Table from '../models/Table.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '..', '.env') });

console.log('\n🔍 Environment Debug:');
console.log(`📁 Current directory: ${__dirname}`);
console.log(`📊 MONGODB_URI: ${process.env.MONGODB_URI ? '✅ Found' : '❌ Missing'}\n`);

if (!process.env.MONGODB_URI) {
  process.env.MONGODB_URI = 'mongodb://localhost:27017/hotel-menu-system';
}

// Sample data
const users = [
  { name: 'Admin User', email: 'admin@hotel.com', password: 'Admin@123456', role: 'admin', phone: '+1234567890', isActive: true },
  { name: 'John Waiter', email: 'waiter@hotel.com', password: 'Waiter@123', role: 'waiter', phone: '+1234567891', isActive: true },
  { name: 'Chef Kitchen', email: 'kitchen@hotel.com', password: 'Kitchen@123', role: 'kitchen', phone: '+1234567892', isActive: true },
  { name: 'Demo Customer', email: 'customer@hotel.com', password: 'Customer@123', role: 'customer', phone: '+1234567893', isActive: true }
];

const categories = [
  { name: 'Appetizers', description: 'Start your meal with these delicious options', icon: '🍤', displayOrder: 1, isActive: true },
  { name: 'Main Course', description: 'Hearty and satisfying main dishes', icon: '🍛', displayOrder: 2, isActive: true },
  { name: 'Beverages', description: 'Refreshing drinks and beverages', icon: '🥤', displayOrder: 4, isActive: true },
  { name: 'Desserts', description: 'Sweet treats to end your meal', icon: '🍰', displayOrder: 5, isActive: true },
  { name: 'Salads', description: 'Fresh and healthy salads', icon: '🥗', displayOrder: 3, isActive: true }
];

const menuItems = [
  { name: 'Bruschetta', description: 'Toasted bread topped with fresh tomatoes, garlic, and basil', price: 8.99, category: null, images: ['bruschetta.jpg'], ingredients: [{ name: 'Bread', isAllergen: false }], allergens: [], dietary: { isVegetarian: true, isVegan: true }, spicyLevel: 0, preparationTime: 10, isAvailable: true, isPopular: true, isNewArrival: true, discount: 0, stock: 100 },
  { name: 'Chicken Wings', description: 'Crispy chicken wings tossed in your choice of sauce', price: 12.99, category: null, images: ['chicken-wings.jpg'], ingredients: [{ name: 'Chicken', isAllergen: false }], allergens: ['gluten'], dietary: { isVegetarian: false }, spicyLevel: 2, preparationTime: 15, isAvailable: true, isPopular: true, stock: 80 },
  { name: 'Grilled Salmon', description: 'Fresh Atlantic salmon grilled to perfection', price: 24.99, category: null, images: ['grilled-salmon.jpg'], ingredients: [{ name: 'Salmon', isAllergen: false }], allergens: ['fish'], dietary: { isGlutenFree: true }, spicyLevel: 1, preparationTime: 20, isAvailable: true, isPopular: true, stock: 50 },
  { name: 'Margherita Pizza', description: 'Classic pizza with tomato sauce, fresh mozzarella, and basil', price: 16.99, category: null, images: ['margherita-pizza.jpg'], ingredients: [{ name: 'Pizza Dough', isAllergen: true }], allergens: ['gluten', 'dairy'], dietary: { isVegetarian: true }, spicyLevel: 0, preparationTime: 15, isAvailable: true, isPopular: true, discount: 10, stock: 60 },
  { name: 'Caesar Salad', description: 'Romaine lettuce, parmesan cheese, croutons, and Caesar dressing', price: 10.99, category: null, images: ['caesar-salad.jpg'], ingredients: [{ name: 'Lettuce', isAllergen: false }], allergens: ['gluten', 'dairy'], spicyLevel: 0, preparationTime: 8, isAvailable: true, stock: 90 },
  { name: 'Chocolate Lava Cake', description: 'Warm chocolate cake with a molten center', price: 7.99, category: null, images: ['lava-cake.jpg'], ingredients: [{ name: 'Chocolate', isAllergen: false }], allergens: ['gluten', 'dairy'], dietary: { isVegetarian: true }, spicyLevel: 0, preparationTime: 12, isAvailable: true, isPopular: true, isNewArrival: true, stock: 70 },
  { name: 'Fresh Orange Juice', description: 'Freshly squeezed orange juice', price: 4.99, category: null, images: ['orange-juice.jpg'], ingredients: [{ name: 'Orange', isAllergen: false }], allergens: [], dietary: { isVegetarian: true, isVegan: true }, preparationTime: 3, isAvailable: true, stock: 200 }
];

const tables = [
  { tableNumber: 1, capacity: 2, section: 'indoor', status: 'available' },
  { tableNumber: 2, capacity: 4, section: 'indoor', status: 'available' },
  { tableNumber: 3, capacity: 4, section: 'indoor', status: 'available' },
  { tableNumber: 4, capacity: 6, section: 'indoor', status: 'available' },
  { tableNumber: 5, capacity: 8, section: 'private', status: 'available' },
  { tableNumber: 6, capacity: 2, section: 'outdoor', status: 'available' },
  { tableNumber: 7, capacity: 4, section: 'outdoor', status: 'available' },
  { tableNumber: 8, capacity: 6, section: 'outdoor', status: 'available' },
  { tableNumber: 9, capacity: 2, section: 'bar', status: 'available' },
  { tableNumber: 10, capacity: 4, section: 'bar', status: 'available' }
];

const importData = async () => {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected successfully\n');

    console.log('🗑️  Clearing existing data...');
    await User.deleteMany();
    await Category.deleteMany();
    await MenuItem.deleteMany();
    await Table.deleteMany();
    console.log('✓ All collections cleared\n');

    console.log('📥 Importing users...');
    const usersWithHashedPasswords = await Promise.all(users.map(async (user) => ({
      ...user,
      password: await bcrypt.hash(user.password, 10)
    })));
    const createdUsers = await User.create(usersWithHashedPasswords);
    console.log(`✅ Imported ${createdUsers.length} users`);

    console.log('📥 Importing categories...');
    const createdCategories = await Category.create(categories);
    console.log(`✅ Imported ${createdCategories.length} categories`);
    
    const categoryMap = {};
    createdCategories.forEach((cat) => {
      categoryMap[cat.name] = cat._id;
    });
    
    const menuItemsWithCategories = menuItems.map(item => {
      let categoryId = null;
      if (item.name === 'Bruschetta' || item.name === 'Chicken Wings') categoryId = categoryMap['Appetizers'];
      else if (item.name === 'Grilled Salmon' || item.name === 'Margherita Pizza') categoryId = categoryMap['Main Course'];
      else if (item.name === 'Caesar Salad') categoryId = categoryMap['Salads'];
      else if (item.name === 'Chocolate Lava Cake') categoryId = categoryMap['Desserts'];
      else if (item.name === 'Fresh Orange Juice') categoryId = categoryMap['Beverages'];
      return { ...item, category: categoryId };
    });
    
    console.log('📥 Importing menu items...');
    const createdMenuItems = await MenuItem.create(menuItemsWithCategories);
    console.log(`✅ Imported ${createdMenuItems.length} menu items`);

    console.log('📥 Importing tables...');
    const createdTables = await Table.create(tables);
    console.log(`✅ Imported ${createdTables.length} tables`);

    console.log('\n🎉 All data imported successfully!');
    console.log('\n📝 Test Credentials:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Admin:     admin@hotel.com / Admin@123456');
    console.log('Waiter:    waiter@hotel.com / Waiter@123');
    console.log('Kitchen:   kitchen@hotel.com / Kitchen@123');
    console.log('Customer:  customer@hotel.com / Customer@123');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error importing data:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
};

const args = process.argv.slice(2);
if (args[0] === '-i') {
  importData();
} else if (args[0] === '-d') {
  // Add delete function if needed
  console.log('Use -i to import data');
} else {
  console.log('Usage: node seeders/seeder.js -i');
}