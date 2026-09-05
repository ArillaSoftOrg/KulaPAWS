"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { ServiceGridLive } from "@/components/sections/ServiceGridLive";
import { CTASection } from "@/components/sections/CTASection";
import { servicesPageRepository } from "@/lib/content/servicesPageRepository";
import type { ServicesPageContent } from "@/data/servicesPage";
import type { Service } from "@/data/services";
import type { NavItem } from "@/data/navigation";

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
  const [content, setContent] = useState(defaultServicesPage);

  useEffect(() => {
    let active = true;
    servicesPageRepository.get().then((value) => {
      if (active) setContent(value);
    });
    return () => {
      active = false;
    };
  }, []);

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
