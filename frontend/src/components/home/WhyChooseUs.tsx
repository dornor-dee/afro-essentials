import { CheckCircle2 } from "lucide-react";

export default function WhyChooseUs() {
  const features = [
    "Authentic Ghanaian Fabrics",
    "Directly Sourced From Ghana",
    "Worldwide Shipping",
    "Premium Quality Materials",
    "Secure Payments",
    "Wholesale Orders Available",
  ];

  return (
    <section className="bg-white py-16 border-t border-gray-100">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-black">
            The Afro Essentials Difference
          </h2>
        </div>

        <div className="grid gap-y-6 gap-x-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div key={feature} className="flex items-center gap-4 p-2">
              <CheckCircle2 className="h-6 w-6 text-[#d4af37] shrink-0" />
              <h3 className="text-lg font-medium text-gray-800">{feature}</h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
