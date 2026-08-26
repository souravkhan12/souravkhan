import Link from "next/link";
import { LuChevronDown } from "react-icons/lu";

export type ReadingNavItem = {
  href: string;
  title: string;
};

export type ReadingNavGroup = {
  /** Omit on a flat list; the group then renders without a heading. */
  label?: string;
  items: ReadingNavItem[];
};

/**
 * The section index that sits to the left of every reading page — patterns.dev's
 * sidebar, applied to patterns, machine coding, setup and the blog alike.
 *
 * A reader who lands on one pattern from search has no idea the other twelve
 * exist; a back-link to the index makes them go and look. The sidebar puts the
 * whole set in front of them and marks where they are in it.
 *
 * Deliberately a server component. The active item is known from the URL the
 * page already resolved, so it comes in as `currentHref` rather than being
 * discovered with usePathname, and the small-screen disclosure is a native
 * <details>. That keeps a navigation element which appears on every article
 * off the client bundle entirely.
 */
export function ReadingNav({
  title,
  href,
  groups,
  currentHref,
}: {
  /** Name of the set — "Vanilla patterns", "Machine coding". */
  title: string;
  /** Where the set's own index lives. */
  href: string;
  groups: ReadingNavGroup[];
  currentHref: string;
}) {
  const total = groups.reduce((sum, group) => sum + group.items.length, 0);
  const list = <NavList groups={groups} currentHref={currentHref} />;

  return (
    <>
      {/* ---- `wide` and up: the sticky rail ---- */}
      <nav
        aria-label={`${title} contents`}
        /* No border-r here: the nav is short and sticky, so its own right
           edge drew a stub line that stopped in mid-air below the last item.
           The column divider lives on the article instead, which is the tall
           element and runs the full page. */
        className="reading-nav-rail wide:block hidden pt-12 pr-2 pb-12 pl-10"
      >
        <Link
          href={href}
          className="ss01 normal-case-force hover:text-blue group flex items-baseline gap-2 text-sm font-semibold transition-colors"
        >
          <span className="min-w-0 flex-1">{title}</span>
          <span className="font-code text-soft text-xs tabular-nums">
            {total}
          </span>
        </Link>

        <div className="mt-5">{list}</div>
      </nav>

      {/* ---- below `wide`: a disclosure strip above the article ----
          Collapsed by default so it costs one line rather than pushing the
          headline off a phone screen. */}
      <details className="border-border wide:hidden group border-b">
        <summary className="font-code text-soft flex cursor-pointer list-none items-center gap-2 px-6 py-3 text-xs lowercase select-none marker:content-none sm:px-10 [&::-webkit-details-marker]:hidden">
          <LuChevronDown
            size={13}
            aria-hidden="true"
            className="transition-transform group-open:rotate-180"
          />
          {title.toLowerCase()}
          <span className="text-soft tabular-nums">{total}</span>
        </summary>
        <div className="px-6 pb-5 sm:px-10">{list}</div>
      </details>
    </>
  );
}

function NavList({
  groups,
  currentHref,
}: {
  groups: ReadingNavGroup[];
  currentHref: string;
}) {
  return (
    <div className="flex flex-col gap-6">
      {groups.map((group, index) => (
        <div key={group.label ?? index}>
          {group.label && (
            /* A rule under the label, rather than a vertical fence beside the
               items: the fence made every list read as a boxed widget, and
               with two or three groups the page filled up with parallel
               vertical lines that meant nothing. */
            <p className="border-border font-code text-soft mb-2 border-b pb-1.5 text-xs tracking-wide lowercase">
              {group.label}
            </p>
          )}

          <ul className="flex flex-col gap-1">
            {group.items.map((item) => {
              const isCurrent = item.href === currentHref;

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={isCurrent ? "page" : undefined}
                    /* The accent bar is drawn as a pseudo-free inset span so
                       the label's left edge never shifts between states —
                       swapping a border colour moved every inactive item by
                       a pixel on hover. */
                    /* text-xs, not text-sm: at 16px a two-word title wrapped
                       to three lines in a 14rem rail, and the index started
                       competing with the article for attention. 14px fits ~22
                       characters, so most titles land on two lines. */
                    className={`relative block py-2 pr-2 pl-3 text-xs leading-snug text-pretty transition-colors ${
                      isCurrent
                        ? "text-blue bg-blue/5 font-medium"
                        : "hover:text-foreground text-soft hover:bg-gray-50 dark:hover:bg-black"
                    }`}
                  >
                    {isCurrent && (
                      <span
                        aria-hidden="true"
                        className="bg-blue absolute inset-y-0 left-0 w-[2px]"
                      />
                    )}
                    <span className="ss01 normal-case-force">{item.title}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </div>
  );
}
