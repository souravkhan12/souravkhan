"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LuChevronDown, LuCheck } from "react-icons/lu";
import type { Flavor, FlavorSlug } from "@/lib/patterns";

export type FlavorTarget = {
  flavor: Flavor;
  href: string;
  /** True when the current pattern also exists in that flavour. */
  hasMatch: boolean;
};

/**
 * The vanilla/react selector, modelled on patterns.dev's — one control that
 * changes which body of patterns you're reading rather than a nav item per
 * flavour, because the two lists answer the same question for different
 * runtimes.
 *
 * Built out of a button and links instead of a `<select>`: the options carry a
 * secondary line ("not written yet" / "same pattern"), which a native select
 * can't render, and being real links means each destination is crawlable and
 * middle-clickable.
 */
export function FlavorSwitcher({
  current,
  targets,
}: {
  current: FlavorSlug;
  targets: FlavorTarget[];
}) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const active = targets.find((t) => t.flavor.slug === current);

  // Prefetching on open rather than on render keeps the index from pulling
  // down every flavour's payload for a control most visitors never touch.
  useEffect(() => {
    if (!open) return;
    for (const target of targets) router.prefetch(target.href);
  }, [open, targets, router]);

  useEffect(() => {
    if (!open) return;

    function onPointerDown(event: MouseEvent | TouchEvent) {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false);
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      setOpen(false);
      // Focus goes back to the trigger, or a keyboard user lands at the top of
      // the document with no idea what just closed.
      buttonRef.current?.focus();
    }

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("touchstart", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("touchstart", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div ref={containerRef} className="relative">
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="menu"
        className="bg-surface hover:bg-surface-hover font-code text-2xs text-soft inline-flex items-center gap-1.5 rounded-full px-3 py-1 transition-[background-color,transform] active:scale-95"
      >
        <span className="text-foreground">
          {active?.flavor.label.toLowerCase() ?? current}
        </span>
        <LuChevronDown
          size={11}
          aria-hidden="true"
          className={`transition-transform ${open ? "rotate-180" : ""}`}
        />
        <span className="sr-only">change pattern flavour</span>
      </button>

      {open && (
        <div
          role="menu"
          aria-label="Pattern flavour"
          // Solid background, not the page's: the menu overlaps rows, and a
          // transparent panel let the list underneath read straight through it.
          className="bg-background shadow-soft animate-in fade-in zoom-in-95 slide-in-from-top-1 absolute top-[calc(100%+6px)] left-0 z-30 w-56 origin-top-left rounded-2xl p-1.5 duration-200"
        >
          {targets.map(({ flavor, href, hasMatch }) => {
            const isCurrent = flavor.slug === current;
            return (
              <Link
                key={flavor.slug}
                href={href}
                role="menuitem"
                onClick={() => setOpen(false)}
                className="group hover:bg-surface flex items-start gap-2 rounded-xl px-3 py-2 transition-colors"
              >
                <LuCheck
                  size={12}
                  aria-hidden="true"
                  className={`text-blue mt-[3px] shrink-0 ${isCurrent ? "" : "invisible"}`}
                />
                <span className="min-w-0">
                  <span className="block text-sm font-medium">
                    {flavor.label}
                  </span>
                  <span className="font-code text-2xs text-faint mt-0.5 block">
                    {isCurrent
                      ? "reading now"
                      : hasMatch
                        ? "same pattern, this runtime"
                        : "browse the index"}
                  </span>
                </span>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
