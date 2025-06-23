"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";

const techs = [
  "Next.js",
  "React.js",
  "Vite",
  "TailwindCSS",
  "TypeScript",
  "Framer Motion",
];

export default function TechSwitcher() {
  const [index, setIndex] = useState(0);

  // Auto switch every 2.5s
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % techs.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="inline-flex items-center gap-2 text-lg font-semibold text-gray-800">
      <div className="relative w-36 h-8 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.span
            key={techs[index]}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}
            className="absolute left-0 top-0 w-full text-blue-600 text-center"
          >
            {techs[index]}
          </motion.span>
        </AnimatePresence>
      </div>
    </div>
  );
}
