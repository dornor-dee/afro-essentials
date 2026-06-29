"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingBag, Search, Menu, X } from "lucide-react"; // Added X icon
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";

const navLinks = ["Home", "Shop", "Kente", "Ankara", "Lace", "Accessories"];

export default function Navbar() {
  const path = usePathname();
  const router = useRouter();
  const { itemCount } = useCart();
  const { items: wishlistItems } = useWishlist();
  const [compact, setCompact] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isCompact = path === "/" ? compact : true;

  // 1. State to track if search is open and what the user typed
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // 2. Handle the enter key / form submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery("");
    }
  };

  const handleSearchToggle = () => {
    if (isSearchOpen) {
      if (searchQuery.trim()) {
        router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
        setIsSearchOpen(false);
        setSearchQuery("");
      } else {
        setIsSearchOpen(false);
      }
      return;
    }

    setIsSearchOpen(true);
  };

  useEffect(() => {
    if (path !== "/") return;

    const handleScroll = () => {
      const triggerPoint = window.innerHeight - 60;

      if (window.scrollY > window.innerHeight) {
        setCompact(true);
      } else if (window.scrollY < triggerPoint - 40) {
        setCompact(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [path]);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0a0a0a]/95 shadow-xl backdrop-blur">
      <div
        className={`bg-[#d4af37] text-center text-sm font-semibold text-black transition-all duration-300 ease-in-out overflow-hidden
          ${isCompact ? "max-h-0 opacity-0 py-0" : "max-h-12 opacity-100 py-2"}`}
      >
        🇬🇭 Authentic Ghanaian Fabrics • Worldwide Shipping Available
      </div>
      <nav
        className={`mx-auto flex max-w-7xl items-center justify-between px-6 transition-all duration-300 ease-in-out
          ${isCompact ? "py-0.5 md:py-2" : "py-0.5 md:py-4"}`}
      >
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/logo.png"
            alt="Afro Essentials Logo"
            width={isCompact ? 60 : 80}
            height={isCompact ? 60 : 80}
          />
          <div>
            <h1 className="hidden md:block text-lg font-bold tracking-wide text-[#d4af37]">
              Afro Essentials
            </h1>
            <p className="hidden text-sm text-[#d4af37]/80 md:block">
              Authentic Kente & African Prints
            </p>
          </div>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link}
              href={link === "Home" ? "/" : `/${link.toLowerCase()}`}
              className="text-sm font-medium text-white/80 transition hover:text-[#d4af37]"
            >
              {link}
            </Link>
          ))}
        </div>

        {/* Right Side Icons & Search */}
        <div className="flex items-center gap-4">
          <div className="flex items-center relative">
            {/* The expanding search input */}
            <form onSubmit={handleSearch} className="flex items-center">
              <input
                type="text"
                placeholder="Search fabrics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`
                  transition-all duration-300 ease-in-out overflow-hidden
                  rounded-full bg-black/60 text-sm text-white placeholder-white/50 backdrop-blur-md
                  focus:outline-none focus:ring-1 focus:ring-[#d4af37]
                  ${isSearchOpen 
                    ? "w-48 md:w-64 px-4 py-1.5 opacity-100 mr-2 border border-[#d4af37]/50" 
                    : "w-0 px-0 py-0 opacity-0 border-transparent"
                  }
                `}
                autoFocus={isSearchOpen}
              />
            </form>

            {/* The toggle button */}
            <button 
              onClick={handleSearchToggle}
              className="p-1 text-white/80 transition-colors hover:text-[#d4af37] z-10"
              aria-label={isSearchOpen ? "Search products" : "Open search"}
            >
              {isSearchOpen ? <X size={20} /> : <Search size={20} />}
            </button>
          </div>

          <Link href="/wishlist" className="relative flex items-center">
            <span className="text-sm font-semibold text-white/80 transition-colors hover:text-[#d4af37]">
              Wishlist
            </span>
            {wishlistItems.length > 0 ? (
              <span className="ml-1 rounded-full bg-[#d4af37] px-2 py-0.5 text-[10px] font-bold text-black">
                {wishlistItems.length}
              </span>
            ) : null}
          </Link>

          <Link href="/cart" className="relative flex items-center">
            <ShoppingBag size={20} className="cursor-pointer text-white/80 transition-colors hover:text-[#d4af37]" />
            {itemCount > 0 ? (
              <span className="ml-1 rounded-full bg-[#d4af37] px-2 py-0.5 text-[10px] font-bold text-black">
                {itemCount}
              </span>
            ) : null}
          </Link>
          <button
            type="button"
            onClick={() => setMobileMenuOpen((open) => !open)}
            className="rounded-full p-2 text-white/80 transition-colors hover:text-[#d4af37] md:hidden"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {mobileMenuOpen ? (
        <div className="border-t border-white/10 bg-[#0a0a0a] px-6 py-6 md:hidden">
          <div className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <Link
                key={link}
                href={link === "Home" ? "/" : `/${link.toLowerCase()}`}
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-lg px-3 py-2 text-sm font-medium text-white/80 transition hover:bg-white/10 hover:text-[#d4af37]"
              >
                {link}
              </Link>
            ))}
            <Link
              href="/wishlist"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-lg px-3 py-2 text-sm font-medium text-white/80 transition hover:bg-white/10 hover:text-[#d4af37]"
            >
              Wishlist
            </Link>
            <Link
              href="/cart"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-lg px-3 py-2 text-sm font-medium text-white/80 transition hover:bg-white/10 hover:text-[#d4af37]"
            >
              Cart
            </Link>
          </div>
        </div>
      ) : null}
    </header>
  );
}