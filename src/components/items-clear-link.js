"use client";

import { useRouter, usePathname } from "next/navigation";

export default function ItemsClearLink({ label = "CLEAR", className = "" }) {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <span
      role="button"
      tabIndex={0}
      onClick={() => router.push(pathname)}
      onKeyDown={(e) => e.key === "Enter" && router.push(pathname)}
      className={`inline-block cursor-pointer text-[11px] text-danger transition-colors hover:text-foreground ${className}`}
    >
      {label}
    </span>
  );
}
