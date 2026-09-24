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
      <Container className="flex flex-col gap-8 py-10 sm:flex-row sm:items-start sm:justify-between sm:py-12">
        <Link href={buildLocalizedPath(locale, "/")} className="inline-flex items-center gap-2">
          <LiveLogo defaultBusiness={business} size={40} />
          <span className="text-[16px] font-semibold text-foreground">
            <LiveBusinessName defaultBusiness={business} />
          </span>
        </Link>

        <div className="flex flex-col gap-6 sm:items-end">
          <nav aria-label={dictionary.common.footerNavAriaLabel} className="flex flex-col gap-3 sm:flex-row sm:gap-6">
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

          <LiveFooterContact defaultBusiness={business} />
        </div>
      </Container>

      <Container className="border-t border-border py-5 text-[14px] text-muted-foreground">
        © {year} <LiveBusinessName defaultBusiness={business} />. {dictionary.common.allRightsReserved}
      </Container>
    </footer>
  );
}
