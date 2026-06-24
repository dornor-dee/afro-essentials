export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black px-6 py-10 text-white">
      <div className="mx-auto flex max-w-7xl flex-col justify-between gap-4 md:flex-row">
        <div>
          <h2 className="text-xl font-bold text-[#d4af37]">Afro Essentials</h2>
          <p className="mt-2 text-sm text-white/60">From Ghana to the World.</p>
        </div>

        <p className="text-sm text-white/50" suppressHydrationWarning>
          © {new Date().getFullYear()} Afro Essentials. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
