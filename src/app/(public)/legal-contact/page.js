import LegalTabs from "@/components/legal-tabs";

export const metadata = { title: "Contact" };

export default function LegalContactPage() {
  return (
    <main className="flex-1 max-w-[760px] mx-auto px-6 pt-9 pb-24 w-full">
      <LegalTabs />
      <h1 className="font-bold text-[28px] m-0 mb-4">Contact</h1>
      <p className="text-sm leading-[1.7] text-tan mb-5">
        This is a portfolio project built by Sukrit Siritip. Questions, feedback, or want
        something changed or removed? Reach out below.
      </p>
      <ul className="list-none p-0 m-0 flex flex-col gap-2.5 text-sm">
        <li>
          <span className="text-muted">Email </span>
          <a href="mailto:sukritsiritip@gmail.com" className="text-gold! hover:text-foreground!">
            sukritsiritip@gmail.com
          </a>
        </li>
        <li>
          <span className="text-muted">GitHub </span>
          <a
            href="https://github.com/sukrit-siritip"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gold! hover:text-foreground!"
          >
            github.com/sukrit-siritip
          </a>
        </li>
        <li>
          <span className="text-muted">LinkedIn </span>
          <a
            href="https://linkedin.com/in/sukrit-siritip"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gold! hover:text-foreground!"
          >
            linkedin.com/in/sukrit-siritip
          </a>
        </li>
        <li>
          <span className="text-muted">Portfolio </span>
          <a
            href="https://sukrit-siritip-portfolio-website.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gold! hover:text-foreground!"
          >
            sukrit-siritip-portfolio-website.vercel.app
          </a>
        </li>
      </ul>
    </main>
  );
}
