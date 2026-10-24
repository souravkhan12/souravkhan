"use client";

import { useId } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { SPRING } from "@/config/theme";
import { cn } from "@/lib/utils";

export type Tab = {
  value: string;
  label: React.ReactNode;
  /** Renders a Link when set; otherwise a button that calls onChange. */
  href?: string;
  /** Small trailing count. */
  count?: number;
};

/**
 * A row of rounded tabs with one pill that springs to whichever is active.
 * Scrolls sideways on phones (with faded edges) rather than wrapping into a
 * block that pushes the content below the fold.
 */
export function AnimatedTabs({
  tabs,
  active,
  onChange,
  className,
  size = "sm",
  label,
}: {
  tabs: Tab[];
  active: string | null;
  onChange?: (value: string) => void;
  className?: string;
  size?: "xs" | "sm";
  /** Accessible name for the group. */
  label?: string;
}) {
  const id = useId();

  return (
    <div
      role={onChange ? "tablist" : undefined}
      aria-label={label}
      className={cn(
        "scroll-fade -mx-5 flex gap-1 overflow-x-auto px-5 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0",
        className,
      )}
    >
      {tabs.map((tab) => {
        const isActive = tab.value === active;
        const cls = cn(
          "relative shrink-0 rounded-full whitespace-nowrap transition-colors",
          size === "xs" ? "px-3 py-1 text-2xs" : "px-3.5 py-1.5 text-xs",
          isActive ? "text-background" : "text-soft hover:text-foreground",
        );
        const inner = (
          <>
            {isActive && (
              <motion.span
                aria-hidden="true"
                layoutId={`tab-${id}`}
                transition={SPRING.snappy}
                className="bg-foreground absolute inset-0 -z-10 rounded-full"
              />
            )}
            {!isActive && (
              <span
                aria-hidden="true"
                className="bg-surface absolute inset-0 -z-20 rounded-full"
              />
            )}
            <span className="relative">
              {tab.label}
              {tab.count !== undefined && (
                <span
                  className={cn(
                    "font-code ml-1.5 tabular-nums",
                    isActive ? "opacity-70" : "text-faint",
                  )}
                >
                  {tab.count}
                </span>
              )}
            </span>
          </>
        );

        return tab.href ? (
          <Link
            key={tab.value}
            href={tab.href}
            aria-current={isActive ? "page" : undefined}
            className={cn(cls, "isolate")}
          >
            {inner}
          </Link>
        ) : (
          <motion.button
            key={tab.value}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange?.(tab.value)}
            whileTap={{ scale: 0.95 }}
            className={cn(cls, "isolate cursor-pointer")}
          >
            {inner}
          </motion.button>
        );
      })}
    </div>
  );
}
