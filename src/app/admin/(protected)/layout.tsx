import type { ReactNode } from "react";
import { AdminAuthGate } from "@/components/admin/layout/AdminAuthGate";
import { AdminShell } from "@/components/admin/layout/AdminShell";

export default function ProtectedAdminLayout({ children }: { children: ReactNode }) {
  return (
    <AdminAuthGate>
      <AdminShell>{children}</AdminShell>
    </AdminAuthGate>
  );
}
