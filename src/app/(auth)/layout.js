import Link from "next/link";
export default function AuthLayout({ children }) {
  return (
    <div className="flex flex-1 items-center justify-center px-6 py-12">
      <div className="w-full max-w-[420px] p-8 border border-hairline bg-card">
        <div className="flex flex-col items-center mb-6 leading-none select-none">
          <Link
            href="/"
            className="font-logo font-black text-shadow-ember text-[38px] tracking-wide text-foreground!"
          >
            SKIN
          </Link>
          <span className="mt-1.5 pl-[0.42em] text-[13px] tracking-[0.42em] text-gold">
            SHOWDOWN
          </span>
        </div>
        {children}
      </div>
    </div>
  );
}
