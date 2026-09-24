"use client";

import { businessRepository, BUSINESS_SYNC_PING_KEY } from "@/lib/content/businessRepository";
import { useLiveContent } from "@/lib/content/useLiveContent";
import { buildTelHref, buildWhatsAppHref } from "@/lib/business/contactLinks";
import { useLocale } from "@/lib/i18n/LocaleProvider";
import type { Business } from "@/data/business";

const STORAGE_KEYS = [BUSINESS_SYNC_PING_KEY];

const linkClassName =
  "text-[15px] text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm";

// Phone + WhatsApp only, per the footer's scope — service areas and any
// other business details live on /contact, not repeated here. Always
// stacked vertically: this now lives in the footer's narrow right-hand
// column (see Footer.tsx), not a wide full-width row.
export function LiveFooterContact({ defaultBusiness }: { defaultBusiness: Business }) {
  const { dictionary } = useLocale();
  const business = useLiveContent(defaultBusiness, businessRepository.get, STORAGE_KEYS);
  if (!business.phone && !business.whatsapp) return null;

  return (
    <div className="flex flex-col gap-2">
      {business.phone && (
        <a href={buildTelHref(business.phone)} className={linkClassName}>
          {business.phone}
        </a>
      )}
      {business.whatsapp && (
        <a
          href={buildWhatsAppHref(business.whatsapp, dictionary.shared.whatsappContact.message)}
          target="_blank"
          rel="noopener noreferrer"
          className={linkClassName}
        >
          {dictionary.shared.whatsapp}
        </a>
      )}
    </div>
  );
}
