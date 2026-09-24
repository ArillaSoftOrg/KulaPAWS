"use client";

import type { ReactNode } from "react";
import { businessRepository, BUSINESS_SYNC_PING_KEY } from "@/lib/content/businessRepository";
import { useLiveContent } from "@/lib/content/useLiveContent";
import { buildTelHref, buildWhatsAppHref } from "@/lib/business/contactLinks";
import { useLocale } from "@/lib/i18n/LocaleProvider";
import { cn } from "@/lib/cn";
import { InstagramIcon } from "@/components/ui/InstagramIcon";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import type { Business } from "@/data/business";

const STORAGE_KEYS = [BUSINESS_SYNC_PING_KEY];

const linkClassName =
  "hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm";

// "https://www.instagram.com/kulapaws.tr/" -> "@kulapaws.tr"
function instagramHandle(url: string): string {
  const match = url.match(/instagram\.com\/([^/?]+)/i);
  return match ? `@${match[1]}` : url;
}

interface ContactRow {
  label: string;
  content: ReactNode;
}

function buildContactRows(
  current: Business,
  labels: Dictionary["shared"]["contactDetails"],
  whatsappMessage: string,
): ContactRow[] {
  const instagram = current.socialLinks.find((link) => link.platform === "Instagram");

  const rows: (ContactRow | false | null | undefined | "")[] = [
    current.phone && {
      label: labels.phone,
      content: (
        <a href={buildTelHref(current.phone)} className={linkClassName}>
          {current.phone}
        </a>
      ),
    },
    current.whatsapp && {
      label: labels.whatsapp,
      content: (
        <a
          href={buildWhatsAppHref(current.whatsapp, whatsappMessage)}
          target="_blank"
          rel="noopener noreferrer"
          className={linkClassName}
        >
          {current.whatsapp}
        </a>
      ),
    },
    instagram && {
      label: labels.instagram,
      content: (
        <a
          href={instagram.url}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(linkClassName, "-my-1 inline-flex items-center gap-1.5 py-1")}
        >
          <InstagramIcon className="h-4 w-4 shrink-0" />
          {instagramHandle(instagram.url)}
        </a>
      ),
    },
    current.email && { label: labels.email, content: current.email },
    current.address && { label: labels.address, content: current.address },
    current.businessHours && { label: labels.businessHours, content: current.businessHours },
    current.serviceAreas.length > 0 && {
      label: labels.serviceAreas,
      content: current.serviceAreas.join(", "),
    },
  ];

  return rows.filter((row): row is ContactRow => Boolean(row));
}

export function LiveContactDetails({ defaultBusiness }: { defaultBusiness: Business }) {
  const { dictionary } = useLocale();
  const business = useLiveContent(defaultBusiness, businessRepository.get, STORAGE_KEYS);
  const rows = buildContactRows(business, dictionary.shared.contactDetails, dictionary.shared.whatsappContact.message);
  if (rows.length === 0) return null;

  return (
    <address className="not-italic">
      <dl className="flex flex-col gap-3">
        {rows.map((row) => (
          <div key={row.label} className="flex flex-col gap-1 sm:flex-row sm:gap-3">
            <dt className="text-[14px] font-medium text-foreground sm:w-32 sm:flex-shrink-0">
              {row.label}
            </dt>
            <dd className="text-[15px] text-muted-foreground">{row.content}</dd>
          </div>
        ))}
      </dl>
    </address>
  );
}
