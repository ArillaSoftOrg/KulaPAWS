"use client";

import { AdminPageHeader } from "@/components/admin/layout/AdminPageHeader";
import { EmptyState } from "@/components/ui/EmptyState";
import { useLocale } from "@/lib/i18n/LocaleProvider";

export default function AdminAppointmentsPage() {
  const { dictionary } = useLocale();
  return (
    <div className="flex flex-col gap-6">
      <AdminPageHeader title={dictionary.admin.appointments.title} />
      <EmptyState
        title={dictionary.admin.appointments.emptyTitle}
        description={dictionary.admin.appointments.emptyDescription}
      />
    </div>
  );
}
