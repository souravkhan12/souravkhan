"use client";

import { useState, useEffect } from "react";
import { Menu, X, Moon, Sun } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { navLinks } from "@/utils/nav-links";

export default function Header() {
  const [affix, setAffix] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";

  // Detect scroll to add shadow
  useEffect(() => {
    const handleScroll = () => setAffix(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      data-affix={affix}
      className={`bg-background/80 fixed top-0 z-50 max-w-screen overflow-x-hidden px-4 pt-2 backdrop-blur-md transition-shadow duration-300 ${affix ? "shadow-[0_4px_16px_rgba(0,0,0,0.15)]" : ""}`}
    >
      <div
        data-header-container="true"
        className="border-border mx-auto flex h-14 items-center justify-between gap-2 border-x px-4 sm:gap-4 md:max-w-4xl"
      >
        {/* Logo */}
        <Link
          aria-label="Home"
          href="/"
          className="flex items-center gap-2 select-none [&_svg]:h-8"
        >
          <img
            src="/LogoBG.png"
            alt="Logo"
            className="h-10 w-10 rounded-full dark:bg-white"
          />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-6 md:flex">
          {navLinks.map(({ name, href }) => (
            <Link
              key={href}
              href={href}
              className="hover:text-primary text-sm font-medium text-gray-700 transition dark:text-gray-300"
            >
              {name}
            </Link>
          ))}
        </nav>

        {/* Right Controls */}
        <div className="flex items-center gap-3">
          {/* Theme Toggle */}
          <motion.button
            whileHover={{ rotate: 20 }}
            onClick={() => setTheme(isDark ? "light" : "dark")}
            className="rounded-full p-2 text-gray-700 transition hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </motion.button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="rounded-full p-2 text-gray-700 md:hidden dark:text-gray-200"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {menuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="mx-3 mt-2 rounded-xl border border-gray-200 bg-white/90 p-4 shadow-lg backdrop-blur-md md:hidden dark:border-gray-700 dark:bg-neutral-900/90"
        >
          {navLinks.map(({ name, href }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setMenuOpen(false)}
              className="block rounded-md px-3 py-2 text-sm font-medium text-gray-800 hover:bg-gray-100 dark:text-gray-100 dark:hover:bg-gray-800"
            >
              {name}
            </Link>
          ))}

          <div className="mt-3 flex justify-end">
            <button
              onClick={() => setTheme(isDark ? "light" : "dark")}
              className="rounded-full p-2 text-gray-700 transition hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>
        </motion.div>
      )}
    </header>
  );
}
