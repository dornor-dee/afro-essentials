import Image from "next/image";
import Link from "next/link";

const collections = [
  {
    title: "Asante Kente",
    description: "Authentic handwoven cloth for traditional ceremonies.",
    image: "/auth-image.jpeg",
  },
  {
    title: "GTP Prints",
    description: "Vibrant Ghanaian wax prints of high durability.",
    image: "/auth-image.jpeg",
  },
  {
    title: "Vlisco Holland",
    description: "Premium Dutch wax featuring luxury designs.",
    image: "/auth-image.jpeg",
  },
  {
    title: "Dutch Wax",
    description: "Elegant African print fabrics for special occasions.",
    image: "/auth-image.jpeg",
  },
  {
    title: "Hitarget",
    description: "Affordable and stylish African print fabrics.",
    image: "/auth-image.jpeg",
  },
  {
    title: "ABC SUPER",
    description: "Premium ABC fabrics known for timeless designs.",
    image: "/auth-image.jpeg",
  },
];

export default function FeaturedCollections() {
  return (
    <section className="bg-[#f8f5ee] py-20 overflow-hidden">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 text-center px-4 md:px-6">
          <p className="font-semibold uppercase tracking-[0.3em] text-[#d4af37]">
            Our Collections
          </p>
          <h2 className="mt-4 text-3xl font-bold text-black md:text-5xl">
            Authentic Fabrics From Ghana
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-gray-600">
            Explore our carefully selected collection of premium African fabrics
            and authentic Ghanaian textiles.
          </p>
        </div>

        <div
          className="flex md:grid overflow-x-auto md:overflow-visible snap-x snap-mandatory gap-3 md:gap-6 ml-2 md:ml-0 px-4 md:px-6 md:grid-cols-2 lg:grid-cols-3
          [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] scrollbar-none"
        >
          {collections.map((item) => (
            <Link
              href="#"
              key={item.title}
              className="group relative flex h-65 md:h-80 w-[75vw] md:w-auto shrink-0 md:shrink snap-start flex-col justify-end overflow-hidden rounded-2xl bg-gray-200 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <Image
                src={item.image}
                alt={item.title + "image"}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                objectFit="cover"
                className="absolute z-10 object-cover"
              />

              <div className="absolute inset-0 z-10 bg-linear-to-t from-black/80 to-transparent"></div>

              <div className="relative z-20 p-3 md:p-6">
                <h3 className="text-2xl font-bold text-white mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-200 text-sm mb-4 line-clamp-2">
                  {item.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
