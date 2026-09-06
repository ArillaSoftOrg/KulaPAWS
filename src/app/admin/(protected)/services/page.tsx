import { AdminPageHeader } from "@/components/admin/layout/AdminPageHeader";
import { ServicesManager } from "@/components/admin/forms/ServicesManager";

export default function AdminServicesPage() {
  return (
    <div className="flex flex-col gap-6">
      <AdminPageHeader
        title="Services"
        description="Create, edit, and remove the grooming services shown on the public site."
      />
      <ServicesManager />
    </div>
  );
}
