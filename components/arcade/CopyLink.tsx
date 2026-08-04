"use client";

import { LuCheck, LuLink } from "react-icons/lu";
import { useCopy } from "@/hooks/use-copy";

/** Copies a puzzle's permalink. Small enough to sit in a panel header. */
export function CopyLink({ url }: { url: string }) {
  const { copied, copy } = useCopy();

  return (
    <button
      type="button"
      onClick={() => copy(url)}
      className="hover:text-blue font-code text-2xs text-soft inline-flex cursor-pointer items-center gap-1.5 lowercase transition-colors"
    >
      {copied ? (
        <LuCheck size={12} aria-hidden="true" />
      ) : (
        <LuLink size={12} aria-hidden="true" />
      )}
      {copied ? "copied" : "copy link"}
    </button>
  );
}
