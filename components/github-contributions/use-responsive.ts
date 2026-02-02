"use client";

import { useCallback, useEffect, useState } from "react";

type GraphSize = {
  blockSize: number;
  blockMargin: number;
  fontSize: number;
};

export function useResponsiveGraphSize(): GraphSize {
  const [size, setSize] = useState<GraphSize>({
    blockSize: 12,
    blockMargin: 2,
    fontSize: 10,
  });

  const update = useCallback(() => {
    const w = window.innerWidth;

    if (w >= 1280) {
      // xl
      setSize({ blockSize: 16, blockMargin: 3, fontSize: 13 });
    } else if (w >= 1024) {
      // lg
      setSize({ blockSize: 14, blockMargin: 3, fontSize: 12 });
    } else {
      // md tablets
      setSize({ blockSize: 12, blockMargin: 2, fontSize: 10 });
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
