import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { FaqSectionsLive } from "@/components/content/FaqSectionsLive";
import { faqs } from "@/data/faqs";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildBreadcrumbList } from "@/lib/seo/jsonLd";
import { OG_IMAGE, OG_SITE_DEFAULTS, TWITTER_CARD, TWITTER_IMAGE } from "@/lib/seo/socialDefaults";

const TITLE = "Frequently Asked Questions";
const DESCRIPTION = "Answers about our services, mobile grooming, and products.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/faq" },
  openGraph: {
    ...OG_SITE_DEFAULTS,
    title: TITLE,
    description: DESCRIPTION,
    url: "/faq",
    images: [OG_IMAGE],
  },
  twitter: {
    card: TWITTER_CARD,
    title: TITLE,
    description: DESCRIPTION,
    images: [TWITTER_IMAGE],
  },
};

export default function FaqPage() {
  return (
    <>
      <JsonLd
        data={buildBreadcrumbList([
          { name: "Home", path: "/" },
          { name: "FAQ", path: "/faq" },
        ])}
      />
      <PageHeader
        title="Frequently asked questions"
        description="Answers about our services, mobile grooming, and products."
      />

      <FaqSectionsLive mode="grouped" defaultFaqs={faqs} tone="background" />
    </>
  );
}
