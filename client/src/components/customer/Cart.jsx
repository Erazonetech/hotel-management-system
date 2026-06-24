import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { FiTrash2, FiMinus, FiPlus, FiShoppingBag, FiArrowLeft } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { orderService } from '../../services/api';

const Cart = () => {
  const { cart, total, updateQuantity, removeFromCart, clearCart } = useCart();
  const { isAuthenticated, user } = useAuth();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const navigate = useNavigate();

  // Calculate totals with proper number handling
  const subtotal = Number(total) || 0;
  const tax = Number(subtotal * 0.1) || 0;
  const serviceCharge = Number(subtotal * 0.05) || 0;
  const grandTotal = Number(subtotal + tax + serviceCharge) || 0;

  const handleCheckout = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to place an order');
      navigate('/login');
      return;
    }

    if (cart.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    // Validate cart items have required fields
    const invalidItems = cart.filter(item => !item._id || !item.price || !item.name);
    if (invalidItems.length > 0) {
      toast.error('Some items in your cart are invalid. Please remove them and try again.');
      console.error('Invalid items:', invalidItems);
      return;
    }

    setIsCheckingOut(true);
    
    try {
      // Prepare order items with proper data
      const orderItems = cart.map(item => ({
        menuItem: item._id,
        name: item.name,
        quantity: Number(item.quantity) || 1,
        price: Number(item.price) || 0,
        specialInstructions: ''
      }));

      const orderData = {
        items: orderItems,
        orderType: 'dine-in',
        subtotal: subtotal,
        tax: tax,
        serviceCharge: serviceCharge,
        total: grandTotal,
        guestInfo: {
          name: user?.name || 'Guest',
          email: user?.email || '',
          phone: user?.phone || ''
        }
      };

      console.log('Sending order data:', orderData); // Debug log

      const response = await orderService.createOrder(orderData);
      
      if (response.data.success) {
        toast.success('Order placed successfully!');
        clearCart();
        navigate('/orders');
      }
    } catch (error) {
      console.error('Checkout error:', error.response?.data || error);
      const errorMessage = error.response?.data?.error || 'Failed to place order. Please try again.';
      toast.error(errorMessage);
    } finally {
      setIsCheckingOut(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-md mx-auto">
          <div className="text-6xl mb-6">🛒</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Cart is Empty</h2>
          <p className="text-gray-600 mb-8">Looks like you haven't added any items to your cart yet.</p>
          <Link to="/menu" className="btn-primary inline-flex items-center gap-2">
            <FiShoppingBag className="h-5 w-5" />
            Browse Menu
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <button 
          onClick={() => navigate('/menu')}
          className="text-gray-600 hover:text-primary-600 flex items-center gap-2 transition-colors"
        >
          <FiArrowLeft className="h-5 w-5" />
          Continue Shopping
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="border-b border-gray-200 px-6 py-4">
              <h2 className="text-xl font-semibold text-gray-800">
                Cart Items ({cart.length})
              </h2>
            </div>
            
            <div className="divide-y divide-gray-200">
              {cart.map((item) => (
                <div key={item._id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex flex-col sm:flex-row gap-4">
                    {/* Product Image */}
                    <div className="w-24 h-24 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                      <img
                        src={`${process.env.REACT_APP_API_URL}/uploads/images/${item.images?.[0] || 'default.jpg'}`}
                        alt={item.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"%3E%3Crect width="100" height="100" fill="%23f3f4f6"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%239ca3af" font-size="14"%3E🍽️%3C/text%3E%3C/svg%3E';
                        }}
                      />
                    </div>

                    {/* Product Info */}
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                        <div>
                          <h3 className="font-semibold text-gray-800 text-lg">{item.name}</h3>
                          <p className="text-gray-500 text-sm mt-1 line-clamp-2">
                            {item.description}
                          </p>
                          {item.dietary?.isVegetarian && (
                            <span className="inline-block mt-2 text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                              Vegetarian
                            </span>
                          )}
                        </div>
                        <div className="text-right">
                          <div className="text-primary-600 font-bold text-lg">
                            {((item.price || 0) * (item.quantity || 1)).toFixed(2)} birr
                          </div>
                          <div className="text-gray-400 text-sm">
                            {(item.price || 0).toFixed(2)} birr each
                          </div>
                        </div>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => updateQuantity(item._id, (item.quantity || 1) - 1)}
                            className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors"
                          >
                            <FiMinus className="h-4 w-4 text-gray-600" />
                          </button>
                          <span className="w-8 text-center font-medium">{item.quantity || 1}</span>
                          <button
                            onClick={() => updateQuantity(item._id, (item.quantity || 1) + 1)}
                            className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors"
                          >
                            <FiPlus className="h-4 w-4 text-gray-600" />
                          </button>
                        </div>
                        
                        <button
                          onClick={() => removeFromCart(item._id)}
                          className="text-red-500 hover:text-red-700 transition-colors flex items-center gap-1 text-sm"
                        >
                          <FiTrash2 className="h-4 w-4" />
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-md overflow-hidden sticky top-24">
            <div className="border-b border-gray-200 px-6 py-4">
              <h2 className="text-xl font-semibold text-gray-800">Order Summary</h2>
            </div>
            
            <div className="p-6">
              <div className="space-y-3">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>{subtotal.toFixed(2)} birr</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax (10%)</span>
                  <span>{tax.toFixed(2)} birr</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Service Charge (5%)</span>
                  <span>{serviceCharge.toFixed(2)} birr</span>
                </div>
                <div className="border-t border-gray-200 pt-3 mt-3">
                  <div className="flex justify-between font-bold text-lg text-gray-800">
                    <span>Total</span>
                    <span className="text-primary-600">{grandTotal.toFixed(2)} birr</span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                disabled={isCheckingOut}
                className="w-full mt-6 bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isCheckingOut ? 'Processing...' : 'Proceed to Checkout'}
              </button>

              <button
                onClick={clearCart}
                className="w-full mt-3 border border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
              >
                Clear Cart
              </button>

              <div className="mt-4 text-xs text-gray-500 text-center">
                <p>By placing an order, you agree to our</p>
                <p>Terms of Service and Privacy Policy</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;