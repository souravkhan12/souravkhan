"use client";

/**
 * Shared chrome for the MDX diagram components.
 *
 * Matches the site's soft-card treatment: rounded border, surface /
 * black band, thin blue accent bar, lowercase font-code label. `not-prose`
 * stops the typography plugin restyling the internals, and `blog-breakout`
 * (globals.css) lets the panel escape the text measure on wide screens.
 *
 * Sizes come from the site scale — text-xs is 14px here, text-sm is 16px.
 * No arbitrary px values.
 */

export function Panel({
  label,
  children,
  footnote,
}: {
  label: string;
  children: React.ReactNode;
  footnote?: React.ReactNode;
}) {
  return (
    <figure className="not-prose blog-breakout border-border bg-surface my-10 overflow-hidden rounded-2xl border">
      <figcaption className="border-border flex items-center gap-3 border-b px-4 py-2.5 sm:px-5">
        <span aria-hidden="true" className="bg-blue h-3.5 w-[3px]" />
        <span className="font-code text-soft text-xs lowercase">{label}</span>
      </figcaption>

      <div className="px-4 py-5 sm:px-5">{children}</div>

      {footnote && (
        <div className="border-border border-t px-4 py-3 text-sm leading-relaxed text-gray-600 sm:px-5 dark:text-gray-400">
          {footnote}
        </div>
      )}
    </figure>
  );
}

export function Chip({
  children,
  active,
}: {
  children: React.ReactNode;
  active?: boolean;
}) {
  return (
    <span
      className={`font-code rounded-full border px-2.5 py-1 text-xs transition-colors ${
        active
          ? "border-blue/40 bg-blue/5 text-blue"
          : "border-border bg-white text-gray-600 dark:bg-gray-950 dark:text-gray-400"
      }`}
    >
      {children}
    </span>
  );
}

export function TreeLine({
  depth,
  children,
  muted,
  struck,
}: {
  depth: number;
  children: React.ReactNode;
  muted?: boolean;
  struck?: boolean;
}) {
  return (
    <div
      className={`font-code text-xs leading-6 ${
        muted ? "text-faint" : "text-gray-700 dark:text-gray-300"
      } ${struck ? "line-through" : ""}`}
      style={{ paddingLeft: depth * 16 }}
    >
      {depth > 0 && <span className="text-faint">└─ </span>}
      {children}
    </div>
  );
}

/** Tab row used by the interactive panels. */
export function Tabs<T extends string>({
  options,
  value,
  onChange,
  labels,
}: {
  options: readonly T[];
  value: T;
  onChange: (v: T) => void;
  labels?: Record<T, string>;
}) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {options.map((o) => (
        <button
          key={o}
          type="button"
          onClick={() => onChange(o)}
          aria-pressed={value === o}
          className={`font-code rounded-full border px-3 py-1.5 text-xs transition-colors ${
            value === o
              ? "border-blue bg-blue/5 text-blue"
              : "border-border text-soft hover:border-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
          }`}
        >
          {labels?.[o] ?? o}
        </button>
      ))}
    </div>
  );
}
