import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MenuCard from './MenuCard';
import Loader from '../common/Loader';
import { menuService } from '../../services/api';

const MenuGrid = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    vegetarian: false,
    vegan: false,
    glutenFree: false,
    sortBy: '',
  });

  useEffect(() => {
    fetchCategories();
    fetchMenuItems();
  }, []);

  useEffect(() => {
    fetchMenuItems();
  }, [activeCategory, filters]);

  const fetchCategories = async () => {
    try {
      const response = await menuService.getCategories();
      setCategories(response.data.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchMenuItems = async () => {
    setLoading(true);
    try {
      const params = {
        category: activeCategory !== 'all' ? activeCategory : undefined,
        vegetarian: filters.vegetarian || undefined,
        vegan: filters.vegan || undefined,
        glutenFree: filters.glutenFree || undefined,
        sortBy: filters.sortBy || undefined,
      };
      const response = await menuService.getMenuItems(params);
      setMenuItems(response.data.data);
    } catch (error) {
      console.error('Error fetching menu items:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Categories */}
      <div className="mb-8">
        <div className="flex overflow-x-auto space-x-3 pb-4">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-6 py-2 rounded-full whitespace-nowrap transition-all duration-300 ${
              activeCategory === 'all'
                ? 'bg-primary-500 text-white shadow-lg'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All Items
          </button>
          {categories.map((category) => (
            <button
              key={category._id}
              onClick={() => setActiveCategory(category._id)}
              className={`px-6 py-2 rounded-full whitespace-nowrap transition-all duration-300 ${
                activeCategory === category._id
                  ? 'bg-primary-500 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <span className="mr-2">{category.icon}</span>
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="mb-8 flex flex-wrap gap-4">
        <div className="flex items-center space-x-4">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={filters.vegetarian}
              onChange={(e) => setFilters({ ...filters, vegetarian: e.target.checked })}
              className="rounded text-primary-500 focus:ring-primary-500"
            />
            <span>Vegetarian</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={filters.vegan}
              onChange={(e) => setFilters({ ...filters, vegan: e.target.checked })}
              className="rounded text-primary-500 focus:ring-primary-500"
            />
            <span>Vegan</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={filters.glutenFree}
              onChange={(e) => setFilters({ ...filters, glutenFree: e.target.checked })}
              className="rounded text-primary-500 focus:ring-primary-500"
            />
            <span>Gluten Free</span>
          </label>
        </div>

        <select
          value={filters.sortBy}
          onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="">Sort by</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="popular">Most Popular</option>
          <option value="newest">Newest First</option>
        </select>
      </div>

      {/* Menu Grid */}
      {loading ? (
        <Loader />
      ) : menuItems.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No items found</p>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          <AnimatePresence>
            {menuItems.map((item, index) => (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.05 }}
              >
                <MenuCard item={item} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
};

export default MenuGrid;