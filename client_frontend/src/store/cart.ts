"use client";

import { create } from "zustand";

export type CartItem = {
  productId: number;
  name: string;
  price: number;
  quantity: number;
  image?: string;
};

type CartState = {
  items: CartItem[];
  setItems: (items: CartItem[]) => void;
  clear: () => void;
  subtotal: () => number;
  upsertItem: (item: CartItem) => void;
  updateQty: (productId: number, qty: number) => void;
  remove: (productId: number) => void;
};

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  setItems: (items) => set({ items }),
  clear: () => set({ items: [] }),
  subtotal: () => get().items.reduce((sum, it) => sum + it.price * it.quantity, 0),
  upsertItem: (item) =>
    set((state) => {
      const idx = state.items.findIndex((i) => i.productId === item.productId);
      if (idx >= 0) {
        const copy = [...state.items];
        copy[idx] = { ...copy[idx], ...item, quantity: copy[idx].quantity + item.quantity };
        return { items: copy };
      }
      return { items: [...state.items, item] };
    }),
  updateQty: (productId, qty) =>
    set((state) => ({
      items: state.items.map((i) => (i.productId === productId ? { ...i, quantity: qty } : i)),
    })),
  remove: (productId) => set((state) => ({ items: state.items.filter((i) => i.productId !== productId) })),
}));
