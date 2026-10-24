"use client";

import { usePathname } from "next/navigation";

/** The path the document was first loaded at, read once when this module
    is evaluated in the browser. */
const landingPath =
  typeof window === "undefined" ? null : window.location.pathname;

/**
 * True on the page the visitor landed on, false on pages reached by
 * client-side navigation: entrances play once, on arrival, and pages you
 * navigate to appear without replaying them.
 *
 * Derived from the pathname rather than from "has an effect run yet". The
 * old version flipped a module flag in an effect, and React hydrates in
 * chunks, so a component that hydrated after another's effect had run
 * rendered `initial={false}` against server HTML rendered with the blur —
 * a hydration mismatch. Every component sees the same pathname during
 * hydration, so they all agree.
 */
export function useInitialAnimation(): boolean {
  const pathname = usePathname();
  return landingPath === null || pathname === landingPath;
}
