"use client";

import dynamic from "next/dynamic";
import HistoryFiltersSkeleton from "@/components/history-filters-skeleton";

const HistoryFilters = dynamic(() => import("@/components/history-filters"), {
  ssr: false,
  loading: () => <HistoryFiltersSkeleton />,
});

export default HistoryFilters;
