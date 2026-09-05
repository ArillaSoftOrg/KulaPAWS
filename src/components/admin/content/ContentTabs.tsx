"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";
import { HomepageContentForm } from "@/components/admin/forms/HomepageContentForm";
import { AboutContentForm } from "@/components/admin/forms/AboutContentForm";
import { ServicesPageContentForm } from "@/components/admin/forms/ServicesPageContentForm";
import { ContactPageContentForm } from "@/components/admin/forms/ContactPageContentForm";
import { FaqManager } from "@/components/admin/forms/FaqManager";

const tabs = [
  { id: "homepage", label: "Homepage" },
  { id: "about", label: "About" },
  { id: "services", label: "Services Page" },
  { id: "contact", label: "Contact Page" },
  { id: "faqs", label: "FAQs" },
] as const;

type TabId = (typeof tabs)[number]["id"];

export function ContentTabs() {
  const [active, setActive] = useState<TabId>("homepage");

  return (
    <div className="flex flex-col gap-6">
      <div role="tablist" aria-label="Content sections" className="flex flex-wrap gap-2 border-b border-border pb-3">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={active === tab.id}
            onClick={() => setActive(tab.id)}
            className={cn(
              "rounded-md px-3 py-2 text-[14px] font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              active === tab.id
                ? "bg-secondary text-secondary-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {active === "homepage" && <HomepageContentForm />}
      {active === "about" && <AboutContentForm />}
      {active === "services" && <ServicesPageContentForm />}
      {active === "contact" && <ContactPageContentForm />}
      {active === "faqs" && <FaqManager />}
    </div>
  );
}
