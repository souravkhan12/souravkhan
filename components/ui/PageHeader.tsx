"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { LuArrowLeft } from "react-icons/lu";
import { EASE_OUT } from "@/config/theme";
import { useInitialAnimation } from "@/hooks/use-initial-animation";

/**
 * The inner-page version of the homepage hero: a small mono eyebrow, one big
 * headline with an optional muted second clause, and a short deck under it.
 *
 * Same entrance as the hero — translate and blur only, no opacity — because
 * the <h1> is usually the page's LCP element and an opacity-0 start would
 * hold its first paint until hydration.
 */
export function PageHeader({
  eyebrow,
  back,
  title,
  muted,
  description,
  count,
  children,
}: {
  eyebrow?: string;
  /** Renders a ← link in place of the eyebrow. */
  back?: { href: string; label: string };
  title: string;
  /** Second clause, rendered faint — "Writing. Notes on building for the web." */
  muted?: string;
  description?: React.ReactNode;
  count?: number;
  /** Rendered under the description: tags, filters, actions. */
  children?: React.ReactNode;
}) {
  const shouldAnimate = useInitialAnimation();
  const initial = shouldAnimate ? { y: 6, filter: "blur(6px)" } : false;
  const animate = { y: 0, filter: "blur(0px)" };

  return (
    <header className="pt-10 pb-8 sm:pt-16 sm:pb-10">
      {back ? (
        <Link
          href={back.href}
          className="font-code text-faint hover:text-foreground group/back text-2xs inline-flex items-center gap-1.5 transition-colors"
        >
          <LuArrowLeft
            size={13}
            aria-hidden="true"
            className="transition-transform group-hover/back:-translate-x-0.5"
          />
          {back.label}
        </Link>
      ) : (
        eyebrow && (
          <p className="font-code text-faint text-2xs flex items-center gap-2">
            {eyebrow}
            {count !== undefined && (
              <span className="bg-surface text-soft rounded-full px-2 py-0.5 tabular-nums">
                {count}
              </span>
            )}
          </p>
        )
      )}

      <motion.h1
        initial={initial}
        animate={animate}
        transition={{ duration: 0.45, ease: EASE_OUT }}
        className="mt-5 text-[30px] leading-[1.15] font-bold tracking-[-0.03em] text-balance sm:text-[40px]"
      >
        {title}
        {muted && <span className="text-faint"> {muted}</span>}
      </motion.h1>

      {description && (
        <motion.div
          initial={shouldAnimate ? { y: 6, opacity: 0 } : false}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.45, delay: 0.08, ease: EASE_OUT }}
          className="text-soft mt-4 max-w-[60ch] text-base leading-relaxed text-pretty"
        >
          {description}
        </motion.div>
      )}

      {children && (
        <motion.div
          initial={shouldAnimate ? { y: 6, opacity: 0 } : false}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.45, delay: 0.14, ease: EASE_OUT }}
          className="mt-7"
        >
          {children}
        </motion.div>
      )}
    </header>
  );
}
