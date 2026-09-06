import { localStorageAdapter } from "@/lib/storage/localStorageAdapter";
import { parseStoredArray } from "@/lib/content/parseStoredJson";
import { faqs as defaultFaqs } from "@/data/faqs";
import type { Faq } from "@/data/faqs";

export const FAQS_STORAGE_KEY = "kulapaws:content:faqs";

// Same bounded, fully admin-owned snapshot model as servicesRepository.
// `id` is the collection's id (question text is editable, so it can't be
// the id).
export interface FaqsRepository {
  list(): Promise<Faq[]>;
  create(faq: Faq): Promise<void>;
  update(id: string, faq: Faq): Promise<void>;
  remove(id: string): Promise<void>;
  reset(): Promise<void>;
}

function readSnapshot(): Faq[] {
  const raw = localStorageAdapter.getItem(FAQS_STORAGE_KEY);
  if (!raw) return defaultFaqs;
  return parseStoredArray<Faq>(raw) ?? defaultFaqs;
}

function writeSnapshot(faqs: Faq[]) {
  localStorageAdapter.setItem(FAQS_STORAGE_KEY, JSON.stringify(faqs));
}

export const faqsRepository: FaqsRepository = {
  async list() {
    return readSnapshot();
  },

  async create(faq) {
    const current = readSnapshot();
    writeSnapshot([...current, faq]);
  },

  async update(id, faq) {
    const current = readSnapshot();
    writeSnapshot(current.map((existing) => (existing.id === id ? faq : existing)));
  },

  async remove(id) {
    const current = readSnapshot();
    writeSnapshot(current.filter((existing) => existing.id !== id));
  },

  async reset() {
    localStorageAdapter.removeItem(FAQS_STORAGE_KEY);
  },
};
