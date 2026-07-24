import { SOCIAL_LINKS } from "@/config/data";

export default function Footer() {
  return (
    <footer className="border-border border-t border-r border-b border-l text-sm text-gray-500">
      <div className="flex flex-col items-center justify-between gap-3 px-6 py-6 sm:flex-row sm:px-8">
        <span>© {new Date().getFullYear()} sourav khan</span>

        <div className="flex gap-6 lowercase">
          <a
            href={SOCIAL_LINKS.github}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue transition-colors"
          >
            github
          </a>
          <a
            href={SOCIAL_LINKS.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue transition-colors"
          >
            linkedin
          </a>
        </div>
      </div>
    </footer>
  );
}
