"use client";

import { useRef } from "react";
import Link from "next/link";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "motion/react";
import { SPRING } from "@/config/theme";
import { cn } from "@/lib/utils";

const MotionLink = motion.create(Link);

const base =
  "group/pill inline-flex h-10 items-center justify-center gap-1.5 rounded-full px-4.5 text-xs whitespace-nowrap transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus";

const variants = {
  solid: "bg-foreground text-background font-semibold hover:bg-foreground/85",
  outline:
    "border border-border bg-background hover:border-foreground/40 hover:bg-surface",
  ghost: "text-soft hover:text-foreground hover:bg-surface",
} as const;

type PillProps = {
  href: string;
  children: React.ReactNode;
  variant?: keyof typeof variants;
  /** Leans a few px toward the pointer. Desktop pointers only. */
  magnetic?: boolean;
  /** Shows a trailing arrow that slides on hover. */
  arrow?: "right" | "up-right" | false;
  external?: boolean;
  className?: string;
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
  "aria-label"?: string;
  download?: boolean;
};

/**
 * The site's button. Springs down on press, optionally leans toward the
 * pointer, and slides its arrow on hover — small enough to never be noticed
 * as "an animation", which is the point.
 */
export function Pill({
  href,
  children,
  variant = "outline",
  magnetic = false,
  arrow = false,
  external = false,
  className,
  onClick,
  download,
  ...rest
}: PillProps) {
  const ref = useRef<HTMLAnchorElement>(null);
  const reduce = useReducedMotion();
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const x = useSpring(mx, SPRING.smooth);
  const y = useSpring(my, SPRING.smooth);

  const onMove = (e: React.PointerEvent) => {
    if (!magnetic || reduce || e.pointerType !== "mouse" || !ref.current)
      return;
    const r = ref.current.getBoundingClientRect();
    mx.set(((e.clientX - r.left) / r.width - 0.5) * 8);
    my.set(((e.clientY - r.top) / r.height - 0.5) * 6);
  };
  const onLeave = () => {
    mx.set(0);
    my.set(0);
  };

  const content = (
    <>
      {children}
      {arrow && (
        <span
          aria-hidden="true"
          className={cn(
            "inline-block transition-transform duration-200 ease-out",
            arrow === "right"
              ? "group-hover/pill:translate-x-0.5"
              : "group-hover/pill:translate-x-0.5 group-hover/pill:-translate-y-0.5",
          )}
        >
          {arrow === "right" ? "→" : "↗"}
        </span>
      )}
    </>
  );

  const shared = {
    ref,
    style: { x, y },
    whileTap: { scale: 0.96 },
    transition: SPRING.snappy,
    onPointerMove: onMove,
    onPointerLeave: onLeave,
    onClick,
    className: cn(base, variants[variant], className),
    ...rest,
  };

  if (external || download) {
    return (
      <motion.a
        href={href}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        download={download}
        {...shared}
      >
        {content}
      </motion.a>
    );
  }

  return (
    <MotionLink href={href} {...shared}>
      {content}
    </MotionLink>
  );
}
