import { Hero } from "@/components/sections/Hero";
import { ServiceGrid } from "@/components/sections/ServiceGrid";
import { FeatureSplit } from "@/components/sections/FeatureSplit";
import { BenefitsGrid } from "@/components/sections/BenefitsGrid";
import { ProcessSteps } from "@/components/sections/ProcessSteps";
import { FAQSection } from "@/components/sections/FAQSection";
import { CTASection } from "@/components/sections/CTASection";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { ProductGrid } from "@/components/product/ProductGrid";
import Link from "next/link";
import { services } from "@/data/services";
import { products } from "@/data/products";
import { faqs } from "@/data/faqs";
import { primaryCta } from "@/data/navigation";
import { homepage } from "@/data/homepage";

export default function Home() {
  return (
    <>
      <Hero
        heading={homepage.hero.heading}
        description={homepage.hero.description}
        image={homepage.hero.image}
        primaryCta={primaryCta}
        secondaryCta={{ label: "Explore Services", href: "/services" }}
      />

      <ServiceGrid
        heading={homepage.servicesSection.heading}
        description={homepage.servicesSection.description}
        items={services}
        tone="surface"
      />

      <FeatureSplit
        eyebrow={homepage.mobileHighlight.eyebrow}
        heading={homepage.mobileHighlight.heading}
        description={homepage.mobileHighlight.description}
        bullets={homepage.mobileHighlight.bullets}
        image={homepage.mobileHighlight.image}
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

      <FAQSection
        heading={homepage.faqPreview.heading}
        items={faqs}
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
