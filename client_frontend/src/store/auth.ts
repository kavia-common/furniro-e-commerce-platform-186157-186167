"use client";

import { create } from "zustand";

export type User = {
  id?: number | string;
  email: string;
  name?: string;
  role?: "user" | "admin";
};

type AuthState = {
  token: string | null;
  user: User | null;
  loading: boolean;
  setToken: (token: string | null) => void;
  setUser: (user: User | null) => void;
  setLoading: (flag: boolean) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  user: null,
  loading: false,
  setToken: (token) => set({ token }),
  setUser: (user) => set({ user }),
  setLoading: (loading) => set({ loading }),
  logout: () => set({ token: null, user: null }),
}));
