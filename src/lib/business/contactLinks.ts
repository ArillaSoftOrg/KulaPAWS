// Both derive their href from the same stored display value (e.g.
// "+90 540 314 62 23") rather than needing a second, separately-maintained
// "raw digits" field — one source of truth for NAP consistency.

// "tel:" wants the number as-is (with the leading +), just without spaces.
export function buildTelHref(phone: string): string {
  return `tel:${phone.replace(/\s+/g, "")}`;
}

// wa.me wants digits only — no "+", no spaces.
export function buildWhatsAppHref(whatsapp: string): string {
  return `https://wa.me/${whatsapp.replace(/\D/g, "")}`;
}
