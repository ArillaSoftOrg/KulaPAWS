import { notFound } from "next/navigation";
import { ServiceDetail } from "@/components/sections/ServiceDetail";
import { getServiceBySlug } from "@/data/services";

export default function DogGroomingPage() {
  const service = getServiceBySlug("dog-grooming");
  if (!service) notFound();

  return <ServiceDetail service={service} />;
}
