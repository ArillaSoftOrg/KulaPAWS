"use client";

import { businessRepository, BUSINESS_SYNC_PING_KEY } from "@/lib/content/businessRepository";
import { useLiveContent } from "@/lib/content/useLiveContent";
import { buildTelHref, buildWhatsAppHref } from "@/lib/business/contactLinks";
import type { Business } from "@/data/business";

const STORAGE_KEYS = [BUSINESS_SYNC_PING_KEY];

const linkClassName =
  "text-[15px] text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm";

// Phone + WhatsApp only, per the footer's scope — service areas and any
// other business details live on /contact, not repeated here.
export function LiveFooterContact({ defaultBusiness }: { defaultBusiness: Business }) {
  const business = useLiveContent(defaultBusiness, businessRepository.get, STORAGE_KEYS);
  if (!business.phone && !business.whatsapp) return null;

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:gap-6">
      {business.phone && (
        <a href={buildTelHref(business.phone)} className={linkClassName}>
          {business.phone}
        </a>
      )}
      {business.whatsapp && (
        <a
          href={buildWhatsAppHref(business.whatsapp)}
          target="_blank"
          rel="noopener noreferrer"
          className={linkClassName}
        >
          WhatsApp
        </a>
      )}
    </div>
  );
}
