import type { Metadata } from "next";
import { AboutContent } from "@/components/content/AboutContent";
import { aboutContent } from "@/data/about";
import { primaryCta } from "@/data/navigation";

export const metadata: Metadata = {
  title: "About Us",
  description: aboutContent.header.description,
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return <AboutContent defaultAbout={aboutContent} primaryCta={primaryCta} />;
}
