import type { Benefit } from "@/components/sections/BenefitsGrid";
import type { ProcessStep } from "@/components/sections/ProcessSteps";

export interface HomepageContent {
  hero: {
    heading: string;
    description: string;
    image: string | null;
  };
  servicesSection: {
    heading: string;
    description: string;
  };
  mobileHighlight: {
    eyebrow: string;
    heading: string;
    description: string;
    bullets: string[];
    image: string | null;
  };
  whyKulapaws: {
    heading: string;
    description: string;
    items: Benefit[];
  };
  productsPreview: {
    heading: string;
    description: string;
  };
  howItWorks: {
    heading: string;
    description: string;
    steps: ProcessStep[];
  };
  faqPreview: {
    heading: string;
  };
  finalCta: {
    heading: string;
    description: string;
  };
}

// Provisional, generic copy (README.md §7 flags real homepage content —
// tagline, hero headline, process steps, etc. — as not yet collected).
// Centralized here so replacing it with confirmed content is a data edit,
// not a page-component edit.
export const homepage: HomepageContent = {
  hero: {
    heading: "Mobile pet grooming that comes to you",
    description:
      "Kulapaws brings professional dog and cat grooming, plus pet-care products, directly to your door — so your pet stays calm and comfortable at home.",
    image: null,
  },
  servicesSection: {
    heading: "Our Services",
    description: "Grooming care built around your pet, wherever home is.",
  },
  mobileHighlight: {
    eyebrow: "Mobile Service",
    heading: "Grooming, delivered to your door",
    description:
      "No crate, no car ride, no waiting room. Our mobile grooming service means your pet is cared for in a familiar, low-stress setting — right at home.",
    bullets: [
      "Grooming happens where your pet is most comfortable",
      "No transport or drop-off required",
      "One-on-one attention from start to finish",
    ],
    image: null,
  },
  whyKulapaws: {
    heading: "Why Kulapaws",
    description: "A pet-care brand built to feel approachable, caring, and easy to trust.",
    items: [
      { title: "Caring by default", description: "Every visit is centered on your pet's comfort, not just the groom." },
      { title: "Genuinely convenient", description: "Mobile service means grooming fits into your day, not the other way around." },
      { title: "Clean & professional", description: "A consistent, careful approach to every appointment." },
    ],
  },
  productsPreview: {
    heading: "Pet-Care Products",
    description: "Alongside grooming, Kulapaws offers pet-care products for the home.",
  },
  howItWorks: {
    heading: "How It Works",
    description: "Getting your pet groomed at home is straightforward.",
    steps: [
      { title: "Reach out", description: "Contact us to share what your pet needs." },
      { title: "We come to you", description: "Our mobile grooming service arrives at your home." },
      { title: "Your pet is pampered", description: "A calm, one-on-one grooming session on-site." },
    ],
  },
  faqPreview: {
    heading: "Frequently Asked Questions",
  },
  finalCta: {
    heading: "Ready to book your pet's next groom?",
    description: "Reach out and we'll help you get started.",
  },
};
