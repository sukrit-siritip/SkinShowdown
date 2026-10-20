import LegalTabs from "@/components/legal-tabs";

export const metadata = { title: "Terms of Use" };

export default function LegalTermsPage() {
  return (
    <main className="flex-1 max-w-[760px] mx-auto px-6 pt-9 pb-24 w-full">
      <LegalTabs />
      <h1 className="font-bold text-[28px] m-0 mb-4">Terms of Use</h1>
      <p className="text-sm leading-[1.7] text-tan mb-3.5">
        This is a fan-built portfolio project and is not affiliated with, endorsed by, or
        connected to the publisher of Hunt: Showdown. No real purchases are processed — all
        checkout flows exist to demonstrate the build, not to sell anything.
      </p>
      <p className="text-sm leading-[1.7] text-tan mb-3.5">
        Skin names, descriptions, and renders shown on this site are sourced from the{" "}
        <a
          href="https://huntshowdown.wiki.gg/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gold! hover:text-foreground!"
        >
          Hunt: Showdown 1896 Wiki
        </a>
        , used under{" "}
        <a
          href="https://creativecommons.org/licenses/by-sa/4.0/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gold! hover:text-foreground!"
        >
          CC BY-SA 4.0
        </a>
        . Prices shown are invented for demo purposes and do not reflect real in-game pricing.
      </p>
      <p className="text-sm leading-[1.7] text-tan m-0">
        Hunt: Showdown is a trademark of its respective owner. All game assets and names remain
        the property of their original rights holders.
      </p>
    </main>
  );
}
