import { PageHeader } from "@/components/layout/PageHeader";
import { FAQSection } from "@/components/sections/FAQSection";
import { faqs } from "@/data/faqs";

export default function FaqPage() {
  return (
    <>
      <PageHeader
        title="Frequently asked questions"
        description="Answers about our services, mobile grooming, and products."
      />

      <FAQSection heading="General" items={faqs} tone="background" />
    </>
  );
}
