"use client";

import { businessRepository, BUSINESS_STORAGE_KEY } from "@/lib/content/businessRepository";
import { useLiveContent } from "@/lib/content/useLiveContent";
import type { Business } from "@/data/business";

const STORAGE_KEYS = [BUSINESS_STORAGE_KEY];

export function LiveBusinessName({ defaultBusiness }: { defaultBusiness: Business }) {
  const business = useLiveContent(defaultBusiness, businessRepository.get, STORAGE_KEYS);
  return <>{business.name}</>;
}
