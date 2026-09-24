"use client";

import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { buttonVariants } from "@/components/ui/Button";
import { MobileNavigation } from "@/components/layout/MobileNavigation";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import { primaryNav, primaryCta } from "@/data/navigation";
import { business } from "@/data/business";
import { LiveLogo } from "@/components/content/LiveLogo";
import { useLocale } from "@/lib/i18n/LocaleProvider";
import { navHref, navLabel } from "@/lib/i18n/navLabels";
import { buildLocalizedPath } from "@/lib/i18n/pathLocale";

export function Header() {
  const { locale, dictionary } = useLocale();

  return (
    <header className="relative border-b border-border bg-surface">
      <Container className="flex h-16 items-center justify-between sm:h-20">
        <Link href={buildLocalizedPath(locale, "/")} className="inline-flex items-center gap-2">
          <LiveLogo defaultBusiness={business} size={48} />
        </Link>

        <nav aria-label={dictionary.common.primaryNavAriaLabel} className="hidden md:flex md:items-center md:gap-8">
          {primaryNav.map((item) => (
            <Link
              key={item.href}
              href={navHref(locale, item)}
              className="text-[15px] font-medium text-foreground hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
            >
              {navLabel(dictionary, item)}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex md:items-center md:gap-3">
          <LanguageSwitcher />
          <Link href={navHref(locale, primaryCta)} className={buttonVariants({ variant: "primary" })}>
            {navLabel(dictionary, primaryCta)}
          </Link>
        </div>

        <MobileNavigation />
      </Container>
    </header>
  );
}
