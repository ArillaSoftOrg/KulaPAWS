import type { Metadata } from "next";
import { ServicesIndexContent } from "@/components/content/ServicesIndexContent";
import { servicesPageContent } from "@/data/servicesPage";
import { services } from "@/data/services";
import { primaryCta } from "@/data/navigation";

export const metadata: Metadata = {
  title: "Grooming Services for Dogs & Cats",
  description: servicesPageContent.header.description,
  alternates: { canonical: "/services" },
};

export default function ServicesPage() {
  return (
    <ServicesIndexContent
      defaultServicesPage={servicesPageContent}
      defaultServices={services}
      primaryCta={primaryCta}
    />
  );
}
