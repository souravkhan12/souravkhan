"use client";

import type { Heading } from "@/lib/blog";
import { useReadingProgress } from "@/hooks/use-reading-progress";
import { cn } from "@/lib/utils";

/**
 * Sticky table of contents for the right rail, desktop only.
 *
 * The rail is a single hairline with a blue segment tracking the active
 * section, rather than a border per item — same idea as the reading bar at
 * the top of the page, so the two indicators read as one system. Below `lg`
 * this renders nothing and BlogProgress's floating widget takes over; there
 * isn't room for a rail and a 40rem measure at the same time.
 */
export function BlogToc({
  headings,
  footer,
}: {
  headings: Heading[];
  /** Rendered under the contents list, inside the same sticky block. */
  footer?: React.ReactNode;
}) {
  const { activeId, scrollToHeading } = useReadingProgress(headings);

  if (headings.length === 0 && !footer) return null;

  const activeIndex = Math.max(
    0,
    headings.findIndex((h) => h.id === activeId),
  );

  return (
    <div className="sticky top-24 hidden max-h-[calc(100vh-8rem)] overflow-y-auto lg:block">
      {/* A post with no H2s still gets the rail — just the share block in it,
          rather than a percentage divided by zero. */}
      {headings.length > 0 && (
        <nav aria-label="On this page">
          <p className="font-code text-faint mb-3 text-xs lowercase">
            on this page
          </p>

          <div className="relative">
            {/* The rail itself, and the segment of it you've reached. */}
            <span
              aria-hidden="true"
              className="bg-border absolute inset-y-0 left-0 w-px"
            />
            <span
              aria-hidden="true"
              className="bg-blue absolute left-0 w-px transition-all duration-200 ease-out"
              style={{
                top: `${(activeIndex / headings.length) * 100}%`,
                height: `${(1 / headings.length) * 100}%`,
              }}
            />

            <ul className="flex flex-col">
              {headings.map((heading) => {
                const isActive = heading.id === activeId;
                return (
                  <li key={heading.id}>
                    <button
                      type="button"
                      onClick={() => scrollToHeading(heading.id)}
                      aria-current={isActive ? "location" : undefined}
                      className={cn(
                        "normal-case-force text-2xs block w-full py-1.5 pr-2 text-left leading-snug transition-colors",
                        heading.depth === 3 ? "pl-6" : "pl-4",
                        isActive
                          ? "text-blue"
                          : "hover:text-foreground text-soft",
                      )}
                    >
                      {heading.text}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </nav>
      )}

      {footer}
    </div>
  );
}
