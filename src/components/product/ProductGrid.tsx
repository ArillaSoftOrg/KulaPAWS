import { EmptyState } from "@/components/ui/EmptyState";
import { ProductCard } from "@/components/product/ProductCard";
import type { Product } from "@/data/products";

interface ProductGridProps {
  items: Product[];
  limit?: number;
}

export function ProductGrid({ items, limit }: ProductGridProps) {
  const visible = typeof limit === "number" ? items.slice(0, limit) : items;

  if (visible.length === 0) {
    return (
      <EmptyState
        title="Products are on the way"
        description="Real Kulapaws pet-care products will be listed here once confirmed."
      />
    );
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {visible.map((product) => (
        <ProductCard key={product.slug} product={product} />
      ))}
    </div>
  );
}
