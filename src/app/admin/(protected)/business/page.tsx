import { Heading } from "@/components/ui/Heading";
import { BusinessForm } from "@/components/admin/forms/BusinessForm";

export default function AdminBusinessPage() {
  return (
    <div className="flex flex-col gap-6">
      <Heading level="h2">Business Information</Heading>
      <BusinessForm />
    </div>
  );
}
