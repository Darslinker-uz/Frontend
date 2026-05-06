"use client";

import { GroupTabs } from "./group-tabs";
import { usePendingCounts } from "./pending-counts-context";

export function ElonlarTabs() {
  const counts = usePendingCounts();
  return (
    <GroupTabs
      tabs={[
        { href: "/admode/listings", label: "Ro'yxat", badge: counts.listings },
        { href: "/admode/boosts", label: "Boostlar", badge: counts.boosts },
        { href: "/admode/ratings", label: "Reytinglar" },
      ]}
    />
  );
}
