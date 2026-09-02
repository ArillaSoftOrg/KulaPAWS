import { PageHeader } from "@/components/layout/PageHeader";
import { ServiceGrid } from "@/components/sections/ServiceGrid";
import { CTASection } from "@/components/sections/CTASection";
import { services } from "@/data/services";
import { primaryCta } from "@/data/navigation";

export default function ServicesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Services"
        title="Grooming services for dogs and cats"
        description="Every Kulapaws service is delivered through our mobile setup, brought directly to your home."
      />

      <ServiceGrid items={services} tone="background" />

      <CTASection
        heading="Not sure which service fits your pet?"
        description="Reach out and we'll help you figure out the right fit."
        cta={primaryCta}
      />
    </>
  );
}
