import Link from "next/link";
import { PageHeader } from "@/components/layout/PageHeader";
import { FeatureSplit } from "@/components/sections/FeatureSplit";
import { ProcessSteps } from "@/components/sections/ProcessSteps";
import { CTASection } from "@/components/sections/CTASection";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import type { Service } from "@/data/services";
import { primaryCta } from "@/data/navigation";

// Shared template for every /services/[slug] page (README.md §6 calls for a
// consistent structural pattern across dog/cat/mobile grooming pages).
export function ServiceDetail({ service }: { service: Service }) {
  return (
    <>
      <PageHeader eyebrow="Service" title={service.title} description={service.shortDescription}>
        <p className="mt-4">
          <Link
            href="/services"
            className="text-[15px] font-medium text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
          >
            ← View all services
          </Link>
        </p>
      </PageHeader>

      <FeatureSplit
        heading="Overview"
        description={service.overview}
        image={service.image}
        imageLabel={`${service.title} photo coming soon`}
        tone="surface"
      />

      <Section tone="muted">
        <Container size="content">
          <Heading level="h2">Who It&apos;s For</Heading>
          <ul className="mt-6 flex flex-col gap-3">
            {service.whoItsFor.map((item) => (
              <li key={item} className="flex items-start gap-3 text-[16px] text-foreground">
                <span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-primary" aria-hidden="true" />
                {item}
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      <ProcessSteps heading="What to Expect" steps={service.process} tone="background" />

      <CTASection
        heading={`Ready to book ${service.title}?`}
        description="Reach out and we'll help you get started."
        cta={primaryCta}
      />
    </>
  );
}
