"use client";

import { useEffect } from "react";

let hasAnimatedOnce = false;

export function useInitialAnimation(): boolean {
  const shouldAnimate = !hasAnimatedOnce;

  useEffect(() => {
    hasAnimatedOnce = true;
  }, []);

  return shouldAnimate;
}
