import { createClient } from "@/lib/supabase/client";
import { localStorageAdapter } from "@/lib/storage/localStorageAdapter";
import { isManagedImageRef, deleteImage } from "@/lib/images/imagesRepository";
import { services as defaultServices } from "@/data/services";
import type { Service, ServiceProcessStep } from "@/data/services";

// Not real data — a same-origin, cross-tab notification only, same pattern
// as businessRepository's ping key. See useLiveContent for how this is used.
export const SERVICES_SYNC_PING_KEY = "kulapaws:sync:services";

function notifyOtherTabs() {
  localStorageAdapter.setItem(SERVICES_SYNC_PING_KEY, String(Date.now()));
}

function cleanupImage(imageId: string | null | undefined, context: string) {
  if (!imageId) return;
  deleteImage(imageId).catch((err) => {
    console.error(`Failed to clean up ${context}:`, err);
  });
}

// Services are a bounded, fully admin-owned list (unlike business info,
// which is a single overridable record), backed by a real multi-row table
// with a unique slug constraint — create/update/delete/rename are
// unambiguous. `slug` is the collection's id.
export interface ServicesRepository {
  list(): Promise<Service[]>;
  create(service: Service): Promise<void>;
  update(originalSlug: string, service: Service): Promise<void>;
  remove(slug: string): Promise<void>;
  reset(): Promise<void>;
}

interface ServiceRow {
  slug: string;
  title: string;
  short_description: string;
  overview: string;
  who_its_for: string[] | null;
  process: ServiceProcessStep[] | null;
  image_id: string | null;
}

const UNIQUE_VIOLATION = "23505";

function duplicateSlugError(slug: string): Error {
  return new Error(`A service with slug "${slug}" already exists.`);
}

// The one place DB snake_case meets the app's existing camelCase Service
// shape — admin CRUD UI and public consumers keep working against the same
// TypeScript type regardless of backend. image stays a raw ref (a
// public.images.id, or null) either way — resolveImageSrc turns it into an
// actual URL downstream, exactly like before this migration.
function rowToService(row: ServiceRow): Service {
  return {
    slug: row.slug,
    title: row.title,
    shortDescription: row.short_description,
    overview: row.overview,
    whoItsFor: row.who_its_for ?? [],
    process: row.process ?? [],
    image: row.image_id,
  };
}

function serviceToRow(service: Service) {
  return {
    slug: service.slug,
    title: service.title,
    short_description: service.shortDescription,
    overview: service.overview,
    who_its_for: service.whoItsFor,
    process: service.process,
    image_id: isManagedImageRef(service.image) ? service.image : null,
  };
}

export const servicesRepository: ServicesRepository = {
  async list() {
    const supabase = createClient();
    // No is_published filter here on purpose: RLS (services_public_select)
    // already restricts anon/non-admin reads to published rows, and an
    // admin-scoped SELECT policy (prepared, not yet applied — see
    // supabase/migrations/20260906150000_services_admin_select.sql) is
    // meant to let admins see everything through this exact same query
    // once it lands, with no app code change required.
    const { data, error } = await supabase
      .from("services")
      .select("*")
      .order("display_order", { ascending: true });
    if (error) {
      console.error("servicesRepository.list failed, falling back to defaults:", error.message);
      return defaultServices;
    }
    return (data as ServiceRow[]).map(rowToService);
  },

  async create(service) {
    const supabase = createClient();
    const { count } = await supabase.from("services").select("*", { count: "exact", head: true });
    const { error } = await supabase
      .from("services")
      .insert({ ...serviceToRow(service), display_order: count ?? 0 });
    if (error) {
      throw error.code === UNIQUE_VIOLATION ? duplicateSlugError(service.slug) : new Error(error.message);
    }
    notifyOtherTabs();
  },

  async update(originalSlug, service) {
    const supabase = createClient();
    const { error } = await supabase.from("services").update(serviceToRow(service)).eq("slug", originalSlug);
    if (error) {
      throw error.code === UNIQUE_VIOLATION ? duplicateSlugError(service.slug) : new Error(error.message);
    }
    notifyOtherTabs();
  },

  async remove(slug) {
    const supabase = createClient();

    // Capture the image before deleting the row — deleting a service
    // doesn't cascade-delete its image (the FK only clears the other
    // direction, on the image being deleted).
    const { data: row } = await supabase.from("services").select("image_id").eq("slug", slug).maybeSingle();
    const imageId = (row as { image_id: string | null } | null)?.image_id ?? null;

    const { error } = await supabase.from("services").delete().eq("slug", slug);
    if (error) throw new Error(error.message);

    cleanupImage(imageId, `image for deleted service "${slug}"`);
    notifyOtherTabs();
  },

  async reset() {
    const supabase = createClient();
    const defaultSlugs = defaultServices.map((service) => service.slug);

    // Capture every existing service's image before it's overwritten or
    // removed, so each can be cleaned up (best-effort) once the reset
    // itself has succeeded. Shipped defaults ship with no image, so
    // anything captured here is orphaned by the reset.
    const { data: existingRows } = await supabase.from("services").select("image_id");
    const previousImageIds = ((existingRows as { image_id: string | null }[] | null) ?? [])
      .map((row) => row.image_id)
      .filter((id): id is string => Boolean(id));

    // Restore the shipped defaults in place first (upsert by slug) rather
    // than deleting everything up front — if this fails partway (network,
    // RLS), existing rows are left exactly as they were instead of gone
    // with nothing put back.
    const { error: upsertError } = await supabase.from("services").upsert(
      defaultServices.map((service, index) => ({
        ...serviceToRow(service),
        display_order: index,
        is_published: true,
      })),
      { onConflict: "slug" },
    );
    if (upsertError) throw new Error(upsertError.message);

    // Only once the defaults are confirmed restored, remove anything else
    // (admin-created services not among the 3 shipped defaults).
    const { error: deleteError } = await supabase
      .from("services")
      .delete()
      .not("slug", "in", `(${defaultSlugs.join(",")})`);
    if (deleteError) throw new Error(deleteError.message);

    // Only after both DB steps above have succeeded, best-effort clean up
    // every image that was attached to any service before the reset.
    for (const imageId of previousImageIds) {
      cleanupImage(imageId, `orphaned image ${imageId} after services reset`);
    }

    notifyOtherTabs();
  },
};
