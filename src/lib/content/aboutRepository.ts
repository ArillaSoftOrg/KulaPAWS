import { localStorageAdapter } from "@/lib/storage/localStorageAdapter";
import { aboutContent as defaultAbout } from "@/data/about";
import type { AboutContent } from "@/data/about";
import type { ContentRepository } from "@/lib/content/types";

const STORAGE_KEY = "kulapaws:content:about";

export const aboutRepository: ContentRepository<AboutContent> = {
  async get() {
    const raw = localStorageAdapter.getItem(STORAGE_KEY);
    if (!raw) return defaultAbout;
    try {
      const stored = JSON.parse(raw) as Partial<AboutContent>;
      return {
        ...defaultAbout,
        ...stored,
        header: { ...defaultAbout.header, ...stored.header },
        mobileStory: { ...defaultAbout.mobileStory, ...stored.mobileStory },
        values: { ...defaultAbout.values, ...stored.values },
        cta: { ...defaultAbout.cta, ...stored.cta },
      };
    } catch {
      return defaultAbout;
    }
  },

  async set(value) {
    localStorageAdapter.setItem(STORAGE_KEY, JSON.stringify(value));
  },

  async reset() {
    localStorageAdapter.removeItem(STORAGE_KEY);
  },
};
