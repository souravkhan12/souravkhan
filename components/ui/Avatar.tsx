import { HERO } from "@/constants/data";
import { motion } from "motion/react";
import Image from "next/image";

export default function Avatar() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex h-[200px] w-[200px] rounded-xl border border-gray-300/30 bg-white/30 shadow-inner backdrop-blur-lg dark:border-white/10 dark:bg-[#1E1E1E]"
    >
      <Image
        src="/sourav.png"
        alt={HERO.name}
        fill
        priority
        className="rounded-xl object-cover"
      />
    </motion.div>
  );
}
