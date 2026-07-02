"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingBag, Search, Heart, User, X } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import UserMenu from "../auth/UserMenu";

const navLinks = ["Home", "Shop", "Kente", "Ankara", "Lace", "Accessories"];

export default function Navbar() {
  const path = usePathname();
  const router = useRouter();
  const { itemCount } = useCart();
  const { items: wishlistItems } = useWishlist();
  const [compact, setCompact] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isCompact = path === "/" ? compact : true;
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [cartBumping, setCartBumping] = useState(false);
  const [wishlistBumping, setWishlistBumping] = useState(false);
  const prevItemCount = useRef(itemCount);
  const prevWishlistCount = useRef(wishlistItems.length);
  const isReadyToAnimate = useRef(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      isReadyToAnimate.current = true;
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isReadyToAnimate.current && itemCount > prevItemCount.current) {
      setCartBumping(true);
      const timer = setTimeout(() => setCartBumping(false), 400);
      return () => clearTimeout(timer);
    }
    prevItemCount.current = itemCount;
  }, [itemCount]);

  useEffect(() => {
    if (
      isReadyToAnimate.current &&
      wishlistItems.length > prevWishlistCount.current
    ) {
      setWishlistBumping(true);
      const timer = setTimeout(() => setWishlistBumping(false), 400);
      return () => clearTimeout(timer);
    }
    prevWishlistCount.current = wishlistItems.length;
  }, [wishlistItems.length]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery("");
    }
  };

  const handleSearchToggle = () => {
    if (isSearchOpen && searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
    setIsSearchOpen(!isSearchOpen);
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
    return () => window.removeEventListener("scroll", handleScroll);
  }, [path]);

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0a0a0a]/95 shadow-xl backdrop-blur">
        <div
          className={`bg-[#d4af37] block text-center text-xs md:text-sm font-semibold text-black transition-all duration-300 ease-in-out overflow-hidden
            ${isCompact ? "max-h-0 opacity-0 py-0" : "max-h-12 opacity-100 py-2"}`}
        >
          🇬🇭 Authentic Ghanaian Fabrics • Worldwide Shipping Available
        </div>

        <nav
          className={`mx-auto relative flex max-w-7xl items-center justify-between px-3 md:px-6 transition-all duration-300 ease-in-out
            ${isCompact ? "py-1 md:py-2" : "py-2 md:py-4"}`}
        >
          <div className={`items-center gap-2 flex `}>
            <button
              type="button"
              onClick={() => setMobileMenuOpen((open) => !open)}
              className={`relative z-50 flex h-8 w-8 flex-col items-center justify-center gap-1.25 text-white/80 transition-colors hover:text-[#d4af37] md:hidden ${isSearchOpen ? "opacity-0 pointer-events-none" : "opacity-100 pointer-events-auto"}`}
            >
              <span
                className={`block h-0.5 w-6 bg-current transition-all duration-300 ease-in-out ${mobileMenuOpen ? "translate-y-1.75 rotate-45" : ""}`}
              />
              <span
                className={`block h-0.5 w-6 bg-current transition-all duration-300 ease-in-out ${mobileMenuOpen ? "opacity-0" : "opacity-100"}`}
              />
              <span
                className={`block h-0.5 w-6 bg-current transition-all duration-300 ease-in-out ${mobileMenuOpen ? "-translate-y-1.75 -rotate-45" : ""}`}
              />
            </button>

            <Link href="/" className="flex items-center gap-3">
              <Image
                src="/logo.png"
                alt="Afro Essentials Logo"
                width={isCompact ? 50 : 70}
                height={isCompact ? 50 : 70}
                className="transition-all duration-300"
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
          </div>

          <div className="hidden items-center gap-8 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link}
                href={link === "Home" ? "/" : `/${link.toLowerCase()}`}
                className="relative text-sm font-medium text-white/80 transition hover:text-[#d4af37] after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-0 after:bg-[#d4af37] after:transition-all after:duration-300 hover:after:w-full"
              >
                {link}
              </Link>
            ))}
          </div>

          <div className={`flex items-center gap-3 md:gap-4`}>
            <div className={`flex items-center`}>
              <form
                onSubmit={handleSearch}
                className={`flex items-center absolute md:static left-0 top-0 pl-2 md:pl-0 w-full h-full bg-[#0a0a0a]/95 ${isSearchOpen ? "" : "opacity-0 pointer-events-none"}`}
              >
                <input
                  type="text"
                  placeholder="Search fabrics..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`
                    transition-all delay-75 md:delay-[0] duration-300 ease-in-out overflow-hidden
                    rounded-full bg-black/60 text-sm text-white placeholder-white/50 backdrop-blur-md
                    focus:outline-none focus:ring-1 focus:ring-[#d4af37]
                    ${
                      isSearchOpen
                        ? "w-full md:w-64 px-4 py-2 opacity-100 mr-2 border border-[#d4af37]/50"
                        : "w-0 px-0 py-0 opacity-0 border-transparent"
                    }
                  `}
                  autoFocus={isSearchOpen}
                />
              </form>

              <button
                onClick={handleSearchToggle}
                className="relative flex h-8 w-8 items-center justify-center text-white/80 transition-colors hover:text-[#d4af37] z-10"
              >
                <Search
                  size={20}
                  className={`absolute transition-all duration-550 md:duration-300 ease-in-out ${isSearchOpen ? "rotate-90 scale-0 opacity-0" : "rotate-0 scale-100 opacity-100"}`}
                />
                <X
                  size={20}
                  className={`absolute transition-all duration-550 md:duration-300 ease-in-out ${isSearchOpen ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-0 opacity-0"}`}
                />
              </button>
            </div>

            <div
              className={`items-center gap-4 ${isSearchOpen ? "hidden md:flex" : "flex"}`}
            >
              <Link
                href="/wishlist"
                className="relative hidden md:flex items-center group"
              >
                <Heart
                  size={20}
                  className={`cursor-pointer transition-all duration-300 group-hover:text-[#d4af37] ${
                    wishlistBumping
                      ? "scale-125 fill-[#d4af37] text-[#d4af37] ease-[cubic-bezier(0.68,-0.6,0.32,1.6)]"
                      : "text-white/80 scale-100 ease-in-out"
                  }`}
                />
                {wishlistItems.length > 0 ? (
                  <span
                    className={`ml-1 absolute -top-2 -right-2 rounded-full bg-[#d4af37] px-1.5 py-0.5 text-[10px] font-bold text-black transition-transform duration-300 ${wishlistBumping ? "scale-125 ease-[cubic-bezier(0.68,-0.6,0.32,1.6)]" : "scale-100 ease-in-out"}`}
                  >
                    {wishlistItems.length}
                  </span>
                ) : null}
              </Link>

              <Link href="/cart" className="relative flex items-center group">
                <ShoppingBag
                  size={20}
                  className={`cursor-pointer transition-all duration-300 group-hover:text-[#d4af37] ${
                    cartBumping
                      ? "scale-125 -rotate-12 text-[#d4af37] ease-[cubic-bezier(0.68,-0.6,0.32,1.6)]"
                      : "text-white/80 scale-100 rotate-0 ease-in-out"
                  }`}
                />
                {itemCount > 0 ? (
                  <span
                    className={`ml-1 absolute -top-2 -right-2 rounded-full bg-[#d4af37] px-1.5 py-0.5 text-[10px] font-bold text-black transition-transform duration-300 ${cartBumping ? "scale-125 ease-[cubic-bezier(0.68,-0.6,0.32,1.6)]" : "scale-100 ease-in-out"}`}
                  >
                    {itemCount}
                  </span>
                ) : null}
              </Link>

              <UserMenu />
            </div>
          </div>
        </nav>
      </header>

      <div
        className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
          mobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setMobileMenuOpen(false)}
        aria-hidden="true"
      />

      <div
        className={`fixed top-0 left-0 bottom-0 z-40 flex w-64 flex-col border-r border-white/10 bg-[#0a0a0a] pt-24 px-6 pb-6 transition-transform duration-300 ease-in-out md:hidden ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col gap-2">
          {navLinks.map((link, index) => (
            <Link
              key={link}
              href={link === "Home" ? "/" : `/${link.toLowerCase()}`}
              onClick={() => setMobileMenuOpen(false)}
              style={{ transitionDelay: `${index * 50}ms` }}
              className={`rounded-lg px-3 py-3 text-sm font-medium text-white/80 transition-all hover:bg-white/10 hover:text-[#d4af37] ${
                mobileMenuOpen
                  ? "translate-x-0 opacity-100"
                  : "-translate-x-4 opacity-0"
              }`}
            >
              {link}
            </Link>
          ))}
          <div className="my-2 border-t border-white/10" />
          <Link
            href="/wishlist"
            onClick={() => setMobileMenuOpen(false)}
            className={`flex items-center justify-between rounded-lg px-3 py-3 text-sm font-medium text-white/80 transition-all hover:bg-white/10 hover:text-[#d4af37] delay-300 ${
              mobileMenuOpen
                ? "translate-x-0 opacity-100"
                : "-translate-x-4 opacity-0"
            }`}
          >
            Wishlist
            {wishlistItems.length > 0 && (
              <span className="rounded-full bg-[#d4af37] px-2 py-0.5 text-[10px] font-bold text-black">
                {wishlistItems.length}
              </span>
            )}
          </Link>
          <Link
            href="/cart"
            onClick={() => setMobileMenuOpen(false)}
            className={`flex items-center justify-between rounded-lg px-3 py-3 text-sm font-medium text-white/80 transition-all hover:bg-white/10 hover:text-[#d4af37] delay-350 ${
              mobileMenuOpen
                ? "translate-x-0 opacity-100"
                : "-translate-x-4 opacity-0"
            }`}
          >
            Cart
            {itemCount > 0 && (
              <span className="rounded-full bg-[#d4af37] px-2 py-0.5 text-[10px] font-bold text-black">
                {itemCount}
              </span>
            )}
          </Link>
        </div>
      </div>
    </>
  );
}
