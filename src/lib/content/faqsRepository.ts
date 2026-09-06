import { createClient } from "@/lib/supabase/client";
import { localStorageAdapter } from "@/lib/storage/localStorageAdapter";
import { faqs as defaultFaqs } from "@/data/faqs";
import type { Faq, FaqCategory } from "@/data/faqs";

// Not real data — a same-origin, cross-tab notification only, same pattern
// as business/servicesRepository's ping keys. See useLiveContent for how
// this is used.
export const FAQS_SYNC_PING_KEY = "kulapaws:sync:faqs";

function notifyOtherTabs() {
  localStorageAdapter.setItem(FAQS_SYNC_PING_KEY, String(Date.now()));
}

// Same bounded, fully admin-owned collection model as servicesRepository.
// `id` is the collection's id (question text is editable, so it can't be
// the id) — generated client-side by FaqForm via crypto.randomUUID(),
// unchanged by this migration.
export interface FaqsRepository {
  list(): Promise<Faq[]>;
  create(faq: Faq): Promise<void>;
  update(id: string, faq: Faq): Promise<void>;
  remove(id: string): Promise<void>;
  reset(): Promise<void>;
}

interface FaqRow {
  id: string;
  category: FaqCategory;
  question: string;
  answer: string;
}

// The one place DB snake_case/enum meets the app's existing Faq shape —
// admin CRUD UI and public consumers keep working against the same
// TypeScript type regardless of backend.
function rowToFaq(row: FaqRow): Faq {
  return {
    id: row.id,
    category: row.category,
    question: row.question,
    answer: row.answer,
  };
}

function faqToRow(faq: Faq) {
  return {
    id: faq.id,
    category: faq.category,
    question: faq.question,
    answer: faq.answer,
  };
}

// A UUID no real row will ever have — used as an always-true "delete
// everything" filter, since Postgrest requires an explicit filter for
// delete-many and `id` is a uuid column (unlike servicesRepository's text
// slug, an empty-string filter isn't a valid uuid literal here).
const NIL_UUID = "00000000-0000-0000-0000-000000000000";

export const faqsRepository: FaqsRepository = {
  async list() {
    const supabase = createClient();
    // No is_published filter here on purpose: RLS (faqs_public_select)
    // already restricts anon/non-admin reads to published rows, and an
    // admin-scoped SELECT policy (prepared, not yet applied — see
    // supabase/migrations/20260906160000_faqs_admin_select.sql) is meant to
    // let admins see everything through this exact same query once it
    // lands, with no app code change required.
    const { data, error } = await supabase
      .from("faqs")
      .select("*")
      .order("display_order", { ascending: true });
    if (error) {
      console.error("faqsRepository.list failed, falling back to defaults:", error.message);
      return defaultFaqs;
    }
    return (data as FaqRow[]).map(rowToFaq);
  },

  async create(faq) {
    const supabase = createClient();
    const { count } = await supabase.from("faqs").select("*", { count: "exact", head: true });
    const { error } = await supabase.from("faqs").insert({ ...faqToRow(faq), display_order: count ?? 0 });
    if (error) throw new Error(error.message);
    notifyOtherTabs();
  },

  async update(id, faq) {
    const supabase = createClient();
    const { error } = await supabase.from("faqs").update(faqToRow(faq)).eq("id", id);
    if (error) throw new Error(error.message);
    notifyOtherTabs();
  },

  async remove(id) {
    const supabase = createClient();
    const { error } = await supabase.from("faqs").delete().eq("id", id);
    if (error) throw new Error(error.message);
    notifyOtherTabs();
  },

  async reset() {
    const supabase = createClient();
    const defaultIds = defaultFaqs.map((faq) => faq.id);

    // Restore shipped defaults in place first (upsert by id) rather than
    // deleting everything up front — if this fails partway, existing rows
    // are left exactly as they were instead of gone with nothing put back.
    if (defaultFaqs.length > 0) {
      const { error: upsertError } = await supabase.from("faqs").upsert(
        defaultFaqs.map((faq, index) => ({ ...faqToRow(faq), display_order: index, is_published: true })),
        { onConflict: "id" },
      );
      if (upsertError) throw new Error(upsertError.message);
    }

    // Only once any defaults are confirmed restored, remove everything
    // else. src/data/faqs.ts currently ships an empty array, so this branch
    // (no defaults to preserve) simply clears the table — the same
    // "reset to nothing" behavior the old localStorage.removeItem had.
    const { error: deleteError } =
      defaultIds.length > 0
        ? await supabase.from("faqs").delete().not("id", "in", `(${defaultIds.join(",")})`)
        : await supabase.from("faqs").delete().neq("id", NIL_UUID);
    if (deleteError) throw new Error(deleteError.message);

    notifyOtherTabs();
  },
};
