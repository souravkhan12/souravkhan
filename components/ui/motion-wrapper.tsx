"use client";

import { motion } from "motion/react";

interface MotionWrapperProps {
  children?: React.ReactNode;
  className?: string;
  variants?: any;
  initial?: any;
  whileInView?: any;
  transition?: any;
  viewport?: any;
  whileHover?: any;
  whileTap?: any;
  layout?: boolean;
  style?: React.CSSProperties;
  animate?: any;
  onHoverStart?: () => void;
  onHoverEnd?: () => void;
}

export function MotionDiv({
  children,
  className,
  variants,
  initial,
  whileInView,
  transition,
  viewport,
  whileHover,
  whileTap,
  layout,
  style,
  animate,
  onHoverStart,
  onHoverEnd,
}: MotionWrapperProps) {
  return (
    <motion.div
      className={className}
      variants={variants}
      initial={initial}
      whileInView={whileInView}
      transition={transition}
      viewport={viewport}
      whileHover={whileHover}
      whileTap={whileTap}
      layout={layout}
      style={style}
      animate={animate}
      onHoverStart={onHoverStart}
      onHoverEnd={onHoverEnd}
    >
      {children}
    </motion.div>
  );
}

export function MotionSpan({
  children,
  className,
  variants,
  initial,
  whileInView,
  transition,
  viewport,
  whileHover,
  whileTap,
  layout,
  style,
  animate,
}: MotionWrapperProps) {
  return (
    <motion.span
      className={className}
      variants={variants}
      initial={initial}
      whileInView={whileInView}
      transition={transition}
      viewport={viewport}
      whileHover={whileHover}
      whileTap={whileTap}
      layout={layout}
      style={style}
      animate={animate}
    >
      {children}
    </motion.span>
  );
}
