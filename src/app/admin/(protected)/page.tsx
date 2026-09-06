import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { AdminPageHeader } from "@/components/admin/layout/AdminPageHeader";
import { adminNavItems } from "@/components/admin/layout/adminNav";

const sectionDescriptions: Record<string, string> = {
  "/admin/appointments": "Placeholder — booking isn't implemented yet.",
  "/admin/business": "Contact info, service areas, hours, and social links.",
  "/admin/services": "Create, edit, and remove the grooming services.",
  "/admin/content": "Edit homepage, about, services, and contact page copy.",
  "/admin/images": "Replace the logo and page images, or reset to defaults.",
  "/admin/settings": "Local-only reset controls for this admin panel.",
};

export default function AdminDashboardPage() {
  const sections = adminNavItems.filter((item) => item.href !== "/admin");

  return (
    <div className="flex flex-col gap-6">
      <AdminPageHeader
        title="Admin Dashboard"
        description="Local development demo. Choose a section below to manage site content."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {sections.map((item) => (
          <Card key={item.href} as="article" interactive className="relative flex flex-col gap-2">
            <Link
              href={item.href}
              className="font-semibold text-foreground after:absolute after:inset-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
            >
              {item.label}
            </Link>
            <p className="text-[14px] text-muted-foreground">{sectionDescriptions[item.href]}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
