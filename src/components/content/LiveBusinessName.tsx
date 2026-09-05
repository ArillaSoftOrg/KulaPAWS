"use client";

import { useEffect, useState } from "react";
import { businessRepository } from "@/lib/content/businessRepository";
import type { Business } from "@/data/business";

export function LiveBusinessName({ defaultBusiness }: { defaultBusiness: Business }) {
  const [business, setBusiness] = useState(defaultBusiness);

  useEffect(() => {
    let active = true;
    businessRepository.get().then((value) => {
      if (active) setBusiness(value);
    });
    return () => {
      active = false;
    };
  }, []);

  return <>{business.name}</>;
}
