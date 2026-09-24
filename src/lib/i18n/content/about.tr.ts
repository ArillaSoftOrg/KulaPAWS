import type { AboutContent } from "@/data/about";

// Turkish translation of the shipped default in src/data/about.ts. See
// homepage.tr.ts for the same-locale-content notes (English stays the
// source of truth; not wired into Supabase's page_content table).
export const aboutTr: AboutContent = {
  header: {
    eyebrow: "Hakkımızda",
    title: "Kolaylık ve özen etrafında kurulmuş bir evcil hayvan bakım markası",
    description:
      "Kulapaws, köpekler ve kediler için mobil bir bakım hizmetidir — bakım, yıkama ve evcil hayvan özeni hizmetlerini, ziyaret edeceğiniz bir mağaza olmadan size getiriyoruz.",
  },
  mobileStory: {
    eyebrow: "Mobil Hizmet",
    heading: "Neden size geliyoruz",
    description:
      "Geleneksel bakım; araba yolculuğu, bekleme salonu ve yabancı bir ortam anlamına gelir. Kulapaws, daha basit bir fikir üzerine kuruldu: bakımı, evcil dostunuzun kendi ortamına getirmek.",
    image: null,
  },
  values: {
    heading: "Bizim için önemli olan",
    items: [
      { title: "Yakın", description: "Gösterişsiz, samimi ve anlaşılır bir hizmet." },
      { title: "Şefkatli", description: "Her randevu, evcil dostunuzun konforu etrafında şekillenir." },
      { title: "Pratik", description: "Pratik, temiz ve rutininize kolayca uyan bir hizmet." },
    ],
  },
  cta: {
    heading: "Daha fazla bilgi mi almak istiyorsunuz?",
    description: "Kulapaws hakkında sorularınız için bize ulaşın.",
  },
};
