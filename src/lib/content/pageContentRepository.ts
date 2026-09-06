import { createClient } from "@/lib/supabase/client";
import { localStorageAdapter } from "@/lib/storage/localStorageAdapter";
import type { ContentRepository } from "@/lib/content/types";

// Matches the page_content.key check constraint in
// supabase/migrations/20260906134100_initial_content_schema.sql.
export type PageContentKey = "homepage" | "about" | "servicesPage" | "contactPage";

// Not real data — a same-origin, cross-tab notification only, same pattern
// as businessRepository/servicesRepository's ping keys. See useLiveContent
// for how this is used.
export function pageContentSyncKey(key: PageContentKey): string {
  return `kulapaws:sync:page_content:${key}`;
}

function notifyOtherTabs(key: PageContentKey) {
  localStorageAdapter.setItem(pageContentSyncKey(key), String(Date.now()));
}

interface PageContentRow {
  content: unknown;
}

// Generic factory backing all 4 page-content repositories (homepage, about,
// servicesPage, contactPage) — the one isolated place any page_content row
// meets the app's existing TypeScript content shape for that page. Every
// caller keeps its own exported repository object and default value, so
// nothing about this being Supabase-backed leaks into admin forms or public
// components.
//
// `mergeWithDefaults` lets each repository preserve its own per-section
// deep-merge behavior (nested defaults filled in under a partially-shaped
// stored value) exactly as it worked when backed by localStorage — a
// network/DB layer doesn't change what "safely handle partial or malformed
// content" means for each shape.
export function createPageContentRepository<T extends object>(
  key: PageContentKey,
  defaultValue: T,
  mergeWithDefaults: (stored: Partial<T>) => T,
): ContentRepository<T> {
  return {
    async get() {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("page_content")
        .select("content")
        .eq("key", key)
        .maybeSingle();

      if (error || !data) {
        if (error) {
          console.error(`pageContentRepository(${key}).get failed, falling back to defaults:`, error.message);
        }
        return defaultValue;
      }

      const { content } = data as PageContentRow;
      if (typeof content !== "object" || content === null || Array.isArray(content)) {
        return defaultValue;
      }
      return mergeWithDefaults(content as Partial<T>);
    },

    async set(value) {
      const supabase = createClient();
      const { error } = await supabase.from("page_content").upsert({ key, content: value }, { onConflict: "key" });
      if (error) throw new Error(error.message);
      notifyOtherTabs(key);
    },

    async reset() {
      const supabase = createClient();
      const { error } = await supabase
        .from("page_content")
        .upsert({ key, content: defaultValue }, { onConflict: "key" });
      if (error) throw new Error(error.message);
      notifyOtherTabs(key);
    },
  };
}
