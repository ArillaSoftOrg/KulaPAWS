import { localStorageAdapter } from "@/lib/storage/localStorageAdapter";
import { parseStoredRecord } from "@/lib/content/parseStoredJson";
import { homepage as defaultHomepage } from "@/data/homepage";
import type { HomepageContent } from "@/data/homepage";
import type { ContentRepository } from "@/lib/content/types";

export const HOMEPAGE_STORAGE_KEY = "kulapaws:content:homepage";

export const homepageRepository: ContentRepository<HomepageContent> = {
  async get() {
    const raw = localStorageAdapter.getItem(HOMEPAGE_STORAGE_KEY);
    if (!raw) return defaultHomepage;
    const stored = parseStoredRecord<HomepageContent>(raw);
    if (!stored) return defaultHomepage;
    return {
      ...defaultHomepage,
      ...stored,
      hero: { ...defaultHomepage.hero, ...stored.hero },
      servicesSection: { ...defaultHomepage.servicesSection, ...stored.servicesSection },
      mobileHighlight: { ...defaultHomepage.mobileHighlight, ...stored.mobileHighlight },
      whyKulapaws: { ...defaultHomepage.whyKulapaws, ...stored.whyKulapaws },
      productsPreview: { ...defaultHomepage.productsPreview, ...stored.productsPreview },
      howItWorks: { ...defaultHomepage.howItWorks, ...stored.howItWorks },
      faqPreview: { ...defaultHomepage.faqPreview, ...stored.faqPreview },
      finalCta: { ...defaultHomepage.finalCta, ...stored.finalCta },
    };
  },

  async set(value) {
    localStorageAdapter.setItem(HOMEPAGE_STORAGE_KEY, JSON.stringify(value));
  },

  async reset() {
    localStorageAdapter.removeItem(HOMEPAGE_STORAGE_KEY);
  },
};
