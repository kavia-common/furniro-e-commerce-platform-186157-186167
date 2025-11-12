"use client";

import React, { useEffect } from "react";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import { useCartStore, CartItem } from "@/store/cart";
import { api } from "@/lib/api";
import Link from "next/link";

type ServerCartItem = {
  productId?: number;
  id?: number;
  name?: string;
  price?: number;
  quantity?: number;
  image?: string;
  images?: Array<{ url?: string }>;
};

export default function CartPage() {
  const { items, subtotal, updateQty, remove, clear, setItems } = useCartStore();

  useEffect(() => {
    // Try to sync with server cart if authenticated
    api
      .getCart()
      .then((res) => {
        const list: ServerCartItem[] = (Array.isArray(res) ? (res as ServerCartItem[]) : ((res as { items?: ServerCartItem[] }).items || []));
        const serverItems: CartItem[] = list.map((it) => ({
          productId: Number(it.productId ?? it.id),
          name: String(it.name ?? "Item"),
          price: Number(it.price ?? 0),
          quantity: Number(it.quantity ?? 1),
          image: it.image || it.images?.[0]?.url,
        }));
        if (serverItems.length) setItems(serverItems);
      })
      .catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleUpdate = async (productId: number, quantity: number) => {
    updateQty(productId, quantity);
    try {
      await api.updateCart(productId, quantity);
    } catch {
      // not authenticated -> ignore server
    }
  };

  const handleRemove = async (productId: number) => {
    remove(productId);
    try {
      await api.removeCartItem(productId);
    } catch {
      // ignore
    }
  };

  const handleClear = async () => {
    clear();
    try {
      await api.clearCart();
    } catch {
      // ignore
    }
  };

  return (
    <Container>
      <header className="header">
        <h1 className="title">Your Cart</h1>
        <p className="subtitle">Review items and proceed to checkout</p>
      </header>

      {items.length === 0 ? (
        <div className="card">
          <p>Your cart is empty.</p>
          <Link href="/products" className="btn btn-primary mt-4 inline-block">Browse products</Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 card">
            <ul className="divide-y">
              {items.map((it) => (
                <li key={it.productId} className="py-4 flex items-center gap-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={it.image || "https://via.placeholder.com/96"} alt={it.name} className="w-24 h-24 rounded object-cover" />
                  <div className="flex-1">
                    <div className="font-medium">{it.name}</div>
                    <div className="text-sm text-gray-600">${it.price.toFixed(2)}</div>
                    <div className="mt-2 flex items-center gap-2">
                      <label htmlFor={`qty-${it.productId}`} className="label">Qty</label>
                      <input
                        id={`qty-${it.productId}`}
                        type="number"
                        min={1}
                        className="input w-24"
                        value={it.quantity}
                        onChange={(e) => handleUpdate(it.productId, Math.max(1, Number(e.target.value)))}
                      />
                      <Button variant="ghost" onClick={() => handleRemove(it.productId)} aria-label={`Remove ${it.name}`}>Remove</Button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <div className="mt-4 flex justify-between">
              <Button variant="ghost" onClick={handleClear}>Clear cart</Button>
              <Link href="/checkout" className="btn btn-primary">Checkout</Link>
            </div>
          </div>
          <aside className="card">
            <h2 className="text-lg font-semibold">Summary</h2>
            <div className="mt-2 text-sm text-gray-600">Subtotal</div>
            <div className="text-2xl font-semibold">${subtotal().toFixed(2)}</div>
            <p className="mt-2 text-xs text-gray-500">Taxes and shipping are calculated at checkout.</p>
            <Link href="/checkout" className="btn btn-primary mt-4 w-full text-center">Proceed to checkout</Link>
          </aside>
        </div>
      )}
    </Container>
  );
}
