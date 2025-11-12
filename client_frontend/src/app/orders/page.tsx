"use client";

import React, { useEffect, useState } from "react";
import Container from "@/components/ui/Container";
import { api } from "@/lib/api";
import Link from "next/link";

type Order = { id: number; createdAt?: string | number | Date };

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .myOrders()
      .then((res) => {
        const list = Array.isArray(res) ? (res as unknown as Order[]) : ((res as { items: Order[] }).items || []);
        setOrders(list);
      })
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Container>
      <header className="header">
        <h1 className="title">My Orders</h1>
        <p className="subtitle">Review your recent purchases</p>
      </header>
      {loading ? (
        <div className="card">Loading…</div>
      ) : orders.length === 0 ? (
        <div className="card">No orders yet.</div>
      ) : (
        <ul className="grid gap-3">
          {orders.map((o) => (
            <li key={o.id} className="card flex items-center justify-between">
              <div>
                <div className="font-medium">Order #{o.id}</div>
                <div className="text-sm text-gray-600">{new Date(o.createdAt || Date.now()).toLocaleString()}</div>
              </div>
              <Link className="btn btn-primary" href={`/orders/${o.id}`}>View</Link>
            </li>
          ))}
        </ul>
      )}
    </Container>
  );
}
