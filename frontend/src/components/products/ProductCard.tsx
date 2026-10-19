"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingCart } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { Product } from "@/types/product";
import { useRouter } from "next/navigation";
import { MouseEvent } from "react";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
  variant?: "default" | "carousel" | "lg";
  className?: string;
}

const cardWidth = {
  default: "w-full min-w-0",
  carousel: "w-60 shrink-0 md:w-full md:shrink snap-start",
  lg: "w-full min-w-0",
};

export default function ProductCard({
  product,
  variant = "default",
  className,
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
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-xl sm:rounded-2xl bg-white shadow-xs hover:shadow-md transition-all duration-300 border border-black/5",
        cardWidth[variant],
        className
      )}
    >
      <div
        className="relative aspect-4/3 sm:aspect-3/2 w-full overflow-hidden bg-gray-100 cursor-pointer"
        onClick={() => router.push(`/products/${product.slug}`)}
      >
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />
        <button
          onClick={toggleWishlist}
          aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
          className="absolute right-2 top-2 sm:right-3 sm:top-3 flex size-7 sm:size-8 items-center justify-center rounded-full shadow-sm backdrop-blur-md transition cursor-pointer bg-white/70 hover:bg-white"
        >
          <Heart
            className={cn(
              "size-4 sm:size-5 transition-colors",
              inWishlist
                ? "fill-[#d4af37] text-[#d4af37]"
                : "text-gray-600 hover:text-black"
            )}
          />
        </button>

        <button
          onClick={toggleCart}
          className="hidden absolute inset-x-3 bottom-3 md:flex items-center justify-center gap-2 rounded-lg bg-black py-2.5 text-xs lg:text-sm font-semibold text-[#d4af37] opacity-100 transition md:translate-y-3 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100 cursor-pointer hover:bg-black/85"
        >
          <ShoppingCart className="h-4 w-4" />
          {inCart ? "Remove from Cart" : "Add to Cart"}
        </button>
      </div>

      <Link
        href={`/products/${product.slug}`}
        className="flex flex-col flex-1 justify-between p-2.5 sm:p-3.5 md:p-5"
      >
        <div>
          <span className="block text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-gray-500 mb-0.5">
            {product.brand}
          </span>
          <h3 className="line-clamp-2 text-xs sm:text-sm md:text-base font-bold text-black group-hover:text-[#947614] transition-colors leading-tight sm:leading-snug">
            {product.name}
          </h3>
        </div>
        <p className="mt-2 text-sm sm:text-base md:text-lg font-extrabold text-[#947614]">
          ${product.price}
        </p>
      </Link>
    </div>
  );
}
