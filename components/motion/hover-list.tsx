"use client";

import { createContext, useContext, useId, useState } from "react";
import { motion } from "motion/react";
import { SPRING } from "@/config/theme";
import { cn } from "@/lib/utils";

type HoverCtx = {
  id: string;
  hovered: string | null;
  setHovered: (key: string | null) => void;
};

const HoverListContext = createContext<HoverCtx | null>(null);

/**
 * One soft highlight that slides between rows as the pointer (or keyboard
 * focus) moves — the Linear / ramx effect. Each list gets its own
 * `layoutId`, so two lists on a page never trade highlights.
 *
 * Rows bleed the highlight past the text with `-mx-3 px-3`, so the list's
 * text still lines up with everything else in the column.
 */
export function HoverList({
  children,
  className,
  as: Tag = "ul",
}: {
  children: React.ReactNode;
  className?: string;
  as?: "ul" | "ol" | "div";
}) {
  const id = useId();
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <HoverListContext.Provider value={{ id, hovered, setHovered }}>
      <Tag
        className={cn("isolate", className)}
        onMouseLeave={() => setHovered(null)}
      >
        {children}
      </Tag>
    </HoverListContext.Provider>
  );
}

export function HoverItem({
  itemKey,
  children,
  className,
  highlightClassName,
  as: Tag = "li",
}: {
  itemKey: string;
  children: React.ReactNode;
  className?: string;
  highlightClassName?: string;
  as?: "li" | "div";
}) {
  const ctx = useContext(HoverListContext);
  if (!ctx) throw new Error("HoverItem must be rendered inside a HoverList");
  const active = ctx.hovered === itemKey;

  return (
    <Tag
      className={cn("relative", className)}
      onMouseEnter={() => ctx.setHovered(itemKey)}
      onFocus={() => ctx.setHovered(itemKey)}
      onBlur={() => ctx.setHovered(null)}
    >
      {active && (
        <motion.span
          aria-hidden="true"
          layoutId={`hover-${ctx.id}`}
          transition={SPRING.snappy}
          className={cn(
            "bg-surface-hover absolute -inset-x-3 inset-y-0 -z-10 rounded-lg",
            highlightClassName,
          )}
        />
      )}
      {children}
    </Tag>
  );
}
