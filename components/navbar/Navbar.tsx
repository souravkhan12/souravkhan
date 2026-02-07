"use client";

import { useRef, useState } from "react";
import { SunDim, Menu, X, MoonIcon } from "lucide-react";
import { motion, useMotionValueEvent, useScroll } from "motion/react";
import { useTheme } from "next-themes";
import { navLinks } from "@/config/nav-links";
import { useMounted } from "@/hooks/use-mounted";
import { MOTION_VARIANTS } from "@/config/theme";
import { useOutsideClick } from "@/hooks/use-outside-clickc";

export default function Navbar() {
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);

  const [isOpen, setIsOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const isDarkMode = theme === "dark";

  const navRef = useRef<HTMLDivElement>(null);
  useOutsideClick({ ref: navRef, callback: () => setIsOpen(false) });

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
        className="bg-background/80 fixed inset-x-0 top-3 z-20 mx-auto flex w-[80%] max-w-6xl items-center justify-between rounded-full px-4 py-1 backdrop-blur-md"
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
              className="text-foreground hover:text-primary dark:text-muted-foreground cursor-pointer text-[15px] font-medium transition-colors"
            >
              {name}
            </motion.a>
          ))}

          <motion.span
            onClick={setTheme.bind(null, isDarkMode ? "light" : "dark")}
            variants={MOTION_VARIANTS.staggerItem}
            whileHover={{ rotate: 20, scale: 1.15 }}
            transition={{ type: "spring", stiffness: 250 }}
            className="text-foreground dark:text-muted-foreground cursor-pointer"
          >
            {isDarkMode ? (
              <SunDim className="text-primary" />
            ) : (
              <MoonIcon className="text-foreground" />
            )}
          </motion.span>
        </motion.div>

        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          whileTap={{ scale: 0.9 }}
          className="text-foreground cursor-pointer md:hidden"
        >
          {isOpen ? <X size={26} /> : <Menu size={26} />}
        </motion.button>
      </motion.nav>

      {/* Mobile Menu */}
      {isOpen && (
        <motion.div
          ref={navRef}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-card border-border fixed top-20 right-4 left-4 z-30 flex flex-col gap-4 rounded-xl border p-4 shadow-lg md:hidden"
        >
          {navLinks.map(({ name, href }, i) => (
            <a
              key={i}
              href={href}
              onClick={() => setIsOpen(false)}
              className="text-foreground dark:text-muted-foreground text-base font-medium"
            >
              {name}
            </a>
          ))}
          <motion.span
            onClick={setTheme.bind(null, isDarkMode ? "light" : "dark")}
            whileHover={{ rotate: 20, scale: 1.15 }}
            transition={{ type: "spring", stiffness: 250 }}
            className="text-foreground dark:text-muted-foreground cursor-pointer"
          >
            {isDarkMode ? (
              <SunDim className="text-primary" />
            ) : (
              <MoonIcon className="text-foreground" />
            )}
          </motion.span>
        </motion.div>
      )}
    </>
  );
}
