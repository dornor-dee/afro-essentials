"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { Product } from "@/types/product";

interface WishlistContextValue {
  items: Product[];
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;
  clearWishlist: () => void;
  isInWishlist: (productId: string) => boolean;
}

const WishlistContext = createContext<WishlistContextValue | undefined>(undefined);

function loadWishlistFromStorage(): Product[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const saved = window.localStorage.getItem("afro-essentials-wishlist");
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<Product[]>([]);

  useEffect(() => {
    setItems(loadWishlistFromStorage());
  }, []);

  useEffect(() => {
    window.localStorage.setItem("afro-essentials-wishlist", JSON.stringify(items));
  }, [items]);

  const addToWishlist = (product: Product) => {
    setItems((current) => (current.some((item) => item.id === product.id) ? current : [...current, product]));
  };

  const removeFromWishlist = (productId: string) => {
    setItems((current) => current.filter((item) => item.id !== productId));
  };

  const clearWishlist = () => {
    setItems([]);
  };

  const isInWishlist = (productId: string) => items.some((item) => item.id === productId);

  const value = useMemo(
    () => ({
      items,
      addToWishlist,
      removeFromWishlist,
      clearWishlist,
      isInWishlist,
    }),
    [items],
  );

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
  const context = useContext(WishlistContext);

  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }

  return context;
}
