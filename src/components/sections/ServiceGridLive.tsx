"use client";

import { useEffect, useState } from "react";
import { ServiceGrid } from "@/components/sections/ServiceGrid";
import { servicesRepository } from "@/lib/content/servicesRepository";
import type { Service } from "@/data/services";

interface ServiceGridLiveProps {
  defaultItems: Service[];
  heading?: string;
  description?: string;
  tone?: "background" | "surface" | "muted" | "secondary";
}

// Same default-first, override-after-mount pattern as LiveBusinessValue —
// renders the static defaults immediately, then swaps to the live
// (admin create/edit/delete) list once the repository read resolves.
export function ServiceGridLive({ defaultItems, heading, description, tone }: ServiceGridLiveProps) {
  const [items, setItems] = useState(defaultItems);

  useEffect(() => {
    let active = true;
    servicesRepository.list().then((list) => {
      if (active) setItems(list);
    });
    return () => {
      active = false;
    };
  }, []);

  return <ServiceGrid items={items} heading={heading} description={description} tone={tone} />;
}
