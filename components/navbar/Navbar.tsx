"use client";

import { useState } from "react";
import { SunDim, Menu, X, MoonIcon } from "lucide-react";
import { motion, useMotionValueEvent, useScroll } from "motion/react";
import { useTheme } from "next-themes";
import { navLinks } from "@/config/nav-links";
import { useMounted } from "@/hooks/use-mounted";
import { MOTION_VARIANTS } from "@/config/theme";

export default function Navbar() {
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const isDarkMode = theme === "dark";

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 20);
  });

  const mounted = useMounted();
  if (!mounted) {
    return null;
  }

  return (
    <>
      <motion.nav
        layout={true}
        style={{
          boxShadow: scrolled ? "var(--shadow-navbar)" : "none",
        }}
        className="fixed inset-x-0 top-3 z-20 mx-auto flex w-[80%] max-w-6xl items-center justify-between rounded-full bg-white/80 px-4 py-1 backdrop-blur-md dark:bg-[#1E1E1E]/70"
      >
        <motion.img
          layout="position"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, marginLeft: "-6px" }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          src="/LogoBG.png"
          alt="Logo"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="h-10 w-10 cursor-pointer rounded-full sm:h-12 sm:w-12 dark:bg-white"
        />

        <motion.div
          variants={MOTION_VARIANTS.containerStagger}
          initial="hidden"
          animate="visible"
          className="hidden flex-row items-center justify-center gap-6 md:flex"
        >
          {navLinks.map(({ name, href }, i) => (
            <motion.a
              key={i}
              href={href}
              variants={MOTION_VARIANTS.staggerItem}
              whileHover={{
                scale: 1.05,
              }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="cursor-pointer text-[15px] font-medium text-gray-700 transition-colors hover:text-blue-600 dark:text-gray-200 dark:hover:text-blue-400"
            >
              {name}
            </motion.a>
          ))}

          <motion.span
            onClick={setTheme.bind(null, isDarkMode ? "light" : "dark")}
            variants={MOTION_VARIANTS.staggerItem}
            whileHover={{ rotate: 20, scale: 1.15 }}
            transition={{ type: "spring", stiffness: 250 }}
            className="cursor-pointer text-gray-700 dark:text-gray-200"
          >
            {isDarkMode ? <SunDim /> : <MoonIcon />}
          </motion.span>
        </motion.div>

        <motion.div
          onClick={() => setIsOpen(!isOpen)}
          whileTap={{ scale: 0.9 }}
          className="cursor-pointer text-gray-800 md:hidden dark:text-gray-100"
        >
          {isOpen ? <X size={26} /> : <Menu size={26} />}
        </motion.div>
      </motion.nav>

      {/* Mobile Menu */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed top-20 right-4 left-4 z-30 flex flex-col gap-4 rounded-xl bg-white p-4 shadow-lg md:hidden dark:bg-neutral-900"
        >
          {navLinks.map(({ name, href }, i) => (
            <a
              key={i}
              href={href}
              onClick={() => setIsOpen(false)}
              className="text-base font-medium text-gray-700 dark:text-gray-200"
            >
              {name}
            </a>
          ))}
          <motion.span
            onClick={setTheme.bind(null, isDarkMode ? "light" : "dark")}
            whileHover={{ rotate: 20, scale: 1.15 }}
            transition={{ type: "spring", stiffness: 250 }}
            className="cursor-pointer text-gray-700 dark:text-gray-200"
          >
            {isDarkMode ? <SunDim /> : <MoonIcon />}
          </motion.span>
        </motion.div>
      )}
    </>
  );
}
