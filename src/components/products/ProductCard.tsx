import Link from "next/link";
import { Product } from "@/types/product";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({
  product,
}: ProductCardProps) {
  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-lg">
      <div className="h-72 bg-gray-200"></div>

      <div className="p-6">
        <h3 className="text-xl font-bold text-black">
          {product.name}
        </h3>

        <p className="mt-2 text-gray-500">
          {product.brand}
        </p>

        <p className="mt-4 text-xl font-bold text-[#d4af37]">
          ${product.price}
        </p>

        <Link
          href={`/products/${product.slug}`}
          className="mt-5 block rounded-lg bg-black py-3 text-center font-semibold text-white"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}