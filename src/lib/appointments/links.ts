import { primaryCta } from "@/data/navigation";

// The booking flow's URL, optionally with a service preselected (the flow
// reads ?service=<slug> and opens on the pet step). Built from primaryCta so
// every entry point follows the one site-wide "Request Appointment" target.
export function appointmentHref(serviceSlug?: string): string {
  return serviceSlug ? `${primaryCta.href}?service=${encodeURIComponent(serviceSlug)}` : primaryCta.href;
}
