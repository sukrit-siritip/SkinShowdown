"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { href: "/admin", label: "Summary" },
  { href: "/admin/items", label: "Content Management" },
  { href: "/admin/events", label: "Events" },
  { href: "/admin/stock", label: "Stock & Codes" },
  { href: "/admin/activity", label: "Activity" },
];

export default function AdminNav({ role }) {
  const pathname = usePathname();
  const isActive = (href) =>
    href === "/admin" ? pathname === href : pathname.startsWith(href);

  return (
    <nav aria-label="Admin sections" className="border border-hairline bg-card">
      <div className="flex items-center justify-between gap-2 px-3.5 py-3.5 border-b border-hairline text-[11px] tracking-[0.18em] text-tan">
        ADMIN
        {role === "viewer" && (
          <span className="text-[9px] tracking-[0.12em] px-1.5 py-0.5 border border-gold-dim text-gold">
            VIEW ONLY
          </span>
        )}
      </div>
      <div className="flex md:flex-col overflow-x-auto scrollbar-thin">
        {TABS.map((tab) => {
          const active = isActive(tab.href);
          return (
            <Link
              key={tab.href}
              href={tab.href}
              aria-current={active ? "page" : undefined}
              className={`shrink-0 whitespace-nowrap px-3.5 py-3 text-sm transition-all duration-300 border-b-2 md:border-b-0 md:border-l-2 ${
                active
                  ? "border-gold bg-selected text-foreground!"
                  : "border-transparent text-tan! hover:text-foreground! hover:bg-selected"
              }`}
            >
              {tab.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
