import { appointmentCopy } from "@/data/appointment";
import { appointmentAvailability } from "@/data/appointmentAvailability";
import { getBreed } from "@/data/petBreeds";
import type { PetDetails, PriceQuote, TimeSlot } from "@/lib/appointments/types";

// Short, human-friendly handle for an appointment id (a UUID) — enough to
// tell appointments apart in a WhatsApp chat or on the phone.
export function formatAppointmentReference(id: string): string {
  return id.replace(/-/g, "").slice(0, 8).toUpperCase();
}

// "Dog · Maltese · Small" — type, breed and (if any) size band.
export function formatPetDescription(pet: PetDetails): string {
  const parts = [appointmentCopy.petTypes[pet.type], getBreed(pet.type, pet.breedId)?.label ?? pet.breedId];
  if (pet.size) parts.push(appointmentCopy.sizes[pet.size].label);
  return parts.join(" · ");
}

// An ISO instant (createdAt/updatedAt) shown in the business time zone.
export function formatTimestamp(iso: string): string {
  return new Intl.DateTimeFormat(appointmentCopy.locale, {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: appointmentAvailability.timeZone,
  }).format(new Date(iso));
}

export function formatAppointmentDateLong(date: string): string {
  return formatAppointmentDate(date, { weekday: "long", day: "numeric", month: "long", year: "numeric" });
}

// Appointment dates are wall-clock calendar dates (see time.ts), so they're
// formatted as UTC midnight with timeZone "UTC" — formatting in the
// viewer's own zone could shift the displayed day.
export function formatAppointmentDate(date: string, options: Intl.DateTimeFormatOptions): string {
  return new Intl.DateTimeFormat(appointmentCopy.locale, { ...options, timeZone: "UTC" }).format(
    new Date(`${date}T00:00:00Z`),
  );
}

export function formatSlotTime(slot: TimeSlot): string {
  return `${slot.start} – ${slot.end}`;
}

export function formatPriceQuote(quote: PriceQuote): string {
  if (quote.kind === "priced") {
    return new Intl.NumberFormat(appointmentCopy.locale, { style: "currency", currency: quote.currency }).format(
      quote.amount,
    );
  }
  if (quote.kind === "on-request") return appointmentCopy.price.onRequest;
  return appointmentCopy.price.unavailable[quote.reason];
}
