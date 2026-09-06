"use client";

import { FAQSection } from "@/components/sections/FAQSection";
import { faqsRepository, FAQS_SYNC_PING_KEY } from "@/lib/content/faqsRepository";
import { useLiveContent } from "@/lib/content/useLiveContent";
import { faqCategories } from "@/data/faqs";
import type { Faq, FaqCategory } from "@/data/faqs";
import type { NavItem } from "@/data/navigation";

const STORAGE_KEYS = [FAQS_SYNC_PING_KEY];

interface FaqSectionsLiveProps {
  defaultFaqs: Faq[];
  mode: "flat" | "grouped";
  heading?: string;
  viewAllCta?: NavItem;
  tone?: "background" | "surface" | "muted" | "secondary";
}

// Homepage preview ("flat") shows every FAQ in one section; the full /faq
// page ("grouped") splits them into one section per category, falling
// back to a single empty "General" section when there are none yet —
// matching the page's original static behavior.
export function FaqSectionsLive({ defaultFaqs, mode, heading, viewAllCta, tone }: FaqSectionsLiveProps) {
  const faqs = useLiveContent(defaultFaqs, faqsRepository.list, STORAGE_KEYS);

  if (mode === "flat") {
    return (
      <FAQSection heading={heading ?? "Frequently Asked Questions"} items={faqs} viewAllCta={viewAllCta} tone={tone} />
    );
  }

  const groups: { category: FaqCategory; items: Faq[] }[] =
    faqs.length > 0
      ? faqCategories
          .map((category) => ({ category, items: faqs.filter((faq) => faq.category === category) }))
          .filter((group) => group.items.length > 0)
      : [{ category: "General", items: [] }];

  return (
    <>
      {groups.map((group) => (
        <FAQSection key={group.category} heading={group.category} items={group.items} tone={tone ?? "background"} />
      ))}
    </>
  );
}
