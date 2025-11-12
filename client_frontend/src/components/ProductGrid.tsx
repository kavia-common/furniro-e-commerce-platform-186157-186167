import React from "react";
import ProductCard, { Product } from "./ProductCard";

/**
 * PUBLIC_INTERFACE
 * ProductGrid
 */
export default function ProductGrid({ products }: { products: Product[] }) {
  return (
    <div
      role="list"
      aria-label="Products"
      className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6"
    >
      {products.map((p) => (
        <div role="listitem" key={p.id}>
          <ProductCard product={p} />
        </div>
      ))}
    </div>
  );
}
