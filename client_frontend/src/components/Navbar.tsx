"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import Container from "./ui/Container";
import Button from "./ui/Button";
import { useAuthStore } from "@/store/auth";
import { useCartStore } from "@/store/cart";

export default function Navbar() {
  const { user, logout } = useAuthStore();
  const { items } = useCartStore();
  const [open, setOpen] = useState(false);

  // close menu on route change in app router via hashchange/popstate fallback
  useEffect(() => {
    const close = () => setOpen(false);
    window.addEventListener("popstate", close);
    window.addEventListener("hashchange", close);
    return () => {
      window.removeEventListener("popstate", close);
      window.removeEventListener("hashchange", close);
    };
  }, []);

  const count = items.reduce((sum, it) => sum + it.quantity, 0);

  return (
    <header className="sticky top-0 z-40 navbar-blur">
      <Container>
        <nav className="flex items-center justify-between py-3" aria-label="Main">
          <div className="flex items-center gap-3">
            <button
              className="md:hidden p-2 rounded-lg border border-gray-200"
              aria-label="Toggle menu"
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
            >
              <span className="sr-only">Menu</span>☰
            </button>
            <Link href="/" className="text-lg font-semibold tracking-tight hover:opacity-80" aria-label="Furniro Home">
              <span className="text-blue-600">Furn</span>iro
            </Link>
          </div>

          <ul className="hidden md:flex items-center gap-6 text-sm">
            <li><Link className="hover:underline" href="/products">Products</Link></li>
            <li><Link className="hover:underline" href="/orders">My Orders</Link></li>
            {user?.role === "admin" && (
              <li><Link className="hover:underline" href="/admin/products">Admin</Link></li>
            )}
          </ul>

          <div className="flex items-center gap-2">
            <Link href="/cart" className="relative px-3 py-2 rounded-lg border border-gray-200 hover:bg-gray-50" aria-label={`Cart with ${count} items`}>
              🛒
              {count > 0 && (
                <span className="absolute -top-1 -right-1 text-[10px] bg-blue-600 text-white rounded-full px-1.5 py-0.5">{count}</span>
              )}
            </Link>
            {user ? (
              <>
                <span className="hidden md:inline text-sm text-gray-600 mr-1">Hi, {user.name || user.email}</span>
                <Button variant="ghost" onClick={logout} aria-label="Log out">Logout</Button>
              </>
            ) : (
              <>
                <Link href="/login" className="btn btn-primary" aria-label="Login">Login</Link>
                <Link href="/register" className="btn btn-secondary" aria-label="Register">Register</Link>
              </>
            )}
          </div>
        </nav>

        {open && (
          <div className="md:hidden pb-4">
            <ul className="grid gap-2 text-sm" role="menu" aria-label="Mobile menu">
              <li role="none"><Link role="menuitem" className="block rounded-lg px-3 py-2 hover:bg-gray-100" href="/products">Products</Link></li>
              <li role="none"><Link role="menuitem" className="block rounded-lg px-3 py-2 hover:bg-gray-100" href="/orders">My Orders</Link></li>
              {user?.role === "admin" && (
                <li role="none"><Link role="menuitem" className="block rounded-lg px-3 py-2 hover:bg-gray-100" href="/admin/products">Admin</Link></li>
              )}
            </ul>
          </div>
        )}
      </Container>
    </header>
  );
}
