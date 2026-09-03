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
export const business: Business = {
  name: "Kulapaws",
  tagline: null,
  phone: null,
  email: null,
  whatsapp: null,
  address: null,
  serviceAreas: [],
  businessHours: null,
  socialLinks: [],
  logoSrc: "/brand/logo.jpg",
};
