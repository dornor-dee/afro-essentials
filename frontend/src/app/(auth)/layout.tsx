import { Cormorant_Garamond, Syne } from "next/font/google";
import Image from "next/image";
import Link from "next/link";

const cormorantGaramond = Cormorant_Garamond({
  variable: "--font-cormorant-garamond",
  subsets: ["latin"],
  weight: ["700"],
});

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["700"],
});

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen w-screen lg:grid grid-cols-2 bg-[#f8f5ee]">
      <div className="hidden lg:block relative h-full w-full rounded-r-[50px] overflow-hidden p-1.5 border-r-2 border-[#d4af37] shadow-lg">
        <Image
          src={"/auth-image.jpeg"}
          alt="Auth Background"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/10 to-transparent" />
        <div
          className={`${cormorantGaramond.className} text-[#f8f5ee] text-5xl font-bold absolute bottom-10 right-10 text-shadow-sm text-shadow-[#d4af37]`}
        >
          <p>Authentic</p>
          <p>Ghanaian</p>
          <p>Fabrics</p>
        </div>
        <Link href="/" className={`absolute top-5 left-5`}>
          <Image
            src={"/logo.png"}
            alt="Logo"
            width={100}
            height={100}
            className="object-contain"
          />
        </Link>
      </div>
      <div className="flex h-full items-center justify-center w-[90%] md:w-full mx-auto">
        {children}
      </div>
    </div>
  );
}
