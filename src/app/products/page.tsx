import { PageHeader } from "@/components/layout/PageHeader";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { ProductGrid } from "@/components/product/ProductGrid";
import { products } from "@/data/products";

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
