"use client";

import { useState, useMemo, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { products } from "@/data/products";
import ProductCard from "@/components/products/ProductCard";
import { Search, SlidersHorizontal, Sparkles, X } from "lucide-react";

const CATEGORIES = [
  "All",
  "Kente",
  "Ankara",
  "Dutch Wax",
  "Lace",
  "Accessories",
];

function ShopContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const urlCategory = searchParams.get("category");
  const selectedCategory =
    urlCategory &&
    CATEGORIES.map((c) => c.toLowerCase()).includes(urlCategory.toLowerCase())
      ? CATEGORIES.find((c) => c.toLowerCase() === urlCategory.toLowerCase()) ||
        "All"
      : "All";

  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<
    "featured" | "price-asc" | "price-desc" | "name"
  >("featured");
  const [priceRange, setPriceRange] = useState<
    "all" | "under50" | "50-100" | "over100"
  >("all");

  const handleCategoryChange = (cat: string) => {
    if (cat === "All") {
      router.push("/shop");
    } else {
      router.push(`/shop?category=${encodeURIComponent(cat)}`);
    }
  };

  const filteredProducts = useMemo(() => {
    return products
      .filter((product) => {
        // Category filter
        if (
          selectedCategory !== "All" &&
          product.category.toLowerCase() !== selectedCategory.toLowerCase()
        ) {
          return false;
        }

        // Price range filter
        if (priceRange === "under50" && product.price >= 50) return false;
        if (
          priceRange === "50-100" &&
          (product.price < 50 || product.price > 100)
        )
          return false;
        if (priceRange === "over100" && product.price <= 100) return false;

        // Search text filter
        if (search.trim()) {
          const q = search.toLowerCase();
          const match =
            product.name.toLowerCase().includes(q) ||
            product.brand.toLowerCase().includes(q) ||
            product.description.toLowerCase().includes(q) ||
            product.category.toLowerCase().includes(q);
          if (!match) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "price-asc") return a.price - b.price;
        if (sortBy === "price-desc") return b.price - a.price;
        if (sortBy === "name") return a.name.localeCompare(b.name);
        return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
      });
  }, [selectedCategory, priceRange, search, sortBy]);

  return (
    <main className="min-h-screen bg-[#f7f3e8] text-black pt-10 md:pt-15">
      <div className="sticky top-14.5 z-30 border-b border-black/10 bg-[#f7f3e8]/95 backdrop-blur-md px-4 py-4">
        <div className="mx-auto max-w-7xl space-y-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 [-ms-overflow-style:none] scrollbar-none [&::-webkit-scrollbar]:hidden">
            {CATEGORIES.map((cat) => {
              const isActive = selectedCategory === cat;
              const count =
                cat === "All"
                  ? products.length
                  : products.filter(
                      (p) => p.category.toLowerCase() === cat.toLowerCase(),
                    ).length;

              return (
                <button
                  key={cat}
                  onClick={() => handleCategoryChange(cat)}
                  className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    isActive
                      ? "bg-black text-[#d4af37] shadow-md ring-2 ring-[#d4af37]/40"
                      : "bg-white text-gray-700 hover:bg-black/5 hover:text-black border border-black/5"
                  }`}
                >
                  {cat}
                  <span
                    className={`rounded-full px-1.5 py-0.2 text-[11px] font-bold ${
                      isActive
                        ? "bg-[#d4af37] text-black"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search
                size={18}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by pattern, brand, color..."
                className="w-full rounded-xl border border-black/10 bg-white py-2.5 pl-10 pr-9 text-sm text-black placeholder:text-gray-400 focus:border-[#d4af37] focus:outline-none focus:ring-1 focus:ring-[#d4af37]"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            <div className="flex items-center gap-2.5">
              <div className="flex items-center gap-1.5 bg-white border border-black/10 rounded-xl px-3 py-1.5 text-xs font-medium text-gray-700">
                <SlidersHorizontal size={14} className="text-gray-400" />
                <span className="hidden sm:inline">Price:</span>
                <select
                  value={priceRange}
                  onChange={(e) =>
                    setPriceRange(
                      e.target.value as
                        | "all"
                        | "under50"
                        | "50-100"
                        | "over100",
                    )
                  }
                  className="bg-transparent font-semibold text-black focus:outline-none cursor-pointer"
                >
                  <option value="all">All Prices</option>
                  <option value="under50">Under $50</option>
                  <option value="50-100">$50 – $100</option>
                  <option value="over100">$100+</option>
                </select>
              </div>

              <div className="flex items-center gap-1.5 bg-white border border-black/10 rounded-xl px-3 py-1.5 text-xs font-medium text-gray-700">
                <span className="hidden sm:inline">Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e) =>
                    setSortBy(
                      e.target.value as
                        | "featured"
                        | "price-asc"
                        | "price-desc"
                        | "name",
                    )
                  }
                  className="bg-transparent font-semibold text-black focus:outline-none cursor-pointer"
                >
                  <option value="featured">Featured First</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="name">Name (A-Z)</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      <section className="mx-auto max-w-7xl px-3 sm:px-4 md:px-6 py-8 md:py-14">
        {filteredProducts.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-black/15 bg-white p-8 sm:p-12 text-center shadow-xs">
            <h3 className="text-xl font-bold text-black">
              No fabrics match your criteria
            </h3>
            <p className="mt-2 text-sm text-gray-500">
              Try adjusting your search query, price filter, or category
              selection.
            </p>
            <button
              onClick={() => {
                setSearch("");
                setPriceRange("all");
                handleCategoryChange("All");
              }}
              className="mt-6 rounded-xl bg-black px-5 py-2.5 text-sm font-semibold text-[#d4af37] hover:bg-black/80 transition"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 md:gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                variant="default"
              />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default function ShopPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-[#f7f3e8] p-10 flex items-center justify-center">
          <div className="text-gray-500 font-medium">Loading fabrics...</div>
        </main>
      }
    >
      <ShopContent />
    </Suspense>
  );
}
