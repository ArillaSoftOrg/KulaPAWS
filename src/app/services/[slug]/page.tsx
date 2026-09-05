import { getServiceBySlug, services as defaultServices } from "@/data/services";
import { ServiceDetailLive } from "@/components/sections/ServiceDetailLive";

export function generateStaticParams() {
  return defaultServices.map((service) => ({ slug: service.slug }));
}

interface ServiceSlugPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ServiceSlugPage({ params }: ServiceSlugPageProps) {
  const { slug } = await params;
  const defaultService = getServiceBySlug(slug) ?? null;

  return <ServiceDetailLive slug={slug} defaultService={defaultService} />;
}
