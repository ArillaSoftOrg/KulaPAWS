import type { HomepageContent } from "@/data/homepage";

// Turkish translation of the shipped default in src/data/homepage.ts.
// English stays the single source of truth (see that file); this mirrors
// its shape exactly and is picked up only when locale === "tr" (see
// HomeContent.tsx). Not wired into Supabase (page_content has no locale
// dimension), so an admin edit made in English will not appear here — see
// the i18n content translation task notes for that known limitation.
export const homepageTr: HomepageContent = {
  hero: {
    heading: "Kapınıza gelen mobil evcil hayvan bakımı",
    description:
      "Kulapaws, Antalya bölgesinde köpek ve kedileriniz için mobil bakım hizmetini kapınıza kadar getirir; evcil dostunuz evinin tanıdık ortamında sakin ve rahat kalır.",
    image: null,
    primaryCtaLabel: "Randevu Talep Et",
    secondaryCtaLabel: "Hizmetleri Keşfedin",
  },
  servicesSection: {
    heading: "Hizmetlerimiz",
    description: "Evcil dostunuzun ihtiyaçlarına göre tasarlanmış bakım hizmeti, evinizin neresinde olursa olsun.",
  },
  mobileHighlight: {
    eyebrow: "Mobil Hizmet",
    heading: "Bakım hizmeti, kapınıza kadar",
    description:
      "Kafes yok, araba yolculuğu yok, bekleme salonu yok. Mobil bakım hizmetimiz sayesinde evcil dostunuz, tam evinizde tanıdık ve stressiz bir ortamda özenle bakılır.",
    bullets: [
      "Bakım, evcil dostunuzun en rahat hissettiği yerde gerçekleşir",
      "Taşıma veya bırakma gerekmez",
      "Baştan sona birebir ilgi",
    ],
    image: null,
  },
  whyKulapaws: {
    heading: "Neden Kulapaws",
    description: "Yakın, şefkatli ve güvenilir hissettirmek için tasarlanmış bir evcil hayvan bakım markası.",
    items: [
      {
        title: "Doğası gereği şefkatli",
        description: "Her ziyaret, sadece bakımı değil, evcil dostunuzun konforunu da önceliklendirir.",
      },
      {
        title: "Gerçekten pratik",
        description: "Mobil hizmet sayesinde bakım günün size uyar, tersi değil.",
      },
      {
        title: "Temiz ve profesyonel",
        description: "Her randevuya tutarlı ve özenli bir yaklaşım.",
      },
    ],
  },
  productsPreview: {
    heading: "Evcil Hayvan Bakım Ürünleri",
    description: "Bakım hizmetinin yanı sıra Kulapaws, eviniz için evcil hayvan bakım ürünleri de sunar.",
  },
  howItWorks: {
    heading: "Nasıl Çalışır",
    description: "Evcil dostunuzun evde bakımını yaptırmak çok kolay.",
    steps: [
      {
        title: "Bize ulaşın",
        description: "Evcil dostunuzun ihtiyaçlarını paylaşmak için bizi telefon, WhatsApp veya Instagram üzerinden arayın.",
      },
      {
        title: "Size geliyoruz",
        description: "Mobil bakım hizmetimiz evinize gelir.",
      },
      {
        title: "Evcil dostunuz şımartılır",
        description: "Yerinde, sakin ve birebir bir bakım seansı.",
      },
    ],
  },
  faqPreview: {
    heading: "Sıkça Sorulan Sorular",
  },
  finalCta: {
    heading: "Evcil dostunuzun bir sonraki bakımını ayırtmaya hazır mısınız?",
    description: "Bize ulaşın, başlamanıza yardımcı olalım.",
  },
};
