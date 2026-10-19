"use client";

import { use, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { products } from "@/data/products";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import ProductCard from "@/components/products/ProductCard";
import {
  Heart,
  ShoppingCart,
  Check,
  ShieldCheck,
  Truck,
  RotateCcw,
  Star,
  ChevronRight,
  ChevronLeft,
  Share2,
} from "lucide-react";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export default function ProductDetailPage({ params }: ProductPageProps) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;

  const product = products.find((p) => p.slug === slug);

  if (!product) {
    notFound();
  }

  const { addToCart, items } = useCart();
  const { addToWishlist, isInWishlist, removeFromWishlist } = useWishlist();

  const imageList =
    product.images && product.images.length > 0
      ? product.images
      : [product.image];
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const currentImage = imageList[selectedImageIndex] || product.image;

  const nextImage = () => {
    setSelectedImageIndex((prev) => (prev + 1) % imageList.length);
  };

  const prevImage = () => {
    setSelectedImageIndex(
      (prev) => (prev - 1 + imageList.length) % imageList.length,
    );
  };

  const [quantity, setQuantity] = useState(1);
  const [addedAnimation, setAddedAnimation] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const inWishlist = isInWishlist(product.id);
  const inCart = items.some((item) => item.product.id === product.id);

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 2000);
  };

  const toggleWishlist = () => {
    if (inWishlist) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard?.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
    <main className="min-h-screen bg-[#f7f3e8] text-black">
      <div className="border-b border-black/5 bg-[#f0ebd9] px-4 py-3.5">
        <div className="mx-auto flex max-w-7xl items-center gap-2 text-xs md:text-sm text-gray-600">
          <Link href="/" className="hover:text-black">
            Home
          </Link>
          <ChevronRight size={14} className="text-gray-400" />
          <Link href="/shop" className="hover:text-black">
            Shop
          </Link>
          <ChevronRight size={14} className="text-gray-400" />
          <Link
            href={`/shop?category=${encodeURIComponent(product.category)}`}
            className="hover:text-black"
          >
            {product.category}
          </Link>
          <ChevronRight size={14} className="text-gray-400" />
          <span className="font-semibold text-black truncate max-w-50 md:max-w-none">
            {product.name}
          </span>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 md:py-14">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
          <div className="space-y-4">
            <div className="relative aspect-4/3 w-full overflow-hidden rounded-3xl bg-white shadow-xl ring-1 ring-black/5">
              <Image
                src={currentImage}
                alt={`${product.name} - view ${selectedImageIndex + 1}`}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover transition-all duration-500 hover:scale-105"
              />

              <button
                onClick={toggleWishlist}
                aria-label={
                  inWishlist ? "Remove from wishlist" : "Add to wishlist"
                }
                className="absolute right-4 top-4 z-10 flex size-10 items-center justify-center rounded-full bg-white/80 backdrop-blur-md shadow-md transition hover:bg-white cursor-pointer"
              >
                <Heart
                  size={20}
                  className={
                    inWishlist
                      ? "fill-[#d4af37] text-[#d4af37]"
                      : "text-gray-600 hover:text-black"
                  }
                />
              </button>

              {imageList.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    aria-label="Previous image"
                    className="absolute left-3 top-1/2 -translate-y-1/2 z-10 flex size-9 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-md transition hover:bg-black hover:scale-110 cursor-pointer"
                  >
                    <ChevronLeft size={20} />
                  </button>

                  <button
                    onClick={nextImage}
                    aria-label="Next image"
                    className="absolute right-3 top-1/2 -translate-y-1/2 z-10 flex size-9 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-md transition hover:bg-black hover:scale-110 cursor-pointer"
                  >
                    <ChevronRight size={20} />
                  </button>

                  <div className="absolute top-4 left-4 z-10 rounded-full bg-black/70 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur-md">
                    {selectedImageIndex + 1} / {imageList.length}
                  </div>
                </>
              )}
            </div>

            {imageList.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-1 [-ms-overflow-style:none] scrollbar-none [&::-webkit-scrollbar]:hidden">
                {imageList.map((img, idx) => (
                  <button
                    key={img + idx}
                    type="button"
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`relative aspect-4/3 h-18 shrink-0 overflow-hidden rounded-xl transition-all cursor-pointer ${
                      selectedImageIndex === idx
                        ? "ring-2 ring-[#d4af37] ring-offset-2 scale-102 shadow-md opacity-100"
                        : "opacity-60 hover:opacity-100 border border-black/10"
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`${product.name} thumbnail ${idx + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col justify-between">
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="inline-block rounded-full bg-[#d4af37]/15 px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#947614]">
                    {product.brand} • {product.category}
                  </span>

                  <button
                    onClick={handleShare}
                    className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-black cursor-pointer"
                  >
                    <Share2 size={15} />
                    {copiedLink ? "Link Copied!" : "Share"}
                  </button>
                </div>

                <h1 className="text-3xl font-extrabold text-black md:text-4xl leading-tight">
                  {product.name}
                </h1>

                {/* Rating & Origin */}
                <div className="flex flex-wrap items-center gap-3 pt-1 text-sm">
                  <div className="flex items-center gap-1 text-[#d4af37]">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        className={
                          i < Math.floor(product.rating || 5)
                            ? "fill-[#d4af37]"
                            : "text-gray-300"
                        }
                      />
                    ))}
                    <span className="ml-1 font-bold text-black">
                      {product.rating || 5.0}
                    </span>
                  </div>
                  <span className="text-gray-400">•</span>
                  <span className="text-gray-600">
                    {product.reviewsCount || 24} customer reviews
                  </span>
                  {product.origin && (
                    <>
                      <span className="text-gray-400">•</span>
                      <span className="text-gray-600 font-medium">
                        Origin: {product.origin}
                      </span>
                    </>
                  )}
                </div>
              </div>

              <div className="rounded-2xl bg-white p-5 shadow-xs border border-black/5 flex items-baseline justify-between">
                <div>
                  <p className="text-xs uppercase font-semibold text-gray-500 tracking-wider">
                    Price
                  </p>
                  <p className="text-3xl font-extrabold text-black">
                    ${product.price}
                  </p>
                </div>
                {product.yardage && (
                  <div className="text-right">
                    <p className="text-xs uppercase font-semibold text-gray-500 tracking-wider">
                      Length / Piece
                    </p>
                    <p className="text-sm font-bold text-[#947614]">
                      {product.yardage}
                    </p>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500">
                  Fabric Description
                </h3>
                <p className="text-base text-gray-700 leading-relaxed">
                  {product.description}
                </p>
              </div>

              <div className="space-y-4 pt-4 border-t border-black/10">
                <div className="flex items-center gap-4">
                  <div className="flex items-center rounded-xl border border-black/15 bg-white">
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="px-3.5 py-2.5 text-lg font-bold text-gray-600 hover:text-black cursor-pointer"
                    >
                      −
                    </button>
                    <span className="px-3 py-2.5 text-base font-bold min-w-10 text-center">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => q + 1)}
                      className="px-3.5 py-2.5 text-lg font-bold text-gray-600 hover:text-black cursor-pointer"
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={handleAddToCart}
                    className={`flex-1 flex items-center justify-center gap-2 rounded-xl py-3.5 px-6 font-bold text-base transition-all cursor-pointer shadow-md ${
                      addedAnimation
                        ? "bg-emerald-600 text-white"
                        : "bg-black text-[#d4af37] hover:bg-black/85"
                    }`}
                  >
                    {addedAnimation ? (
                      <>
                        <Check size={20} />
                        Added to Cart!
                      </>
                    ) : (
                      <>
                        <ShoppingCart size={20} />
                        {inCart ? "Add More to Cart" : "Add to Cart"}
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-8 rounded-2xl bg-[#efebe0] p-4 text-xs text-gray-700 space-y-1">
              <span className="font-bold text-black uppercase tracking-wider block mb-1">
                Fabric Care & Maintenance
              </span>
              <p>• Hand wash or gentle cold cycle with mild detergent.</p>
              <p>
                • Do not bleach. Turn inside out when ironing on warm cotton
                setting.
              </p>
              <p>• Line dry in the shade to preserve vibrant wax colors.</p>
            </div>
          </div>
        </div>

        {relatedProducts.length > 0 && (
          <section className="mt-20 border-t border-black/10 pt-14">
            <div className="flex items-center justify-between mb-8">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-[#d4af37]">
                  More In This Category
                </p>
                <h2 className="text-2xl font-extrabold text-black md:text-3xl mt-1">
                  You May Also Like
                </h2>
              </div>
              <Link
                href={`/shop?category=${encodeURIComponent(product.category)}`}
                className="text-sm font-bold text-[#b89329] hover:underline"
              >
                View all {product.category} →
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 md:gap-6">
              {relatedProducts.map((relProduct) => (
                <ProductCard
                  key={relProduct.id}
                  product={relProduct}
                  variant="default"
                />
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
