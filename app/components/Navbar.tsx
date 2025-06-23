"use client";
import { SunDim } from "lucide-react";
import { motion } from "motion/react";

export default function Page() {
  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 4 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="flex  flex-row justify-between sticky top-0  bg-white z-10 items-center">
      <motion.img
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        src="/LogoBG.png"
        alt="Logo"
        className="h-12 w-12"
      />
      <motion.div
        variants={container}
        initial="hidden"
        animate="visible"
        className="flex flex-row justify-center items-center gap-6"
      >
        {["About", "Experience", "Skills", "Projects", "Contact"].map(
          (text, i) => (
            <motion.span
              key={i}
              variants={item}
              whileHover={{
                scale: 1.05,
                color: "#1e40af",
              }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="cursor-pointer text-gray-700 text-[15px] font-medium"
            >
              {text}
            </motion.span>
          )
        )}

        <motion.span
          variants={item}
          whileHover={{ rotate: 20, scale: 1.15 }}
          transition={{ type: "spring", stiffness: 250 }}
          className="cursor-pointer text-gray-700"
        >
          <SunDim />
        </motion.span>
      </motion.div>
    </div>
  );
}
