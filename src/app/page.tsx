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

export default function Home() {
  return (
    <>
      <Hero
        heading="Mobile pet grooming that comes to you"
        description="Kulapaws brings professional dog and cat grooming, plus pet-care products, directly to your door — so your pet stays calm and comfortable at home."
        primaryCta={primaryCta}
        secondaryCta={{ label: "Explore Services", href: "/services" }}
      />

      <ServiceGrid
        heading="Our Services"
        description="Grooming care built around your pet, wherever home is."
        items={services}
        tone="surface"
      />

      <FeatureSplit
        eyebrow="Mobile Service"
        heading="Grooming, delivered to your door"
        description="No crate, no car ride, no waiting room. Our mobile grooming service means your pet is cared for in a familiar, low-stress setting — right at home."
        bullets={[
          "Grooming happens where your pet is most comfortable",
          "No transport or drop-off required",
          "One-on-one attention from start to finish",
        ]}
        cta={{ label: "How Mobile Grooming Works", href: "/services/mobile-pet-grooming" }}
        imageLabel="Mobile grooming vehicle photo coming soon"
        tone="muted"
      />

      <BenefitsGrid
        heading="Why Kulapaws"
        description="A pet-care brand built to feel approachable, caring, and easy to trust."
        tone="surface"
        items={[
          { title: "Caring by default", description: "Every visit is centered on your pet's comfort, not just the groom." },
          { title: "Genuinely convenient", description: "Mobile service means grooming fits into your day, not the other way around." },
          { title: "Clean & professional", description: "A consistent, careful approach to every appointment." },
        ]}
      />

      <Section tone="background">
        <Container size="wide">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
            <div className="max-w-[65ch]">
              <Heading level="h2">Pet-Care Products</Heading>
              <p className="mt-4 text-[16px] text-muted-foreground sm:text-[18px]">
                Alongside grooming, Kulapaws offers pet-care products for the home.
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
        heading="How It Works"
        description="Getting your pet groomed at home is straightforward."
        tone="muted"
        steps={[
          { title: "Reach out", description: "Contact us to share what your pet needs." },
          { title: "We come to you", description: "Our mobile grooming service arrives at your home." },
          { title: "Your pet is pampered", description: "A calm, one-on-one grooming session on-site." },
        ]}
      />

      <FAQSection
        heading="Frequently Asked Questions"
        items={faqs}
        viewAllCta={{ label: "Visit the FAQ page", href: "/faq" }}
        tone="surface"
      />

      <CTASection
        heading="Ready to book your pet's next groom?"
        description="Reach out and we'll help you get started."
        cta={primaryCta}
      />
    </>
  );
}
