"use client";

import { businessRepository, BUSINESS_SYNC_PING_KEY } from "@/lib/content/businessRepository";
import { useLiveContent } from "@/lib/content/useLiveContent";
import { buildTelHref, buildWhatsAppHref } from "@/lib/business/contactLinks";
import { useLocale } from "@/lib/i18n/LocaleProvider";
import type { Business } from "@/data/business";

const STORAGE_KEYS = [BUSINESS_SYNC_PING_KEY];

const linkClassName =
  "text-[15px] text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm";

interface ContactItem {
  key: string;
  href: string;
  label: string;
  external: boolean;
}

// Phone, WhatsApp, and Instagram as plain text links — the footer's full
// contact scope (service areas and other business details stay on
// /contact only). Plain text by design: the footer avoids standalone
// icon-only blocks. Always a tight vertical list — this is column 3 of
// the footer's 3-column layout (see Footer.tsx), stacked at every width.
export function LiveFooterContact({ defaultBusiness }: { defaultBusiness: Business }) {
  const { dictionary } = useLocale();
  const business = useLiveContent(defaultBusiness, businessRepository.get, STORAGE_KEYS);
  const instagram = business.socialLinks.find((link) => link.platform === "Instagram");

  const items = [
    business.phone && { key: "phone", href: buildTelHref(business.phone), label: business.phone, external: false },
    business.whatsapp && {
      key: "whatsapp",
      href: buildWhatsAppHref(business.whatsapp),
      label: dictionary.shared.whatsapp,
      external: true,
    },
    instagram && {
      key: "instagram",
      href: instagram.url,
      label: dictionary.shared.contactDetails.instagram,
      external: true,
    },
  ].filter((item): item is ContactItem => Boolean(item));

  if (items.length === 0) return null;

  return (
    <div className="flex flex-col gap-1.5 sm:items-end">
      {items.map((item) => (
        <a
          key={item.key}
          href={item.href}
          target={item.external ? "_blank" : undefined}
          rel={item.external ? "noopener noreferrer" : undefined}
          className={linkClassName}
        >
          {item.label}
        </a>
      ))}
    </div>
  );
}
