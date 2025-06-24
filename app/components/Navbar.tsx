"use client";

import { SunDim } from "lucide-react";
import {
  motion,
  useMotionValueEvent,
  useScroll,
  useSpring,
} from "motion/react";
import { useState } from "react";

export default function Page() {
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 20);
  });

  const translateY = useSpring(scrolled ? 10 : 0, {
    stiffness: 300,
    damping: 24,
  });

  const navLinks = [
    { name: "About", href: "#about" },
    { name: "Experience", href: "#experience" },
    { name: "Skills", href: "#skills" },
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
      <motion.nav
        layout
        style={{
          boxShadow: scrolled ? "var(--shadow-navbar)" : "none",
          width: scrolled ? "80%" : "80%",
          y: translateY,
        }}
        className="fixed inset-x-0 top-3 z-20 mx-auto flex items-center justify-between rounded-full bg-white/80 px-3 py-1 backdrop-blur-md dark:bg-neutral-900/80"
      >
        <motion.img
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, marginLeft: "-6px" }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          src="/LogoBG.png"
          alt="Logo"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="h-12 w-12 cursor-pointer rounded-full"
        />

        <motion.div
          variants={container}
          initial="hidden"
          animate="visible"
          className="flex flex-row items-center justify-center gap-6"
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
              className="cursor-pointer text-[15px] font-medium text-gray-700"
            >
              {name}
            </motion.a>
          ))}

          <motion.span
            variants={item}
            whileHover={{ rotate: 20, scale: 1.15 }}
            transition={{ type: "spring", stiffness: 250 }}
            className="cursor-pointer text-gray-700"
          >
            <SunDim />
          </motion.span>
        </motion.div>
      </motion.nav>
    </>
  );
}
