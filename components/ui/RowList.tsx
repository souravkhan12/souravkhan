import Link from "next/link";
import { LuArrowRight, LuArrowUpRight } from "react-icons/lu";
import { HoverList, HoverItem } from "@/components/motion/hover-list";

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
 * The site's compact list primitive: one row per item, title over a mono
 * meta line, with a soft highlight that slides between rows on hover.
 *
 * Sections that are *pointers* — setup guides, arcade games, bookmarks — use
 * this instead of cards. Cards are reserved for things with their own
 * artwork and prose (projects, posts), so card weight stays meaningful.
 */
export function RowList({ rows }: { rows: Row[] }) {
  return (
    <HoverList className="flex flex-col">
      {rows.map((row) => {
        const Arrow = row.external ? LuArrowUpRight : LuArrowRight;
        const inner = (
          <>
            <div className="min-w-0 flex-1">
              <h3 className="truncate text-sm font-semibold">{row.title}</h3>
              {row.meta && (
                <p className="font-code text-2xs text-faint mt-0.5 truncate">
                  {row.meta}
                </p>
              )}
            </div>

            {row.chip && (
              <span className="font-code text-2xs text-soft bg-surface hidden shrink-0 rounded-full px-2.5 py-0.5 sm:inline">
                {row.chip}
              </span>
            )}

            <Arrow
              size={15}
              aria-hidden="true"
              className="text-faint group-hover:text-foreground shrink-0 transition-transform duration-200 group-hover:translate-x-0.5"
            />
          </>
        );

        const className = "group flex items-center gap-3 py-3";

        return (
          <HoverItem key={row.href} itemKey={row.href}>
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
          </HoverItem>
        );
      })}
    </HoverList>
  );
}
