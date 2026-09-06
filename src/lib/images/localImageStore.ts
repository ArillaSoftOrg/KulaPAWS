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
      reject(new Error("IndexedDB is not available in this browser."));
      return;
    }
    let request: IDBOpenDBRequest;
    try {
      request = indexedDB.open(DB_NAME, DB_VERSION);
    } catch (err) {
      reject(err instanceof Error ? err : new Error("Failed to open image storage."));
      return;
    }
    request.onupgradeneeded = () => {
      if (!request.result.objectStoreNames.contains(STORE_NAME)) {
        request.result.createObjectStore(STORE_NAME);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error("Failed to open image storage."));
    request.onblocked = () => reject(new Error("Image storage is blocked by another open tab."));
  });
}

// IndexedDB-backed local image storage — blobs never leave the browser.
// Content (business/homepage/about/service records) stores only the
// returned ref string, never the blob itself. Every method closes its
// connection in `finally` so a failed transaction never leaks an open
// handle that would block a later open() call.
export const localImageStore: ImageStore = {
  async save(file) {
    const db = await openDb();
    try {
      const id = crypto.randomUUID();
      await new Promise<void>((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, "readwrite");
        tx.objectStore(STORE_NAME).put(file, id);
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error ?? new Error("Failed to save image."));
      });
      return LOCAL_IMAGE_REF_PREFIX + id;
    } finally {
      db.close();
    }
  },

  async getBlob(ref) {
    if (!isLocalImageRef(ref)) return null;
    const id = ref.slice(LOCAL_IMAGE_REF_PREFIX.length);
    const db = await openDb();
    try {
      return await new Promise<Blob | null>((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, "readonly");
        const request = tx.objectStore(STORE_NAME).get(id);
        request.onsuccess = () => resolve((request.result as Blob | undefined) ?? null);
        request.onerror = () => reject(request.error ?? new Error("Failed to read image."));
      });
    } finally {
      db.close();
    }
  },

  async remove(ref) {
    if (!isLocalImageRef(ref)) return;
    const id = ref.slice(LOCAL_IMAGE_REF_PREFIX.length);
    const db = await openDb();
    try {
      await new Promise<void>((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, "readwrite");
        tx.objectStore(STORE_NAME).delete(id);
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error ?? new Error("Failed to remove image."));
      });
    } finally {
      db.close();
    }
  },
};

// Administrative helper for the Settings "reset everything" action — not
// part of the ImageStore interface since a remote store's equivalent
// wouldn't necessarily be this trivial "wipe everything". Swallows a
// missing-database error since "no images stored yet" is a valid state to
// reset from, not a failure.
export async function clearAllLocalImages(): Promise<void> {
  let db: IDBDatabase;
  try {
    db = await openDb();
  } catch {
    return;
  }
  try {
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readwrite");
      tx.objectStore(STORE_NAME).clear();
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error ?? new Error("Failed to clear images."));
    });
  } finally {
    db.close();
  }
}
