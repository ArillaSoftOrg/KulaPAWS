import { AboutContent } from "@/components/content/AboutContent";
import { aboutContent } from "@/data/about";
import { primaryCta } from "@/data/navigation";

export default function AboutPage() {
  return <AboutContent defaultAbout={aboutContent} primaryCta={primaryCta} />;
}
