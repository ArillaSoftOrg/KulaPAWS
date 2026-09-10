import type { Metadata } from "next";
import { getServiceBySlug, services as defaultServices } from "@/data/services";
import { ServiceDetailLive } from "@/components/sections/ServiceDetailLive";
import { createPublicClient } from "@/lib/supabase/publicClient";

export function generateStaticParams() {
  return defaultServices.map((service) => ({ slug: service.slug }));
}

interface ServiceSlugPageProps {
  params: Promise<{ slug: string }>;
}

interface ServiceMetadataFields {
  title: string;
  shortDescription: string;
}

// Metadata must reflect what's actually live and publicly visible,
// including services created in /admin that never shipped as static
// defaults. Reads through the cookie-free anon-key client, so
// services_public_select (is_published = true) is what actually decides
// what this can see — same RLS boundary the public page itself uses, no
// service-role key involved. A DB miss or error falls back to the shipped
// static default for this slug (if any) before giving up.
async function resolveServiceMetadata(slug: string): Promise<ServiceMetadataFields | null> {
  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("services")
      .select("title, short_description")
      .eq("slug", slug)
      .maybeSingle();

    if (error) {
      console.error(
        `generateMetadata: Supabase lookup failed for service "${slug}", falling back to static defaults:`,
        error.message,
      );
    } else if (data) {
      return { title: data.title, shortDescription: data.short_description };
    }
  } catch (err) {
    console.error(
      `generateMetadata: Supabase client failed for service "${slug}", falling back to static defaults:`,
      err,
    );
  }

  const staticService = getServiceBySlug(slug);
  return staticService ? { title: staticService.title, shortDescription: staticService.shortDescription } : null;
}

export async function generateMetadata({ params }: ServiceSlugPageProps): Promise<Metadata> {
  const { slug } = await params;
  const canonical = `/services/${encodeURIComponent(slug)}`;
  const service = await resolveServiceMetadata(slug);

  if (!service) {
    return {
      title: "Service Not Found",
      description: "This service may have been removed, or the link is incorrect.",
      alternates: { canonical },
    };
  }

  return {
    title: service.title,
    description: service.shortDescription,
    alternates: { canonical },
  };
}

export default async function ServiceSlugPage({ params }: ServiceSlugPageProps) {
  const { slug } = await params;
  const defaultService = getServiceBySlug(slug) ?? null;

  return <ServiceDetailLive slug={slug} defaultService={defaultService} />;
}
