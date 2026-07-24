"use client";

import { useEffect, useRef, useState } from "react";
import { useOutsideClick } from "@/hooks/use-outside-click";

export const ACCENTS = [
  { id: "indigo", label: "indigo", swatch: "#5b5bd6" },
  { id: "emerald", label: "emerald", swatch: "#0e9f6e" },
  { id: "ocean", label: "ocean", swatch: "#2563eb" },
  { id: "amber", label: "amber", swatch: "#b45309" },
  { id: "rose", label: "rose", swatch: "#c2415d" },
  { id: "graphite", label: "graphite", swatch: "#4b5563" },
] as const;

export type AccentId = (typeof ACCENTS)[number]["id"];
const KEY = "accent";

/** Applies the accent by flipping one attribute — the CSS does the rest. */
function apply(id: AccentId) {
  const root = document.documentElement;
  if (id === "indigo") root.removeAttribute("data-accent");
  else root.setAttribute("data-accent", id);
  localStorage.setItem(KEY, id);
}

/**
 * Accent switcher. Collapsed to a single swatch in the navbar — six loose
 * dots up there read as clutter — and expanded inline on mobile.
 */
export function AccentPicker({ inline = false }: { inline?: boolean }) {
  // Server renders the default; the real accent is read from the DOM after
  // mount (the pre-paint script in the layout has already applied it).
  const [active, setActive] = useState<AccentId>("indigo");
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);
  useOutsideClick({ ref, callback: () => setOpen(false) });

  useEffect(() => {
    const id = requestAnimationFrame(() =>
      setActive(
        (document.documentElement.getAttribute("data-accent") as AccentId) ??
          "indigo",
      ),
    );
    return () => cancelAnimationFrame(id);
  }, []);

  const select = (id: AccentId) => {
    apply(id);
    setActive(id);
    setOpen(false);
  };

  const dots = ACCENTS.map((a) => (
    <button
      key={a.id}
      type="button"
      onClick={() => select(a.id)}
      aria-label={a.label}
      aria-pressed={active === a.id}
      title={a.label}
      className={`size-4 rounded-full transition-transform hover:scale-110 ${
        active === a.id
          ? "ring-foreground/40 ring-1 ring-offset-2 ring-offset-[var(--background)]"
          : ""
      }`}
      style={{ backgroundColor: a.swatch }}
    />
  ));

  if (inline) {
    return (
      <div role="group" aria-label="accent colour" className="flex gap-2">
        {dots}
      </div>
    );
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="change accent colour"
        aria-expanded={open}
        title="accent colour"
        className="border-border hover:border-blue flex size-5 items-center justify-center rounded-full border transition-colors"
      >
        <span className="bg-blue size-2.5 rounded-full" />
      </button>

      {open && (
        <div
          role="group"
          aria-label="accent colour"
          className="border-border bg-background absolute top-8 right-0 z-40 flex gap-2 border p-2.5"
        >
          {dots}
        </div>
      )}
    </div>
  );
}
