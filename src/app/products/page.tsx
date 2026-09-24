import type { Metadata } from "next";
import { ProductsIndexContent } from "@/components/content/ProductsIndexContent";
import { getProductsServer } from "@/lib/content/getProductsServer";

// No real product has been confirmed as published yet (README.md §23
// "Products") — noindex until one is. Follow stays true so this isn't a
// crawl dead end. Not tied to whether the Supabase table happens to be
// empty right now; this is a content-readiness decision, not a data-source
// one, and stays a manual flip once a real product ships.
export const metadata: Metadata = {
  title: "Pet-Care Products",
  description: "Kulapaws' lineup of pet-care products for the home.",
  alternates: { canonical: "/products" },
  robots: { index: false, follow: true },
};

export default async function ProductsPage() {
  // Server-resolved (see getProductsServer.ts) so the real, published
  // products are in the initial HTML instead of only appearing once
  // ProductGridLive's own client-side fetch resolves. ProductGridLive
  // still re-fetches after mount via useLiveContent — this only changes
  // what it starts from.
  const publishedProducts = await getProductsServer();

  return <ProductsIndexContent defaultProducts={publishedProducts} />;
}
