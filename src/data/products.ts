import { Product } from "@/types/product";

export const products: Product[] = [
  {
    id: "1",
    name: "Royal Asante Kente",
    slug: "royal-asante-kente",
    brand: "Asante Kente",
    category: "Kente",
    price: 180,
    image: "/products/kente1.jpg",
    description: "Authentic handwoven Asante Kente cloth.",
    featured: true,
  },
  {
    id: "2",
    name: "GTP Premium Print",
    slug: "gtp-premium-print",
    brand: "GTP",
    category: "African Print",
    price: 45,
    image: "/products/gtp1.jpg",
    description: "Premium Ghanaian wax print fabric.",
    featured: true,
  },
  {
    id: "3",
    name: "Vlisco Holland Gold",
    slug: "vlisco-holland-gold",
    brand: "Vlisco",
    category: "Dutch Wax",
    price: 95,
    image: "/products/vlisco1.jpg",
    description: "Luxury Dutch wax fabric.",
    featured: true,
  },
];