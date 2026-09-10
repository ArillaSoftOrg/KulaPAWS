import type { Metadata } from "next";
import { ContactContent } from "@/components/content/ContactContent";
import { contactPageContent } from "@/data/contactPage";
import { business } from "@/data/business";

export const metadata: Metadata = {
  title: "Contact Us",
  description: contactPageContent.description,
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return <ContactContent defaultContactPage={contactPageContent} defaultBusiness={business} />;
}
