import Link from "next/link";
import { SOCIAL_LINKS, CONTACT_INFO } from "@/config/data";
import { BrandMark } from "@/components/ui/BrandMark";

const links = [
  { name: "GitHub", href: SOCIAL_LINKS.github },
  { name: "LinkedIn", href: SOCIAL_LINKS.linkedin },
  { name: "Résumé", href: CONTACT_INFO.resume },
  { name: "Email", href: `mailto:${CONTACT_INFO.email}` },
  { name: "RSS", href: "/feed.xml" },
];

/** The one rule on every page sits above this. */
export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-border text-soft mt-16 border-t pt-8 pb-10 text-sm">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
        <Link href="/" className="group flex items-center gap-2.5">
          <BrandMark size={26} />
          <span className="text-foreground font-semibold">Sourav Khan</span>
        </Link>

        <nav className="flex flex-wrap gap-x-5 gap-y-2" aria-label="footer">
          {links.map((l) => (
            <a
              key={l.name}
              href={l.href}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors"
            >
              {l.name}
            </a>
          ))}
        </nav>
      </div>

      <div className="font-code text-faint text-2xs mt-8 flex flex-wrap items-center justify-between gap-2">
        <span>© {year} Sourav Khan</span>
        <span>{CONTACT_INFO.city} · open to remote work worldwide</span>
      </div>
    </footer>
  );
}
