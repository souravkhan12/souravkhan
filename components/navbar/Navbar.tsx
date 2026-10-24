"use client";

import { SunDim, MoonIcon, Search } from "lucide-react";
import { motion } from "motion/react";
import { useTheme } from "next-themes";
import Link from "next/link";
import Image from "next/image";
import { AccentPicker } from "@/components/theme/AccentPicker";
import { navLinks } from "@/config/nav-links";
import { useMounted } from "@/hooks/use-mounted";
import { INTERACTIONS, NAVBAR_ANIMATION } from "@/config/theme";
import { usePathname, redirect } from "next/navigation";

export default function Navbar() {
  const { theme, setTheme } = useTheme();
  const isDarkMode = theme === "dark";

  const pathname = usePathname();
  const onHome = pathname === "/";

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

  /* Route links had no current-page state at all, so once you were on /blog
     or /reading the nav gave you no idea where you were. Section anchors
     stay unstyled — they're positions on the home page, not destinations. */
  const isCurrent = (href: string) =>
    !href.startsWith("#") && href !== "/" && pathname.startsWith(href);

  return (
    <motion.nav
      initial={NAVBAR_ANIMATION.initial}
      animate={NAVBAR_ANIMATION.animate}
      className="border-border bg-background/85 sticky top-0 z-30 border-b backdrop-blur-md"
    >
      {/* On the homepage the bar narrows to the 860px reading column and
          drops the frame's side rules, which only exist on the inner pages. */}
      <div
        className={
          onHome
            ? "mx-auto flex max-w-[860px] items-center justify-between px-5 py-3 sm:px-8"
            : "navbar-frame border-border mx-auto flex max-w-[1200px] items-center justify-between border-x px-6 py-3 sm:px-8"
        }
      >
        <Link
          href="/"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="group/logo flex shrink-0 items-center gap-2.5"
        >
          <span className="relative size-7 shrink-0 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-900">
            <Image
              src="/sourav.webp"
              alt=""
              fill
              sizes="28px"
              className="object-cover"
            />
          </span>
          <span className="group-hover/logo:text-blue text-[15px] font-semibold whitespace-nowrap transition-colors">
            Sourav Khan
          </span>
        </Link>

        {/* Desktop: full navigation + utilities */}
        <div className="hidden min-w-0 flex-row items-center gap-6 md:flex lg:gap-8">
          {navLinks.map(({ name, href }, i) =>
            href.startsWith("#") ? (
              <a
                key={i}
                href={href}
                onClick={(e) => handleSectionNavigation(e, href)}
                className="text-soft hover:text-foreground cursor-pointer text-sm font-normal whitespace-nowrap transition-colors"
              >
                {name}
              </a>
            ) : (
              <Link
                key={i}
                href={href}
                aria-current={isCurrent(href) ? "page" : undefined}
                className={`hover:text-foreground relative cursor-pointer text-sm font-normal whitespace-nowrap transition-colors ${
                  isCurrent(href)
                    ? "text-foreground after:bg-blue font-medium after:absolute after:-bottom-1.5 after:left-0 after:h-[2px] after:w-full after:content-['']"
                    : "text-soft"
                }`}
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
            className="border-border hover:border-foreground group text-soft flex w-40 shrink cursor-pointer items-center gap-2 rounded-full border px-3.5 py-1.5 text-left transition-colors lg:w-48"
          >
            <Search
              size={14}
              className="group-hover:text-foreground shrink-0 transition-colors"
            />
            <span className="flex-1 text-xs">Search…</span>
            <kbd className="border-border font-code text-2xs shrink-0 rounded-full border px-1.5 py-0.5 leading-none">
              ⌘k
            </kbd>
          </motion.button>

          <AccentPicker />

          <motion.button
            type="button"
            aria-label="Toggle theme"
            onClick={toggleTheme}
            {...INTERACTIONS.themeToggle}
            className="hover:text-blue text-soft cursor-pointer"
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
            className="hover:text-blue text-soft"
          >
            <Search size={19} />
          </button>

          <AccentPicker />

          <button
            type="button"
            aria-label="Toggle theme"
            onClick={toggleTheme}
            className="hover:text-blue text-soft"
          >
            {isDarkMode ? <SunDim size={20} /> : <MoonIcon size={19} />}
          </button>
        </div>
      </div>
    </motion.nav>
  );
}
