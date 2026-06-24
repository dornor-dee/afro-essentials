import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/home/Hero";
import FeaturedCollections from "@/components/home/FeaturedCollections";
import BestSellers from "@/components/home/BestSellers";
import WhyChooseUs from "@/components/home/WhyChooseUs";

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />
      <Hero />
      <FeaturedCollections />
      <BestSellers />
      <WhyChooseUs />
      <Footer />
    </main>

  );
}