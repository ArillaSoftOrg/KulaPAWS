import type { ImageStore } from "@/lib/images/types";

const DB_NAME = "kulapaws-images";
const DB_VERSION = 1;
const STORE_NAME = "images";

export const LOCAL_IMAGE_REF_PREFIX = "local:";

export function isLocalImageRef(value: string | null | undefined): value is string {
  return typeof value === "string" && value.startsWith(LOCAL_IMAGE_REF_PREFIX);
}

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === "undefined") {
      reject(new Error("IndexedDB is not available in this environment."));
      return;
    }
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      if (!request.result.objectStoreNames.contains(STORE_NAME)) {
        request.result.createObjectStore(STORE_NAME);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

// IndexedDB-backed local image storage — blobs never leave the browser.
// Content (business/homepage/about/service records) stores only the
// returned ref string, never the blob itself.
export const localImageStore: ImageStore = {
  async save(file) {
    const db = await openDb();
    const id = crypto.randomUUID();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readwrite");
      tx.objectStore(STORE_NAME).put(file, id);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
    db.close();
    return LOCAL_IMAGE_REF_PREFIX + id;
  },

  async getBlob(ref) {
    if (!isLocalImageRef(ref)) return null;
    const id = ref.slice(LOCAL_IMAGE_REF_PREFIX.length);
    const db = await openDb();
    const blob = await new Promise<Blob | null>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readonly");
      const request = tx.objectStore(STORE_NAME).get(id);
      request.onsuccess = () => resolve((request.result as Blob | undefined) ?? null);
      request.onerror = () => reject(request.error);
    });
    db.close();
    return blob;
  },

  async remove(ref) {
    if (!isLocalImageRef(ref)) return;
    const id = ref.slice(LOCAL_IMAGE_REF_PREFIX.length);
    const db = await openDb();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readwrite");
      tx.objectStore(STORE_NAME).delete(id);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
    db.close();
  },
};

// Administrative helper for the Settings "reset everything" action — not
// part of the ImageStore interface since a remote store's equivalent
// wouldn't necessarily be this trivial "wipe everything".
export async function clearAllLocalImages(): Promise<void> {
  const db = await openDb();
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    tx.objectStore(STORE_NAME).clear();
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
  db.close();
}
