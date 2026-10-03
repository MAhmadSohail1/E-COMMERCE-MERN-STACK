import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('cartItems');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  // Add to cart
  const addToCart = (product, qty = 1) => {
    setCartItems((prevItems) => {
      const existingIndex = prevItems.findIndex(
        (item) => item._id === product._id
      );

      if (existingIndex > -1) {
        // Update quantity
        const updated = [...prevItems];
        updated[existingIndex].qty += qty;
        return updated;
      } else {
        // Add new item
        return [...prevItems, { ...product, qty }];
      }
    });
  };

  // Remove from cart
  const removeFromCart = (productId) => {
    setCartItems((prevItems) => prevItems.filter((item) => item._id !== productId));
  };

  // Update quantity
  const updateQty = (productId, qty) => {
    if (qty <= 0) {
      removeFromCart(productId);
      return;
    }
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item._id === productId ? { ...item, qty } : item
      )
    );
  };

  // Clear cart
  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('cartItems');
  };

  // Total calculation
  const totalPrice = cartItems.reduce(
    (acc, item) => acc + item.price * (item.qty || 1),
    0
  );

  const totalItems = cartItems.reduce(
    (acc, item) => acc + (item.qty || 1),
    0
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        totalItems,
        totalPrice,
        addToCart,
        removeFromCart,
        updateQty,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
