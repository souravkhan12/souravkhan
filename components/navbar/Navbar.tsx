"use client";

import { SunDim, MoonIcon, Search } from "lucide-react";
import { motion } from "motion/react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { Logo } from "@/components/ui";
import { AccentPicker } from "@/components/theme/AccentPicker";
import { navLinks } from "@/config/nav-links";
import { useMounted } from "@/hooks/use-mounted";
import { INTERACTIONS, NAVBAR_ANIMATION } from "@/config/theme";
import { usePathname, redirect } from "next/navigation";

export default function Navbar() {
  const { theme, setTheme } = useTheme();
  const isDarkMode = theme === "dark";

  const pathname = usePathname();

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

  const toggleTheme = () => setTheme(isDarkMode ? "light" : "dark");

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
          className="group/logo flex items-center gap-2.5"
        >
          <Logo
            size={26}
            className="group-hover/logo:text-blue shrink-0 cursor-pointer transition-colors"
          />
          <span className="ss01 text-[15px] font-semibold">sourav khan</span>
        </Link>

        {/* Desktop: full navigation + utilities */}
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

          <motion.button
            type="button"
            aria-label="Search"
            onClick={() =>
              window.dispatchEvent(new Event("open-command-palette"))
            }
            whileHover={{ scale: 1.015 }}
            whileTap={{ scale: 0.985 }}
            className="border-border hover:border-blue group flex w-52 cursor-pointer items-center gap-2 border px-3 py-1.5 text-left text-gray-500 transition-colors"
          >
            <Search
              size={14}
              className="group-hover:text-blue shrink-0 transition-colors"
            />
            <span className="flex-1 text-xs">search...</span>
            <kbd className="border-border font-code shrink-0 border px-1.5 py-0.5 text-[10px] leading-none">
              ⌘k
            </kbd>
          </motion.button>

          <AccentPicker />

          <motion.button
            type="button"
            aria-label="Toggle theme"
            onClick={toggleTheme}
            {...INTERACTIONS.themeToggle}
            className="hover:text-blue cursor-pointer text-gray-600 dark:text-gray-400"
          >
            {isDarkMode ? <SunDim size={18} /> : <MoonIcon size={18} />}
          </motion.button>
        </div>

        {/* Mobile: quick utilities only — the page links live in the bottom bar */}
        <div className="flex items-center gap-4 md:hidden">
          <button
            type="button"
            aria-label="Search"
            onClick={() =>
              window.dispatchEvent(new Event("open-command-palette"))
            }
            className="hover:text-blue text-gray-600 dark:text-gray-400"
          >
            <Search size={19} />
          </button>

          <AccentPicker />

          <button
            type="button"
            aria-label="Toggle theme"
            onClick={toggleTheme}
            className="hover:text-blue text-gray-600 dark:text-gray-400"
          >
            {isDarkMode ? <SunDim size={20} /> : <MoonIcon size={19} />}
          </button>
        </div>
      </div>
    </motion.nav>
  );
}
