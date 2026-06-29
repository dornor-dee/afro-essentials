import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <CartProvider>
        <WishlistProvider>
          <Navbar />
          <main className="grow">{children}</main>
          <Footer />
        </WishlistProvider>
      </CartProvider>
    </>
  );
}
