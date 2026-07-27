"use client";

import { useState } from "react";
import { LuRotateCcw } from "react-icons/lu";

/**
 * A framed, resettable stage for live examples inside a post. Whatever you put
 * in it is real, running React — the thing that makes a post worth bookmarking.
 *
 * Usage in MDX: <Demo title="Debounced input"><MyExample /></Demo>
 */
export function Demo({
  title = "live demo",
  children,
}: {
  title?: string;
  children: React.ReactNode;
}) {
  // Remounting the subtree is the whole reset mechanism.
  const [runId, setRunId] = useState(0);

  return (
    <div className="not-prose border-border my-8 border">
      <div className="border-border flex items-center justify-between border-b bg-gray-50 px-4 py-2 dark:bg-black">
        <span className="font-code text-[11px] text-gray-500 lowercase">
          {title}
        </span>
        <button
          type="button"
          onClick={() => setRunId((n) => n + 1)}
          className="hover:text-blue font-code inline-flex items-center gap-1.5 text-[11px] text-gray-500 transition-colors"
        >
          <LuRotateCcw size={12} aria-hidden="true" />
          reset
        </button>
      </div>
      <div key={runId} className="p-6">
        {children}
      </div>
    </div>
  );
}
