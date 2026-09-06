"use client";

import { PageHeader } from "@/components/layout/PageHeader";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { LiveContactDetails } from "@/components/content/LiveContactDetails";
import { contactPageRepository, CONTACT_PAGE_SYNC_PING_KEY } from "@/lib/content/contactPageRepository";
import { useLiveContent } from "@/lib/content/useLiveContent";
import type { ContactPageContent } from "@/data/contactPage";
import type { Business } from "@/data/business";

const STORAGE_KEYS = [CONTACT_PAGE_SYNC_PING_KEY];

interface ContactContentProps {
  defaultContactPage: ContactPageContent;
  defaultBusiness: Business;
}

export function ContactContent({ defaultContactPage, defaultBusiness }: ContactContentProps) {
  const content = useLiveContent(defaultContactPage, contactPageRepository.get, STORAGE_KEYS);

  return (
    <>
      <PageHeader title={content.title} description={content.description} />

      <Section tone="background">
        <Container size="narrow" className="flex flex-col gap-10">
          <LiveContactDetails defaultBusiness={defaultBusiness} />

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
