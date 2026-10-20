"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { DatePicker } from "antd";
import dayjs from "dayjs";
import ItemsClearLink from "@/components/items-clear-link";

export default function HistoryFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const from = searchParams.get("from") ?? "";
  const to = searchParams.get("to") ?? "";

  const updateParams = (updates) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (value) params.set(key, value);
      else params.delete(key);
    });
    router.push(params.size > 0 ? `${pathname}?${params.toString()}` : pathname);
  };

  return (
    <div className="flex items-end gap-3.5 flex-wrap mb-5.5">
      <div>
        <div className="text-[11px] tracking-[0.14em] text-tan mb-2">FROM</div>
        <DatePicker
          value={from ? dayjs(from) : null}
          onChange={(date) => updateParams({ from: date ? date.format("YYYY-MM-DD") : "" })}
        />
      </div>
      <div>
        <div className="text-[11px] tracking-[0.14em] text-tan mb-2">TO</div>
        <DatePicker
          value={to ? dayjs(to) : null}
          onChange={(date) => updateParams({ to: date ? date.format("YYYY-MM-DD") : "" })}
        />
      </div>
      {(from || to) && (
        <div className="flex flex-col">
          <div aria-hidden className="text-[11px] mb-2 invisible">
            CLEAR
          </div>
          <div className="h-8 flex items-center">
            <ItemsClearLink className="translate-y-[0.14em]" />
          </div>
        </div>
      )}
    </div>
  );
}
