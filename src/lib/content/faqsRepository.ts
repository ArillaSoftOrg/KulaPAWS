import { localStorageAdapter } from "@/lib/storage/localStorageAdapter";
import { faqs as defaultFaqs } from "@/data/faqs";
import type { Faq } from "@/data/faqs";

const STORAGE_KEY = "kulapaws:content:faqs";

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
  const raw = localStorageAdapter.getItem(STORAGE_KEY);
  if (!raw) return defaultFaqs;
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as Faq[]) : defaultFaqs;
  } catch {
    return defaultFaqs;
  }
}

function writeSnapshot(faqs: Faq[]) {
  localStorageAdapter.setItem(STORAGE_KEY, JSON.stringify(faqs));
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
    localStorageAdapter.removeItem(STORAGE_KEY);
  },
};
