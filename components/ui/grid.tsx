import React from "react";

/**
 * paper.design's structural vocabulary: a modular grid whose cells are
 * separated by hairline borders, with square vertex markers at the
 * intersections and diagonal rules used as decoration.
 */

/**
 * The page's grid container. Cells inside it draw their own right/bottom
 * hairlines; the container supplies the matching top/left edges so the
 * outer frame closes.
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
    <div
      id={id}
      className={`border-border grid border-t border-l ${cols} ${className}`}
    >
      {children}
    </div>
  );
}

/**
 * One cell of the grid. Draws the right/bottom hairlines that, combined with
 * the band's top/left, produce a single-pixel rule between every neighbour.
 */
export function GridCell({
  className = "",
  tinted = false,
  padded = true,
  as: Tag = "div",
  children,
  ...props
}: {
  className?: string;
  /** Alternating fill used to give the grid rhythm. */
  tinted?: boolean;
  padded?: boolean;
  as?: React.ElementType;
} & React.HTMLAttributes<HTMLElement>) {
  return (
    <Tag
      // min-w-0: grid tracks size to `auto` by default, so a wide child (the
      // contributions graph) would otherwise blow its column out and push the
      // neighbouring cell's content past its borders.
      className={`border-border relative min-w-0 border-r border-b ${
        tinted ? "bg-gray-50 dark:bg-black" : "bg-background"
      } ${padded ? "p-8 sm:p-10" : ""} ${className}`}
      {...props}
    >
      {children}
    </Tag>
  );
}

/**
 * 12px bordered square pinned to a cell corner — paper marks its grid
 * intersections with these. Offset by half its size so it straddles the rule.
 */
export function VertexSquare({
  corner = "top-left",
  className = "",
}: {
  corner?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  className?: string;
}) {
  const position: Record<string, string> = {
    "top-left": "-top-[6px] -left-[6px]",
    "top-right": "-top-[6px] -right-[6px]",
    "bottom-left": "-bottom-[6px] -left-[6px]",
    "bottom-right": "-bottom-[6px] -right-[6px]",
  };

  return (
    <span
      aria-hidden="true"
      className={`bg-paper pointer-events-none absolute z-20 size-3 border border-gray-200 dark:border-gray-900 dark:bg-black ${position[corner]} ${className}`}
      style={{ backgroundColor: "var(--background)" }}
    />
  );
}

/**
 * paper.design's halftone signature: a faint monochrome dot grid used as a
 * background texture in otherwise-empty cells. Purely decorative.
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

/**
 * Corner-to-corner hairline drawn across a cell. `non-scaling-stroke` keeps it
 * exactly 1px however the cell is sized.
 */
export function DiagonalLine({
  direction = "tl-br",
  className = "",
}: {
  direction?: "tl-br" | "tr-bl";
  className?: string;
}) {
  const [x1, y1, x2, y2] =
    direction === "tl-br" ? [0, 0, 100, 100] : [100, 0, 0, 100];

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      fill="none"
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
    >
      <line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke="var(--color-border)"
        strokeWidth={1}
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

/**
 * The full-height vertical hairlines that flank the content column and run the
 * whole length of the page, tying the bands together.
 */
export function GridRules() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0">
      <div className="border-border mx-auto h-full max-w-[1200px] border-x" />
    </div>
  );
}
