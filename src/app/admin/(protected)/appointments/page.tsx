import { AdminPageHeader } from "@/components/admin/layout/AdminPageHeader";
import { EmptyState } from "@/components/ui/EmptyState";

export default function AdminAppointmentsPage() {
  return (
    <div className="flex flex-col gap-6">
      <AdminPageHeader title="Appointments" />
      <EmptyState
        title="Appointments are not implemented yet"
        description="This section is a placeholder for a future phase. No booking data exists yet."
      />
    </div>
  );
}
