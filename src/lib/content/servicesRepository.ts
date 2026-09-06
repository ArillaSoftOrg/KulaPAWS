import { localStorageAdapter } from "@/lib/storage/localStorageAdapter";
import { parseStoredArray } from "@/lib/content/parseStoredJson";
import { services as defaultServices } from "@/data/services";
import type { Service } from "@/data/services";

export const SERVICES_STORAGE_KEY = "kulapaws:content:services";

// Services are a bounded, fully admin-owned list (unlike business info,
// which is a single overridable record), so the repository stores a full
// snapshot rather than a partial override — this makes create/update/
// delete/rename unambiguous. `slug` is the collection's id.
export interface ServicesRepository {
  list(): Promise<Service[]>;
  create(service: Service): Promise<void>;
  update(originalSlug: string, service: Service): Promise<void>;
  remove(slug: string): Promise<void>;
  reset(): Promise<void>;
}

function readSnapshot(): Service[] {
  const raw = localStorageAdapter.getItem(SERVICES_STORAGE_KEY);
  if (!raw) return defaultServices;
  return parseStoredArray<Service>(raw) ?? defaultServices;
}

function writeSnapshot(services: Service[]) {
  localStorageAdapter.setItem(SERVICES_STORAGE_KEY, JSON.stringify(services));
}

export const servicesRepository: ServicesRepository = {
  async list() {
    return readSnapshot();
  },

  async create(service) {
    const current = readSnapshot();
    if (current.some((existing) => existing.slug === service.slug)) {
      throw new Error(`A service with slug "${service.slug}" already exists.`);
    }
    writeSnapshot([...current, service]);
  },

  async update(originalSlug, service) {
    const current = readSnapshot();
    const conflict = current.some(
      (existing) => existing.slug === service.slug && existing.slug !== originalSlug,
    );
    if (conflict) {
      throw new Error(`A service with slug "${service.slug}" already exists.`);
    }
    writeSnapshot(current.map((existing) => (existing.slug === originalSlug ? service : existing)));
  },

  async remove(slug) {
    const current = readSnapshot();
    writeSnapshot(current.filter((existing) => existing.slug !== slug));
  },

  async reset() {
    localStorageAdapter.removeItem(SERVICES_STORAGE_KEY);
  },
};
