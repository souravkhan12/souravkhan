"use client";

import { useMemo, useState } from "react";
import { RowList } from "@/components/ui";
import { AnimatedTabs } from "@/components/motion/animated-tabs";
import type { Bookmark } from "@/lib/reading";

const fmtDate = (d: string) =>
  new Date(d).toLocaleDateString("en-GB", { year: "numeric", month: "short" });

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
      <div className="py-4">
        <p className="text-base font-semibold">Nothing saved yet.</p>
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
        <AnimatedTabs
          label="Filter bookmarks by tag"
          size="xs"
          className="mb-4"
          active={active ?? "all"}
          onChange={(value) =>
            setActive(value === "all" || value === active ? null : value)
          }
          tabs={[
            { value: "all", label: "all", count: bookmarks.length },
            ...tags.map((tag) => ({ value: tag, label: tag })),
          ]}
        />
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
          className="font-code text-2xs text-soft hover:text-foreground bg-surface hover:bg-surface-hover mt-3 rounded-full px-4 py-2 transition-colors active:scale-[0.97]"
        >
          Show {hidden} more ↓
        </button>
      )}
    </>
  );
}
