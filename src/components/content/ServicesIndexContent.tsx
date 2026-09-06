"use client";

import { PageHeader } from "@/components/layout/PageHeader";
import { ServiceGridLive } from "@/components/sections/ServiceGridLive";
import { CTASection } from "@/components/sections/CTASection";
import { servicesPageRepository, SERVICES_PAGE_STORAGE_KEY } from "@/lib/content/servicesPageRepository";
import { useLiveContent } from "@/lib/content/useLiveContent";
import type { ServicesPageContent } from "@/data/servicesPage";
import type { Service } from "@/data/services";
import type { NavItem } from "@/data/navigation";

const STORAGE_KEYS = [SERVICES_PAGE_STORAGE_KEY];

interface ServicesIndexContentProps {
  defaultServicesPage: ServicesPageContent;
  defaultServices: Service[];
  primaryCta: NavItem;
}

export function ServicesIndexContent({
  defaultServicesPage,
  defaultServices,
  primaryCta,
}: ServicesIndexContentProps) {
  const content = useLiveContent(defaultServicesPage, servicesPageRepository.get, STORAGE_KEYS);

  return (
    <>
      <PageHeader
        eyebrow={content.header.eyebrow}
        title={content.header.title}
        description={content.header.description}
      />

      <ServiceGridLive defaultItems={defaultServices} tone="background" />

      <CTASection heading={content.cta.heading} description={content.cta.description} cta={primaryCta} />
    </>
  );
}
