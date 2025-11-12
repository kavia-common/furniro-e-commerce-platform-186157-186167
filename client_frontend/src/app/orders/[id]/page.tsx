"use client";

import React, { useEffect, useState } from "react";
import Container from "@/components/ui/Container";
import { api } from "@/lib/api";

type OrderItem = { productId?: number; name?: string; quantity?: number; price?: number };
type Order = { id: number; createdAt?: string | number | Date; total?: number; items?: OrderItem[] };

export default function OrderDetail({ params }: { params: Promise<{ id: string }> }) {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [resolvedId, setResolvedId] = useState<string>("");

  useEffect(() => {
    (async () => {
      const pms = await params;
      setResolvedId(pms.id);
    })();
  }, [params]);

  useEffect(() => {
    if (!resolvedId) return;
    api
      .orderById(Number(resolvedId))
      .then((res) => setOrder(res as unknown as Order))
      .catch(() => setOrder(null))
      .finally(() => setLoading(false));
  }, [resolvedId]);

  return (
    <Container>
      <header className="header">
        <h1 className="title">Order #{resolvedId}</h1>
        <p className="subtitle">Order details and items</p>
      </header>

      {loading ? (
        <div className="card">Loading…</div>
      ) : !order ? (
        <div className="card">Order not found.</div>
      ) : (
        <div className="card">
          <div className="text-sm text-gray-600">Placed at: {new Date(order.createdAt || Date.now()).toLocaleString()}</div>
          <ul className="mt-4 space-y-2">
            {(order.items || []).map((it, idx: number) => (
              <li key={idx} className="flex items-center justify-between">
                <span>{it.name || `Product ${it.productId}`} × {it.quantity}</span>
                <span>${Number(it.price || 0).toFixed(2)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex justify-end font-semibold">
            Total: ${Number(order.total || 0).toFixed(2)}
          </div>
        </div>
      )}
    </Container>
  );
}
