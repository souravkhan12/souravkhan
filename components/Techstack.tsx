"use client";

import { motion } from "motion/react";
import TextIcon from "./TextIcon";
import { useState } from "react";

interface TechStackProps {
  technologies: string[];
}

export default function TechStack({ technologies }: TechStackProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <motion.ul className="mt-3 flex list-none gap-2">
      {technologies.map((tech, index) => (
        <motion.li
          key={index}
          className="relative mx-[-7] flex cursor-pointer items-center"
          whileHover={{ zIndex: 10 }}
          onHoverStart={() => setHoveredIndex(index)}
          onHoverEnd={() => setHoveredIndex(null)}
        >
          <motion.div
            transition={{ type: "spring", stiffness: 200, damping: 10 }}
            className="flex items-center gap-2 rounded-full border border-gray-200 bg-white p-2 shadow-sm dark:border-neutral-700 dark:bg-neutral-800 dark:shadow-md"
          >
            <TextIcon label={tech} />
            {hoveredIndex === index && (
              <motion.span
                layout
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.5 }}
                className="text-xs whitespace-nowrap text-gray-700 dark:text-gray-200"
              >
                {tech}
              </motion.span>
            )}
          </motion.div>
        </motion.li>
      ))}
    </motion.ul>
  );
}
