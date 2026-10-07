"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Checkbox, Input, Select } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { ITEM_TYPES, ITEM_TYPE_BY_VALUE } from "@/lib/item-type-groups";

const TYPE_FILTERS = [{ value: "", label: "All Types" }, ...ITEM_TYPES];

function meta(item) {
  const type = ITEM_TYPE_BY_VALUE[item.type]?.label.toUpperCase() ?? item.type;
  if (item.is_battle_pass) return `${type} · BATTLE PASS LV ${item.battle_pass_tier ?? "—"}`;
  if (item.is_dlc) return `${type} · DLC · ${item.dlc_name ?? "—"}`;
  return `${type} · $${Number(item.price ?? 0).toFixed(2)}`;
}

export default function AdminItemList({ items, selectedId }) {
  const [query, setQuery] = useState("");
  const [type, setType] = useState("");
  const [battlePassOnly, setBattlePassOnly] = useState(false);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter(
      (item) =>
        (!type || item.type === type) &&
        (!battlePassOnly || item.is_battle_pass) &&
        (!q || item.name.toLowerCase().includes(q) || item.base?.toLowerCase().includes(q))
    );
  }, [items, query, type, battlePassOnly]);

  return (
    <div className="border border-hairline bg-card min-w-0">
      <div className="flex flex-wrap items-center gap-2.5 p-3 border-b border-hairline">
        <Input
          allowClear
          prefix={<SearchOutlined className="text-muted!" />}
          placeholder="Search skins"
          aria-label="Search skins"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 min-w-40"
        />
        <Select
          value={type}
          onChange={setType}
          options={TYPE_FILTERS}
          aria-label="Filter by type"
          className="w-36"
        />
        <Checkbox checked={battlePassOnly} onChange={(e) => setBattlePassOnly(e.target.checked)}>
          <span className="text-xs text-tan">Battle Pass only</span>
        </Checkbox>
      </div>

      <div className="flex justify-between px-4 py-3 border-b border-hairline text-[10px] tracking-[0.16em] text-tan">
        <span>SKIN · {visible.length}</span>
        <span>STATE</span>
      </div>

      <div className="max-h-[640px] overflow-y-auto scrollbar-thin">
        {visible.map((item) => (
          <Link
            key={item.id}
            href={`/admin/items?id=${item.id}`}
            scroll={false}
            aria-current={item.id === selectedId ? "true" : undefined}
            className={`flex items-center justify-between gap-3 px-4 py-3 border-b border-divider text-foreground! transition-colors duration-300 hover:bg-selected ${
              item.id === selectedId ? "bg-selected" : ""
            }`}
          >
            <div className="min-w-0">
              <div className="text-base truncate">{item.name}</div>
              <div className="text-[10px] text-muted truncate">{meta(item)}</div>
            </div>
            <span
              className={`shrink-0 text-[10px] px-2 py-0.75 border ${
                item.published ? "border-line text-tan" : "border-hairline text-muted"
              }`}
            >
              {item.published ? "LIVE" : "DRAFT"}
            </span>
          </Link>
        ))}
        {visible.length === 0 && (
          <div className="px-4 py-8 text-center text-[13px] text-muted">No skins match this filter.</div>
        )}
      </div>
    </div>
  );
}
