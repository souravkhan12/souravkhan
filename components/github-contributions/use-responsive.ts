"use client";

import { useEffect, useState } from "react";

type GraphSize = {
  blockSize: number;
  blockMargin: number;
  fontSize: number;
};

export function useResponsiveGraphSize(): GraphSize {
  const [size, setSize] = useState<GraphSize>({
    blockSize: 10,
    blockMargin: 3,
    fontSize: 12,
  });

  useEffect(() => {
    const update = () => {
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
      } else {
        // mobile / tablet
        setSize({ blockSize: 10, blockMargin: 3, fontSize: 12 });
      }
    };

    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return size;
}
