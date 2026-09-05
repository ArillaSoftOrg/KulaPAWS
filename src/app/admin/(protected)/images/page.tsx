import { Heading } from "@/components/ui/Heading";
import { ImagesManager } from "@/components/admin/images/ImagesManager";

export default function AdminImagesPage() {
  return (
    <div className="flex flex-col gap-6">
      <Heading level="h2">Images</Heading>
      <ImagesManager />
    </div>
  );
}
