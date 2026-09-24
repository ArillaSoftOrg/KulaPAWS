"use client";

import { businessRepository, BUSINESS_SYNC_PING_KEY } from "@/lib/content/businessRepository";
import { useLiveContent } from "@/lib/content/useLiveContent";
import { buildTelHref, buildWhatsAppHref } from "@/lib/business/contactLinks";
import { useLocale } from "@/lib/i18n/LocaleProvider";
import type { Business } from "@/data/business";

const STORAGE_KEYS = [BUSINESS_SYNC_PING_KEY];

const linkClassName =
  "text-[15px] text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm";

// Phone, WhatsApp, and Instagram as plain text links — the footer's full
// contact scope (service areas and other business details stay on
// /contact only). Plain text by design: the footer avoids standalone
// icon-only blocks. Always stacked vertically: this lives in the
// footer's narrow right-hand block (see Footer.tsx), not a wide row.
export function LiveFooterContact({ defaultBusiness }: { defaultBusiness: Business }) {
  const { dictionary } = useLocale();
  const business = useLiveContent(defaultBusiness, businessRepository.get, STORAGE_KEYS);
  const instagram = business.socialLinks.find((link) => link.platform === "Instagram");
  if (!business.phone && !business.whatsapp && !instagram) return null;

  return (
    <div className="flex flex-col gap-2 sm:items-end">
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
          {dictionary.shared.whatsapp}
        </a>
      )}
      {instagram && (
        <a href={instagram.url} target="_blank" rel="noopener noreferrer" className={linkClassName}>
          {dictionary.shared.contactDetails.instagram}
        </a>
      )}
    </div>
  );
}
