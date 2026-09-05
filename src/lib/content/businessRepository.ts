import { localStorageAdapter } from "@/lib/storage/localStorageAdapter";
import { business as defaultBusiness } from "@/data/business";
import type { Business } from "@/data/business";
import type { ContentRepository } from "@/lib/content/types";

const STORAGE_KEY = "kulapaws:content:business";

export const businessRepository: ContentRepository<Business> = {
  async get() {
    const raw = localStorageAdapter.getItem(STORAGE_KEY);
    if (!raw) return defaultBusiness;
    try {
      return { ...defaultBusiness, ...(JSON.parse(raw) as Partial<Business>) };
    } catch {
      return defaultBusiness;
    }
  },

  async set(value) {
    localStorageAdapter.setItem(STORAGE_KEY, JSON.stringify(value));
  },

  async reset() {
    localStorageAdapter.removeItem(STORAGE_KEY);
  },
};
