import { PageHeader } from "@/components/layout/PageHeader";
import { FeatureSplit } from "@/components/sections/FeatureSplit";
import { BenefitsGrid } from "@/components/sections/BenefitsGrid";
import { CTASection } from "@/components/sections/CTASection";
import { primaryCta } from "@/data/navigation";

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="About"
        title="A pet-care brand built around convenience and care"
        description="Kulapaws is a mobile pet grooming and pet-care brand, focused on making grooming easier for pets and their people."
      />

      <FeatureSplit
        eyebrow="Mobile Service"
        heading="Why we come to you"
        description="Traditional grooming means a car ride, a waiting room, and an unfamiliar space. Kulapaws was built around a simpler idea: bring the grooming to your pet's own environment instead."
        imageLabel="Kulapaws team photo coming soon"
        tone="surface"
      />

      <BenefitsGrid
        heading="What we care about"
        tone="muted"
        items={[
          { title: "Approachable", description: "Friendly, straightforward service without the fuss." },
          { title: "Caring", description: "Every appointment is centered on your pet's comfort." },
          { title: "Practical", description: "Convenient, clean, and easy to fit into your routine." },
        ]}
      />

      <CTASection
        heading="Want to learn more?"
        description="Reach out with any questions about Kulapaws."
        cta={primaryCta}
      />
    </>
  );
}
