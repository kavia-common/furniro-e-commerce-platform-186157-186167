"use client";

import React, { useEffect, useState } from "react";
import Container from "@/components/ui/Container";
import { Input } from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";

type ProductPayload = {
  name: string;
  slug: string;
  description?: string;
  price: number;
  discountPct?: number;
  stock?: number;
  sku?: string;
  categoryId?: number | string;
  images?: Array<{ url: string; alt?: string }>;
};

type Category = { id?: number; slug?: string; name?: string };

export default function AdminNewProduct() {
  const [payload, setPayload] = useState<ProductPayload>({
    name: "",
    slug: "",
    description: "",
    price: 0,
    discountPct: 0,
    stock: 0,
    sku: "",
    categoryId: "",
    images: [],
  });
  const [categories, setCategories] = useState<Category[]>([]);
  const router = useRouter();

  useEffect(() => {
    api
      .categories()
      .then((res) => {
        const list = Array.isArray(res) ? res : (res as { items: Category[] }).items || [];
        setCategories(list);
      })
      .catch(() => setCategories([]));
  }, []);

  const onChange = (key: keyof ProductPayload, value: unknown) =>
    setPayload((p) => ({ ...p, [key]: value } as ProductPayload));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const body = { ...payload, categoryId: Number(payload.categoryId) || undefined };
    await api.createProduct(body as unknown as Record<string, unknown>);
    router.push("/admin/products");
  };

  return (
    <Container>
      <header className="header">
        <h1 className="title">New Product</h1>
        <p className="subtitle">Create a new product</p>
      </header>
      <form onSubmit={submit} className="card grid md:grid-cols-2 gap-4">
        <div>
          <label className="label" htmlFor="name">Name</label>
          <Input id="name" value={payload.name} onChange={(e) => onChange("name", e.target.value)} required />
        </div>
        <div>
          <label className="label" htmlFor="slug">Slug</label>
          <Input id="slug" value={payload.slug} onChange={(e) => onChange("slug", e.target.value)} required />
        </div>
        <div className="md:col-span-2">
          <label className="label" htmlFor="description">Description</label>
          <Input id="description" value={payload.description} onChange={(e) => onChange("description", e.target.value)} />
        </div>
        <div>
          <label className="label" htmlFor="price">Price</label>
          <Input id="price" type="number" value={payload.price} onChange={(e) => onChange("price", Number(e.target.value))} required />
        </div>
        <div>
          <label className="label" htmlFor="discountPct">Discount %</label>
          <Input id="discountPct" type="number" value={payload.discountPct} onChange={(e) => onChange("discountPct", Number(e.target.value))} />
        </div>
        <div>
          <label className="label" htmlFor="stock">Stock</label>
          <Input id="stock" type="number" value={payload.stock} onChange={(e) => onChange("stock", Number(e.target.value))} />
        </div>
        <div>
          <label className="label" htmlFor="sku">SKU</label>
          <Input id="sku" value={payload.sku} onChange={(e) => onChange("sku", e.target.value)} />
        </div>
        <div>
          <label className="label" htmlFor="categoryId">Category</label>
          <Select id="categoryId" value={payload.categoryId as string} onChange={(e) => onChange("categoryId", e.target.value)}>
            <option value="">Select</option>
            {categories.map((c) => (
              <option key={c.id ?? c.slug} value={c.id}>{c.name}</option>
            ))}
          </Select>
        </div>
        <div className="md:col-span-2">
          <label className="label" htmlFor="image">Primary Image URL</label>
          <Input id="image" placeholder="https://..." onChange={(e) => onChange("images", [{ url: e.target.value, alt: payload.name }])} />
        </div>
        <div className="md:col-span-2">
          <Button type="submit">Create</Button>
        </div>
      </form>
    </Container>
  );
}
