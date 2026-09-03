import { PageHeader } from "@/components/layout/PageHeader";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { business } from "@/data/business";

const contactRows = [
  business.phone && { label: "Phone", value: business.phone },
  business.email && { label: "Email", value: business.email },
  business.whatsapp && { label: "WhatsApp", value: business.whatsapp },
  business.address && { label: "Address", value: business.address },
  business.businessHours && { label: "Business Hours", value: business.businessHours },
  business.serviceAreas.length > 0 && { label: "Service Areas", value: business.serviceAreas.join(", ") },
].filter((row): row is { label: string; value: string } => Boolean(row));

export default function ContactPage() {
  return (
    <>
      <PageHeader
        title="Contact us"
        description="Send us a message and we'll get back to you."
      />

      <Section tone="background">
        <Container size="narrow" className="flex flex-col gap-10">
          {contactRows.length > 0 && (
            <dl className="flex flex-col gap-3">
              {contactRows.map((row) => (
                <div key={row.label} className="flex flex-col gap-1 sm:flex-row sm:gap-3">
                  <dt className="text-[14px] font-medium text-foreground sm:w-32 sm:flex-shrink-0">
                    {row.label}
                  </dt>
                  <dd className="text-[15px] text-muted-foreground">{row.value}</dd>
                </div>
              ))}
            </dl>
          )}

          <form className="flex flex-col gap-5" aria-describedby="contact-form-note">
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="flex flex-col gap-2">
                <label htmlFor="name" className="text-[14px] font-medium text-foreground">
                  Name <span aria-hidden="true">*</span>
                </label>
                <Input id="name" name="name" type="text" autoComplete="name" required />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="email" className="text-[14px] font-medium text-foreground">
                  Email <span aria-hidden="true">*</span>
                </label>
                <Input id="email" name="email" type="email" autoComplete="email" required />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="phone" className="text-[14px] font-medium text-foreground">
                Phone <span className="text-muted-foreground">(optional)</span>
              </label>
              <Input id="phone" name="phone" type="tel" autoComplete="tel" />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="message" className="text-[14px] font-medium text-foreground">
                Message <span aria-hidden="true">*</span>
              </label>
              <Textarea id="message" name="message" required />
            </div>

            <div>
              <Button type="submit" disabled>
                Send Message
              </Button>
              <p id="contact-form-note" className="mt-3 text-[14px] text-muted-foreground">
                This form isn&apos;t connected yet — submissions aren&apos;t sent.
              </p>
            </div>
          </form>
        </Container>
      </Section>
    </>
  );
}
