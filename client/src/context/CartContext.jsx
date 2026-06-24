import React, { createContext, useState, useContext, useEffect } from 'react';
import toast from 'react-hot-toast';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        setCart(parsedCart);
      } catch (e) {
        console.error('Error parsing cart:', e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
    calculateTotal();
  }, [cart]);

  const calculateTotal = () => {
    const sum = cart.reduce((acc, item) => {
      const price = Number(item.price) || 0;
      const quantity = Number(item.quantity) || 1;
      return acc + (price * quantity);
    }, 0);
    setTotal(sum);
  };

  const addToCart = (item, quantity = 1) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(i => i._id === item._id);
      if (existingItem) {
        return prevCart.map(i =>
          i._id === item._id
            ? { ...i, quantity: (i.quantity || 1) + quantity }
            : i
        );
      }
      return [...prevCart, { 
        ...item, 
        quantity: quantity,
        price: Number(item.price) || 0
      }];
    });
    toast.success(`Added ${item.name} to cart`);
  };

  const removeFromCart = (itemId) => {
    setCart(prev => prev.filter(item => item._id !== itemId));
    toast.success('Item removed from cart');
  };

  const updateQuantity = (itemId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    setCart(prev =>
      prev.map(item =>
        item._id === itemId ? { ...item, quantity: quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
    toast.success('Cart cleared');
  };

  const getCartCount = () => {
    return cart.reduce((acc, item) => acc + (item.quantity || 1), 0);
  };

  const value = {
    cart,
    total,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartCount,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};