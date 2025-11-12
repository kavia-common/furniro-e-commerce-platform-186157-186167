import Link from "next/link";

export type Product = {
  id: number;
  name: string;
  slug?: string;
  price: number;
  discountPct?: number;
  images?: { url: string; alt?: string }[];
  description?: string;
};

/**
 * PUBLIC_INTERFACE
 * ProductCard - basic product summary card
 */
export default function ProductCard({ product }: { product: Product }) {
  const image = product.images?.[0]?.url || "https://via.placeholder.com/400x300?text=Product";
  const finalPrice = product.discountPct
    ? product.price * (1 - product.discountPct / 100)
    : product.price;

  const href = `/products/${product.slug || product.id}`;

  return (
    <article className="card h-full flex flex-col group">
      <Link href={href} aria-label={`View details for ${product.name}`} className="block">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={image}
          alt={product.images?.[0]?.alt || product.name}
          className="aspect-[4/3] w-full object-cover rounded-lg"
        />
      </Link>
      <div className="mt-4 flex-1 flex flex-col">
        <h3 className="text-base font-medium line-clamp-2">{product.name}</h3>
        <div className="mt-2 flex items-center gap-2">
          {product.discountPct ? (
            <>
              <span className="text-lg font-semibold text-blue-700">${finalPrice.toFixed(2)}</span>
              <span className="text-sm text-gray-400 line-through">${product.price.toFixed(2)}</span>
              <span className="ml-auto text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
                -{product.discountPct}%
              </span>
            </>
          ) : (
            <span className="text-lg font-semibold">${product.price.toFixed(2)}</span>
          )}
        </div>
        <Link href={href} className="mt-4 btn btn-primary text-center" aria-label={`Shop ${product.name}`}>
          View
        </Link>
      </div>
    </article>
  );
}
