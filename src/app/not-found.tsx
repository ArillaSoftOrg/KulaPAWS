import type { Metadata } from "next";
import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { buttonVariants } from "@/components/ui/Button";

// The App Router's not-found convention already makes the response a real
// HTTP 404 — nothing here needs to (or can) change that. This also covers
// /services/[slug]'s own notFound() call, since it renders the nearest
// not-found boundary, which is this file. No `robots` field here: Next
// already injects `<meta name="robots" content="noindex">` automatically
// for any 404 response (verified against actual rendered output) — adding
// one here would just produce a second, redundant robots tag.
export const metadata: Metadata = {
  title: "Page Not Found",
};

export default function NotFound() {
  return (
    <Section tone="background">
      <Container size="content" className="flex flex-col items-center gap-5 py-20 text-center sm:py-28">
        <p className="text-[14px] font-medium uppercase tracking-wide text-primary">404</p>
        <Heading level="h1">Page not found</Heading>
        <p className="max-w-[50ch] text-[16px] text-muted-foreground sm:text-[18px]">
          The page you&apos;re looking for doesn&apos;t exist or may have been moved.
        </p>
        <div className="mt-3 flex flex-col gap-3 sm:flex-row">
          <Link href="/" className={buttonVariants({ variant: "primary" })}>
            Back to Home
          </Link>
          <Link href="/services" className={buttonVariants({ variant: "secondary" })}>
            View Services
          </Link>
        </div>
      </Container>
    </Section>
  );
}
