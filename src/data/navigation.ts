export interface NavItem {
  label: string;
  href: string;
}

// Mirrors the approved sitemap in README.md §5. Do not add routes here
// that are not part of that sitemap.
export const primaryNav: NavItem[] = [
  { label: "Services", href: "/services" },
  { label: "Products", href: "/products" },
  { label: "About", href: "/about" },
  { label: "FAQ", href: "/faq" },
  { label: "Contact", href: "/contact" },
];

export const footerNav: NavItem[] = [
  ...primaryNav,
  { label: "Privacy", href: "/privacy" },
];

// Site-wide booking CTA (header, mobile menu, hero, CTA sections). Points
// at the online booking flow; see src/lib/appointments/links.ts for
// service-specific links.
export const primaryCta: NavItem = {
  label: "Request Appointment",
  href: "/appointment",
};
