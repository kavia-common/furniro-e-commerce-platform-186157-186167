"use client";
import React from "react";
import { Input } from "./ui/Input";
import { Select } from "./ui/Select";
import Button from "./ui/Button";

/**
 * PUBLIC_INTERFACE
 * FilterBar - search, category, price, sort, discount filter
 */
export default function FilterBar({
  values,
  onChange,
  categories,
  onApply,
}: {
  values: {
    q?: string;
    categorySlug?: string;
    minPrice?: string | number;
    maxPrice?: string | number;
    hasDiscount?: string;
    sort?: string;
  };
  categories: { slug: string; name: string }[];
  onChange: (key: string, val: string) => void;
  onApply: () => void;
}) {
  return (
    <div className="card">
      <div className="grid md:grid-cols-6 gap-3">
        <div className="md:col-span-2">
          <label className="label" htmlFor="q">Search</label>
          <Input id="q" placeholder="Search products..." value={values.q || ""} onChange={(e) => onChange("q", e.target.value)} />
        </div>
        <div>
          <label className="label" htmlFor="category">Category</label>
          <Select id="category" value={values.categorySlug || ""} onChange={(e) => onChange("categorySlug", e.target.value)}>
            <option value="">All</option>
            {categories.map((c) => (
              <option key={c.slug} value={c.slug}>{c.name}</option>
            ))}
          </Select>
        </div>
        <div>
          <label className="label" htmlFor="minPrice">Min Price</label>
          <Input id="minPrice" type="number" value={values.minPrice || ""} onChange={(e) => onChange("minPrice", e.target.value)} />
        </div>
        <div>
          <label className="label" htmlFor="maxPrice">Max Price</label>
          <Input id="maxPrice" type="number" value={values.maxPrice || ""} onChange={(e) => onChange("maxPrice", e.target.value)} />
        </div>
        <div>
          <label className="label" htmlFor="discount">Discount</label>
          <Select id="discount" value={values.hasDiscount || ""} onChange={(e) => onChange("hasDiscount", e.target.value)}>
            <option value="">Any</option>
            <option value="true">On sale</option>
            <option value="false">No discount</option>
          </Select>
        </div>
        <div>
          <label className="label" htmlFor="sort">Sort</label>
          <Select id="sort" value={values.sort || ""} onChange={(e) => onChange("sort", e.target.value)}>
            <option value="">Default</option>
            <option value="newest">Newest</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
          </Select>
        </div>
      </div>
      <div className="mt-4 flex justify-end">
        <Button onClick={onApply} aria-label="Apply filters">Apply</Button>
      </div>
    </div>
  );
}
