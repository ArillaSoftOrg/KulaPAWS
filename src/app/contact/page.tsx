import { ContactContent } from "@/components/content/ContactContent";
import { contactPageContent } from "@/data/contactPage";
import { business } from "@/data/business";

export default function ContactPage() {
  return <ContactContent defaultContactPage={contactPageContent} defaultBusiness={business} />;
}
