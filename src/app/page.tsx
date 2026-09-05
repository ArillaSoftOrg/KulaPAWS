import { HomeContent } from "@/components/content/HomeContent";
import { services } from "@/data/services";
import { products } from "@/data/products";
import { faqs } from "@/data/faqs";
import { primaryCta } from "@/data/navigation";
import { homepage } from "@/data/homepage";

export default function Home() {
  return (
    <HomeContent
      defaultHomepage={homepage}
      defaultServices={services}
      products={products}
      defaultFaqs={faqs}
      primaryCta={primaryCta}
    />
  );
}
