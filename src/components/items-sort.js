"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";

export default function ItemsSort({ resultCount }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const sort = searchParams.get("sort") === "desc" ? "desc" : "asc";

  const toggleSort = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", sort === "asc" ? "desc" : "asc");
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex items-center gap-3.5">
      <span className="text-xs text-muted">{resultCount} RESULTS</span>
      <button
        type="button"
        onClick={toggleSort}
        className="flex items-center gap-2.5 border border-line bg-[#1a1f2e] px-3 py-2 text-xs transition-colors hover:border-brass"
      >
        <span className="text-tan">Sort</span>
        <span>PRICE {sort === "asc" ? "↑" : "↓"}</span>
      </button>
    </div>
  );
}
