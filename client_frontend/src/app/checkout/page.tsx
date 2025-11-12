"use client";

import React, { useState } from "react";
import Container from "@/components/ui/Container";
import { Input } from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { useCartStore } from "@/store/cart";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
  const { items, clear, subtotal } = useCartStore();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [card, setCard] = useState("");
  const router = useRouter();

  const placeOrder = async () => {
    setLoading(true);
    try {
      if (card.replace(/\s+/g, "").length < 12) {
        throw new Error("Please enter a valid mock card number (12+ digits).");
      }
      let order: { id?: number } | null = null;
      try {
        order = (await api.createOrder({ fromCart: true })) as unknown as { id?: number };
      } catch {
        order = (await api.createOrder({
          items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
        })) as unknown as { id?: number };
      }
      clear();
      router.push(`/orders/${order?.id ?? ""}`);
    } catch (e) {
      const message = e instanceof Error ? e.message : "Failed to place order";
      alert(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <header className="header">
        <h1 className="title">Checkout</h1>
        <p className="subtitle">Complete your order with mock payment</p>
      </header>
      {items.length === 0 ? (
        <div className="card">Your cart is empty.</div>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 card">
            <h2 className="text-lg font-semibold">Shipping</h2>
            <div className="mt-3 grid sm:grid-cols-2 gap-4">
              <div>
                <label className="label" htmlFor="name">Full Name</label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Jane Doe" />
              </div>
              <div className="sm:col-span-2">
                <label className="label" htmlFor="address">Address</label>
                <Input id="address" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="123 Ocean Ave, City" />
              </div>
            </div>

            <h2 className="text-lg font-semibold mt-6">Payment (Mock)</h2>
            <div className="mt-3">
              <label className="label" htmlFor="card">Card Number</label>
              <Input id="card" value={card} onChange={(e) => setCard(e.target.value)} placeholder="4242 4242 4242 4242" />
            </div>

            <Button className="mt-6" onClick={placeOrder} disabled={loading} aria-label="Place order">
              {loading ? "Placing…" : "Place order"}
            </Button>
          </div>
          <aside className="card">
            <h2 className="text-lg font-semibold">Summary</h2>
            <ul className="mt-2 space-y-1 text-sm text-gray-700">
              {items.map((i) => (
                <li key={i.productId} className="flex justify-between">
                  <span>{i.name} × {i.quantity}</span>
                  <span>${(i.price * i.quantity).toFixed(2)}</span>
                </li>
              ))}
            </ul>
            <div className="mt-3 flex justify-between font-semibold">
              <span>Subtotal</span>
              <span>${subtotal().toFixed(2)}</span>
            </div>
          </aside>
        </div>
      )}
    </Container>
  );
}
