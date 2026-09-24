"use client";

import { useId } from "react";
import { useLocale } from "@/lib/i18n/LocaleProvider";
import { LOCALES, LOCALE_LABELS, type Locale } from "@/lib/i18n/config";
import { cn } from "@/lib/cn";

interface LanguageSwitcherProps {
  className?: string;
}

// A native <select> rather than a custom popover — works identically with
// touch, mouse, and keyboard on both the desktop header and the mobile
// nav panel without any extra positioning/focus-trap code.
export function LanguageSwitcher({ className }: LanguageSwitcherProps) {
  const { locale, dictionary, switchLocale } = useLocale();
  const id = useId();

  return (
    <div className={cn("inline-flex items-center", className)}>
      <label htmlFor={id} className="sr-only">
        {dictionary.language.label}
      </label>
      <select
        id={id}
        value={locale}
        onChange={(event) => switchLocale(event.target.value as Locale)}
        aria-label={dictionary.language.label}
        className="h-11 min-w-[44px] rounded-md border border-border bg-surface px-3 text-[14px] font-medium text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        {LOCALES.map((value) => (
          <option key={value} value={value}>
            {LOCALE_LABELS[value]}
          </option>
        ))}
      </select>
    </div>
  );
}
