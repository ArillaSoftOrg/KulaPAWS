import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { ProductGrid } from "@/components/product/ProductGrid";
import { products } from "@/data/products";

// src/data/products.ts is currently empty — no real product has been
// confirmed yet, so this stays scoped to "coming soon" rather than the
// on-page copy's "offers" wording (that's a content decision for a later
// pass, not a metadata one).
export const metadata: Metadata = {
  title: "Pet-Care Products",
  description: "Kulapaws' lineup of pet-care products for the home is being finalized and will be listed here soon.",
  alternates: { canonical: "/products" },
};

export default function ProductsPage() {
  return (
    <>
      <PageHeader
        title="Pet-care products"
        description="Alongside mobile grooming, Kulapaws offers pet-care products for the home."
      />

      <Section tone="background">
        <Container size="wide">
          <ProductGrid items={products} />
        </Container>
      </Section>
    </>
  );
}
