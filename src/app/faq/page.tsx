import { PageHeader } from "@/components/layout/PageHeader";
import { FAQSection } from "@/components/sections/FAQSection";
import { faqs, type FaqCategory } from "@/data/faqs";

const categoryOrder: FaqCategory[] = [
  "General",
  "Dog Grooming",
  "Cat Grooming",
  "Mobile Service",
  "Appointments",
  "Products",
];

const groups =
  faqs.length > 0
    ? categoryOrder
        .map((category) => ({ category, items: faqs.filter((faq) => faq.category === category) }))
        .filter((group) => group.items.length > 0)
    : [{ category: "General" as FaqCategory, items: [] }];

export default function FaqPage() {
  return (
    <>
      <PageHeader
        title="Frequently asked questions"
        description="Answers about our services, mobile grooming, and products."
      />

      {groups.map((group) => (
        <FAQSection key={group.category} heading={group.category} items={group.items} tone="background" />
      ))}
    </>
  );
}
