import Link from "next/link";

function tabClass(isActive) {
  return [
    "flex-1 text-center py-2.5 text-xs tracking-[0.08em] border-b-2",
    isActive ? "border-gold text-foreground" : "border-hairline text-muted",
  ].join(" ");
}

export default function AuthTabs({ active }) {
  return (
    <div className="flex mb-6">
      <Link href="/login" className={tabClass(active === "login")}>
        SIGN IN
      </Link>
      <Link href="/register" className={tabClass(active === "register")}>
        REGISTER
      </Link>
    </div>
  );
}
