import type { Metadata } from "next";
import { HomeContent } from "@/components/content/HomeContent";
import { services } from "@/data/services";
import { products } from "@/data/products";
import { faqs } from "@/data/faqs";
import { primaryCta } from "@/data/navigation";
import { homepage } from "@/data/homepage";

// Kept independent of homepage.hero.description (the on-page hero copy):
// that copy mentions pet-care products, but src/data/products.ts is
// currently empty (no real product has been confirmed), so metadata
// stays scoped to the one thing that's actually real today — mobile dog
// and cat grooming — rather than claiming a product offering that isn't
// live yet.
export const metadata: Metadata = {
  title: { absolute: "Kulapaws | Mobile Dog & Cat Grooming" },
  description:
    "Kulapaws offers mobile dog and cat grooming, delivered to your home so your pet can be groomed in a calm, familiar space.",
  alternates: { canonical: "/" },
};

export default function Home() {
  return (
    <HomeContent
      defaultHomepage={homepage}
      defaultServices={services}
      products={products}
      defaultFaqs={faqs}
      primaryCta={primaryCta}
    />
  );
}
