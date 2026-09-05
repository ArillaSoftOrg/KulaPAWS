import { Heading } from "@/components/ui/Heading";
import { ContentTabs } from "@/components/admin/content/ContentTabs";

export default function AdminContentPage() {
  return (
    <div className="flex flex-col gap-6">
      <Heading level="h2">Site Content</Heading>
      <ContentTabs />
    </div>
  );
}
