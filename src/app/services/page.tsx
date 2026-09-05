import { ServicesIndexContent } from "@/components/content/ServicesIndexContent";
import { servicesPageContent } from "@/data/servicesPage";
import { services } from "@/data/services";
import { primaryCta } from "@/data/navigation";

export default function ServicesPage() {
  return (
    <ServicesIndexContent
      defaultServicesPage={servicesPageContent}
      defaultServices={services}
      primaryCta={primaryCta}
    />
  );
}
