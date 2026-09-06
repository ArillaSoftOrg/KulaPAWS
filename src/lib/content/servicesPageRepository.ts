import { localStorageAdapter } from "@/lib/storage/localStorageAdapter";
import { parseStoredRecord } from "@/lib/content/parseStoredJson";
import { servicesPageContent as defaultServicesPage } from "@/data/servicesPage";
import type { ServicesPageContent } from "@/data/servicesPage";
import type { ContentRepository } from "@/lib/content/types";

export const SERVICES_PAGE_STORAGE_KEY = "kulapaws:content:servicesPage";

export const servicesPageRepository: ContentRepository<ServicesPageContent> = {
  async get() {
    const raw = localStorageAdapter.getItem(SERVICES_PAGE_STORAGE_KEY);
    if (!raw) return defaultServicesPage;
    const stored = parseStoredRecord<ServicesPageContent>(raw);
    if (!stored) return defaultServicesPage;
    return {
      ...defaultServicesPage,
      ...stored,
      header: { ...defaultServicesPage.header, ...stored.header },
      cta: { ...defaultServicesPage.cta, ...stored.cta },
    };
  },

  async set(value) {
    localStorageAdapter.setItem(SERVICES_PAGE_STORAGE_KEY, JSON.stringify(value));
  },

  async reset() {
    localStorageAdapter.removeItem(SERVICES_PAGE_STORAGE_KEY);
  },
};
