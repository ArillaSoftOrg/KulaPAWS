export interface ServiceProcessStep {
  title: string;
  description: string;
}

export interface Service {
  slug: "dog-grooming" | "cat-grooming" | "mobile-pet-grooming";
  title: string;
  shortDescription: string;
  overview: string;
  whoItsFor: string[];
  process: ServiceProcessStep[];
}

// Category names and routes mirror the approved sitemap (README.md §5).
// Copy below is intentionally generic/provisional — no specific inclusions,
// pricing, or process claims until real business content is confirmed.
export const services: Service[] = [
  {
    slug: "dog-grooming",
    title: "Dog Grooming",
    shortDescription:
      "Grooming care for dogs of all sizes and coat types, brought to your door.",
    overview:
      "Kulapaws offers dog grooming designed around your dog's comfort, delivered through our mobile service so there's no crate, no waiting room, and no stressful car ride.",
    whoItsFor: [
      "Dogs who get anxious in traditional grooming salons",
      "Owners who want grooming done without leaving home",
      "Regular coat, skin, and nail maintenance",
    ],
    process: [
      { title: "Reach out", description: "Tell us about your dog and what you're looking for." },
      { title: "We come to you", description: "Our mobile grooming setup arrives at your home." },
      { title: "Your dog is groomed", description: "A calm, one-on-one grooming session in a familiar setting." },
    ],
  },
  {
    slug: "cat-grooming",
    title: "Cat Grooming",
    shortDescription:
      "Low-stress cat grooming at home, without the carrier or the car ride.",
    overview:
      "Cats tend to do best in their own environment. Kulapaws brings cat grooming directly to your home, keeping the experience as calm and low-stress as possible.",
    whoItsFor: [
      "Cats who find travel and unfamiliar spaces stressful",
      "Owners who want grooming without a carrier trip",
      "Routine coat and hygiene maintenance",
    ],
    process: [
      { title: "Reach out", description: "Share a few details about your cat and their needs." },
      { title: "We come to you", description: "Our team arrives ready to work in your space." },
      { title: "Your cat is groomed", description: "A gentle, unhurried session at home." },
    ],
  },
  {
    slug: "mobile-pet-grooming",
    title: "Mobile Pet Grooming",
    shortDescription:
      "The convenience of professional grooming, delivered to your driveway.",
    overview:
      "Mobile grooming is at the core of what Kulapaws does: professional pet grooming that comes to you, so your pet is cared for in a familiar, comfortable environment.",
    whoItsFor: [
      "Busy schedules that make salon visits difficult",
      "Pets that do better without travel or waiting areas",
      "Anyone who prefers one-on-one grooming attention",
    ],
    process: [
      { title: "Book a visit", description: "Reach out to set up a time that works for you." },
      { title: "We arrive", description: "Our mobile grooming service comes directly to your home." },
      { title: "Pampering happens", description: "Your pet is groomed on-site, start to finish." },
    ],
  },
];

export function getServiceBySlug(slug: string) {
  return services.find((service) => service.slug === slug);
}
