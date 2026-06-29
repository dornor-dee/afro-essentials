"use client";

import Link from "next/link";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { products } from "@/data/products";

function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q")?.toLowerCase() ?? "";

  const filteredProducts = products.filter((product) => {
    const searchableText = `${product.name} ${product.brand} ${product.category} ${product.description}`.toLowerCase();
    return searchableText.includes(query);
  });

  return (
    <main className="min-h-screen bg-[#f7f3e8] px-6 py-16 text-black">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-3xl font-bold">Search Results</h1>
        <p className="mt-2 text-gray-600">
          {query ? `Showing results for “${query}”` : "Enter a search term to find fabrics."}
        </p>

        {query && filteredProducts.length === 0 ? (
          <p className="mt-8 rounded-xl border border-dashed border-gray-300 bg-white p-6 text-gray-600">
            No products matched your search. Try another term.
          </p>
        ) : null}

        <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredProducts.map((product) => (
            <div key={product.id} className="overflow-hidden rounded-2xl bg-white shadow-lg">
              <div className="h-48 bg-gray-200" />
              <div className="p-6">
                <h2 className="text-xl font-semibold">{product.name}</h2>
                <p className="mt-2 text-sm text-gray-500">{product.brand}</p>
                <p className="mt-4 text-lg font-semibold text-[#d4af37]">${product.price}</p>
                <Link
                  href={`/products/${product.slug}`}
                  className="mt-5 inline-block rounded-lg bg-black px-4 py-2 text-sm font-semibold text-white"
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

export default function SearchPage() {
  return (
    <Suspense fallback={<main className="min-h-screen bg-[#f7f3e8] px-6 py-16 text-black" />}> 
      <SearchResults />
    </Suspense>
  );
}
