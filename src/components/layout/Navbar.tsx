import Image from "next/image";
import Link from "next/link";
import { ShoppingBag, Search, Menu } from "lucide-react";

const navLinks = [
  "Home",
  "Shop",
  "Kente",
  "Ankara",
  "Lace",
  "Accessories",
];
export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0a0a0a]/95 shadow-xl backdrop-blur">
        <div className="bg-[#d4af37] py-2 text-center text-sm font-semibold text-black">
     🇬🇭 Authentic Ghanaian Fabrics • Worldwide Shipping Available
      </div>
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-3">
          <Image src="/logo.png" alt="Afro Essentials Logo" width={80} height={80} />
          <div>
            <h1 className="text-lg font-bold tracking-wide text-[#d4af37]">
              Afro Essentials
            </h1>
            <p className="text-sm text-[#d4af37]/80">
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