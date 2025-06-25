"use client";

import { useState } from "react";
import { SunDim, Menu, X, MoonIcon } from "lucide-react";
import {
  motion,
  useMotionValueEvent,
  useScroll,
  useSpring,
} from "motion/react";
import { useDarkMode } from "@/app/context/useDarkMode";

export default function Page() {
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const { isDarkMode, toggleDarkMode } = useDarkMode();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 20);
  });

  const translateY = useSpring(scrolled ? 10 : 0, {
    stiffness: 300,
    damping: 24,
  });

  const navLinks = [
    { name: "Experience", href: "#experience" },
    { name: "Projects", href: "#projects" },
    { name: "Contact", href: "#contact" },
  ];

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
    <>
      {/* Navbar */}
      <motion.nav
        layout
        style={{
          boxShadow: scrolled ? "var(--shadow-navbar)" : "none",
          width: scrolled ? "70%" : "80%",
          y: translateY,
        }}
        className="fixed inset-x-0 top-3 z-20 mx-auto flex items-center justify-between rounded-full bg-white/80 px-4 py-1 backdrop-blur-md dark:bg-neutral-900/80"
      >
        {/* Logo */}
        <motion.img
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, marginLeft: "-6px" }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          src="/LogoBG.png"
          alt="Logo"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="h-10 w-10 cursor-pointer rounded-full sm:h-12 sm:w-12"
        />

        {/* Desktop nav links */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="visible"
          className="hidden flex-row items-center justify-center gap-6 md:flex"
        >
          {navLinks.map(({ name, href }, i) => (
            <motion.a
              key={i}
              href={href}
              variants={item}
              whileHover={{
                scale: 1.05,
                color: "#1e40af",
              }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="cursor-pointer text-[15px] font-medium text-gray-700 dark:text-gray-200"
            >
              {name}
            </motion.a>
          ))}

          <motion.span
            onClick={toggleDarkMode}
            variants={item}
            whileHover={{ rotate: 20, scale: 1.15 }}
            transition={{ type: "spring", stiffness: 250 }}
            className="cursor-pointer text-gray-700 dark:text-gray-200"
          >
            {isDarkMode ? <SunDim /> : <MoonIcon />}
          </motion.span>
        </motion.div>

        {/* Hamburger Icon for Mobile */}
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
        </motion.div>
      )}
    </>
  );
}
