import Link from "next/link";

const LEGAL_LINKS = [
  { href: "/legal-terms", label: "TERMS" },
  { href: "/legal-privacy", label: "PRIVACY" },
  { href: "/legal-contact", label: "CONTACT" },
];

export default function Footer() {
  const snapshotDate = new Date().toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return (
    <footer className="border-t border-hairline py-7 px-6">
      <div className="max-w-[1320px] mx-auto flex items-center justify-between gap-5 flex-wrap">
        <div className="max-w-[560px] text-[11px] leading-[1.6] text-muted">
          FAN PROJECT · NOT AFFILIATED WITH THE GAME&apos;S PUBLISHER. CATALOGUE DATA AS OF{" "}
          {snapshotDate.toUpperCase()}.
        </div>
        <div className="flex gap-5 flex-wrap">
          {LEGAL_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-[11px] tracking-[0.08em] text-tan! transition-colors hover:text-foreground!"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
