"use client";

import { ServiceGrid } from "@/components/sections/ServiceGrid";
import { servicesRepository, SERVICES_STORAGE_KEY } from "@/lib/content/servicesRepository";
import { useLiveContent } from "@/lib/content/useLiveContent";
import type { Service } from "@/data/services";

const STORAGE_KEYS = [SERVICES_STORAGE_KEY];

interface ServiceGridLiveProps {
  defaultItems: Service[];
  heading?: string;
  description?: string;
  tone?: "background" | "surface" | "muted" | "secondary";
}

// Same default-first, override-after-mount pattern as LiveBusinessValue —
// renders the static defaults immediately, then swaps to the live
// (admin create/edit/delete) list once the repository read resolves.
export function ServiceGridLive({ defaultItems, heading, description, tone }: ServiceGridLiveProps) {
  const items = useLiveContent(defaultItems, servicesRepository.list, STORAGE_KEYS);
  return <ServiceGrid items={items} heading={heading} description={description} tone={tone} />;
}
