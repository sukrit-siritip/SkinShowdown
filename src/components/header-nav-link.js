"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function HeaderNavLink({ href, label, variant = "desktop", onNavigate }) {
  const pathname = usePathname();
  const active = href === "/" ? pathname === "/" : pathname.startsWith(href);

  if (variant === "mobile") {
    return (
      <Link
        href={href}
        onClick={onNavigate}
        className={`px-1 py-[11px] text-[13px] tracking-[0.08em] border-b border-divider ${
          active ? "text-foreground" : "text-tan"
        }`}
      >
        {label}
      </Link>
    );
  }

  return (
    <Link
      href={href}
      className={`flex items-center px-0.5 pt-[18px] pb-[15px] -mb-px border-b-2 text-[13px] tracking-[0.14em] transition-colors hover:text-foreground ${
        active ? "text-foreground border-gold" : "text-muted border-transparent"
      }`}
    >
      {label}
    </Link>
  );
}
