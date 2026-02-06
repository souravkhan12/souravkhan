"use client";

import { motion } from "motion/react";
import { HERO_TECH_STACK } from "@/config/data";
import TextIcon from "@/components/tech-stack/TextIcon";

export default function HeroTechStack() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="mb-0 flex flex-wrap gap-2 pt-4 sm:mb-2 sm:gap-3 sm:pt-6"
    >
      {HERO_TECH_STACK.map((tech, index) => (
        <motion.div
          key={tech.name}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
          className="group relative"
        >
          {/* Icon */}
          <div className="h-5 w-5 opacity-80 transition group-hover:opacity-100 sm:h-[22px] sm:w-[22px]">
            <TextIcon label={tech.icon} size={20} />
          </div>

          {/* Tooltip */}
          <div className="pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 rounded-md bg-slate-900 px-2 py-1 text-xs whitespace-nowrap text-white opacity-0 shadow-sm transition-all duration-200 group-hover:-top-10 group-hover:opacity-100 dark:bg-white dark:text-slate-900">
            {tech.name}
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}
