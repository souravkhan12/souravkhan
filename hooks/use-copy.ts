"use client";

import * as React from "react";

/**
 * Copy-to-clipboard with a "copied" flag that resets itself.
 *
 * `navigator.clipboard` is undefined on insecure origins and throws when the
 * document isn't focused, so there's an execCommand fallback — a share button
 * that silently does nothing is worse than not having one.
 */
export function useCopy(resetAfter = 1600) {
  const [copied, setCopied] = React.useState(false);
  const timer = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  // Without this, copying and navigating away sets state on an unmounted tree.
  React.useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  const copy = React.useCallback(
    async (text: string) => {
      let ok = false;

      try {
        await navigator.clipboard.writeText(text);
        ok = true;
      } catch {
        ok = legacyCopy(text);
      }

      if (!ok) return false;

      setCopied(true);
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), resetAfter);
      return true;
    },
    [resetAfter],
  );

  return { copied, copy };
}

function legacyCopy(text: string): boolean {
  try {
    const el = document.createElement("textarea");
    el.value = text;
    // Off-screen rather than hidden: display:none isn't selectable.
    el.style.position = "fixed";
    el.style.top = "-9999px";
    el.setAttribute("readonly", "");
    document.body.appendChild(el);
    el.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(el);
    return ok;
  } catch {
    return false;
  }
}
