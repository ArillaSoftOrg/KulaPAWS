import { createClient } from "@/lib/supabase/client";
import { localStorageAdapter } from "@/lib/storage/localStorageAdapter";
import { isManagedImageRef, deleteImage } from "@/lib/images/imagesRepository";
import { business as defaultBusiness } from "@/data/business";
import type { Business, SocialLink } from "@/data/business";
import type { ContentRepository } from "@/lib/content/types";

// Not real data — a same-origin, cross-tab notification only. A native
// localStorage write fires the "storage" event in every OTHER open tab
// (never the tab that wrote it); useLiveContent already listens for that,
// so touching this key after a Supabase write lets an already-open public
// tab refresh without a full reload. No business data is ever stored here.
export const BUSINESS_SYNC_PING_KEY = "kulapaws:sync:business";

function notifyOtherTabs() {
  localStorageAdapter.setItem(BUSINESS_SYNC_PING_KEY, String(Date.now()));
}

interface BusinessRow {
  name: string;
  tagline: string | null;
  phone: string | null;
  email: string | null;
  whatsapp: string | null;
  address: string | null;
  service_areas: string[] | null;
  business_hours: string | null;
  social_links: SocialLink[] | null;
  logo_image_id: string | null;
}

// The one place DB snake_case meets the app's existing camelCase Business
// shape — every caller (admin form, public Live* components) keeps working
// against the same TypeScript type regardless of backend. logo_image_id
// null means "use the packaged default logo asset"; a real value is a
// public.images.id, resolved to an actual URL downstream by
// resolveImageSrc — logoSrc itself stays a raw ref either way, exactly
// like services.image and page_content image fields.
function rowToBusiness(row: BusinessRow): Business {
  return {
    name: row.name,
    tagline: row.tagline,
    phone: row.phone,
    email: row.email,
    whatsapp: row.whatsapp,
    address: row.address,
    serviceAreas: row.service_areas ?? [],
    businessHours: row.business_hours,
    socialLinks: row.social_links ?? [],
    logoSrc: row.logo_image_id ?? defaultBusiness.logoSrc,
  };
}

function businessToRow(value: Business) {
  return {
    id: 1,
    name: value.name,
    tagline: value.tagline,
    phone: value.phone,
    email: value.email,
    whatsapp: value.whatsapp,
    address: value.address,
    service_areas: value.serviceAreas,
    business_hours: value.businessHours,
    social_links: value.socialLinks,
    logo_image_id: isManagedImageRef(value.logoSrc) ? value.logoSrc : null,
  };
}

export const businessRepository: ContentRepository<Business> = {
  async get() {
    const supabase = createClient();
    const { data, error } = await supabase.from("business").select("*").eq("id", 1).maybeSingle();
    if (error || !data) {
      if (error) console.error("businessRepository.get failed, falling back to defaults:", error.message);
      return defaultBusiness;
    }
    return rowToBusiness(data as BusinessRow);
  },

  async set(value) {
    const supabase = createClient();
    const { error } = await supabase.from("business").upsert(businessToRow(value), { onConflict: "id" });
    if (error) throw new Error(error.message);

    notifyOtherTabs();
  },

  async reset() {
    const supabase = createClient();

    // Capture the current logo before it's overwritten, so it can be
    // cleaned up (best-effort) once the reset itself has succeeded.
    const { data: currentRow } = await supabase.from("business").select("logo_image_id").eq("id", 1).maybeSingle();
    const previousLogoImageId = (currentRow as { logo_image_id: string | null } | null)?.logo_image_id ?? null;

    const { error } = await supabase
      .from("business")
      .upsert(businessToRow(defaultBusiness), { onConflict: "id" });
    if (error) throw new Error(error.message);

    if (previousLogoImageId) {
      deleteImage(previousLogoImageId).catch((err) => {
        console.error("Failed to clean up previous logo image after business reset:", err);
      });
    }

    notifyOtherTabs();
  },
};
