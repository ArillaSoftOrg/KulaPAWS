import { Heading } from "@/components/ui/Heading";
import { SettingsPanel } from "@/components/admin/forms/SettingsPanel";

export default function AdminSettingsPage() {
  return (
    <div className="flex flex-col gap-6">
      <Heading level="h2">Settings</Heading>
      <SettingsPanel />
    </div>
  );
}
