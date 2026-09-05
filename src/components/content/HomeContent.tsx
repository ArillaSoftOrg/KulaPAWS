"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Hero } from "@/components/sections/Hero";
import { ServiceGridLive } from "@/components/sections/ServiceGridLive";
import { FeatureSplit } from "@/components/sections/FeatureSplit";
import { BenefitsGrid } from "@/components/sections/BenefitsGrid";
import { ProcessSteps } from "@/components/sections/ProcessSteps";
import { FaqSectionsLive } from "@/components/content/FaqSectionsLive";
import { CTASection } from "@/components/sections/CTASection";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { ProductGrid } from "@/components/product/ProductGrid";
import { homepageRepository } from "@/lib/content/homepageRepository";
import { resolveImageSrc } from "@/lib/images/resolveImageSrc";
import type { HomepageContent } from "@/data/homepage";
import type { Service } from "@/data/services";
import type { Faq } from "@/data/faqs";
import type { Product } from "@/data/products";
import type { NavItem } from "@/data/navigation";

interface HomeContentProps {
  defaultHomepage: HomepageContent;
  defaultServices: Service[];
  products: Product[];
  defaultFaqs: Faq[];
  primaryCta: NavItem;
}

export function HomeContent({
  defaultHomepage,
  defaultServices,
  products,
  defaultFaqs,
  primaryCta,
}: HomeContentProps) {
  const [homepage, setHomepage] = useState(defaultHomepage);
  const [heroImage, setHeroImage] = useState<string | null>(defaultHomepage.hero.image);
  const [highlightImage, setHighlightImage] = useState<string | null>(defaultHomepage.mobileHighlight.image);

  useEffect(() => {
    let active = true;
    homepageRepository.get().then(async (value) => {
      if (!active) return;
      setHomepage(value);
      setHeroImage(await resolveImageSrc(value.hero.image));
      setHighlightImage(await resolveImageSrc(value.mobileHighlight.image));
    });
    return () => {
      active = false;
    };
  }, []);

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
        tone="muted"
      />

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
