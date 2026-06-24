import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-linear-to-br from-black via-[#1a1208] to-black">
      <div className="mx-auto grid min-h-[85vh] max-w-7xl items-center gap-12 px-6 py-20 md:grid-cols-2">
        <div>
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.35em] text-[#d4af37]">
            Authentic Ghanaian Fabrics
          </p>

          <h2 className="max-w-3xl text-5xl font-extrabold leading-tight md:text-7xl">
            Kente & African Prints for Every Occasion
          </h2>

          <p className="mt-6 max-w-xl text-lg leading-8 text-white/70">
            Shop premium Kente, Ankara, lace, head wraps, and cultural fashion
            sourced from Ghana and delivered worldwide.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/shop"
              className="rounded-full bg-[#d4af37] px-7 py-3 font-semibold text-black transition hover:bg-[#f1ce63]"
            >
              Shop Collection
            </Link>

            <Link
              href="/kente"
              className="rounded-full border border-white/20 px-7 py-3 font-semibold text-white transition hover:border-[#d4af37] hover:text-[#d4af37]"
            >
              Explore Kente
            </Link>
          </div>
        </div>

        <div className="hidden md:flex justify-center">
          <Image
            src="/logo.png"
            alt="Afro Essentials"
            width={520}
            height={520}
            priority
            className="drop-shadow-2xl"
          />
        </div>
      </div>
    </section>
  );
}
