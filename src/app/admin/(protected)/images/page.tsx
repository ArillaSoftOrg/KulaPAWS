import { AdminPageHeader } from "@/components/admin/layout/AdminPageHeader";
import { ImagesManager } from "@/components/admin/images/ImagesManager";

export default function AdminImagesPage() {
  return (
    <div className="flex flex-col gap-6">
      <AdminPageHeader
        title="Images"
        description="Replace the logo and page images used across the public site, or reset them to defaults."
      />
      <ImagesManager />
    </div>
  );
}
