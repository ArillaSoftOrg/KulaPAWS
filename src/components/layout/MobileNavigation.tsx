"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { primaryNav, primaryCta } from "@/data/navigation";
import { buttonVariants } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import { useLocale } from "@/lib/i18n/LocaleProvider";
import { navHref, navLabel } from "@/lib/i18n/navLabels";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";

export function MobileNavigation() {
  const { locale, dictionary } = useLocale();
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (!open) return;

    firstLinkRef.current?.focus();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  return (
    <div className="md:hidden">
      <button
        ref={triggerRef}
        type="button"
        aria-expanded={open}
        aria-controls="mobile-nav-panel"
        aria-label={open ? dictionary.common.closeMenu : dictionary.common.openMenu}
        onClick={() => setOpen((value) => !value)}
        className="flex h-11 w-11 items-center justify-center rounded-md text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <svg
          className="h-6 w-6"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          aria-hidden="true"
        >
          {open ? (
            <path d="M6 6l12 12M18 6L6 18" />
          ) : (
            <path d="M4 7h16M4 12h16M4 17h16" />
          )}
        </svg>
      </button>

      <div
        id="mobile-nav-panel"
        hidden={!open}
        className="absolute inset-x-0 top-full border-b border-border bg-surface shadow-lg"
      >
        <nav aria-label={dictionary.common.primaryNavAriaLabel} className="flex flex-col px-5 py-4">
          {primaryNav.map((item, index) => (
            <Link
              key={item.href}
              href={navHref(locale, item)}
              ref={index === 0 ? firstLinkRef : undefined}
              onClick={() => setOpen(false)}
              className="rounded-md px-2 py-3 text-[16px] font-medium text-foreground hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {navLabel(dictionary, item)}
            </Link>
          ))}
          <Link
            href={navHref(locale, primaryCta)}
            onClick={() => setOpen(false)}
            className={cn("mt-3 w-full", buttonVariants({ variant: "primary" }))}
          >
            {navLabel(dictionary, primaryCta)}
          </Link>
          <LanguageSwitcher className="mt-4 w-full [&>select]:w-full" />
        </nav>
      </div>
    </div>
  );
}
