import ProductCard from "@/components/products/ProductCard";
import { products } from "@/data/products";

export default function BestSellers() {
  return (
    <section className="bg-black py-24">
      <div className="mx-auto max-w-7xl px-6">
        <p className="text-center text-sm font-bold uppercase tracking-[0.3em] text-[#d4af37]">
          Best Sellers
        </p>

        <h2 className="mt-4 text-center text-5xl font-bold text-white">
          Customer Favorites
        </h2>

        <div className="mt-14 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
            />
          ))}
        </div>
      </div>
    </section>
  );
}