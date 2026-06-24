const collections = [
  {
    title: "Asante Kente",
    description:
      "Authentic handwoven Kente cloth from Ghana, perfect for weddings, graduations, and traditional ceremonies.",
  },
  {
    title: "GTP Prints",
    description:
      "High-quality Ghanaian wax prints known for vibrant colors, durability, and cultural significance.",
  },
  {
    title: "Vlisco Holland",
    description:
      "Premium Dutch wax fabrics featuring luxury designs and world-renowned craftsmanship.",
  },
  {
    title: "Dutch Wax",
    description:
      "Elegant African print fabrics suitable for fashion designers, special occasions, and everyday wear.",
  },
  {
    title: "Hitarget",
    description:
      "Affordable and stylish African print fabrics with bold patterns and rich colors.",
  },
  {
    title: "Hollander",
    description:
      "Classic African fabric collections loved for quality, comfort, and beautiful prints.",
  },
  {
    title: "ABC SUPER",
    description:
      "Premium ABC fabrics known throughout West Africa for quality, prestige, and timeless designs.",
  },
];

export default function FeaturedCollections() {
  return (
    <section className="bg-[#f8f5ee] px-6 py-20">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 text-center">
          <p className="font-semibold uppercase tracking-[0.3em] text-[#d4af37]">
            Our Collections
          </p>

          <h2 className="mt-4 text-4xl font-bold text-black md:text-5xl">
            Authentic Fabrics From Ghana
          </h2>

          <p className="mx-auto mt-4 max-w-3xl text-gray-600">
            Explore our carefully selected collection of premium African fabrics
            and authentic Ghanaian textiles.
          </p>
        </div>

       <div className="mx-auto grid max-w-7xl gap-8 px-6 md:grid-cols-2 lg:grid-cols-3">
  {collections.map((item) => (
    <div
      key={item.title}
      className="rounded-2xl bg-white p-8 shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
    >
      <h3 className="mb-4 text-2xl font-bold text-[#111111]">
        {item.title}
      </h3>

      <p className="leading-7 text-gray-600">
        {item.description}
      </p>

      <button className="mt-6 font-semibold text-[#d4af37] hover:text-[#b89329]">
        Shop Collection →
      </button>
    </div>
  ))}
</div>
      </div>
    </section>
  );
}