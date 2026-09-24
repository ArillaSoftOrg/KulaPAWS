import { EmptyState } from "@/components/ui/EmptyState";
import { ProductCard } from "@/components/product/ProductCard";
import { DEFAULT_LOCALE, type Locale } from "@/lib/i18n/config";
import type { Product } from "@/data/products";

interface ProductGridProps {
  items: Product[];
  limit?: number;
  emptyTitle?: string;
  emptyDescription?: string;
  // Defaults to English so any caller that doesn't localize (none today
  // besides ProductGridLive/HomeContent, which always do) still links to
  // the unprefixed English URL exactly as before.
  locale?: Locale;
}

export function ProductGrid({
  items,
  limit,
  emptyTitle = "Products are on the way",
  emptyDescription = "Real Kulapaws pet-care products will be listed here once confirmed.",
  locale = DEFAULT_LOCALE,
}: ProductGridProps) {
  const visible = typeof limit === "number" ? items.slice(0, limit) : items;

  if (visible.length === 0) {
    return <EmptyState title={emptyTitle} description={emptyDescription} />;
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {visible.map((product) => (
        <ProductCard key={product.slug} product={product} locale={locale} />
      ))}
    </div>
  );
}
