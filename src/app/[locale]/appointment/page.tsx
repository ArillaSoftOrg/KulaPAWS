// See app/[locale]/page.tsx for why this re-exports rather than duplicates.
// The booking flow's own copy is English-only for now; this route keeps
// tr/ru visitors inside their locale (header, footer, language switcher)
// on the way to and through it.
export { default, metadata } from "@/app/appointment/page";
