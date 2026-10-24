import React from "react";

/**
 * A grid of soft cards. It used to be a hairline-ruled sheet (paper.design);
 * the cells are now separate rounded cards on a gap, so a band reads as a
 * set of things you can pick up rather than a table.
 */
export function GridBand({
  className = "",
  cols = "1",
  id,
  children,
}: {
  className?: string;
  /** Tailwind grid-template-columns utility set (responsive-friendly). */
  cols?: string;
  id?: string;
  children: React.ReactNode;
}) {
  return (
    <div id={id} className={`grid gap-3 ${cols} ${className}`}>
      {children}
    </div>
  );
}

/** One card of the grid. */
export function GridCell({
  className = "",
  tinted = false,
  padded = true,
  as: Tag = "div",
  children,
  ...props
}: {
  className?: string;
  /** A filled surface instead of an outlined one. */
  tinted?: boolean;
  padded?: boolean;
  as?: React.ElementType;
} & React.HTMLAttributes<HTMLElement>) {
  return (
    <Tag
      // min-w-0: grid tracks size to `auto` by default, so a wide child (the
      // contributions graph) would otherwise blow its column out.
      className={`border-border/70 relative min-w-0 overflow-hidden rounded-2xl border ${
        tinted ? "bg-surface" : "bg-background"
      } ${padded ? "p-6 sm:p-8" : ""} ${className}`}
      {...props}
    >
      {children}
    </Tag>
  );
}

/**
 * A faint dot grid used as a background texture in otherwise-empty cards.
 * Purely decorative.
 */
export function DotGrid({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 ${className}`}
      style={{
        backgroundImage:
          "radial-gradient(var(--color-border) 1.1px, transparent 1.1px)",
        backgroundSize: "16px 16px",
        backgroundPosition: "center",
        maskImage:
          "radial-gradient(ellipse at center, black 55%, transparent 100%)",
        WebkitMaskImage:
          "radial-gradient(ellipse at center, black 55%, transparent 100%)",
      }}
    />
  );
}
