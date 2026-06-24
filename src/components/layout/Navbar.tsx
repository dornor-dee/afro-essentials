"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingBag, Search, Menu } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const navLinks = ["Home", "Shop", "Kente", "Ankara", "Lace", "Accessories"];
export default function Navbar() {
  const path = usePathname();
  const [compact, setCompact] = useState(false);
  const isCompact = path === "/" ? compact : true;

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
            <p className="hidden md:blocktext-sm text-[#d4af37]/80">
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

        <div className="flex items-center gap-4">
          <Search size={20} className="text-white/80" />
          <ShoppingBag size={20} className="text-white/80" />
          <Menu size={24} className="md:hidden text-white/80" />
        </div>
      </nav>
    </header>
  );
}
