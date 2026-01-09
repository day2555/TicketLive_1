//Versión con local storage en lo que se incorpora el carrito del back y cookies
"use client";

import { createContext, useContext, useEffect, useState } from "react";
import IEvent from "@/interfaces/event.interface";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

type CartItem = IEvent & {
  quantity: number;
};

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (event: IEvent) => void;
  increaseQuantity: (eventId: number) => void;
  decreaseQuantity: (eventId: number) => void;
  removeFromCart: (eventId: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
  getIdItems: () => number[];
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { isLoggedIn } = useAuth();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  //PERSISTENCIA LOCAL
  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      setCartItems(JSON.parse(storedCart));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  //LIMPIAR EL CARRITO AL HACER LOGOUT
  useEffect(() => {
    if (!isLoggedIn) {
      setCartItems([]);
      localStorage.removeItem("cart");
    }
  }, [isLoggedIn]);

  //FUNCIONES
  const addToCart = (event: IEvent) => {
    if (!isLoggedIn) {
      toast.error("Debes estar logueado para agregar productos al carrito");
      return;
    }

    const existingItem = cartItems.find(item => item.id === event.id);

    // Si el producto ya existe en el carrito
    if (existingItem) {
      if (existingItem.quantity >= 6) {
        toast.error("Un usuario no puede comprar más de 6 boletos");
        return;
      }

      setCartItems(prev =>
        prev.map(item =>
          item.id === event.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );

      toast.success("Se agregó otro boleto");
      return;
    }

    // Si el producto no existe, se agrega con cantidad 1
    setCartItems(prev => [...prev, { ...event, quantity: 1 }]);
    toast.success("Producto agregado al carrito");
  };

  const increaseQuantity = (productId: number) => {
    setCartItems(prev =>
      prev.map(item => {
        if (item.id === productId) {
          if (item.quantity >= 6) {
            toast.error("Un usuario no puede comprar más de 6 boletos");
            return item;
          }
          return { ...item, quantity: item.quantity + 1 };
        }
        return item;
      })
    );
  };

  const decreaseQuantity = (productId: number) => {
    setCartItems(prev =>
      prev
        .map(item =>
          item.id === productId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter(item => item.quantity > 0)
    );
  };

  const removeFromCart = (productId: number) => {
    setCartItems(prev => prev.filter(item => item.id !== productId));
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem("cart");
  };

  const getTotal = () =>
    cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );

  const getItemCount = () =>
    cartItems.reduce((total, item) => total + item.quantity, 0);

  const getIdItems = () => cartItems.map(item => item.id);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        increaseQuantity,
        decreaseQuantity,
        removeFromCart,
        clearCart,
        getTotal,
        getItemCount,
        getIdItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}

