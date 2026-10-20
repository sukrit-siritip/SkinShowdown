"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";

function leftColor(left) {
  if (left < 15) return "text-danger";
  if (left < 25) return "text-gold";
  return "text-tan";
}

export default function StockItemList({ items, selectedId }) {
  const [query, setQuery] = useState("");

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter(
      (item) => item.name.toLowerCase().includes(q) || item.base?.toLowerCase().includes(q)
    );
  }, [items, query]);

  return (
    <div className="border border-hairline bg-card min-w-0">
      <div className="p-3 border-b border-hairline">
        <Input
          allowClear
          prefix={<SearchOutlined className="text-muted!" />}
          placeholder="Search skins"
          aria-label="Search skins"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
      <div className="flex justify-between px-4 py-3 border-b border-hairline text-[10px] tracking-[0.16em] text-tan">
        <span>SKIN</span>
        <span>LEFT</span>
      </div>
      <div className="max-h-[560px] overflow-y-auto scrollbar-thin">
        {visible.map((item) => (
          <Link
            key={item.id}
            href={`/admin/stock?item=${item.id}`}
            scroll={false}
            aria-current={item.id === selectedId ? "true" : undefined}
            className={`flex items-center justify-between gap-3 px-4 py-3 border-b border-divider text-foreground! transition-colors duration-300 hover:bg-selected ${
              item.id === selectedId ? "bg-selected" : ""
            }`}
          >
            <div className="min-w-0">
              <div className="text-sm truncate">{item.name}</div>
              <div className="text-[10px] text-muted truncate">{item.base}</div>
            </div>
            <span className={`text-sm shrink-0 ${leftColor(item.codesLeft)}`}>{item.codesLeft}</span>
          </Link>
        ))}
        {visible.length === 0 && (
          <div className="px-4 py-8 text-center text-[13px] text-muted">No skins match this search.</div>
        )}
      </div>
    </div>
  );
}
