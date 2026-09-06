"use client";

import { useEffect, useState } from "react";
import { ServiceDetail } from "@/components/sections/ServiceDetail";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { EmptyState } from "@/components/ui/EmptyState";
import { servicesRepository, SERVICES_SYNC_PING_KEY } from "@/lib/content/servicesRepository";
import { useLiveContent } from "@/lib/content/useLiveContent";
import { resolveImageSrc } from "@/lib/images/resolveImageSrc";
import type { Service } from "@/data/services";

const STORAGE_KEYS = [SERVICES_SYNC_PING_KEY];

interface ServiceDetailLiveProps {
  slug: string;
  defaultService: Service | null;
}

// The server only knows about the static default services at request time,
// so an admin-created service slug renders as "not found" until this
// effect resolves and fetches the live list from Supabase. Existing
// default services render immediately from `defaultService` (no flash) and
// are only replaced if the Supabase row differs from the shipped default.
export function ServiceDetailLive({ slug, defaultService }: ServiceDetailLiveProps) {
  const services = useLiveContent<Service[]>(
    defaultService ? [defaultService] : [],
    servicesRepository.list,
    STORAGE_KEYS,
  );
  const match = services.find((item) => item.slug === slug) ?? null;
  const [resolvedImage, setResolvedImage] = useState<string | null>(defaultService?.image ?? null);

  useEffect(() => {
    if (!match) return;
    let active = true;
    resolveImageSrc(match.image).then((src) => {
      if (active) setResolvedImage(src);
    });
    return () => {
      active = false;
    };
  }, [match]);

  if (!match) {
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

  return <ServiceDetail service={{ ...match, image: resolvedImage }} />;
}
