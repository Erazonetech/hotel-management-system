import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';
import { FiShoppingCart, FiUser, FiMenu, FiX, FiCalendar } from 'react-icons/fi';

const Navbar = () => {
  const { user, isAuthenticated, logout, isAdmin, isWaiter, isCashier } = useAuth();
  const { getCartCount } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Menu', path: '/menu' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
    // { name: 'Cashier', path: '/cashier' },
  ];

  if (isAuthenticated) {
    if (isAdmin) {
      navLinks.push({ name: 'Admin', path: '/admin' });
    } else if (isCashier) {
      navLinks.push({ name: 'Cashier', path: '/cashier' });
    }
     else if (isWaiter) {
      navLinks.push({ name: 'Waiter', path: '/waiter' });
    }
    else {
      navLinks.push({ name: 'My Orders', path: '/orders' });
    }
  }

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo - always visible */}
          <Link to="/" className="flex items-center space-x-2 shrink-0">
            <span className="text-2xl">🍽️</span>
            <span className="text-lg sm:text-xl font-bold text-primary-600">
              Hotel Restaurant
            </span>
          </Link>

          {/* Desktop Navigation - hidden on mobile */}
          <div className="hidden lg:flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="text-gray-700 hover:text-primary-600 transition-colors duration-300"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Desktop Right Section - hidden on mobile */}
          <div className="hidden lg:flex items-center space-x-4">
            {/* Cart Icon */}
            <Link to="/cart" className="relative">
              <FiShoppingCart className="h-6 w-6 text-gray-700 hover:text-primary-600" />
              {getCartCount() > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {getCartCount()}
                </span>
              )}
            </Link>

            {/* Book a Table Button */}
            <Link
              to="/reservations"
              className="bg-primary-600 text-white px-5 py-2 rounded-lg hover:bg-primary-700 transition-all duration-300 flex items-center gap-2"
            >
              <FiCalendar className="h-4 w-4" />
              <span>Book a Table</span>
            </Link>

            {/* User Menu */}
            {isAuthenticated ? (
              <div className="relative group">
                <button className="flex items-center space-x-2">
                  <FiUser className="h-6 w-6 text-gray-700" />
                  <span className="text-gray-700">{user?.name?.split(' ')[0]}</span>
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                  <button
                    onClick={logout}
                    className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => navigate('/login')}
                className="border-2 border-primary-600 text-primary-600 px-5 py-2 rounded-lg hover:bg-primary-600 hover:text-white transition-all duration-300"
              >
                Login
              </button>
            )}
          </div>

          {/* Mobile Menu Button - always visible on mobile */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden flex items-center justify-center w-10 h-10 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Toggle menu"
          >
            {isOpen ? <FiX className="h-6 w-6" /> : <FiMenu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu - Dropdown */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden border-t border-gray-100 overflow-hidden"
            >
              <div className="py-4 space-y-2">
                {/* Navigation Links */}
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsOpen(false)}
                    className="block py-3 px-4 text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    {link.name}
                  </Link>
                ))}

                {/* Cart Link */}
                <Link
                  to="/cart"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-between py-3 px-4 text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <span>Shopping Cart</span>
                  {getCartCount() > 0 && (
                    <span className="bg-primary-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {getCartCount()}
                    </span>
                  )}
                </Link>

                {/* Book a Table Button - Prominent in mobile menu */}
                <Link
                  to="/reservations"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center gap-2 mt-4 bg-primary-600 text-white py-3 px-4 rounded-lg hover:bg-primary-700 transition-colors font-semibold"
                >
                  <FiCalendar className="h-5 w-5" />
                  Book a Table
                </Link>

                {/* Auth Section */}
                {isAuthenticated ? (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-3 px-4 py-2 text-gray-700">
                      <FiUser className="h-5 w-5" />
                      <span className="font-medium">{user?.name}</span>
                    </div>
                    <button
                      onClick={() => {
                        logout();
                        setIsOpen(false);
                      }}
                      className="w-full text-left py-3 px-4 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <div className="mt-4 space-y-2 pt-4 border-t border-gray-100">
                    <button
                      onClick={() => {
                        navigate('/login');
                        setIsOpen(false);
                      }}
                      className="w-full bg-primary-600 text-white py-3 px-4 rounded-lg hover:bg-primary-700 transition-colors font-semibold"
                    >
                      Login
                    </button>
                    <button
                      onClick={() => {
                        navigate('/register');
                        setIsOpen(false);
                      }}
                      className="w-full border-2 border-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:border-primary-600 hover:text-primary-600 transition-colors"
                    >
                      Create Account
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default Navbar;