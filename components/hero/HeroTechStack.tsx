"use client";

import { motion } from "motion/react";
import { HERO_TECH_STACK } from "@/config/data";
import TextIcon from "@/components/tech-stack/TextIcon";

export default function HeroTechStack() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2, ease: "easeOut" }}
    >
      <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
        {HERO_TECH_STACK.map((tech) => (
          <div
            key={tech.name}
            className="group text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 transition-colors duration-200"
          >
            <TextIcon
              label={tech.icon}
              size={22}
              className="opacity-70 group-hover:opacity-100"
            />
          </div>
        ))}
      </div>
    </motion.div>
  );
}
