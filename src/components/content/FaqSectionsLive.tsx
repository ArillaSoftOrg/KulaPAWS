"use client";

import { useEffect, useState } from "react";
import { FAQSection } from "@/components/sections/FAQSection";
import { faqsRepository } from "@/lib/content/faqsRepository";
import { faqCategories } from "@/data/faqs";
import type { Faq, FaqCategory } from "@/data/faqs";
import type { NavItem } from "@/data/navigation";

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
  const [faqs, setFaqs] = useState(defaultFaqs);

  useEffect(() => {
    let active = true;
    faqsRepository.list().then((list) => {
      if (active) setFaqs(list);
    });
    return () => {
      active = false;
    };
  }, []);

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
