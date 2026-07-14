"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingCart } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { Product } from "@/types/product";
import { useRouter } from "next/navigation";
import { MouseEvent } from "react";

interface ProductCardProps {
  product: Product;
  variant?: "lg" | "default";
}

const cardWidth = {
  default: "w-60 md:w-full",
  lg: "w-70 md:w-full",
};

export default function ProductCard({
  product,
  variant = "default",
}: ProductCardProps) {
  const { addToCart, items, removeFromCart } = useCart();
  const { addToWishlist, isInWishlist, removeFromWishlist } = useWishlist();
  const router = useRouter();

  const inWishlist = isInWishlist(product.id);
  const inCart = items.some((item) => item.product.id === product.id);

  const toggleWishlist = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (inWishlist) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  const toggleCart = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (inCart) {
      removeFromCart(product.id);
    } else {
      addToCart(product);
    }
  };

  return (
    <div
      className={`${cardWidth[variant]} group relative shrink-0 snap-start overflow-hidden rounded-2xl bg-white shadow-lg transition-shadow hover:shadow-xl`}
    >
      <div
        className="relative aspect-3/2 w-full overflow-hidden bg-gray-200"
        onClick={() => router.push(`/products/${product.slug}`)}
      >
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 768px) 240px, 33vw"
        />
        <button
          onClick={toggleWishlist}
          aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
          className={`absolute right-3 top-3 flex size-7 md:size-8 items-center justify-center rounded-full shadow-md backdrop-blur transition cursor-pointer bg-white/50 hover:bg-white/70`}
        >
          <Heart
            className={`size-5 ${
              inWishlist ? "fill-primary text-primary" : "text-primary"
            }`}
          />
        </button>

        <button
          onClick={toggleCart}
          className="hidden absolute inset-x-3 bottom-3 md:flex items-center justify-center gap-2 rounded-lg bg-black py-2.5 text-sm font-semibold text-white opacity-100 transition md:translate-y-3 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100 cursor-pointer"
        >
          <ShoppingCart className="h-4 w-4" />
          {inCart ? "Remove from Cart" : "Add to Cart"}
        </button>
      </div>

      <Link href={`/products/${product.slug}`} className="block p-3 md:p-6">
        <h3 className="line-clamp-2 text-base font-bold text-black md:text-xl">
          {product.name}
        </h3>
        <p className="mt-2 text-xl font-bold text-primary">${product.price}</p>
      </Link>
    </div>
  );
}
