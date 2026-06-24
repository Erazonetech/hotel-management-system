import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useCart } from '../../context/CartContext';
import { FiShoppingBag } from 'react-icons/fi';
import { FaStar } from 'react-icons/fa';

// Simple placeholder without external URL
const DEFAULT_IMAGE = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"%3E%3Crect width="400" height="300" fill="%23f3f4f6"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%239ca3af" font-size="20"%3E🍽️ No Image%3C/text%3E%3C/svg%3E';

const MenuCard = ({ item }) => {
  const { addToCart } = useCart();
  const [imageError, setImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const finalPrice = item.discount > 0 
    ? item.price - (item.price * item.discount / 100)
    : item.price;

  const imageUrl = imageError || !item.images?.[0] 
    ? `${process.env.REACT_APP_API_URL}/uploads/images/${item.images[0]}`
    : DEFAULT_IMAGE;

    // console.log(imageUrl)
  return (
    <motion.div
      whileHover={{ y: -5 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="card cursor-pointer"
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden bg-gray-100">
        <img
          src={imageUrl}
          alt={item.name}
          className="w-full h-full object-cover transition-transform duration-300 transform hover:scale-110"
          onError={() => setImageError(true)}
        />
        {item.discount > 0 && (
          <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-lg text-sm font-semibold">
            {item.discount}% OFF
          </div>
        )}
        {item.isPopular && (
          <div className="absolute top-2 left-2 bg-yellow-500 text-white px-2 py-1 rounded-lg text-sm flex items-center gap-1">
            <FaStar className="h-3 w-3" />
            Popular
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-gray-800 line-clamp-1">{item.name}</h3>
          <div className="text-right">
            {item.discount > 0 ? (
              <>
                <span className="text-gray-400 line-through text-sm">{item.price} birr</span>
                <span className="text-primary-600 font-bold text-lg ml-2">{finalPrice.toFixed(2)} birr</span>
              </>
            ) : (
              <span className="text-primary-600 font-bold text-lg">{item.price.toFixed(2)} birr</span>
            )}
          </div>
        </div>

        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{item.description}</p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 flex-wrap">
            {item.dietary?.isVegetarian && (
              <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">🌱 Vegetarian</span>
            )}
            {item.dietary?.isVegan && (
              <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">🌿 Vegan</span>
            )}
            {item.spicyLevel > 0 && (
              <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full">
                {'🌶️'.repeat(item.spicyLevel)}
              </span>
            )}
          </div>

          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => addToCart(item)}
            className="bg-primary-500 text-white p-2 rounded-lg hover:bg-primary-600 transition-colors"
          >
            <FiShoppingBag className="h-5 w-5" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default MenuCard;