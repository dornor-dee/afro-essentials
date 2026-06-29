"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { Product } from "@/types/product";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({
  product,
}: ProductCardProps) {
  const { addToCart } = useCart();
  const { addToWishlist, isInWishlist, removeFromWishlist } = useWishlist();

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

        <div className="mt-5 flex flex-col gap-3">
          <button
            onClick={() => addToCart(product)}
            className="rounded-lg border border-[#d4af37] px-4 py-3 font-semibold text-[#d4af37] transition hover:bg-[#d4af37] hover:text-black"
          >
            Add to Cart
          </button>
          <button
            onClick={() => (isInWishlist(product.id) ? removeFromWishlist(product.id) : addToWishlist(product))}
            className="rounded-lg border border-gray-300 px-4 py-3 font-semibold text-gray-700 transition hover:border-[#d4af37] hover:text-[#d4af37]"
          >
            {isInWishlist(product.id) ? "Remove from Wishlist" : "Add to Wishlist"}
          </button>
          <Link
            href={`/products/${product.slug}`}
            className="block rounded-lg bg-black py-3 text-center font-semibold text-white"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}