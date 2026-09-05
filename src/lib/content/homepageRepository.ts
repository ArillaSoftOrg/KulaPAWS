import { localStorageAdapter } from "@/lib/storage/localStorageAdapter";
import { homepage as defaultHomepage } from "@/data/homepage";
import type { HomepageContent } from "@/data/homepage";
import type { ContentRepository } from "@/lib/content/types";

const STORAGE_KEY = "kulapaws:content:homepage";

export const homepageRepository: ContentRepository<HomepageContent> = {
  async get() {
    const raw = localStorageAdapter.getItem(STORAGE_KEY);
    if (!raw) return defaultHomepage;
    try {
      const stored = JSON.parse(raw) as Partial<HomepageContent>;
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
    } catch {
      return defaultHomepage;
    }
  },

  async set(value) {
    localStorageAdapter.setItem(STORAGE_KEY, JSON.stringify(value));
  },

  async reset() {
    localStorageAdapter.removeItem(STORAGE_KEY);
  },
};
