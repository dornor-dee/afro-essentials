export interface Product {
  id: string;
  name: string;
  slug: string;
  brand: string;
  category: string;
  price: number;
  image: string;
  images?: string[];
  description: string;
  featured?: boolean;
  yardage?: string;
  inStock?: boolean;
  rating?: number;
  reviewsCount?: number;
  origin?: string;
}