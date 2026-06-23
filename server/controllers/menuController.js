import MenuItem from'../models/MenuItem.js';
import Category from'../models/Category.js';
import { asyncHandler } from'../middleware/errorHandler.js';
import { clearCache } from'../config/redis.js';

// @desc    Get all menu items
// @route   GET /api/menu/items
// @access  Public
const getAllMenuItems = asyncHandler(async (req, res) => {
  const { 
    category, 
    isAvailable, 
    vegetarian, 
    vegan, 
    glutenFree,
    minPrice, 
    maxPrice,
    search,
    sortBy,
    limit = 20,
    page = 1,
    popular,
    new: isNew
  } = req.query;
  
  let query = {};
  
  // Filters
  if (category) query.category = category;
  if (isAvailable) query.isAvailable = isAvailable === 'true';
  if (vegetarian) query['dietary.isVegetarian'] = vegetarian === 'true';
  if (vegan) query['dietary.isVegan'] = vegan === 'true';
  if (glutenFree) query['dietary.isGlutenFree'] = glutenFree === 'true';
  if (popular === 'true') query.isPopular = true;
  if (isNew === 'true') query.isNew = true;
  
  // Price filter
  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = Number(minPrice);
    if (maxPrice) query.price.$lte = Number(maxPrice);
  }
  
  // Search
  if (search) {
    query.$text = { $search: search };
  }
  
  // Pagination
  const skip = (parseInt(page) - 1) * parseInt(limit);
  
  // Sorting
  let sort = {};
  switch(sortBy) {
    case 'price-asc':
      sort = { price: 1 };
      break;
    case 'price-desc':
      sort = { price: -1 };
      break;
    case 'popular':
      sort = { orderCount: -1 };
      break;
    case 'newest':
      sort = { createdAt: -1 };
      break;
    default:
      sort = { category: 1, displayOrder: 1 };
  }
  
  const menuItems = await MenuItem.find(query)
    .populate('category', 'name icon')
    .sort(sort)
    .skip(skip)
    .limit(parseInt(limit));
    
  const total = await MenuItem.countDocuments(query);
  
  res.status(200).json({
    success: true,
    total,
    page: parseInt(page),
    pages: Math.ceil(total / parseInt(limit)),
    data: menuItems
  });
});

// @desc    Get single menu item
// @route   GET /api/menu/items/:id
// @access  Public
const getMenuItemById = asyncHandler(async (req, res) => {
  const menuItem = await MenuItem.findById(req.params.id)
    .populate('category', 'name icon description');
    
  if (!menuItem) {
    return res.status(404).json({
      success: false,
      error: 'Menu item not found'
    });
  }
  
  res.status(200).json({
    success: true,
    data: menuItem
  });
});

// @desc    Create new menu item
// @route   POST /api/menu/items
// @access  Private/Admin
const createMenuItem = asyncHandler(async (req, res) => {
  const menuItem = await MenuItem.create(req.body);
  
  // Clear cache
  await clearCache('cache:/api/menu*');
  
  res.status(201).json({
    success: true,
    data: menuItem
  });
});

// @desc    Update menu item
// @route   PUT /api/menu/items/:id
// @access  Private/Admin
const updateMenuItem = asyncHandler(async (req, res) => {
  let menuItem = await MenuItem.findById(req.params.id);
  
  if (!menuItem) {
    return res.status(404).json({
      success: false,
      error: 'Menu item not found'
    });
  }
  
  menuItem = await MenuItem.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true
    }
  );
  
  // Clear cache
  await clearCache('cache:/api/menu*');
  
  res.status(200).json({
    success: true,
    data: menuItem
  });
});

// @desc    Delete menu item
// @route   DELETE /api/menu/items/:id
// @access  Private/Admin
const deleteMenuItem = asyncHandler(async (req, res) => {
  const menuItem = await MenuItem.findById(req.params.id);
  
  if (!menuItem) {
    return res.status(404).json({
      success: false,
      error: 'Menu item not found'
    });
  }
  
  await menuItem.remove();
  
  // Clear cache
  await clearCache('cache:/api/menu*');
  
  res.status(200).json({
    success: true,
    message: 'Menu item deleted successfully'
  });
});

// @desc    Get categories
// @route   GET /api/menu/categories
// @access  Public
const getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find({ isActive: true })
    .sort('displayOrder');
    // .populate('menuItems');
    
  res.status(200).json({
    success: true,
    count: categories.length,
    data: categories
  });
});

// @desc    Get popular items
// @route   GET /api/menu/popular
// @access  Public
const getPopularItems = asyncHandler(async (req, res) => {
  const limit = parseInt(req.query.limit) || 10;
  
  const popularItems = await MenuItem.find({ isAvailable: true, isPopular: true })
    .sort({ orderCount: -1 })
    .limit(limit)
    .populate('category', 'name');
    
  res.status(200).json({
    success: true,
    data: popularItems
  });
});

// @desc    Toggle item availability
// @route   PATCH /api/menu/items/:id/availability
// @access  Private/Admin
const toggleAvailability = asyncHandler(async (req, res) => {
  const menuItem = await MenuItem.findById(req.params.id);
  
  if (!menuItem) {
    return res.status(404).json({
      success: false,
      error: 'Menu item not found'
    });
  }
  
  menuItem.isAvailable = !menuItem.isAvailable;
  await menuItem.save();
  
  // Clear cache
  await clearCache('cache:/api/menu*');
  
  res.status(200).json({
    success: true,
    data: { isAvailable: menuItem.isAvailable }
  });
});

export {
  getAllMenuItems,
  getMenuItemById,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  getCategories,
  getPopularItems,
  toggleAvailability
};