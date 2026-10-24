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
    <div className="not-prose border-border my-8 overflow-hidden rounded-2xl border">
      <div className="border-border bg-surface flex items-center justify-between border-b px-4 py-2">
        <span className="font-code text-2xs text-soft lowercase">{title}</span>
        <button
          type="button"
          onClick={() => setRunId((n) => n + 1)}
          className="hover:text-blue font-code text-2xs text-soft inline-flex items-center gap-1.5 transition-colors"
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
