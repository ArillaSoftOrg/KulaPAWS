"use client";

import { business as defaultBusiness } from "@/data/business";
import { businessRepository, BUSINESS_SYNC_PING_KEY } from "@/lib/content/businessRepository";
import { useLiveContent } from "@/lib/content/useLiveContent";

const STORAGE_KEYS = [BUSINESS_SYNC_PING_KEY];

// Self-contained (own default + own live fetch, like LiveLogo/
// LiveBusinessName) so it can drop into any section without that section
// needing to thread business data through as a prop. One line of real
// service-area names — no per-city claims, no separate pages.
export function LiveServiceAreas() {
  const business = useLiveContent(defaultBusiness, businessRepository.get, STORAGE_KEYS);
  if (business.serviceAreas.length === 0) return null;

  return (
    <p className="mt-6 text-[15px] text-foreground">
      <span className="font-medium">Serving:</span> {business.serviceAreas.join(", ")}
    </p>
  );
}
