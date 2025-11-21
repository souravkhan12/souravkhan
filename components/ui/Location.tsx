import { HERO } from "@/constants/data";
import { MapPin } from "lucide-react";
import { motion } from "motion/react";

export default function Location() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="inline-flex items-center gap-2 rounded-full border border-gray-300 bg-white px-3 py-1 shadow-sm dark:border-gray-600 dark:bg-[#1E1E1E]"
    >
      <MapPin className="h-4 w-2" />
      <motion.span
        initial={{ filter: "blur(10px)" }}
        animate={{ filter: "blur(0px)" }}
        className="text-sm font-medium text-gray-600 dark:text-gray-300"
      >
        {HERO.location}
      </motion.span>
    </motion.div>
  );
}
