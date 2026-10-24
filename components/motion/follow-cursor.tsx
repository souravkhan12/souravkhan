"use client";

import { useEffect, useRef } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "motion/react";
import { cn } from "@/lib/utils";

/**
 * Leans its child toward the pointer, wherever it is on the page: a few
 * degrees of 3D tilt plus a couple of pixels of drift, on a soft spring so
 * it trails the cursor rather than snapping to it.
 *
 * Mouse pointers only (a touch has no "where the cursor is" between taps),
 * and off entirely for reduced motion. It only ever sets transforms, so it
 * never delays the first paint of what it wraps.
 */
export function FollowCursor({
  children,
  className,
  strength = 1,
}: {
  children: React.ReactNode;
  className?: string;
  /** Multiplies the tilt; 1 ≈ 12° at the far edge of the screen. */
  strength?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const nx = useMotionValue(0);
  const ny = useMotionValue(0);
  const spring = { stiffness: 120, damping: 14, mass: 0.6 };
  const sx = useSpring(nx, spring);
  const sy = useSpring(ny, spring);

  const rotateY = useTransform(sx, (v) => v * 12 * strength);
  const rotateX = useTransform(sy, (v) => -v * 12 * strength);
  const x = useTransform(sx, (v) => v * 3 * strength);
  const y = useTransform(sy, (v) => v * 3 * strength);

  useEffect(() => {
    if (reduce) return;
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" || !ref.current) return;
      const r = ref.current.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      // Normalised to the viewport so the lean is gentle near the element
      // and tops out at the screen edge, clamped to [-1, 1].
      const clamp = (v: number) => Math.max(-1, Math.min(1, v));
      nx.set(clamp((e.clientX - cx) / (window.innerWidth / 2)));
      ny.set(clamp((e.clientY - cy) / (window.innerHeight / 2)));
    };
    const onLeave = () => {
      nx.set(0);
      ny.set(0);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, [reduce, nx, ny]);

  return (
    <div className={cn("[perspective:400px]", className)}>
      <motion.div ref={ref} style={{ rotateX, rotateY, x, y }}>
        {children}
      </motion.div>
    </div>
  );
}
