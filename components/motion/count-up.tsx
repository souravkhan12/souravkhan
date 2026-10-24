"use client";

import { useEffect, useRef } from "react";
import { animate, useInView, useReducedMotion } from "motion/react";

/**
 * Counts the numeric part of `value` up from zero once it's in view —
 * "2,000+" keeps its comma and its plus. Values with no digits ("AWS") and
 * reduced-motion users get the final text straight away; the server HTML is
 * always the final text, so nothing is ever wrong without JS.
 */
export function CountUp({
  value,
  className,
}: {
  value: string;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  const reduce = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    const match = value.match(/[\d,]+/);
    if (!el || !inView || reduce || !match) return;

    const target = Number(match[0].replace(/,/g, ""));
    const [before, after] = value.split(match[0]);
    const grouped = match[0].includes(",");
    const fmt = (n: number) => {
      const r = Math.round(n);
      return `${before}${grouped ? r.toLocaleString("en-US") : r}${after}`;
    };

    el.textContent = fmt(0);
    const controls = animate(0, target, {
      duration: 1.1,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (n) => (el.textContent = fmt(n)),
    });
    return () => controls.stop();
  }, [inView, reduce, value]);

  return (
    <span ref={ref} className={className}>
      {value}
    </span>
  );
}
