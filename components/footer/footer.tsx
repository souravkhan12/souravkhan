import { SOCIAL_LINKS, CONTACT_INFO } from "@/config/data";

const links = [
  { name: "GitHub", href: SOCIAL_LINKS.github },
  { name: "LinkedIn", href: SOCIAL_LINKS.linkedin },
  { name: "Résumé", href: CONTACT_INFO.resume },
  { name: "Email", href: `mailto:${CONTACT_INFO.email}` },
  { name: "RSS", href: "/feed.xml" },
];

/**
 * `inset` pads the footer to the inner pages' 1200px frame. The homepage
 * column already carries its own gutter, so it renders the footer flush.
 */
export default function Footer({ inset = true }: { inset?: boolean }) {
  const year = new Date().getFullYear();
  const pad = inset ? "px-6 sm:px-10" : "";

  return (
    <footer
      className={`text-soft text-sm ${inset ? "border-border border-t" : ""}`}
    >
      <nav
        className={`flex flex-wrap gap-x-6 gap-y-2 pt-6 pb-8 ${pad}`}
        aria-label="footer"
      >
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

      <div
        className={`border-border font-code text-faint text-2xs flex flex-wrap items-center justify-between gap-2 border-t py-6 ${pad}`}
      >
        <span>© {year} Sourav Khan</span>
        <span>
          {CONTACT_INFO.hometown} → {CONTACT_INFO.city}
        </span>
      </div>
    </footer>
  );
}
