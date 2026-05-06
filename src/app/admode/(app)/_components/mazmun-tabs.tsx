"use client";

import { GroupTabs } from "./group-tabs";
import { usePendingCounts } from "./pending-counts-context";

export function MazmunTabs() {
  const counts = usePendingCounts();
  return (
    <GroupTabs
      tabs={[
        { href: "/admode/categories", label: "Kategoriyalar", badge: counts.categories },
        { href: "/admode/regions", label: "Viloyatlar" },
        { href: "/admode/kontent", label: "Kontent" },
        { href: "/admode/faq", label: "FAQ" },
      ]}
    />
  );
}
