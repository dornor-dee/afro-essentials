import Link from "next/link";
import ProductCard from "@/components/products/ProductCard";
import { products } from "@/data/products";

export default function BestSellers() {
  const featuredProducts = products.filter((p) => p.featured).slice(0, 6);

  return (
    <section className="bg-black py-24">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <p className="text-center text-sm font-bold uppercase tracking-[0.3em] text-[#d4af37]">
          Best Sellers
        </p>

        <h2 className="mt-4 text-center text-3xl md:text-5xl font-bold text-white">
          Customer Favorites
        </h2>

        <div className="mt-8 md:mt-14 flex items-stretch gap-4 overflow-x-auto snap-x snap-mandatory px-2 md:grid md:grid-cols-3 md:gap-8 md:overflow-visible md:px-0">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} variant="carousel" />
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 rounded-xl border border-[#d4af37]/40 bg-black px-8 py-3.5 text-sm font-bold text-[#d4af37] transition hover:bg-[#d4af37] hover:text-black"
          >
            Explore All Fabrics & Accessories →
          </Link>
        </div>
      </div>
    </section>
  );
}
