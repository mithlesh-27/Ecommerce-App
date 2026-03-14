import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useSnackbar } from "../utils/SnackbarContext"

export type Product = {
  id: string;
  name: string;
  price: number;
  stock?: number;
  variants?: { stock: number }[];
  [key: string]: any;
};

export type CartItem = Product & {
  quantity: number;
  stock: number;
  price: number;
};

type CartContextType = {
  cart: CartItem[];
  addToCart: (product: Product) => void;
  increaseQty: (id: string) => void;
  decreaseQty: (id: string) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  total: number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);
const CART_KEY = "@cart";

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const { showSnackbar } = useSnackbar();

  /* ---------------- LOAD CART ---------------- */
  useEffect(() => {
    const loadCart = async () => {
      try {
        const stored = await AsyncStorage.getItem(CART_KEY);
        if (stored) setCart(JSON.parse(stored));
      } catch (e) {
        console.log("Failed to load cart", e);
      }
    };
    loadCart();
  }, []);

  /* ---------------- SAVE CART ---------------- */
  useEffect(() => {
    const saveCart = async () => {
      try {
        await AsyncStorage.setItem(CART_KEY, JSON.stringify(cart));
      } catch (e) {
        console.log("Failed to save cart", e);
      }
    };
    saveCart();
  }, [cart]);

  /* ---------------- SYNC STOCK ---------------- */
  useEffect(() => {
    if (!cart.length) return;

    const syncCartStock = async () => {
      try {
        const res = await fetch("https://your-api.com/api/products");
        const products: Product[] = await res.json();

        setCart(prev =>
          prev.map(item => {
            const live = products.find(p => p.id === item.id);
            if (!live) return { ...item, stock: 0, price: 0 };

            const totalStock =
              live.variants?.reduce((sum, v) => sum + (v.stock ?? 0), 0) ??
              live.stock ??
              0;

            return {
              ...item,
              stock: totalStock,
              price: live.price ?? 0,
            };
          })
        );
      } catch (e) {
        console.log("Failed to sync cart stock", e);
      }
    };

    syncCartStock();
  }, []);

  /* ---------------- TOTAL ---------------- */
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  /* ---------------- ADD TO CART ---------------- */
  const addToCart = (product: Product) => {
    const totalStock =
      product.variants?.reduce((sum, v) => sum + (v.stock ?? 0), 0) ??
      product.stock ??
      0;

    if (totalStock <= 0) {
      showSnackbar("Out of stock");
      return;
    }

    let message = "";

    setCart(prev => {
      const existing = prev.find(i => i.id === product.id);

      if (existing) {
        if (existing.quantity >= existing.stock) {
          message = "Maximum stock reached";
          return prev;
        }

        message = "Quantity updated";
        return prev.map(i =>
          i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }

      message = "Added to cart";
      return [...prev, { ...product, quantity: 1, stock: totalStock, price: product.price ?? 0 }];
    });

    if (message) showSnackbar(message);
  };

  /* ---------------- INCREASE QTY ---------------- */
  const increaseQty = (id: string) => {
    let message = "";

    setCart(prev =>
      prev.map(i => {
        if (i.id !== id) return i;

        if (i.quantity >= i.stock) {
          message = "Maximum stock reached";
          return i;
        }

        return { ...i, quantity: i.quantity + 1 };
      })
    );

    if (message) showSnackbar(message);
  };

  /* ---------------- DECREASE QTY ---------------- */
  const decreaseQty = (id: string) => {
    setCart(prev =>
      prev
        .map(i => (i.id === id ? { ...i, quantity: i.quantity - 1 } : i))
        .filter(i => i.quantity > 0)
    );
  };

  /* ---------------- REMOVE ---------------- */
  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(i => i.id !== id));
    showSnackbar("Removed from cart");
  };

  /* ---------------- CLEAR ---------------- */
  const clearCart = () => setCart([]);

  return (
    <CartContext.Provider
      value={{ cart, addToCart, increaseQty, decreaseQty, removeFromCart, clearCart, total }}
    >
      {children}
    </CartContext.Provider>
  );
};

/* ---------------- HOOK ---------------- */
export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
};