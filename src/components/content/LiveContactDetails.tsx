"use client";

import type { ReactNode } from "react";
import { businessRepository, BUSINESS_SYNC_PING_KEY } from "@/lib/content/businessRepository";
import { useLiveContent } from "@/lib/content/useLiveContent";
import { buildTelHref, buildWhatsAppHref } from "@/lib/business/contactLinks";
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

function buildContactRows(current: Business): ContactRow[] {
  const instagram = current.socialLinks.find((link) => link.platform === "Instagram");

  const rows: (ContactRow | false | null | undefined | "")[] = [
    current.phone && {
      label: "Phone",
      content: (
        <a href={buildTelHref(current.phone)} className={linkClassName}>
          {current.phone}
        </a>
      ),
    },
    current.whatsapp && {
      label: "WhatsApp",
      content: (
        <a href={buildWhatsAppHref(current.whatsapp)} target="_blank" rel="noopener noreferrer" className={linkClassName}>
          {current.whatsapp}
        </a>
      ),
    },
    instagram && {
      label: "Instagram",
      content: (
        <a href={instagram.url} target="_blank" rel="noopener noreferrer" className={linkClassName}>
          {instagramHandle(instagram.url)}
        </a>
      ),
    },
    current.email && { label: "Email", content: current.email },
    current.address && { label: "Address", content: current.address },
    current.businessHours && { label: "Business Hours", content: current.businessHours },
    current.serviceAreas.length > 0 && {
      label: "Service Areas",
      content: current.serviceAreas.join(", "),
    },
  ];

  return rows.filter((row): row is ContactRow => Boolean(row));
}

export function LiveContactDetails({ defaultBusiness }: { defaultBusiness: Business }) {
  const business = useLiveContent(defaultBusiness, businessRepository.get, STORAGE_KEYS);
  const rows = buildContactRows(business);
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
