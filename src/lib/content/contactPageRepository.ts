import { localStorageAdapter } from "@/lib/storage/localStorageAdapter";
import { parseStoredRecord } from "@/lib/content/parseStoredJson";
import { contactPageContent as defaultContactPage } from "@/data/contactPage";
import type { ContactPageContent } from "@/data/contactPage";
import type { ContentRepository } from "@/lib/content/types";

export const CONTACT_PAGE_STORAGE_KEY = "kulapaws:content:contactPage";

export const contactPageRepository: ContentRepository<ContactPageContent> = {
  async get() {
    const raw = localStorageAdapter.getItem(CONTACT_PAGE_STORAGE_KEY);
    if (!raw) return defaultContactPage;
    const stored = parseStoredRecord<ContactPageContent>(raw);
    if (!stored) return defaultContactPage;
    return { ...defaultContactPage, ...stored };
  },

  async set(value) {
    localStorageAdapter.setItem(CONTACT_PAGE_STORAGE_KEY, JSON.stringify(value));
  },

  async reset() {
    localStorageAdapter.removeItem(CONTACT_PAGE_STORAGE_KEY);
  },
};
