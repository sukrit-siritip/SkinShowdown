"use client";

import { useRef, useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Input, Select } from "antd";
import ItemsClearLink from "@/components/items-clear-link";
import { TYPE_OPTIONS } from "@/lib/item-type-groups";

function SearchInput({ initialValue, onSearchChange }) {
  const [value, setValue] = useState(initialValue);
  const debounceRef = useRef(null);

  return (
    <Input
      value={value}
      onChange={(e) => {
        const next = e.target.value;
        setValue(next);
        clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => onSearchChange(next.trim()), 350);
      }}
      placeholder="Search skins"
      allowClear
    />
  );
}

export default function ItemsFilters({ weaponOptions, utilityOptions }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const searchQ = searchParams.get("q") ?? "";

  const type = searchParams.get("type") ?? "";

  const updateParams = (updates) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (value) params.set(key, value);
      else params.delete(key);
    });
    params.delete("page");
    router.push(params.size > 0 ? `${pathname}?${params.toString()}` : pathname);
  };

  const onTypeChange = (value) => {
    updateParams({ type: value ?? "", weapon: "", utility: "" });
  };

  return (
    <div className="border border-hairline bg-card">
      <div className="p-3.5 border-b border-hairline flex items-center justify-between">
        <span className="text-[11px] tracking-[0.18em] text-tan">FILTERS</span>
        <ItemsClearLink />
      </div>

      <div className="p-3.5 border-b border-hairline">
        <SearchInput
          key={searchQ}
          initialValue={searchQ}
          onSearchChange={(value) => updateParams({ q: value })}
        />
      </div>

      <div className="p-3.5 border-b border-hairline">
        <div className="text-[11px] tracking-[0.16em] text-tan mb-2.5">TYPE</div>
        <Select
          value={type || undefined}
          placeholder="All Types"
          allowClear
          className="w-full"
          onChange={onTypeChange}
          options={TYPE_OPTIONS}
        />
      </div>

      {type === "weapon" && (
        <div className="p-3.5 border-b border-hairline">
          <div className="text-[11px] tracking-[0.16em] text-tan mb-2.5">WEAPON</div>
          <Select
            value={searchParams.get("weapon") ?? undefined}
            placeholder="All Weapons"
            allowClear
            className="w-full"
            onChange={(value) => updateParams({ weapon: value ?? "" })}
            options={weaponOptions.map((name) => ({ value: name, label: name }))}
          />
        </div>
      )}

      {type === "utility" && (
        <div className="p-3.5 border-b border-hairline">
          <div className="text-[11px] tracking-[0.16em] text-tan mb-2.5">
            TOOLS &amp; CONSUMABLES
          </div>
          <Select
            value={searchParams.get("utility") ?? undefined}
            placeholder="All Tools & Consumables"
            allowClear
            className="w-full"
            onChange={(value) => updateParams({ utility: value ?? "" })}
            options={utilityOptions.map((name) => ({ value: name, label: name }))}
          />
        </div>
      )}
    </div>
  );
}
