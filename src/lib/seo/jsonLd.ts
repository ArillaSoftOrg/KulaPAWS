import { getSiteUrl } from "@/lib/seo/siteUrl";

export interface BreadcrumbItem {
  name: string;
  path: string;
}

export function buildBreadcrumbList(items: BreadcrumbItem[]) {
  const siteUrl = getSiteUrl();

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${siteUrl}${item.path}`,
    })),
  };
}

export interface ServiceJsonLdInput {
  name: string;
  description: string;
  path: string;
}

// Only fields backed by real, confirmed data: name/description come from
// the same live-resolved service record as the page's own metadata, and
// "provider" identifies Kulapaws by name only. No price, offers, ratings,
// reviews, address, service area, or opening hours — none of that is
// confirmed business data yet (see src/data/business.ts).
export function buildServiceJsonLd({ name, description, path }: ServiceJsonLdInput) {
  const siteUrl = getSiteUrl();

  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    description,
    url: `${siteUrl}${path}`,
    provider: {
      "@type": "Organization",
      name: "Kulapaws",
    },
  };
}
