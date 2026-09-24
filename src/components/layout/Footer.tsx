"use client";

import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { footerNav } from "@/data/navigation";
import { business } from "@/data/business";
import { LiveLogo } from "@/components/content/LiveLogo";
import { LiveBusinessName } from "@/components/content/LiveBusinessName";
import { LiveFooterTagline } from "@/components/content/LiveFooterTagline";
import { LiveFooterContact } from "@/components/content/LiveFooterContact";
import { LiveFooterSocial } from "@/components/content/LiveFooterSocial";
import { useLocale } from "@/lib/i18n/LocaleProvider";
import { navHref, navLabel } from "@/lib/i18n/navLabels";
import { buildLocalizedPath } from "@/lib/i18n/pathLocale";

export function Footer() {
  const { locale, dictionary } = useLocale();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-surface">
      <Container className="grid grid-cols-1 gap-8 py-10 sm:grid-cols-3 sm:gap-6 sm:py-12">
        <div className="flex flex-col gap-3">
          <Link href={buildLocalizedPath(locale, "/")} className="inline-flex w-fit items-center gap-2">
            <LiveLogo defaultBusiness={business} size={40} />
            <span className="text-[16px] font-semibold text-foreground">
              <LiveBusinessName defaultBusiness={business} />
            </span>
          </Link>
          <LiveFooterTagline defaultBusiness={business} />
        </div>

        <nav
          aria-label={dictionary.common.footerNavAriaLabel}
          className="flex flex-row flex-wrap gap-x-5 gap-y-2 sm:flex-col sm:gap-3"
        >
          {footerNav.map((item) => (
            <Link
              key={item.href}
              href={navHref(locale, item)}
              className="text-[15px] text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
            >
              {navLabel(dictionary, item)}
            </Link>
          ))}
        </nav>

        {/* sm:pr-20 keeps this column clear of the fixed WhatsApp button
            (h-14, bottom/right-5–6) so its bottom-right circle never sits
            over a real link here, at any viewport width or scroll position. */}
        <div className="flex flex-col gap-3 sm:items-end sm:pr-20">
          <LiveFooterContact defaultBusiness={business} />
          <LiveFooterSocial defaultBusiness={business} />
        </div>
      </Container>

      <Container className="border-t border-border py-5 text-[14px] text-muted-foreground">
        © {year} <LiveBusinessName defaultBusiness={business} />. {dictionary.common.allRightsReserved}
      </Container>
    </footer>
  );
}
