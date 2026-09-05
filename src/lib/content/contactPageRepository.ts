import { localStorageAdapter } from "@/lib/storage/localStorageAdapter";
import { contactPageContent as defaultContactPage } from "@/data/contactPage";
import type { ContactPageContent } from "@/data/contactPage";
import type { ContentRepository } from "@/lib/content/types";

const STORAGE_KEY = "kulapaws:content:contactPage";

export const contactPageRepository: ContentRepository<ContactPageContent> = {
  async get() {
    const raw = localStorageAdapter.getItem(STORAGE_KEY);
    if (!raw) return defaultContactPage;
    try {
      return { ...defaultContactPage, ...(JSON.parse(raw) as Partial<ContactPageContent>) };
    } catch {
      return defaultContactPage;
    }
  },

  async set(value) {
    localStorageAdapter.setItem(STORAGE_KEY, JSON.stringify(value));
  },

  async reset() {
    localStorageAdapter.removeItem(STORAGE_KEY);
  },
};
