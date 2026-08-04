"use client";

import { useMemo, useState } from "react";
import { RowList } from "@/components/ui";
import type { Bookmark } from "@/lib/reading";

const fmtDate = (d: string) =>
  new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "short" });

/**
 * Things worth reading that I didn't write. Uses the same compact RowList as
 * setup and the arcade: a bookmark is a pointer somewhere else, so it
 * shouldn't take as much vertical space as one of my own posts.
 */
export function ReadingList({
  bookmarks,
  tags = [],
  initial,
}: {
  bookmarks: Bookmark[];
  tags?: string[];
  /** Show this many, then offer to expand the rest in place. */
  initial?: number;
}) {
  const [active, setActive] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);

  const filtered = useMemo(
    () =>
      active ? bookmarks.filter((b) => b.tags.includes(active)) : bookmarks,
    [bookmarks, active],
  );

  // Expanding in place beats sending someone to another page for four more
  // rows — they keep their filter, their scroll position and their context.
  const visible =
    initial && !expanded && !active ? filtered.slice(0, initial) : filtered;
  const hidden = filtered.length - visible.length;

  // Left-aligned on the same 24/32px gutter as a real row, so the empty state
  // occupies the space a bookmark would rather than floating in it.
  if (bookmarks.length === 0) {
    return (
      <div className="border-border border-x border-b p-6 sm:p-8">
        <p className="ss01 normal-case-force text-base font-semibold">
          Nothing saved yet.
        </p>
        <p className="text-soft mt-2 max-w-xl text-sm">
          This is where posts, essays and talks worth my time will land — each
          with a line on why it&apos;s here, rather than just a link dump.
        </p>
      </div>
    );
  }

  return (
    <>
      {tags.length > 0 && (
        // Its own bordered strip: as a bare flex row it sat outside the grid
        // and read as 4px further left than every rule on the page. Phones
        // scroll it on one line instead of stacking it into a block that
        // pushes the list below the fold.
        <div className="border-border flex gap-2 overflow-x-auto border-x border-t px-6 py-2.5 sm:flex-wrap sm:overflow-visible sm:px-8">
          <button
            type="button"
            onClick={() => setActive(null)}
            className={`font-code text-2xs shrink-0 border px-2 py-0.5 whitespace-nowrap transition-colors ${
              active === null
                ? "border-blue text-blue"
                : "border-border hover:border-blue hover:text-blue text-soft"
            }`}
          >
            all <span className="text-faint">{bookmarks.length}</span>
          </button>
          {tags.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => setActive((t) => (t === tag ? null : tag))}
              className={`font-code text-2xs shrink-0 border px-2 py-0.5 whitespace-nowrap transition-colors ${
                active === tag
                  ? "border-blue text-blue"
                  : "border-border hover:border-blue hover:text-blue text-soft"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      )}

      <RowList
        rows={visible.map((bookmark) => ({
          href: bookmark.url,
          title: bookmark.title,
          meta: [bookmark.source, bookmark.author, fmtDate(bookmark.date)]
            .filter(Boolean)
            .join(" · "),
          chip: bookmark.tags[0],
          external: true,
          // The "why it's here" note is the point of the list, but it can't
          // earn a line in a row this dense.
          hint: bookmark.note,
        }))}
      />

      {hidden > 0 && (
        <button
          type="button"
          onClick={() => setExpanded(true)}
          className="border-border hover:text-blue font-code text-2xs text-soft w-full border-x border-b px-6 py-2.5 text-left transition-colors hover:bg-gray-50 sm:px-8 dark:hover:bg-black"
        >
          show {hidden} more ↓
        </button>
      )}
    </>
  );
}
