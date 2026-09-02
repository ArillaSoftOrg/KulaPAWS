export interface Product {
  slug: string;
  name: string;
  shortDescription: string;
  imageSrc?: string;
  price?: string;
}

// Intentionally empty: no real product data has been confirmed yet.
// Do not add placeholder/demo products here — see README.md §7 and §23.
export const products: Product[] = [];
