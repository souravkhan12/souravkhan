"use client";

import TextIcon from "@/components/tech-stack/TextIcon";
import { motion } from "motion/react";
import { useState } from "react";

interface TechStackProps {
  technologies: string[];
  colorful?: boolean;
}

export default function TechStack({
  technologies,
  colorful = false,
}: TechStackProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <motion.ul className="mt-3 flex list-none flex-wrap gap-2">
      {technologies.map((tech, index) => (
        <motion.li
          key={index}
          className="relative"
          whileHover={{ zIndex: 10 }}
          onHoverStart={() => setHoveredIndex(index)}
          onHoverEnd={() => setHoveredIndex(null)}
        >
          <motion.div
            transition={{ type: "spring", stiffness: 200, damping: 10 }}
            className="bg-card inline-flex items-center gap-2 rounded-full border px-3 py-1.5 shadow-sm"
          >
            <TextIcon label={tech} colorful={colorful} />
            <motion.span
              layout
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "auto" }}
              exit={{ opacity: 0, width: 0 }}
              transition={{ duration: 0.3 }}
              className="text-foreground text-xs font-medium"
            >
              {tech}
            </motion.span>
          </motion.div>
        </motion.li>
      ))}
    </motion.ul>
  );
}
