import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Hotel Restaurant</h3>
            <p className="text-gray-400">Experience the finest dining with our exquisite menu.</p>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Hours</h3>
            <p className="text-gray-400">Mon-Fri: 11am - 10pm</p>
            <p className="text-gray-400">Sat-Sun: 10am - 11pm</p>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Contact</h3>
            <p className="text-gray-400">📍 Vision Cafe Sodo, Ethiopia</p>
            <p className="text-gray-400">📞 +1 234 567 890</p>
            <p className="text-gray-400">✉️ info@hotel.com</p>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 Hotel Restaurant. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;