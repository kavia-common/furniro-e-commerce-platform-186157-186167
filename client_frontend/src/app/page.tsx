import Link from "next/link";
import Container from "@/components/ui/Container";

export default function Home() {
  return (
    <>
      <section className="bg-gradient-to-b from-blue-500/10 to-gray-50">
        <Container>
          <div className="grid md:grid-cols-2 gap-8 items-center py-12">
            <div>
              <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
                Elevate your space with modern furniture
              </h1>
              <p className="mt-3 text-gray-600">
                Discover quality pieces with timeless design. Shop our latest collection with exclusive deals.
              </p>
              <div className="mt-6 flex items-center gap-3">
                <Link href="/products" className="btn btn-primary">Shop Now</Link>
                <Link href="/orders" className="btn btn-secondary">My Orders</Link>
              </div>
            </div>
            <div className="card">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://images.unsplash.com/photo-1540574163026-643ea20ade25?q=80&w=1200&auto=format&fit=crop"
                alt="Living room furniture"
                className="w-full h-full rounded-lg object-cover"
              />
            </div>
          </div>
        </Container>
      </section>
      <section className="py-10">
        <Container>
          <div className="flex items-center justify-between">
            <h2 className="title">Featured</h2>
            <Link href="/products" className="link">Browse all →</Link>
          </div>
          <p className="mt-2 text-sm text-gray-600">Explore our best-sellers and new arrivals.</p>
        </Container>
      </section>
    </>
  );
}
