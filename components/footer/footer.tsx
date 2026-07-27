import Link from "next/link";
import { Logo } from "@/components/ui";
import { SOCIAL_LINKS, CONTACT_INFO } from "@/config/data";

const links = [
  { name: "github", href: SOCIAL_LINKS.github, external: true },
  { name: "linkedin", href: SOCIAL_LINKS.linkedin, external: true },
  { name: "résumé", href: "/resume", external: false },
  { name: "email", href: `mailto:${CONTACT_INFO.email}`, external: true },
  { name: "rss", href: "/feed.xml", external: true },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-border border-x border-t text-sm text-gray-500">
      {/* Main band: wordmark left, links right */}
      <div className="flex flex-col items-start justify-between gap-6 px-6 py-8 sm:flex-row sm:items-center sm:px-10">
        <Link href="/" className="group/logo flex items-center gap-2.5">
          <Logo
            size={20}
            className="group-hover/logo:text-blue text-foreground shrink-0 transition-colors"
          />
          <span className="ss01 text-foreground text-sm font-semibold">
            sourav khan
          </span>
        </Link>

        <nav className="flex flex-wrap gap-x-6 gap-y-2">
          {links.map((l) => (
            <a
              key={l.name}
              href={l.href}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue text-sm lowercase transition-colors"
            >
              {l.name}
            </a>
          ))}
        </nav>
      </div>

      {/* Baseline */}
      <div className="border-border border-t px-6 py-4 sm:px-10">
        <span className="font-code text-xs text-gray-500">
          © {year} sourav khan
        </span>
      </div>
    </footer>
  );
}
