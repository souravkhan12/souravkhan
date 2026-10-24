"use client";

import { LuCheck, LuLink } from "react-icons/lu";
import { useCopy } from "@/hooks/use-copy";

const LABEL = "font-code text-2xs";

/**
 * Copy-the-permalink control for a post — the footer row under the article
 * and the compact version in the contents rail.
 */
export function ShareBar({
  url,
  variant = "footer",
}: {
  url: string;
  /** `rail` is the narrow sidebar copy: full width, louder confirmation. */
  variant?: "footer" | "rail";
}) {
  const { copied, copy } = useCopy();

  if (variant === "rail") {
    return (
      <div className="border-border mt-8 border-t pt-5">
        <p className={`${LABEL} text-faint mb-3`}>Share</p>

        {/* Full-width and accent-filled once copied, so the confirmation is
            unmissable at the width of the rail. */}
        <button
          type="button"
          onClick={() => copy(url)}
          className={`${LABEL} flex w-full cursor-pointer items-center gap-2 rounded-full border px-3 py-2 transition-colors ${
            copied
              ? "border-blue bg-blue/10 text-blue"
              : "border-border hover:border-blue hover:text-blue text-soft"
          }`}
        >
          {copied ? (
            <LuCheck size={13} aria-hidden="true" />
          ) : (
            <LuLink size={13} aria-hidden="true" />
          )}
          {copied ? "Link copied" : "Copy link"}
        </button>
      </div>
    );
  }

  return (
    <div className="border-border mt-14 flex flex-wrap items-center gap-x-3 gap-y-2 border-t pt-6">
      <span className={`${LABEL} text-soft`}>Share this post</span>

      <button
        type="button"
        onClick={() => copy(url)}
        className={`${LABEL} inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-full border px-3 transition-[color,border-color,transform] active:scale-95 ${
          copied
            ? "border-blue bg-blue/10 text-blue"
            : "border-border hover:border-blue hover:text-blue text-soft"
        }`}
      >
        {copied ? (
          <LuCheck size={13} aria-hidden="true" />
        ) : (
          <LuLink size={13} aria-hidden="true" />
        )}
        {copied ? "Copied" : "Copy link"}
      </button>
    </div>
  );
}
