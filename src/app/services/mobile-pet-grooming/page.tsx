import { notFound } from "next/navigation";
import { ServiceDetail } from "@/components/sections/ServiceDetail";
import { getServiceBySlug } from "@/data/services";

export default function MobilePetGroomingPage() {
  const service = getServiceBySlug("mobile-pet-grooming");
  if (!service) notFound();

  return <ServiceDetail service={service} />;
}
