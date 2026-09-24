"use client";

import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { footerNav } from "@/data/navigation";
import { business } from "@/data/business";
import { LiveLogo } from "@/components/content/LiveLogo";
import { LiveBusinessName } from "@/components/content/LiveBusinessName";
import { LiveFooterContact } from "@/components/content/LiveFooterContact";
import { useLocale } from "@/lib/i18n/LocaleProvider";
import { navHref, navLabel } from "@/lib/i18n/navLabels";
import { buildLocalizedPath } from "@/lib/i18n/pathLocale";

export function Footer() {
  const { locale, dictionary } = useLocale();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-surface">
      <Container className="flex flex-col gap-4 py-6 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-x-6 sm:gap-y-2 sm:py-6">
        <Link href={buildLocalizedPath(locale, "/")} className="inline-flex w-fit items-center gap-2">
          <LiveLogo defaultBusiness={business} size={32} />
          <span className="text-[16px] font-semibold text-foreground">
            <LiveBusinessName defaultBusiness={business} />
          </span>
        </Link>

        <nav
          aria-label={dictionary.common.footerNavAriaLabel}
          className="flex flex-row flex-wrap gap-x-5 gap-y-1"
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

        {/* sm:pr-20 keeps these text links clear of the fixed WhatsApp
            button (h-14, bottom/right-5–6) so it never sits over a real
            link here, at any viewport width or scroll position. */}
        <div className="sm:pr-20">
          <LiveFooterContact defaultBusiness={business} />
        </div>
      </Container>

      <Container className="border-t border-border py-3 text-[14px] text-muted-foreground">
        © {year} <LiveBusinessName defaultBusiness={business} />. {dictionary.common.allRightsReserved}
      </Container>
    </footer>
  );
}
