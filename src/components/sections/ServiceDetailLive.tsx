"use client";

import { useEffect, useState } from "react";
import { ServiceDetail } from "@/components/sections/ServiceDetail";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { EmptyState } from "@/components/ui/EmptyState";
import { servicesRepository } from "@/lib/content/servicesRepository";
import { resolveImageSrc } from "@/lib/images/resolveImageSrc";
import type { Service } from "@/data/services";

interface ServiceDetailLiveProps {
  slug: string;
  defaultService: Service | null;
}

// The server only knows about the static default services at request time,
// so an admin-created (local-only) service slug renders as "not found"
// until this effect resolves. Existing default services render immediately
// from `defaultService` (no flash) and are only replaced if a local edit
// exists.
export function ServiceDetailLive({ slug, defaultService }: ServiceDetailLiveProps) {
  const [service, setService] = useState<Service | null>(defaultService);

  useEffect(() => {
    let active = true;
    servicesRepository.list().then(async (list) => {
      if (!active) return;
      const match = list.find((item) => item.slug === slug) ?? null;
      if (!match) {
        setService(null);
        return;
      }
      const resolvedImage = await resolveImageSrc(match.image);
      if (active) setService({ ...match, image: resolvedImage });
    });
    return () => {
      active = false;
    };
  }, [slug]);

  if (!service) {
    return (
      <Section tone="background">
        <Container size="narrow">
          <EmptyState
            title="Service not found"
            description="This service may have been removed, or the link is incorrect."
          />
        </Container>
      </Section>
    );
  }

  return <ServiceDetail service={service} />;
}
