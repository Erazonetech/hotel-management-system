import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import Category from '../models/Category.js';
import MenuItem from '../models/MenuItem.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '..', '.env') });

const menuItems = [
  {
    name: 'Bruschetta',
    description: 'Toasted bread topped with fresh tomatoes, garlic, and basil. A classic Italian appetizer.',
    price: 8.99,
    images: ['bruschetta.jpg'],
    ingredients: [{ name: 'Bread' }, { name: 'Tomatoes' }, { name: 'Garlic' }, { name: 'Basil' }],
    allergens: ['gluten'],
    dietary: { isVegetarian: true, isVegan: true },
    spicyLevel: 0,
    preparationTime: 10,
    isAvailable: true,
    isPopular: true,
    isNewArrival: true,
    stock: 100,
    categoryName: 'Appetizers'
  },
  {
    name: 'Chicken Wings',
    description: 'Crispy chicken wings tossed in your choice of buffalo, BBQ, or honey garlic sauce.',
    price: 12.99,
    images: ['chicken-wings.jpg'],
    ingredients: [{ name: 'Chicken' }, { name: 'Sauce' }],
    allergens: [],
    dietary: { isVegetarian: false },
    spicyLevel: 2,
    preparationTime: 15,
    isAvailable: true,
    isPopular: true,
    stock: 80,
    categoryName: 'Appetizers'
  },
  {
    name: 'Garlic Bread',
    description: 'Toasted bread topped with garlic butter and parsley.',
    price: 5.99,
    images: ['garlic-bread.jpg'],
    ingredients: [{ name: 'Bread' }, { name: 'Garlic Butter' }, { name: 'Parsley' }],
    allergens: ['gluten', 'dairy'],
    dietary: { isVegetarian: true },
    spicyLevel: 0,
    preparationTime: 5,
    isAvailable: true,
    stock: 150,
    categoryName: 'Appetizers'
  },
  {
    name: 'Grilled Salmon',
    description: 'Fresh Atlantic salmon grilled to perfection, served with seasonal vegetables and lemon butter sauce.',
    price: 24.99,
    images: ['grilled-salmon.jpg'],
    ingredients: [{ name: 'Salmon' }, { name: 'Vegetables' }, { name: 'Lemon Butter Sauce' }],
    allergens: ['fish'],
    dietary: { isGlutenFree: true },
    spicyLevel: 1,
    preparationTime: 20,
    isAvailable: true,
    isPopular: true,
    stock: 50,
    categoryName: 'Main Course'
  },
  {
    name: 'Margherita Pizza',
    description: 'Classic pizza with tomato sauce, fresh mozzarella, basil, and a drizzle of olive oil.',
    price: 16.99,
    images: ['margherita-pizza.jpg'],
    ingredients: [{ name: 'Pizza Dough' }, { name: 'Tomato Sauce' }, { name: 'Mozzarella' }, { name: 'Basil' }],
    allergens: ['gluten', 'dairy'],
    dietary: { isVegetarian: true },
    spicyLevel: 0,
    preparationTime: 15,
    isAvailable: true,
    isPopular: true,
    discount: 10,
    stock: 60,
    categoryName: 'Main Course'
  },
  {
    name: 'Steak',
    description: 'Grilled beef steak cooked to your liking, served with mashed potatoes and grilled vegetables.',
    price: 32.99,
    images: ['steak.jpg'],
    ingredients: [{ name: 'Beef Steak' }, { name: 'Potatoes' }, { name: 'Vegetables' }],
    allergens: [],
    dietary: { isGlutenFree: true },
    spicyLevel: 2,
    preparationTime: 25,
    isAvailable: true,
    isPopular: true,
    stock: 40,
    categoryName: 'Main Course'
  },
  {
    name: 'Pasta Carbonara',
    description: 'Creamy pasta with pancetta, eggs, parmesan cheese, and black pepper.',
    price: 18.99,
    images: ['pasta-carbonara.jpg'],
    ingredients: [{ name: 'Pasta' }, { name: 'Pancetta' }, { name: 'Eggs' }, { name: 'Parmesan' }],
    allergens: ['gluten', 'eggs', 'dairy'],
    dietary: { isVegetarian: false },
    spicyLevel: 1,
    preparationTime: 15,
    isAvailable: true,
    stock: 60,
    categoryName: 'Main Course'
  },
  {
    name: 'Caesar Salad',
    description: 'Crisp romaine lettuce, parmesan cheese, croutons, and creamy Caesar dressing.',
    price: 10.99,
    images: ['caesar-salad.jpg'],
    ingredients: [{ name: 'Romaine Lettuce' }, { name: 'Parmesan' }, { name: 'Croutons' }, { name: 'Caesar Dressing' }],
    allergens: ['gluten', 'dairy', 'eggs'],
    dietary: { isVegetarian: true },
    spicyLevel: 0,
    preparationTime: 8,
    isAvailable: true,
    stock: 90,
    categoryName: 'Salads'
  },
  {
    name: 'Chocolate Lava Cake',
    description: 'Warm chocolate cake with a molten chocolate center, served with vanilla ice cream.',
    price: 7.99,
    images: ['lava-cake.jpg'],
    ingredients: [{ name: 'Chocolate' }, { name: 'Flour' }, { name: 'Eggs' }, { name: 'Sugar' }],
    allergens: ['gluten', 'eggs', 'dairy'],
    dietary: { isVegetarian: true },
    spicyLevel: 0,
    preparationTime: 12,
    isAvailable: true,
    isPopular: true,
    isNewArrival: true,
    stock: 70,
    categoryName: 'Desserts'
  },
  {
    name: 'Fresh Orange Juice',
    description: 'Freshly squeezed orange juice, served chilled.',
    price: 4.99,
    images: ['orange-juice.jpg'],
    ingredients: [{ name: 'Orange' }],
    allergens: [],
    dietary: { isVegetarian: true, isVegan: true, isGlutenFree: true },
    spicyLevel: 0,
    preparationTime: 3,
    isAvailable: true,
    stock: 200,
    categoryName: 'Beverages'
  }
];

const importMenuItems = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Get all categories from database
    let categories = await Category.find();
    console.log(`📁 Found ${categories.length} categories in database:\n`);
    
    // Create a map of category name to ID (case-insensitive)
    let categoryMap = {};
    categories.forEach(cat => {
      categoryMap[cat.name.toLowerCase()] = cat._id;
      console.log(`   - ${cat.name} (ID: ${cat._id})`);
    });
    console.log('');

    // Check which categories are missing
    const missingCategories = [];
    const menuItemsWithCategories = [];

    for (const item of menuItems) {
      const categoryKey = item.categoryName.toLowerCase();
      const categoryId = categoryMap[categoryKey];
      
      if (!categoryId) {
        missingCategories.push(item.categoryName);
        console.log(`❌ Category not found: ${item.categoryName} for item "${item.name}"`);
      } else {
        const { categoryName, ...itemWithoutCategoryName } = item;
        menuItemsWithCategories.push({
          ...itemWithoutCategoryName,
          category: categoryId
        });
        console.log(`✅ ${item.name} -> ${item.categoryName}`);
      }
    }

    // Create missing categories
    let allCreatedCategories = [...categories];
    if (missingCategories.length > 0) {
      const uniqueMissing = [...new Set(missingCategories)];
      console.log(`\n⚠️ Creating ${uniqueMissing.length} missing categories...`);
      
      const createdCategories = [];
      for (const catName of uniqueMissing) {
        const icon = catName === 'Appetizers' ? '🍤' : 
                     catName === 'Main Course' ? '🍛' :
                     catName === 'Desserts' ? '🍰' :
                     catName === 'Beverages' ? '🥤' : 
                     catName === 'Salads' ? '🥗' : '🍽️';
        
        const newCat = await Category.create({
          name: catName,
          description: `${catName} category`,
          icon: icon,
          displayOrder: 1,
          isActive: true
        });
        createdCategories.push(newCat);
        console.log(`   ✅ Created category: ${catName}`);
        
        // Add to category map
        categoryMap[catName.toLowerCase()] = newCat._id;
      }
      
      // Add created categories to all categories list
      allCreatedCategories = [...categories, ...createdCategories];
      
      // Add remaining items that couldn't be mapped
      for (const item of menuItems) {
        const categoryKey = item.categoryName.toLowerCase();
        const categoryId = categoryMap[categoryKey];
        
        if (categoryId) {
          const alreadyAdded = menuItemsWithCategories.some(i => i.name === item.name);
          if (!alreadyAdded) {
            const { categoryName, ...itemWithoutCategoryName } = item;
            menuItemsWithCategories.push({
              ...itemWithoutCategoryName,
              category: categoryId
            });
            console.log(`✅ ${item.name} -> ${item.categoryName} (after category creation)`);
          }
        }
      }
    }

    // Clear existing menu items
    const deleted = await MenuItem.deleteMany();
    console.log(`\n🗑️ Cleared ${deleted.deletedCount} existing menu items\n`);

    // Import new menu items
    if (menuItemsWithCategories.length > 0) {
      const created = await MenuItem.create(menuItemsWithCategories);
      console.log(`✅ Imported ${created.length} menu items:\n`);
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      created.forEach(item => {
        const category = allCreatedCategories.find(c => c._id.toString() === item.category?.toString());
        console.log(`   🍽️ ${item.name.padEnd(25)} $${item.price}  (${category?.name || 'Unknown'})`);
      });
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    } else {
      console.log('❌ No menu items were imported. Please check your categories.');
    }

    await mongoose.disconnect();
    console.log('\n🎉 Menu items import completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
};

importMenuItems();