import LegalTabs from "@/components/legal-tabs";

export const metadata = { title: "Privacy" };

export default function LegalPrivacyPage() {
  return (
    <main className="flex-1 max-w-[760px] mx-auto px-6 pt-9 pb-24 w-full">
      <LegalTabs />
      <h1 className="font-bold text-[28px] m-0 mb-4">Privacy</h1>
      <p className="text-sm leading-[1.7] text-tan mb-3.5">
        Creating an account stores your email, display name, cart, favorites,
        reviews, and order history in our database so the site can function —
        sign in on another device and your cart is still there. This data is
        only used to run the site, never sold or shared with third parties.
      </p>
      <p className="text-sm leading-[1.7] text-tan mb-3.5">
        No analytics or advertising trackers are used on this site. The only
        cookies set are the ones required to keep you signed in.
      </p>
      <p className="text-sm leading-[1.7] text-tan m-0">
        You can delete your account data at any time by contacting me on the{" "}
        <a href="/legal-contact" className="text-gold! hover:text-foreground!">
          Contact
        </a>{" "}
        page.
      </p>
    </main>
  );
}
