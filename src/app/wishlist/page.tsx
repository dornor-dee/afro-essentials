"use client";

import Link from "next/link";
import { useWishlist } from "@/context/WishlistContext";

export default function WishlistPage() {
  const { items, removeFromWishlist, clearWishlist } = useWishlist();

  if (items.length === 0) {
    return (
      <main className="min-h-screen bg-[#f7f3e8] px-6 py-16 text-black">
        <div className="mx-auto flex max-w-5xl flex-col items-center rounded-3xl bg-white p-10 text-center shadow-lg">
          <h1 className="text-3xl font-bold">Your wishlist is empty</h1>
          <p className="mt-3 max-w-xl text-gray-600">
            Save fabrics you love here so you can come back to them later.
          </p>
          <Link href="/" className="mt-6 rounded-lg bg-black px-6 py-3 font-semibold text-white">
            Continue Shopping
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f7f3e8] px-6 py-16 text-black">
      <div className="mx-auto max-w-6xl rounded-3xl bg-white p-8 shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Wishlist</h1>
            <p className="mt-2 text-gray-600">{items.length} saved item(s)</p>
          </div>
          <button
            onClick={clearWishlist}
            className="text-sm font-semibold text-[#b89329] hover:text-[#d4af37]"
          >
            Clear wishlist
          </button>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {items.map((product) => (
            <div key={product.id} className="rounded-2xl border border-gray-200 p-6">
              <h2 className="text-xl font-semibold">{product.name}</h2>
              <p className="mt-2 text-sm text-gray-500">{product.category}</p>
              <p className="mt-4 text-lg font-semibold text-[#d4af37]">${product.price}</p>
              <div className="mt-5 flex gap-3">
                <button
                  onClick={() => removeFromWishlist(product.id)}
                  className="rounded-lg border border-red-200 px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-50"
                >
                  Remove
                </button>
                <Link
                  href={`/products/${product.slug}`}
                  className="rounded-lg bg-black px-3 py-2 text-sm font-semibold text-white"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
