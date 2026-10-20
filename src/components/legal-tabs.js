"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { href: "/legal-terms", label: "TERMS" },
  { href: "/legal-privacy", label: "PRIVACY" },
  { href: "/legal-contact", label: "CONTACT" },
];

export default function LegalTabs() {
  const pathname = usePathname();

  return (
    <div className="flex mb-6 border-b border-hairline">
      {TABS.map((tab) => {
        const active = pathname === tab.href;
        return (
          <Link
            key={tab.href}
            href={tab.href}
            aria-current={active ? "page" : undefined}
            className={`flex-1 text-center py-2.5 text-xs tracking-[0.14em] -ml-px border transition-all duration-250 ${
              active
                ? "border-gold bg-raised text-foreground!"
                : "border-hairline text-muted! hover:text-foreground!"
            }`}
          >
            {tab.label}
          </Link>
        );
      })}
    </div>
  );
}
