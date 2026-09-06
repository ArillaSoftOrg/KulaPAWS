import { Card } from "@/components/ui/Card";
import { AdminPageHeader } from "@/components/admin/layout/AdminPageHeader";
import { BusinessForm } from "@/components/admin/forms/BusinessForm";

export default function AdminBusinessPage() {
  return (
    <div className="flex flex-col gap-6">
      <AdminPageHeader
        title="Business Information"
        description="Manage the business details shown across the public site — contact info, service areas, and social links."
      />
      <Card>
        <BusinessForm />
      </Card>
    </div>
  );
}
