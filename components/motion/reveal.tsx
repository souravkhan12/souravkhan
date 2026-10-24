"use client";

import { motion } from "motion/react";
import { REVEAL } from "@/config/theme";

type RevealProps = {
  children: React.ReactNode;
  className?: string;
  as?: "div" | "section" | "ul" | "ol" | "li" | "header";
};

const VIEWPORT = { once: true, margin: "0px 0px -10% 0px" } as const;

/**
 * Rises, un-blurs and fades in once it scrolls into view.
 *
 * Never wrap the LCP element in this: `initial` is inlined into the server
 * HTML as opacity 0, so anything inside stays unpainted until hydration.
 * The hero handles its own transform-only entrance for that reason.
 */
export function Reveal({ children, className, as = "div" }: RevealProps) {
  const Tag = motion[as];
  return (
    <Tag
      className={className}
      variants={REVEAL.item}
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT}
    >
      {children}
    </Tag>
  );
}

/** Staggers its <RevealItem> children in, one after another. */
export function RevealGroup({ children, className, as = "div" }: RevealProps) {
  const Tag = motion[as];
  return (
    <Tag
      className={className}
      variants={REVEAL.group}
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT}
    >
      {children}
    </Tag>
  );
}

export function RevealItem({ children, className, as = "div" }: RevealProps) {
  const Tag = motion[as];
  return (
    <Tag className={className} variants={REVEAL.item}>
      {children}
    </Tag>
  );
}
