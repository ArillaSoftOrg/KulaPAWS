import type { Benefit } from "@/components/sections/BenefitsGrid";
import type { ProcessStep } from "@/components/sections/ProcessSteps";
import type { MobileSalonGalleryItem } from "@/components/sections/MobileSalonShowcase";
import type { BeforeAfterGalleryItem } from "@/components/sections/BeforeAfterShowcase";

export interface HomepageContent {
  hero: {
    heading: string;
    description: string;
    image: string | null;
    // Curated real-photo set shown (crossfading) in the Hero's media panel
    // when no admin-uploaded `image` override is set — see HeroMedia.tsx.
    // Always fixed /public paths, not managed Supabase image refs, so it
    // isn't exposed in the admin content form.
    gallery: string[];
    primaryCtaLabel: string;
    secondaryCtaLabel: string;
  };
  mobileSalon: {
    eyebrow: string;
    heading: string;
    description: string;
    gallery: MobileSalonGalleryItem[];
  };
  beforeAfter: {
    eyebrow: string;
    heading: string;
    description: string;
    prevLabel: string;
    nextLabel: string;
    goToSlideLabel: string;
    gallery: BeforeAfterGalleryItem[];
  };
  servicesSection: {
    heading: string;
    description: string;
  };
  campaign: {
    eyebrow: string;
    heading: string;
    description: string;
    perks: string[];
    ctaLabel: string;
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
      "Kulapaws brings mobile dog and cat grooming to your door across the Antalya area — so your pet stays calm and comfortable at home.",
    image: null,
    gallery: ["/hero/hero-van-side.jpg", "/hero/hero-van-front.jpg", "/hero/hero-van-rear.jpg"],
    primaryCtaLabel: "Request Appointment",
    secondaryCtaLabel: "Explore Services",
  },
  mobileSalon: {
    eyebrow: "Meet The Van",
    heading: "Meet Our Mobile Salon",
    description:
      "A real look inside the van that brings grooming to your door — the tools, the setup, and the team behind every appointment.",
    gallery: [
      {
        id: "van-exterior-front",
        alt: "Kulapaws mobile grooming van parked outside",
        caption: "Our fully-equipped grooming van",
      },
      {
        id: "van-exterior-side",
        alt: "Side view of the Kulapaws mobile pet salon van",
        caption: "Kitted out for dogs and cats",
      },
      {
        id: "mobile-groom-dog",
        alt: "A freshly groomed dog held up inside the van",
        caption: "Grooming, right where your pet feels safe",
      },
      {
        id: "mobile-groom-pomeranian",
        alt: "A Pomeranian being dried after its bath in the van",
        caption: "Bath and blow-dry, on board",
      },
      {
        id: "pomeranian-after-groom",
        alt: "A fluffy Pomeranian after grooming",
        caption: "Fluffed, trimmed, and happy",
      },
      {
        id: "groomers-at-work",
        alt: "Kulapaws groomers working together inside the van",
        caption: "Our groomers at work",
      },
      {
        id: "cat-after-groom",
        alt: "A groomed cat held up after its session",
        caption: "Cats get the same gentle care",
      },
    ],
  },
  beforeAfter: {
    eyebrow: "Real Results",
    heading: "Before & After",
    description: "A real look at the transformation from some of our mobile grooming sessions.",
    prevLabel: "Previous photo",
    nextLabel: "Next photo",
    goToSlideLabel: "Go to photo",
    gallery: [
      {
        id: "before-after-01",
        alt: "Before and after grooming photos of a fluffy dog, showing a full coat wash and trim",
        width: 1086,
        height: 1448,
      },
      {
        id: "before-after-02",
        alt: "Before and after grooming photos of a curly-coated dog, showing a tidy, shaped trim",
        width: 1254,
        height: 1254,
      },
      {
        id: "before-after-03",
        alt: "Before and after grooming photos of a small white dog, showing a clean, shaped coat",
        width: 1144,
        height: 1375,
      },
      {
        id: "before-after-04",
        alt: "Before and after grooming photos of a small dog, showing a neat face and coat trim",
        width: 1254,
        height: 1254,
      },
    ],
  },
  servicesSection: {
    heading: "Our Services",
    description: "Grooming care built around your pet, wherever home is.",
  },
  campaign: {
    eyebrow: "Now Booking",
    heading: "Your pet's next groom, without the stress of getting there",
    description:
      "Skip the crate, the car ride, and the waiting room. Book a mobile grooming appointment and give your pet a calm, one-on-one experience — right at home.",
    perks: [
      "Comes directly to your door",
      "Calm, one-on-one attention",
      "Flexible scheduling that fits your day",
    ],
    ctaLabel: "Book Your Pet's Groom",
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
      { title: "Reach out", description: "Contact us by phone, WhatsApp, or Instagram to share what your pet needs." },
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
