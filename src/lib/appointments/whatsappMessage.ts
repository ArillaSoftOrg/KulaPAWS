import { appointmentCopy } from "@/data/appointment";
import {
  formatAppointmentDateLong,
  formatAppointmentReference,
  formatPetDescription,
  formatSlotTime,
} from "@/lib/appointments/format";
import type { Appointment } from "@/lib/appointments/types";

// The message a customer can send from the success screen — everything the
// business needs to find and confirm the request, one fact per line.
export function buildAppointmentWhatsAppMessage(appointment: Appointment, businessName: string): string {
  const { labels, greeting } = appointmentCopy.whatsappMessage;
  const { address } = appointment;
  const streetAddress = [address.addressLine, address.addressDetails].filter(Boolean).join(", ");

  return [
    greeting(businessName),
    "",
    `${labels.reference}: ${formatAppointmentReference(appointment.id)}`,
    `${labels.service}: ${appointment.serviceTitle}`,
    `${labels.pet}: ${appointment.pet.name} (${formatPetDescription(appointment.pet)})`,
    `${labels.date}: ${formatAppointmentDateLong(appointment.slot.date)}`,
    `${labels.time}: ${formatSlotTime(appointment.slot)}`,
    `${labels.area}: ${address.serviceArea}`,
    `${labels.address}: ${streetAddress}`,
    `${labels.name}: ${appointment.customer.fullName}`,
    `${labels.phone}: ${appointment.customer.phone}`,
  ].join("\n");
}
