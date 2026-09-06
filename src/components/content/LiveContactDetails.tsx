"use client";

import { businessRepository, BUSINESS_STORAGE_KEY } from "@/lib/content/businessRepository";
import { useLiveContent } from "@/lib/content/useLiveContent";
import type { Business } from "@/data/business";

const STORAGE_KEYS = [BUSINESS_STORAGE_KEY];

function buildContactRows(current: Business) {
  return [
    current.phone && { label: "Phone", value: current.phone },
    current.email && { label: "Email", value: current.email },
    current.whatsapp && { label: "WhatsApp", value: current.whatsapp },
    current.address && { label: "Address", value: current.address },
    current.businessHours && { label: "Business Hours", value: current.businessHours },
    current.serviceAreas.length > 0 && {
      label: "Service Areas",
      value: current.serviceAreas.join(", "),
    },
  ].filter((row): row is { label: string; value: string } => Boolean(row));
}

export function LiveContactDetails({ defaultBusiness }: { defaultBusiness: Business }) {
  const business = useLiveContent(defaultBusiness, businessRepository.get, STORAGE_KEYS);
  const rows = buildContactRows(business);
  if (rows.length === 0) return null;

  return (
    <dl className="flex flex-col gap-3">
      {rows.map((row) => (
        <div key={row.label} className="flex flex-col gap-1 sm:flex-row sm:gap-3">
          <dt className="text-[14px] font-medium text-foreground sm:w-32 sm:flex-shrink-0">
            {row.label}
          </dt>
          <dd className="text-[15px] text-muted-foreground">{row.value}</dd>
        </div>
      ))}
    </dl>
  );
}
