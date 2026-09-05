import { businessRepository } from "@/lib/content/businessRepository";
import { homepageRepository } from "@/lib/content/homepageRepository";
import { aboutRepository } from "@/lib/content/aboutRepository";
import { servicesPageRepository } from "@/lib/content/servicesPageRepository";
import { contactPageRepository } from "@/lib/content/contactPageRepository";
import { servicesRepository } from "@/lib/content/servicesRepository";
import { faqsRepository } from "@/lib/content/faqsRepository";
import { clearAllLocalImages } from "@/lib/images/localImageStore";

// Used by the /admin/settings "reset everything" action. Reverts every
// local content repository to its shipped default and clears all locally
// stored image blobs.
export async function resetAllLocalContent(): Promise<void> {
  await Promise.all([
    businessRepository.reset(),
    homepageRepository.reset(),
    aboutRepository.reset(),
    servicesPageRepository.reset(),
    contactPageRepository.reset(),
    servicesRepository.reset(),
    faqsRepository.reset(),
    clearAllLocalImages(),
  ]);
}
