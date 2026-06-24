export interface Product {
  id: string;
  name: string;
  slug: string;
  brand: string;
  category: string;
  price: number;
  image: string;
  description: string;
  featured?: boolean;
}