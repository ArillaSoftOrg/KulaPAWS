import Link from "next/link";
import { Heading } from "@/components/ui/Heading";
import { Card } from "@/components/ui/Card";
import { adminNavItems } from "@/components/admin/layout/adminNav";

export default function AdminDashboardPage() {
  const sections = adminNavItems.filter((item) => item.href !== "/admin");

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Heading level="h2">Admin Dashboard</Heading>
        <p className="mt-2 text-[15px] text-muted-foreground">
          Local development demo. Choose a section to continue.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {sections.map((item) => (
          <Card key={item.href} as="article" interactive className="relative">
            <Link
              href={item.href}
              className="font-semibold text-foreground after:absolute after:inset-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
            >
              {item.label}
            </Link>
          </Card>
        ))}
      </div>
    </div>
  );
}
