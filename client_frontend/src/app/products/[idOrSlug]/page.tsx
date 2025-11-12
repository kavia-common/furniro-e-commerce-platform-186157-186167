"use client";

import React, { useEffect, useState } from "react";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import { api } from "@/lib/api";
import { useCartStore } from "@/store/cart";

type Product = {
  id: number;
  name: string;
  description?: string;
  price: number;
  discountPct?: number;
  images?: Array<{ url: string; alt?: string }>;
};

export default function ProductDetail({ params }: { params: Promise<{ idOrSlug: string }> }) {
  const [loading, setLoading] = useState(true);
  const [p, setP] = useState<Product | null>(null);
  const [qty, setQty] = useState(1);
  const [resolvedId, setResolvedId] = useState<string>("");
  const { upsertItem } = useCartStore();

  useEffect(() => {
    (async () => {
      const pms = await params;
      setResolvedId(pms.idOrSlug);
    })();
  }, [params]);

  useEffect(() => {
    if (!resolvedId) return;
    setLoading(true);
    api
      .product(resolvedId)
      .then((res) => setP(res as unknown as Product))
      .catch(() => setP(null))
      .finally(() => setLoading(false));
  }, [resolvedId]);

  const image = p?.images?.[0]?.url || "https://via.placeholder.com/800x600?text=Product";
  const price = Number(p?.price || 0);
  const discount = Number(p?.discountPct || 0);
  const finalPrice = discount ? price * (1 - discount / 100) : price;

  const addLocal = () => {
    if (!p) return;
    upsertItem({
      productId: Number(p.id),
      name: p.name,
      price: finalPrice,
      quantity: qty,
      image,
    });
  };

  const addRemote = async () => {
    if (!p) return;
    try {
      await api.addToCart(Number(p.id), qty);
    } catch {
      // ignore if not authed; local cart is maintained
    }
  };

  const addToCart = async () => {
    addLocal();
    await addRemote();
  };

  return (
    <Container>
      {loading ? (
        <div className="card">Loading…</div>
      ) : !p ? (
        <div className="card">Product not found</div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={image} alt={p.images?.[0]?.alt || p.name} className="w-full rounded-xl object-cover" />
          <div>
            <h1 className="title">{p.name}</h1>
            <p className="mt-2 text-gray-600">{p.description || "No description"}</p>
            <div className="mt-4 flex items-center gap-3">
              {discount ? (
                <>
                  <span className="text-2xl font-semibold text-blue-700">${finalPrice.toFixed(2)}</span>
                  <span className="text-sm text-gray-400 line-through">${price.toFixed(2)}</span>
                  <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
                    -{discount}%
                  </span>
                </>
              ) : (
                <span className="text-2xl font-semibold">${price.toFixed(2)}</span>
              )}
            </div>

            <div className="mt-6 flex items-center gap-3">
              <label htmlFor="qty" className="label">Quantity</label>
              <input
                id="qty"
                type="number"
                min={1}
                className="input w-24"
                value={qty}
                onChange={(e) => setQty(Math.max(1, Number(e.target.value)))}
              />
              <Button onClick={addToCart} aria-label="Add to cart">Add to cart</Button>
            </div>
          </div>
        </div>
      )}
    </Container>
  );
}
