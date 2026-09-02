import { notFound } from "next/navigation";
import { ServiceDetail } from "@/components/sections/ServiceDetail";
import { getServiceBySlug } from "@/data/services";

export default function CatGroomingPage() {
  const service = getServiceBySlug("cat-grooming");
  if (!service) notFound();

  return <ServiceDetail service={service} />;
}
