"use client";

import { businessRepository, BUSINESS_SYNC_PING_KEY } from "@/lib/content/businessRepository";
import { useLiveContent } from "@/lib/content/useLiveContent";
import type { Business } from "@/data/business";

const STORAGE_KEYS = [BUSINESS_SYNC_PING_KEY];

// `business.tagline` ships as null — no invented brand copy — so this
// stays hidden until a real tagline is entered via /admin/business.
export function LiveFooterTagline({ defaultBusiness }: { defaultBusiness: Business }) {
  const business = useLiveContent(defaultBusiness, businessRepository.get, STORAGE_KEYS);
  if (!business.tagline) return null;

  return <p className="max-w-[32ch] text-[14px] text-muted-foreground">{business.tagline}</p>;
}
