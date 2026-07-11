import ProductCard from "@/components/products/ProductCard";
import { products } from "@/data/products";

export default function BestSellers() {
  return (
    <section className="bg-black py-24">
      <div className="mx-auto max-w-7xl px-2 md:px-6">
        <p className="text-center text-sm font-bold uppercase tracking-[0.3em] text-[#d4af37]">
          Best Sellers
        </p>

        <h2 className="mt-4 text-center text-3xl md:text-5xl font-bold text-white">
          Customer Favorites
        </h2>

        <div className="mt-8 md:mt-14 flex items-stretch gap-4 overflow-x-auto snap-x snap-mandatory px-2 md:grid md:grid-cols-3 md:gap-8 md:overflow-visible md:px-0">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} variant="default" />
          ))}
        </div>
      </div>
    </section>
  );
}
