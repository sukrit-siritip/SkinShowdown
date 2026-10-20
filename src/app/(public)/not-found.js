import Link from "next/link";

export const metadata = {
  title: "Page Not Found",
};

export default function PublicNotFound() {
  return (
    <main className="flex-1 flex items-center justify-center px-6 py-24">
      <div className="max-w-[520px] text-center">
        <div className="text-[11px] tracking-[0.2em] text-tan mb-3">LOST IN THE BAYOU</div>
        <div className="font-bold text-[88px] leading-none text-gold-light mb-3">404</div>
        <h1 className="font-bold text-3xl m-0 mb-3">This trail runs cold</h1>
        <p className="text-[15px] text-muted mb-8">
          The skin, page, or contract you&apos;re hunting for doesn&apos;t exist — or it&apos;s
          already been claimed.
        </p>
        <Link
          href="/"
          className="inline-block px-6.5 py-3.5 border border-gold bg-[#1a1f2e] text-foreground! text-[13px] font-semibold tracking-[0.14em] transition-all duration-300 hover:bg-gold! hover:text-background!"
        >
          RETURN HOME
        </Link>
      </div>
    </main>
  );
}
