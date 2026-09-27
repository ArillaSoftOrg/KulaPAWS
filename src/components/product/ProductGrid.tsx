import Link from "next/link";
import { EmptyState } from "@/components/ui/EmptyState";
import { ProductCard } from "@/components/product/ProductCard";
import { buttonVariants } from "@/components/ui/Button";
import { buildLocalizedPath } from "@/lib/i18n/pathLocale";
import { getDictionary } from "@/lib/i18n/dictionaries";
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
  emptyDescription = "Real KulaPAWS pet-care products will be listed here once confirmed.",
  locale = DEFAULT_LOCALE,
}: ProductGridProps) {
  const visible = typeof limit === "number" ? items.slice(0, limit) : items;

  if (visible.length === 0) {
    const dictionary = getDictionary(locale);
    return (
      <EmptyState
        title={emptyTitle}
        description={emptyDescription}
        action={
          <Link
            href={buildLocalizedPath(locale, "/contact")}
            className={buttonVariants({ variant: "primary" })}
          >
            {dictionary.shared.contactUs}
          </Link>
        }
      />
    );
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 lg:gap-8">
      {visible.map((product) => (
        <ProductCard key={product.slug} product={product} locale={locale} />
      ))}
    </div>
  );
}
