"use client";

import { motion } from "motion/react";
import TextIcon from "./TextIcon";
import { useState } from "react";

interface ListProps {
  arr: string[];
}

export default function TechStack({ arr }: ListProps) {
  const [hover, setHover] = useState<number | null>(null);

  return (
    <motion.ul className="mt-3 flex list-none gap-2">
      {arr.map((e, idx) => (
        <motion.li
          key={idx}
          className="relative mx-[-7] flex cursor-pointer items-center"
          whileHover={{ zIndex: 10 }}
          onHoverStart={() => setHover(idx)}
          onHoverEnd={() => setHover(null)}
        >
          <motion.div
            transition={{ type: "spring", stiffness: 200, damping: 10 }}
            className="flex items-center gap-2 rounded-full border border-gray-200 bg-white p-2 dark:bg-neutral-800"
          >
            <TextIcon label={e} />
            {hover === idx && (
              <motion.span
                layout
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.5 }}
                className="text-xs whitespace-nowrap dark:text-gray-200"
              >
                {e}
              </motion.span>
            )}
          </motion.div>
        </motion.li>
      ))}
    </motion.ul>
  );
}
