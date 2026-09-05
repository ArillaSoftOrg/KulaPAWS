import type { StorageAdapter } from "@/lib/storage/types";

// SSR-safe: returns null/no-ops on the server so importing this in a
// Server Component context never throws — callers naturally fall back
// to defaults there.
export const sessionStorageAdapter: StorageAdapter = {
  getItem(key) {
    if (typeof window === "undefined") return null;
    return window.sessionStorage.getItem(key);
  },
  setItem(key, value) {
    if (typeof window === "undefined") return;
    window.sessionStorage.setItem(key, value);
  },
  removeItem(key) {
    if (typeof window === "undefined") return;
    window.sessionStorage.removeItem(key);
  },
};
