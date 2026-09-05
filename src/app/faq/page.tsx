import { PageHeader } from "@/components/layout/PageHeader";
import { FaqSectionsLive } from "@/components/content/FaqSectionsLive";
import { faqs } from "@/data/faqs";

export default function FaqPage() {
  return (
    <>
      <PageHeader
        title="Frequently asked questions"
        description="Answers about our services, mobile grooming, and products."
      />

      <FaqSectionsLive mode="grouped" defaultFaqs={faqs} tone="background" />
    </>
  );
}
