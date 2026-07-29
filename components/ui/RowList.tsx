import Link from "next/link";
import { LuArrowRight, LuArrowUpRight } from "react-icons/lu";

export type Row = {
  /** Stable key + destination. */
  href: string;
  title: string;
  /** The small mono line under the title — source, date, reading time, … */
  meta?: string;
  /** Optional trailing label, hidden on phones where there's no room. */
  chip?: string;
  /** Renders an ↗ and opens in a new tab. */
  external?: boolean;
  /** Tooltip — for detail that can't earn a line in a row this dense. */
  hint?: string;
};

/**
 * The site's compact list primitive: one row per item, title over a mono meta
 * line, at roughly a third the height of a GridCell card.
 *
 * Sections that are *pointers* — setup guides, arcade games, bookmarks — use
 * this instead of cards. Cards are reserved for things with their own
 * artwork and prose (projects, posts), so card weight stays meaningful
 * instead of every list on the site shouting equally loudly.
 */
export function RowList({ rows }: { rows: Row[] }) {
  return (
    <ul className="border-border border-x border-b">
      {rows.map((row, index) => {
        const Arrow = row.external ? LuArrowUpRight : LuArrowRight;
        const inner = (
          <>
            {/* A mono index gives the rows a left edge to line up against —
                without it they read as an undifferentiated stack of text. */}
            <span
              aria-hidden="true"
              className="font-code group-hover:text-blue w-6 shrink-0 text-[11px] text-gray-300 tabular-nums transition-colors dark:text-gray-700"
            >
              {String(index + 1).padStart(2, "0")}
            </span>

            <div className="min-w-0 flex-1">
              <h3 className="ss01 normal-case-force group-hover:text-blue truncate text-sm font-medium transition-colors">
                {row.title}
              </h3>
              {row.meta && (
                <p className="font-code mt-0.5 truncate text-[11px] text-gray-400">
                  {row.meta}
                </p>
              )}
            </div>

            {row.chip && (
              <span className="border-border font-code hidden shrink-0 border px-2 py-0.5 text-[11px] text-gray-500 sm:inline">
                {row.chip}
              </span>
            )}

            <Arrow
              size={15}
              aria-hidden="true"
              className="group-hover:text-blue shrink-0 text-gray-300 transition-transform group-hover:translate-x-0.5 dark:text-gray-600"
            />
          </>
        );

        // The accent bar on the left is the hover tell — a background tint
        // alone was too quiet to say "this whole row is the target".
        const className =
          "flex items-center gap-3 border-l-2 border-transparent px-6 py-3.5 transition-colors hover:border-blue hover:bg-gray-50 sm:px-8 dark:hover:bg-black";

        return (
          <li
            key={row.href}
            className="border-border group border-b last:border-b-0"
          >
            {row.external ? (
              <a
                href={row.href}
                target="_blank"
                rel="noopener noreferrer"
                title={row.hint}
                className={className}
              >
                {inner}
              </a>
            ) : (
              <Link href={row.href} title={row.hint} className={className}>
                {inner}
              </Link>
            )}
          </li>
        );
      })}
    </ul>
  );
}
