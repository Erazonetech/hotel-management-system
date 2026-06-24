import React from 'react';
import Cart from '../components/customer/Cart';

const CartPage = () => {
  return (
    <div>
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Your Cart</h1>
          <p className="text-lg">Review your items and proceed to checkout</p>
        </div>
      </div>
      
      {/* Cart Component */}
      <Cart />
    </div>
  );
};

export default CartPage;