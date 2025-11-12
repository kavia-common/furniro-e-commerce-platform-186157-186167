"use client";

import React, { useEffect, useState } from "react";
import Container from "@/components/ui/Container";
import FilterBar from "@/components/FilterBar";
import ProductGrid from "@/components/ProductGrid";
import Pagination from "@/components/Pagination";
import { api } from "@/lib/api";

type Category = { slug: string; name: string };
import type { Product as ProductType } from "@/components/ProductCard";
type Product = ProductType;

export default function ProductsPage() {
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);

  const [filters, setFilters] = useState<{
    q?: string;
    categorySlug?: string;
    minPrice?: string;
    maxPrice?: string;
    hasDiscount?: string;
    sort?: string;
    page: number;
    pageSize: number;
  }>({
    q: "",
    categorySlug: "",
    minPrice: "",
    maxPrice: "",
    hasDiscount: "",
    sort: "",
    page: 1,
    pageSize: 12,
  });

  const onChange = (k: string, v: string) =>
    setFilters((f) => ({ ...f, [k]: v }));

  const load = async () => {
    setLoading(true);
    try {
      const query: Record<string, string | number | boolean | undefined> = {
        q: filters.q || undefined,
        categorySlug: filters.categorySlug || undefined,
        minPrice: filters.minPrice ? Number(filters.minPrice) : undefined,
        maxPrice: filters.maxPrice ? Number(filters.maxPrice) : undefined,
        hasDiscount: filters.hasDiscount || undefined,
        sort: filters.sort || undefined,
        page: filters.page,
        pageSize: filters.pageSize,
      };
      const res = await api.products(query);
      const items = Array.isArray(res) ? (res as unknown as Product[]) : (res.items as Product[]) || [];
      setProducts(items);
      setTotal((!Array.isArray(res) && res.total) || items.length || 0);
    } catch {
      setProducts([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    api
      .categories()
      .then((res) => {
        const list = Array.isArray(res) ? res : (res as { items: Category[] }).items || [];
        setCategories(
          (list as Array<Partial<{ id: number; slug: string; name: string }>>).map((c) => ({
            slug: String((c.slug as string | undefined) ?? (c.id as number | undefined) ?? (c.name as string | undefined) ?? ""),
            name: String((c.name as string | undefined) ?? (c.slug as string | undefined) ?? (c.id as number | undefined) ?? ""),
          }))
        );
      })
      .catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.page, filters.pageSize]);

  const onApply = () => {
    setFilters((f) => ({ ...f, page: 1 }));
    void load();
  };

  return (
    <Container>
      <header className="header">
        <h1 className="title">Products</h1>
        <p className="subtitle">Browse and filter our catalog</p>
      </header>

      <FilterBar values={filters} categories={categories} onChange={onChange} onApply={onApply} />

      <section className="mt-6" aria-busy={loading}>
        {loading ? (
          <div className="card">Loading products…</div>
        ) : products.length === 0 ? (
          <div className="card">No products found</div>
        ) : (
          <>
            <ProductGrid products={products} />
            <Pagination
              page={filters.page}
              pageSize={filters.pageSize}
              total={total}
              onPageChange={(p) => setFilters((f) => ({ ...f, page: p }))}
            />
          </>
        )}
      </section>
    </Container>
  );
}
