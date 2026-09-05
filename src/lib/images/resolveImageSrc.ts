import { isLocalImageRef, localImageStore } from "@/lib/images/localImageStore";

const objectUrlCache = new Map<string, string>();

// Turns a stored image reference into something an <img>/<Image> can
// render: a plain path/URL is returned as-is; a "local:<id>" ref is
// resolved to a cached object URL backed by the IndexedDB blob. Content
// records only ever hold the reference string — this is the one place
// that turns a reference into actual pixels.
export async function resolveImageSrc(ref: string | null | undefined): Promise<string | null> {
  if (!ref) return null;
  if (!isLocalImageRef(ref)) return ref;

  const cached = objectUrlCache.get(ref);
  if (cached) return cached;

  const blob = await localImageStore.getBlob(ref);
  if (!blob) return null;

  const url = URL.createObjectURL(blob);
  objectUrlCache.set(ref, url);
  return url;
}
