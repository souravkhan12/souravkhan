"use client";

import { useCallback, useEffect, useState } from "react";

type GraphSize = {
  blockSize: number;
  blockMargin: number;
  fontSize: number;
  ready: boolean;
};

export function useResponsiveGraphSize(): GraphSize {
  const [size, setSize] = useState<GraphSize>({
    blockSize: 12,
    blockMargin: 2,
    fontSize: 10,
    ready: false,
  });

  const update = useCallback(() => {
    const w = window.innerWidth;

    if (w >= 1280) {
      setSize({ blockSize: 16, blockMargin: 3, fontSize: 13, ready: true });
    } else if (w >= 1024) {
      setSize({ blockSize: 14, blockMargin: 3, fontSize: 12, ready: true });
    } else {
      setSize({ blockSize: 12, blockMargin: 2, fontSize: 10, ready: true });
    }
  }, []);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(update, 150); // Debounce resize events
    };

    update();
    window.addEventListener("resize", handleResize, { passive: true });

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("resize", handleResize);
    };
  }, [update]);

  return size;
}
