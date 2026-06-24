import Hero from "@/components/home/Hero";
import FeaturedCollections from "@/components/home/FeaturedCollections";
import BestSellers from "@/components/home/BestSellers";
import WhyChooseUs from "@/components/home/WhyChooseUs";

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white">
      <Hero />
      <FeaturedCollections />
      <BestSellers />
      <WhyChooseUs />
    </main>
  );
}
