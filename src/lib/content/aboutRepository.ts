import { localStorageAdapter } from "@/lib/storage/localStorageAdapter";
import { parseStoredRecord } from "@/lib/content/parseStoredJson";
import { aboutContent as defaultAbout } from "@/data/about";
import type { AboutContent } from "@/data/about";
import type { ContentRepository } from "@/lib/content/types";

export const ABOUT_STORAGE_KEY = "kulapaws:content:about";

export const aboutRepository: ContentRepository<AboutContent> = {
  async get() {
    const raw = localStorageAdapter.getItem(ABOUT_STORAGE_KEY);
    if (!raw) return defaultAbout;
    const stored = parseStoredRecord<AboutContent>(raw);
    if (!stored) return defaultAbout;
    return {
      ...defaultAbout,
      ...stored,
      header: { ...defaultAbout.header, ...stored.header },
      mobileStory: { ...defaultAbout.mobileStory, ...stored.mobileStory },
      values: { ...defaultAbout.values, ...stored.values },
      cta: { ...defaultAbout.cta, ...stored.cta },
    };
  },

  async set(value) {
    localStorageAdapter.setItem(ABOUT_STORAGE_KEY, JSON.stringify(value));
  },

  async reset() {
    localStorageAdapter.removeItem(ABOUT_STORAGE_KEY);
  },
};
