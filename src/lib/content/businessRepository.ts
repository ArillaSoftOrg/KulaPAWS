import { localStorageAdapter } from "@/lib/storage/localStorageAdapter";
import { parseStoredRecord } from "@/lib/content/parseStoredJson";
import { business as defaultBusiness } from "@/data/business";
import type { Business } from "@/data/business";
import type { ContentRepository } from "@/lib/content/types";

export const BUSINESS_STORAGE_KEY = "kulapaws:content:business";

export const businessRepository: ContentRepository<Business> = {
  async get() {
    const raw = localStorageAdapter.getItem(BUSINESS_STORAGE_KEY);
    if (!raw) return defaultBusiness;
    const stored = parseStoredRecord<Business>(raw);
    if (!stored) return defaultBusiness;
    return { ...defaultBusiness, ...stored };
  },

  async set(value) {
    localStorageAdapter.setItem(BUSINESS_STORAGE_KEY, JSON.stringify(value));
  },

  async reset() {
    localStorageAdapter.removeItem(BUSINESS_STORAGE_KEY);
  },
};
