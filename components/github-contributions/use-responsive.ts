"use client";

import { useCallback, useEffect, useState } from "react";

type GraphSize = {
  blockSize: number;
  blockMargin: number;
  fontSize: number;
};

export function useResponsiveGraphSize(): GraphSize {
  const [size, setSize] = useState<GraphSize>({
    blockSize: 6,
    blockMargin: 1,
    fontSize: 8,
  });

  const update = useCallback(() => {
    const w = window.innerWidth;

    if (w >= 1536) {
      // 2xl screens
      setSize({ blockSize: 15, blockMargin: 5, fontSize: 16 });
    } else if (w >= 1280) {
      // xl
      setSize({ blockSize: 14, blockMargin: 4, fontSize: 14 });
    } else if (w >= 1024) {
      // lg
      setSize({ blockSize: 12, blockMargin: 4, fontSize: 13 });
    } else if (w >= 768) {
      // md tablets
      setSize({ blockSize: 8, blockMargin: 2, fontSize: 10 });
    } else {
      // mobile
      setSize({ blockSize: 6, blockMargin: 1, fontSize: 8 });
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
