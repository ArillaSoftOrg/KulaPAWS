import type { Service } from "@/data/services";

// Russian translation of the shipped defaults in src/data/services.ts.
// Slugs are identical to the English defaults on purpose — service pages
// are matched by slug regardless of locale (see ServiceDetailLive.tsx).
// See homepage.ru.ts for the same-locale-content notes (not wired into
// Supabase's services table, which has no locale dimension).
export const servicesRu: Service[] = [
  {
    slug: "dog-grooming",
    title: "Груминг собак",
    shortDescription: "Уход за собаками любого размера и типа шерсти с выездом на дом.",
    overview:
      "Kulapaws предлагает груминг собак, построенный вокруг комфорта вашего питомца: благодаря нашей мобильной службе не нужны переноска, зал ожидания и стрессовая поездка на машине.",
    whoItsFor: [
      "Собаки, которые тревожатся в обычных грум-салонах",
      "Владельцы, которые хотят получить груминг не выходя из дома",
      "Регулярный уход за шерстью, кожей и когтями",
    ],
    process: [
      { title: "Свяжитесь с нами", description: "Расскажите нам о своей собаке и о том, что вам нужно." },
      { title: "Мы приедем к вам", description: "Наша мобильная студия груминга приедет к вам домой." },
      {
        title: "Собака ухожена",
        description: "Спокойный индивидуальный сеанс груминга в привычной обстановке.",
      },
    ],
    image: null,
  },
  {
    slug: "cat-grooming",
    title: "Груминг кошек",
    shortDescription: "Груминг кошек дома, без стресса от переноски и поездки на машине.",
    overview:
      "Кошки чувствуют себя лучше всего в привычной обстановке. Kulapaws проводит груминг кошек прямо у вас дома, делая процедуру максимально спокойной и комфортной.",
    whoItsFor: [
      "Кошки, которые тяжело переносят поездки и незнакомые места",
      "Владельцы, которые хотят обойтись без поездки в переноске",
      "Регулярный уход за шерстью и гигиена",
    ],
    process: [
      { title: "Свяжитесь с нами", description: "Расскажите немного о своей кошке и её потребностях." },
      { title: "Мы приедем к вам", description: "Наша команда приедет и всё подготовит на месте." },
      { title: "Кошка ухожена", description: "Бережный, неторопливый сеанс дома." },
    ],
    image: null,
  },
  {
    slug: "mobile-pet-grooming",
    title: "Мобильный груминг для питомцев",
    shortDescription: "Удобство профессионального груминга прямо у вашего дома.",
    overview:
      "Мобильный груминг — основа того, чем занимается Kulapaws: профессиональный уход за питомцем с выездом на дом, в привычной и комфортной обстановке.",
    whoItsFor: [
      "Плотный график, при котором сложно посещать салон",
      "Питомцы, которым лучше без поездок и залов ожидания",
      "Все, кто предпочитает индивидуальный подход при груминге",
    ],
    process: [
      { title: "Запишитесь на визит", description: "Свяжитесь с нами, чтобы выбрать удобное время." },
      {
        title: "Мы приезжаем",
        description: "Наша мобильная служба груминга приезжает прямо к вам домой.",
      },
      { title: "Начинается уход", description: "Питомец получает полный уход на месте, от начала до конца." },
    ],
    image: null,
  },
];

export function getServiceRuBySlug(slug: string): Service | undefined {
  return servicesRu.find((service) => service.slug === slug);
}
