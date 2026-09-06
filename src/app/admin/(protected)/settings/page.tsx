import { AdminPageHeader } from "@/components/admin/layout/AdminPageHeader";
import { SettingsPanel } from "@/components/admin/forms/SettingsPanel";

export default function AdminSettingsPage() {
  return (
    <div className="flex flex-col gap-6">
      <AdminPageHeader
        title="Settings"
        description="Controls for this admin panel — not account or site-wide settings."
      />
      <SettingsPanel />
    </div>
  );
}
