import { localStorageAdapter } from "@/lib/storage/localStorageAdapter";
import { servicesPageContent as defaultServicesPage } from "@/data/servicesPage";
import type { ServicesPageContent } from "@/data/servicesPage";
import type { ContentRepository } from "@/lib/content/types";

const STORAGE_KEY = "kulapaws:content:servicesPage";

export const servicesPageRepository: ContentRepository<ServicesPageContent> = {
  async get() {
    const raw = localStorageAdapter.getItem(STORAGE_KEY);
    if (!raw) return defaultServicesPage;
    try {
      const stored = JSON.parse(raw) as Partial<ServicesPageContent>;
      return {
        ...defaultServicesPage,
        ...stored,
        header: { ...defaultServicesPage.header, ...stored.header },
        cta: { ...defaultServicesPage.cta, ...stored.cta },
      };
    } catch {
      return defaultServicesPage;
    }
  },

  async set(value) {
    localStorageAdapter.setItem(STORAGE_KEY, JSON.stringify(value));
  },

  async reset() {
    localStorageAdapter.removeItem(STORAGE_KEY);
  },
};
