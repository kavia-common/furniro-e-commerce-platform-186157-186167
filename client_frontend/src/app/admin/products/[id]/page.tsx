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
  category?: { id?: number };
};

type Category = { id?: number; slug?: string; name?: string };

export default function AdminEditProduct({ params }: { params: Promise<{ id: string }> }) {
  const [payload, setPayload] = useState<ProductPayload | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [resolvedId, setResolvedId] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const pms = await params;
      setResolvedId(pms.id);
    })();
  }, [params]);

  useEffect(() => {
    if (!resolvedId) return;
    api.product(resolvedId).then((p) => {
      const prod = p as unknown as ProductPayload;
      setPayload({
        ...prod,
        categoryId: (prod?.categoryId as number) ?? prod?.category?.id ?? "",
      });
    });
    api
      .categories()
      .then((res) => {
        const list = Array.isArray(res) ? res : (res as { items: Category[] }).items || [];
        setCategories(list);
      })
      .catch(() => setCategories([]));
  }, [resolvedId]);

  const onChange = (key: keyof ProductPayload, value: unknown) =>
    setPayload((p) => (p ? ({ ...p, [key]: value } as ProductPayload) : p));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!payload) return;
    const body = {
      name: payload.name,
      slug: payload.slug,
      description: payload.description,
      price: Number(payload.price),
      discountPct: Number(payload.discountPct || 0),
      stock: Number(payload.stock || 0),
      sku: payload.sku,
      categoryId: Number(payload.categoryId) || undefined,
      images: payload.images,
    };
    await api.updateProduct(Number(resolvedId), body as unknown as Record<string, unknown>);
    router.push("/admin/products");
  };

  if (!payload) {
    return (
      <Container>
        <div className="card">Loading…</div>
      </Container>
    );
  }

  return (
    <Container>
      <header className="header">
        <h1 className="title">Edit Product</h1>
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
          <Input id="description" value={payload.description || ""} onChange={(e) => onChange("description", e.target.value)} />
        </div>
        <div>
          <label className="label" htmlFor="price">Price</label>
          <Input id="price" type="number" value={payload.price} onChange={(e) => onChange("price", Number(e.target.value))} required />
        </div>
        <div>
          <label className="label" htmlFor="discountPct">Discount %</label>
          <Input id="discountPct" type="number" value={payload.discountPct || 0} onChange={(e) => onChange("discountPct", Number(e.target.value))} />
        </div>
        <div>
          <label className="label" htmlFor="stock">Stock</label>
          <Input id="stock" type="number" value={payload.stock || 0} onChange={(e) => onChange("stock", Number(e.target.value))} />
        </div>
        <div>
          <label className="label" htmlFor="sku">SKU</label>
          <Input id="sku" value={payload.sku || ""} onChange={(e) => onChange("sku", e.target.value)} />
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
          <Input
            id="image"
            value={(payload.images?.[0]?.url) || ""}
            onChange={(e) => onChange("images", [{ url: e.target.value, alt: payload.name }])}
          />
        </div>
        <div className="md:col-span-2">
          <Button type="submit">Save</Button>
        </div>
      </form>
    </Container>
  );
}
