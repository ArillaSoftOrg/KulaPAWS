import { AdminPageHeader } from "@/components/admin/layout/AdminPageHeader";
import { AppointmentsManager } from "@/components/admin/appointments/AppointmentsManager";
import { appointmentCopy } from "@/data/appointment";

export default function AdminAppointmentsPage() {
  return (
    <div className="flex flex-col gap-6">
      <AdminPageHeader title="Appointments" description={appointmentCopy.admin.pageDescription} />
      <AppointmentsManager />
    </div>
  );
}
