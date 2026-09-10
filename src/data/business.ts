export interface SocialLink {
  platform: string;
  url: string;
}

export interface Business {
  name: string;
  tagline: string | null;
  phone: string | null;
  email: string | null;
  whatsapp: string | null;
  address: string | null;
  serviceAreas: string[];
  businessHours: string | null;
  socialLinks: SocialLink[];
  logoSrc: string;
}

// Central business record (shape mirrors README.md §7 "Business Data
// Needed"). Unknown values stay null/empty — never invented. Update this
// file only, once real business facts are confirmed; no page component
// should need to change to pick up new values here.
//
// Kulapaws is a mobile/service-area business — customers never visit a
// physical location, so `address` correctly stays null rather than
// inventing one. `tagline`, `email`, and `businessHours` remain
// unconfirmed and stay null for the same reason. phone/whatsapp/
// serviceAreas/socialLinks below are real, verified business facts.
//
// This file is the code-level fallback only. The live Supabase `business`
// row (edited via /admin/business) still needs these same values entered
// there for them to take effect on a deployed site — updating this file
// does not change production data (see businessRepository.ts).
export const business: Business = {
  name: "Kulapaws",
  tagline: null,
  phone: "+90 540 314 62 23",
  email: null,
  whatsapp: "+90 540 314 62 23",
  address: null,
  serviceAreas: ["Antalya Merkez", "Kemer", "Kumluca", "Finike", "Demre", "Kaş", "Kalkan", "Fethiye"],
  businessHours: null,
  socialLinks: [{ platform: "Instagram", url: "https://www.instagram.com/kulapaws.tr/" }],
  logoSrc: "/brand/logo.jpg",
};
