"use client";

import { businessRepository, BUSINESS_SYNC_PING_KEY } from "@/lib/content/businessRepository";
import { useLiveContent } from "@/lib/content/useLiveContent";
import { useLocale } from "@/lib/i18n/LocaleProvider";
import { InstagramIcon } from "@/components/ui/InstagramIcon";
import type { Business } from "@/data/business";

const STORAGE_KEYS = [BUSINESS_SYNC_PING_KEY];

// Sourced from business.socialLinks (single source of truth, edited via
// /admin/business) — hidden entirely when no Instagram link is configured,
// same idiom as every other optional contact touchpoint in this codebase.
// Icon-only by design: kept separate from LiveFooterContact, which is
// scoped to phone + WhatsApp.
export function LiveFooterSocial({ defaultBusiness }: { defaultBusiness: Business }) {
  const { dictionary } = useLocale();
  const business = useLiveContent(defaultBusiness, businessRepository.get, STORAGE_KEYS);
  const instagram = business.socialLinks.find((link) => link.platform === "Instagram");
  if (!instagram) return null;

  return (
    <a
      href={instagram.url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={dictionary.shared.instagramLink.ariaLabel}
      className="-my-2.5 inline-flex h-11 w-11 items-center justify-center rounded-full text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <InstagramIcon className="h-5 w-5" />
    </a>
  );
}
