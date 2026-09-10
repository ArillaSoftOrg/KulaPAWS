"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Hero } from "@/components/sections/Hero";
import { ServiceGridLive } from "@/components/sections/ServiceGridLive";
import { FeatureSplit } from "@/components/sections/FeatureSplit";
import { BenefitsGrid } from "@/components/sections/BenefitsGrid";
import { ProcessSteps } from "@/components/sections/ProcessSteps";
import { FaqSectionsLive } from "@/components/content/FaqSectionsLive";
import { LiveServiceAreas } from "@/components/content/LiveServiceAreas";
import { CTASection } from "@/components/sections/CTASection";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { ProductGrid } from "@/components/product/ProductGrid";
import { homepageRepository, HOMEPAGE_SYNC_PING_KEY } from "@/lib/content/homepageRepository";
import { useLiveContent } from "@/lib/content/useLiveContent";
import { resolveImageSrc } from "@/lib/images/resolveImageSrc";
import type { HomepageContent } from "@/data/homepage";
import type { Service } from "@/data/services";
import type { Faq } from "@/data/faqs";
import type { Product } from "@/data/products";
import type { NavItem } from "@/data/navigation";

const STORAGE_KEYS = [HOMEPAGE_SYNC_PING_KEY];

interface HomeContentProps {
  defaultHomepage: HomepageContent;
  // Server-resolved (see src/lib/content/getInitialHeroImage.ts) so the
  // hero — the homepage's LCP candidate — has a real src in the initial
  // HTML instead of only being discoverable after this component mounts
  // and its own effect below resolves it. null when there's no hero photo
  // yet, same as the static default.
  initialHeroImage: string | null;
  defaultServices: Service[];
  products: Product[];
  defaultFaqs: Faq[];
  primaryCta: NavItem;
}

export function HomeContent({
  defaultHomepage,
  initialHeroImage,
  defaultServices,
  products,
  defaultFaqs,
  primaryCta,
}: HomeContentProps) {
  const homepage = useLiveContent(defaultHomepage, homepageRepository.get, STORAGE_KEYS);
  const [heroImage, setHeroImage] = useState<string | null>(initialHeroImage ?? defaultHomepage.hero.image);
  const [highlightImage, setHighlightImage] = useState<string | null>(defaultHomepage.mobileHighlight.image);

  useEffect(() => {
    let active = true;
    resolveImageSrc(homepage.hero.image).then((resolved) => {
      if (active) setHeroImage(resolved);
    });
    return () => {
      active = false;
    };
  }, [homepage.hero.image]);

  useEffect(() => {
    let active = true;
    resolveImageSrc(homepage.mobileHighlight.image).then((resolved) => {
      if (active) setHighlightImage(resolved);
    });
    return () => {
      active = false;
    };
  }, [homepage.mobileHighlight.image]);

  return (
    <>
      <Hero
        heading={homepage.hero.heading}
        description={homepage.hero.description}
        image={heroImage}
        primaryCta={{ label: homepage.hero.primaryCtaLabel, href: primaryCta.href }}
        secondaryCta={{ label: homepage.hero.secondaryCtaLabel, href: "/services" }}
      />

      <ServiceGridLive
        heading={homepage.servicesSection.heading}
        description={homepage.servicesSection.description}
        defaultItems={defaultServices}
        tone="surface"
      />

      <FeatureSplit
        eyebrow={homepage.mobileHighlight.eyebrow}
        heading={homepage.mobileHighlight.heading}
        description={homepage.mobileHighlight.description}
        bullets={homepage.mobileHighlight.bullets}
        image={highlightImage}
        cta={{ label: "How Mobile Grooming Works", href: "/services/mobile-pet-grooming" }}
        imageLabel="Mobile grooming vehicle photo coming soon"
        imageAlt="Kulapaws mobile grooming vehicle"
        tone="muted"
      >
        <LiveServiceAreas />
      </FeatureSplit>

      <BenefitsGrid
        heading={homepage.whyKulapaws.heading}
        description={homepage.whyKulapaws.description}
        items={homepage.whyKulapaws.items}
        tone="surface"
      />

      <Section tone="background">
        <Container size="wide">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
            <div className="max-w-[65ch]">
              <Heading level="h2">{homepage.productsPreview.heading}</Heading>
              <p className="mt-4 text-[16px] text-muted-foreground sm:text-[18px]">
                {homepage.productsPreview.description}
              </p>
            </div>
            <Link
              href="/products"
              className="text-[15px] font-medium text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
            >
              View all products →
            </Link>
          </div>
          <div className="mt-10">
            <ProductGrid items={products} limit={3} />
          </div>
        </Container>
      </Section>

      <ProcessSteps
        heading={homepage.howItWorks.heading}
        description={homepage.howItWorks.description}
        steps={homepage.howItWorks.steps}
        tone="muted"
      />

      <FaqSectionsLive
        mode="flat"
        heading={homepage.faqPreview.heading}
        defaultFaqs={defaultFaqs}
        viewAllCta={{ label: "Visit the FAQ page", href: "/faq" }}
        tone="surface"
      />

      <CTASection
        heading={homepage.finalCta.heading}
        description={homepage.finalCta.description}
        cta={primaryCta}
      />
    </>
  );
}
