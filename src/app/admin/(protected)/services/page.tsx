import { Heading } from "@/components/ui/Heading";
import { ServicesManager } from "@/components/admin/forms/ServicesManager";

export default function AdminServicesPage() {
  return (
    <div className="flex flex-col gap-6">
      <Heading level="h2">Services</Heading>
      <ServicesManager />
    </div>
  );
}
