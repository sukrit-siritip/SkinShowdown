"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Button, Form } from "antd";
import { DownOutlined } from "@ant-design/icons";
import HeaderNavLink from "@/components/header-nav-link";
import HeaderUserMenu, { userMenuLinks } from "@/components/header-user-menu";
import { logout } from "@/app/actions/auth";

const NAV_LINKS = [
  { href: "/", label: "HOME" },
  { href: "/items", label: "ITEMS" },
];

export default function HeaderShell({ user, displayName, cartCount, isStaff }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [, startTransition] = useTransition();

  return (
    <header className="sticky top-0 z-40 border-b border-hairline backdrop-blur-[6px]">
      <div className="relative max-w-[1320px] mx-auto px-6 flex items-center justify-between gap-5 flex-wrap">
        <Link
          href="/"
          className="flex flex-col items-center justify-center py-[9px] leading-none select-none"
        >
          <span className="pl-[0.04em] font-logo font-black text-shadow-ember text-2xl tracking-[0.04em] text-foreground">
            SKIN
          </span>
          <span className="mt-1 pl-[0.36em] text-[10px] tracking-[0.36em] text-gold">
            SHOWDOWN
          </span>
        </Link>

        <nav className="hidden sm:flex sm:absolute sm:left-1/2 sm:-translate-x-1/2 gap-6 items-stretch">
          {NAV_LINKS.map((link) => (
            <HeaderNavLink
              key={link.href}
              href={link.href}
              label={link.label}
            />
          ))}
        </nav>

        <div className="hidden sm:flex items-center gap-3.5 py-2.5">
          <Link
            href="/cart"
            aria-label={`View cart, ${cartCount} items`}
            className="block"
          >
            <Button
              type="text"
              className="flex! items-center! gap-2! h-auto! px-3! py-[7px]! bg-transparent! border! border-hairline! transition-all hover:border-gold! hover:bg-[#12161d]!"
            >
              <span className="text-xs tracking-[0.12em] text-tan">CART</span>
              <span className="flex items-center justify-center min-w-[18px] h-[18px] bg-danger text-[11px] text-foreground">
                {cartCount}
              </span>
            </Button>
          </Link>
          {user ? (
            <HeaderUserMenu displayName={displayName} isStaff={isStaff} />
          ) : (
            <Link href="/login" className="block">
              <Button
                type="text"
                className="h-auto! px-5! py-2.5! text-xs! font-bold! tracking-[0.12em]! text-background! bg-gold! transition-all hover:bg-gold-light! hover:-translate-y-px!"
              >
                SIGN IN
              </Button>
            </Link>
          )}
        </div>

        <div className="flex sm:hidden items-center gap-2">
          <Link
            href="/cart"
            aria-label={`View cart, ${cartCount} items`}
            className="block"
          >
            <Button
              type="text"
              className="flex! items-center! gap-1.5! h-auto! px-2! py-1.5! bg-transparent! border! border-hairline!"
            >
              <span className="text-xs tracking-[0.12em] text-tan">CART</span>
              <span className="flex items-center justify-center min-w-[18px] h-[18px] bg-danger text-[11px] text-foreground">
                {cartCount}
              </span>
            </Button>
          </Link>
          <Button
            type="text"
            aria-label="Open menu"
            aria-expanded={mobileOpen}
            onClick={() =>
              setMobileOpen((v) => {
                if (v) setAccountOpen(false);
                return !v;
              })
            }
            className="flex! flex-col! gap-1! h-auto! p-2! bg-transparent!"
          >
            <span className="w-5 h-0.5 bg-foreground" />
            <span className="w-5 h-0.5 bg-foreground" />
            <span className="w-5 h-0.5 bg-foreground" />
          </Button>
        </div>
      </div>

      <div
        aria-hidden={!mobileOpen}
        className={`sm:hidden absolute left-0 right-0 top-full grid transition-[grid-template-rows] duration-300 ease-out ${
          mobileOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          <div className="w-full border-t border-hairline bg-card px-6 pt-2 pb-4 flex flex-col">
            {NAV_LINKS.map((link) => (
              <HeaderNavLink
                key={link.href}
                href={link.href}
                label={link.label}
                variant="mobile"
                onNavigate={() => setMobileOpen(false)}
              />
            ))}
            {user && (
              <div className="border-b border-divider">
                <Button
                  type="text"
                  onClick={() => setAccountOpen((v) => !v)}
                  aria-expanded={accountOpen}
                  className="flex! items-center! justify-between! w-full! h-auto! px-1! py-[11px]! bg-transparent! text-[13px]! tracking-[0.08em]! text-tan!"
                >
                  <span className="overflow-hidden text-ellipsis whitespace-nowrap">
                    {displayName}
                  </span>
                  <DownOutlined
                    className={`text-[10px]! text-muted! transition-transform! duration-200! ${accountOpen ? "rotate-180!" : ""}`}
                  />
                </Button>
                <div
                  className={`grid transition-[grid-template-rows] duration-200 ease-out ${
                    accountOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="flex flex-col pl-3 pb-1">
                      {userMenuLinks(isStaff).map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setMobileOpen(false)}
                          className="py-2 text-xs tracking-[0.06em] text-dim"
                        >
                          {item.label}
                        </Link>
                      ))}
                      <Form onFinish={() => startTransition(() => logout())}>
                        <Button
                          type="text"
                          htmlType="submit"
                          className="w-full! h-auto! justify-start! text-left! px-0! py-2! bg-transparent! text-xs! tracking-[0.1em]! text-muted!"
                        >
                          SIGN OUT
                        </Button>
                      </Form>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {!user && (
              <Link
                href="/login"
                onClick={() => setMobileOpen(false)}
                className="block mt-1.5"
              >
                <Button
                  type="text"
                  block
                  className="h-auto! text-center! text-xs! tracking-[0.12em]! font-bold! text-background! bg-gold! px-4! py-2.5!"
                >
                  SIGN IN
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
