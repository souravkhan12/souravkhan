"use client";

import { useEffect, useState } from "react";

/**
 * Wall-clock time in the given zone. Renders a placeholder until mounted:
 * the server's clock and the visitor's first paint are never the same
 * minute, so rendering the time on the server is a guaranteed hydration
 * mismatch.
 */
export function LocalTime({ timeZone }: { timeZone: string }) {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const format = new Intl.DateTimeFormat("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone,
    });
    const tick = () => setTime(format.format(new Date()));

    tick();
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, [timeZone]);

  return (
    <time suppressHydrationWarning className="tabular-nums">
      {time ?? "--:--"}
    </time>
  );
}
