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

export const primaryCta: NavItem = {
  label: "Request Appointment",
  href: "/contact",
};
