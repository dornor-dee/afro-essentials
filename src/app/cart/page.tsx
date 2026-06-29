"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, subtotal, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <main className="min-h-screen bg-[#f7f3e8] px-6 py-16 text-black">
        <div className="mx-auto flex max-w-5xl flex-col items-center rounded-3xl bg-white p-10 text-center shadow-lg">
          <h1 className="text-3xl font-bold">Your cart is empty</h1>
          <p className="mt-3 max-w-xl text-gray-600">
            Add fabrics to your cart and they will appear here for quick checkout.
          </p>
          <Link
            href="/"
            className="mt-6 rounded-lg bg-black px-6 py-3 font-semibold text-white"
          >
            Continue Shopping
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f7f3e8] px-6 py-16 text-black">
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[2fr_1fr]">
        <section className="rounded-3xl bg-white p-8 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Shopping Cart</h1>
              <p className="mt-2 text-gray-600">{items.length} item(s) ready for checkout</p>
            </div>
            <button
              onClick={clearCart}
              className="text-sm font-semibold text-[#b89329] hover:text-[#d4af37]"
            >
              Clear cart
            </button>
          </div>

          <div className="mt-8 space-y-6">
            {items.map((item) => (
              <div key={item.product.id} className="flex flex-col gap-4 rounded-2xl border border-gray-200 p-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="text-xl font-semibold">{item.product.name}</h2>
                  <p className="mt-1 text-sm text-gray-500">{item.product.category}</p>
                  <p className="mt-3 font-semibold text-[#d4af37]">${item.product.price}</p>
                </div>

                <div className="flex items-center gap-3">
                  <select
                    value={item.quantity}
                    onChange={(e) => updateQuantity(item.product.id, Number(e.target.value))}
                    className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
                  >
                    {[1, 2, 3, 4, 5].map((value) => (
                      <option key={value} value={value}>
                        {value}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={() => removeFromCart(item.product.id)}
                    className="rounded-lg border border-red-200 px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-50"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <aside className="rounded-3xl bg-black p-8 text-white shadow-lg">
          <h2 className="text-2xl font-bold">Order Summary</h2>
          <div className="mt-6 space-y-3 text-sm text-white/80">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>Free</span>
            </div>
            <div className="flex justify-between border-t border-white/20 pt-3 text-base font-semibold text-white">
              <span>Total</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
          </div>

          <button
            onClick={() => alert("Checkout is ready! This demo can be connected to a payment provider next.")}
            className="mt-8 w-full rounded-lg bg-[#d4af37] px-4 py-3 font-semibold text-black transition hover:bg-[#e8c24d]"
          >
            Proceed to Checkout
          </button>
          <Link href="/" className="mt-4 block text-center text-sm text-[#d4af37] hover:text-[#e8c24d]">
            Continue shopping
          </Link>
        </aside>
      </div>
    </main>
  );
}
