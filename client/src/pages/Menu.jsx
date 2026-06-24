import React from 'react';
import MenuGrid from '../components/customer/MenuGrid';

const Menu = () => {
  return (
    <div>
      <div className="bg-primary-600 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Our Menu</h1>
          <p className="text-lg">Discover our delicious selection of dishes</p>
        </div>
      </div>
      <MenuGrid />
    </div>
  );
};

export default Menu;