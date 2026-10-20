"use client";

import { useRef, useState, useTransition } from "react";
import Link from "next/link";
import { Button, Form } from "antd";
import { DownOutlined } from "@ant-design/icons";
import { logout } from "@/app/actions/auth";

const USER_MENU_LINKS = [
  { href: "/history", label: "HISTORY" },
  { href: "/favorites", label: "FAVORITES" },
  { href: "/profile", label: "PROFILE SETTINGS" },
  { href: "/admin", label: "ADMIN", staffOnly: true },
];

export function userMenuLinks(isStaff) {
  return USER_MENU_LINKS.filter((link) => isStaff || !link.staffOnly);
}

export default function HeaderUserMenu({ displayName, isStaff = false }) {
  const [open, setOpen] = useState(false);
  const [, startTransition] = useTransition();
  const containerRef = useRef(null);

  const handleBlur = (e) => {
    if (!containerRef.current?.contains(e.relatedTarget)) {
      setOpen(false);
    }
  };

  return (
    <div className="relative" ref={containerRef} onBlur={handleBlur}>
      <Button
        type="text"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="true"
        aria-expanded={open}
        className="flex! items-center! gap-1.5! h-auto! py-[7px]! px-1! max-w-[120px]! bg-transparent! text-xs! tracking-[0.06em]! text-tan! transition-colors hover:text-foreground!"
      >
        <span className="overflow-hidden text-ellipsis whitespace-nowrap">{displayName}</span>
        <DownOutlined
          className={`text-[9px]! text-muted! transition-transform! duration-200! ${open ? "rotate-180!" : ""}`}
        />
      </Button>
      {open && (
        <div className="absolute top-full right-0 mt-1.5 min-w-[180px] border border-hairline bg-card z-50 shadow-[0_8px_24px_rgba(0,0,0,0.45)]">
          {userMenuLinks(isStaff).map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="block px-3.5 py-[11px] text-xs tracking-[0.06em] text-tan! border-b border-divider transition-colors hover:bg-hover hover:text-foreground!"
            >
              {item.label}
            </Link>
          ))}
          <Form onFinish={() => startTransition(() => logout())}>
            <Button
              type="text"
              htmlType="submit"
              className="w-full! h-auto! justify-start! text-left! px-3.5! py-[11px]! bg-transparent! text-xs! tracking-[0.1em]! text-muted! transition-colors hover:bg-hover! hover:text-danger!"
            >
              SIGN OUT
            </Button>
          </Form>
        </div>
      )}
    </div>
  );
}
