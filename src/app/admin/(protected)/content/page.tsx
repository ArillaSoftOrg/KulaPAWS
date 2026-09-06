import { AdminPageHeader } from "@/components/admin/layout/AdminPageHeader";
import { ContentTabs } from "@/components/admin/content/ContentTabs";

export default function AdminContentPage() {
  return (
    <div className="flex flex-col gap-6">
      <AdminPageHeader
        title="Site Content"
        description="Edit the page copy shown on the homepage, about, services, contact, and FAQ pages."
      />
      <ContentTabs />
    </div>
  );
}
