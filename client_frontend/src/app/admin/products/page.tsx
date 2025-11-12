"use client";

import React, { useEffect, useState } from "react";
import Container from "@/components/ui/Container";
import { api } from "@/lib/api";
import Link from "next/link";
import Button from "@/components/ui/Button";

type Product = { id: number; name: string; price: number; category?: { name?: string }; categoryId?: number };

export default function AdminProductsPage() {
  const [items, setItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.products({ page: 1, pageSize: 100 });
      const list = Array.isArray(res) ? (res as unknown as Product[]) : ((res.items as Product[]) || []);
      setItems(list);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const remove = async (id: number) => {
    if (!confirm("Delete this product?")) return;
    await api.deleteProduct(id);
    await load();
  };

  return (
    <Container>
      <header className="header flex items-center justify-between">
        <div>
          <h1 className="title">Admin · Products</h1>
          <p className="subtitle">Create, update, and delete products</p>
        </div>
        <Link href="/admin/products/new" className="btn btn-primary">New Product</Link>
      </header>

      {loading ? (
        <div className="card">Loading…</div>
      ) : (
        <div className="card overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left border-b">
                <th className="py-2 pr-4">ID</th>
                <th className="py-2 pr-4">Name</th>
                <th className="py-2 pr-4">Price</th>
                <th className="py-2 pr-4">Category</th>
                <th className="py-2 pr-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((p) => (
                <tr key={p.id} className="border-b">
                  <td className="py-2 pr-4">{p.id}</td>
                  <td className="py-2 pr-4">{p.name}</td>
                  <td className="py-2 pr-4">${Number(p.price).toFixed(2)}</td>
                  <td className="py-2 pr-4">{p.category?.name || p.categoryId}</td>
                  <td className="py-2 pr-4 flex gap-2">
                    <Link className="btn btn-secondary" href={`/admin/products/${p.id}`}>Edit</Link>
                    <Button variant="ghost" onClick={() => remove(p.id)}>Delete</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Container>
  );
}
