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
    <section className="bg-[#f8f5ee] py-24">
      <div className="mx-auto max-w-7xl px-6">
        <p className="text-center text-sm font-bold uppercase tracking-[0.3em] text-[#d4af37]">
          Why Choose Us
        </p>

        <h2 className="mt-4 text-center text-5xl font-bold text-black">
          The Afro Essentials Difference
        </h2>

        <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature}
              className="rounded-2xl bg-white p-8 shadow-md hover:shadow-xl transition"
            >
              <div className="mb-4 text-3xl text-[#d4af37]">✓</div>

              <h3 className="text-xl font-semibold text-black">
                {feature}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}