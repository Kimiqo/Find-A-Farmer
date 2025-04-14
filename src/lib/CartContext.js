"use client";

import { createContext, useContext, useState } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  function addToCart(product, farmerId) {
    const existingItem = cart.find(
      (item) => item.id === product.id && item.farmerId === farmerId
    );
    if (existingItem) {
      setCart(
        cart.map((item) =>
          item.id === product.id && item.farmerId === farmerId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCart([...cart, { ...product, farmerId, quantity: 1 }]);
    }
  }

  function removeFromCart(productId, farmerId) {
    setCart(cart.filter((item) => !(item.id === productId && item.farmerId === farmerId)));
  }

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}