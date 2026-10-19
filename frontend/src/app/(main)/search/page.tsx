"use client";

import Link from "next/link";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { products } from "@/data/products";
import ProductCard from "@/components/products/ProductCard";

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

        <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-4 md:gap-6 lg:grid-cols-3">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} variant="default" />
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
