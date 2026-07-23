"use client";

import { useRef, useState } from "react";
import { SunDim, Menu, X, MoonIcon } from "lucide-react";
import { motion } from "motion/react";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";
import { navLinks } from "@/config/nav-links";
import { useMounted } from "@/hooks/use-mounted";
import { INTERACTIONS, NAVBAR_ANIMATION } from "@/config/theme";
import { useOutsideClick } from "@/hooks/use-outside-click";
import { RemoveScroll } from "react-remove-scroll";
import { usePathname, redirect } from "next/navigation";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const isDarkMode = theme === "dark";

  const pathname = usePathname();

  const navRef = useRef<HTMLDivElement | null>(null);
  useOutsideClick({
    ref: navRef,
    callback: () => setIsOpen(false),
  });

  const mounted = useMounted();
  if (!mounted) {
    return null;
  }

  const handleSectionNavigation = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string,
  ) => {
    const id = href.replace("#", "");

    if (pathname === "/") {
      e.preventDefault();

      const el = document.getElementById(id);
      if (!el) return;

      el.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
      return;
    }

    e.preventDefault();
    redirect(`/#${id}`);
  };

  return (
    <motion.nav
      initial={NAVBAR_ANIMATION.initial}
      animate={NAVBAR_ANIMATION.animate}
      className="border-border bg-background/90 sticky top-0 z-30 border-b backdrop-blur-sm"
    >
      <div className="border-border mx-auto flex max-w-[1200px] items-center justify-between border-x px-6 py-3 sm:px-8">
        <Link
          href="/"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="flex items-center gap-3"
        >
          <Image
            src="/LogoBG.webp"
            alt="Logo"
            width={32}
            height={32}
            priority={true}
            className="size-8 cursor-pointer dark:bg-white"
          />
          <span className="ss01 text-sm font-semibold">sourav khan</span>
        </Link>

        <div className="hidden flex-row items-center gap-8 md:flex">
          {navLinks.map(({ name, href }, i) =>
            href.startsWith("#") ? (
              <a
                key={i}
                href={href}
                onClick={(e) => handleSectionNavigation(e, href)}
                className="hover:text-blue cursor-pointer text-sm font-normal text-gray-600 lowercase transition-colors dark:text-gray-400"
              >
                {name}
              </a>
            ) : (
              <Link
                key={i}
                href={href}
                className="hover:text-blue cursor-pointer text-sm font-normal text-gray-600 lowercase transition-colors dark:text-gray-400"
              >
                {name}
              </Link>
            ),
          )}

          <button
            type="button"
            aria-label="Open command menu"
            onClick={() =>
              window.dispatchEvent(new Event("open-command-palette"))
            }
            className="border-border hover:border-blue hover:text-blue font-code flex cursor-pointer items-center gap-1 border px-2 py-1 text-xs text-gray-500 transition-colors"
          >
            <span className="text-sm leading-none">⌘</span>k
          </button>

          <motion.button
            type="button"
            aria-label="Toggle theme"
            onClick={setTheme.bind(null, isDarkMode ? "light" : "dark")}
            {...INTERACTIONS.themeToggle}
            className="hover:text-blue cursor-pointer text-gray-600 dark:text-gray-400"
          >
            {isDarkMode ? <SunDim size={18} /> : <MoonIcon size={18} />}
          </motion.button>
        </div>

        <motion.div
          ref={navRef}
          onClick={() => setIsOpen(!isOpen)}
          {...INTERACTIONS.menuToggle}
          className="cursor-pointer md:hidden"
        >
          {isOpen ? <X size={22} /> : <Menu size={22} />}
        </motion.div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <RemoveScroll>
          <div className="border-border bg-background flex flex-col border-t md:hidden">
            {navLinks.map(({ name, href }, i) =>
              href.startsWith("#") ? (
                <a
                  key={i}
                  href={href}
                  onClick={(e) => {
                    handleSectionNavigation(e, href);
                    setIsOpen(false);
                  }}
                  className="border-border border-b px-6 py-4 text-sm lowercase"
                >
                  {name}
                </a>
              ) : (
                <Link
                  key={i}
                  href={href}
                  onClick={() => setIsOpen(false)}
                  className="border-border border-b px-6 py-4 text-sm lowercase"
                >
                  {name}
                </Link>
              ),
            )}
            <button
              type="button"
              aria-label="Toggle theme"
              onClick={setTheme.bind(null, isDarkMode ? "light" : "dark")}
              className="flex items-center gap-2 px-6 py-4 text-left text-sm lowercase"
            >
              {isDarkMode ? <SunDim size={18} /> : <MoonIcon size={18} />}
              {isDarkMode ? "light mode" : "dark mode"}
            </button>
          </div>
        </RemoveScroll>
      )}
    </motion.nav>
  );
}
