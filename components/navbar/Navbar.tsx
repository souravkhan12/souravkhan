"use client";

import { useEffect, useState } from "react";
import { SunDim, MoonIcon, Search } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useTheme } from "next-themes";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { AccentPicker } from "@/components/theme/AccentPicker";
import { BrandMark } from "@/components/ui/BrandMark";
import { HoverList, HoverItem } from "@/components/motion/hover-list";
import { navLinks } from "@/config/nav-links";
import { useMounted } from "@/hooks/use-mounted";
import { useInitialAnimation } from "@/hooks/use-initial-animation";
import { EASE_OUT, SPRING } from "@/config/theme";
import { cn } from "@/lib/utils";

/**
 * A floating pill bar, on the same column as the page under it.
 *
 * The brand is the S mark, everywhere. The photo belongs to the hero; on the
 * homepage a small copy of it slides in beside the mark only once the hero
 * has scrolled away, so the face is never on screen twice at once.
 */
export default function Navbar({ wide = false }: { wide?: boolean }) {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useMounted();
  const isDarkMode = mounted && resolvedTheme === "dark";

  const pathname = usePathname();
  const router = useRouter();
  const onHome = pathname === "/";
  const heroGone = useHeroGone(onHome);
  // The bar is part of every page, so it remounts on each navigation; it
  // should only drop in once, on arrival.
  const shouldAnimate = useInitialAnimation();

  const handleSectionNavigation = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string,
  ) => {
    e.preventDefault();
    const id = href.replace("#", "");
    if (onHome) {
      document
        .getElementById(id)
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    router.push(`/#${id}`);
  };

  const toggleTheme = () => setTheme(isDarkMode ? "light" : "dark");
  const openPalette = () =>
    window.dispatchEvent(new Event("open-command-palette"));

  /* Section anchors stay unstyled — they're positions on the home page, not
     destinations. */
  const isCurrent = (href: string) =>
    !href.startsWith("#") && href !== "/" && pathname.startsWith(href);

  return (
    <motion.nav
      initial={shouldAnimate ? { y: -12, opacity: 0 } : false}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: EASE_OUT }}
      className="sticky top-0 z-30 pt-3"
    >
      <div
        className={cn(
          "mx-auto px-3 sm:px-5",
          wide ? "max-w-[1100px]" : "max-w-[880px]",
        )}
      >
        <div className="bg-background/75 shadow-soft flex items-center justify-between gap-3 rounded-full py-1.5 pr-2 pl-2 backdrop-blur-xl backdrop-saturate-150">
          <Link
            href="/"
            onClick={() =>
              onHome && window.scrollTo({ top: 0, behavior: "smooth" })
            }
            aria-label="Sourav Khan — home"
            className="group/logo flex shrink-0 items-center gap-2 rounded-full pr-2"
          >
            <motion.span
              whileHover={{ rotate: -8 }}
              whileTap={{ scale: 0.92 }}
              transition={SPRING.bouncy}
              className="inline-flex"
            >
              <BrandMark size={30} />
            </motion.span>

            <AnimatePresence initial={false}>
              {onHome && heroGone && (
                <motion.span
                  key="avatar"
                  initial={{ width: 0, opacity: 0, scale: 0.6 }}
                  animate={{ width: 26, opacity: 1, scale: 1 }}
                  exit={{ width: 0, opacity: 0, scale: 0.6 }}
                  transition={SPRING.smooth}
                  className="relative -ml-1 block size-[26px] shrink-0 overflow-hidden rounded-full"
                >
                  <Image
                    src="/sourav.webp"
                    alt=""
                    fill
                    sizes="78px"
                    quality={90}
                    className="object-cover object-[50%_30%]"
                  />
                </motion.span>
              )}
            </AnimatePresence>

            <span className="text-xs font-semibold tracking-tight whitespace-nowrap">
              Sourav Khan
            </span>
          </Link>

          {/* Desktop: links share one highlight that slides between them */}
          <div className="hidden min-w-0 items-center gap-1 md:flex">
            <HoverList as="div" className="flex items-center">
              {navLinks.map(({ name, href }) => (
                <HoverItem
                  key={href}
                  itemKey={href}
                  as="div"
                  highlightClassName="inset-x-0 rounded-full"
                >
                  {href.startsWith("#") ? (
                    <a
                      href={href}
                      onClick={(e) => handleSectionNavigation(e, href)}
                      className="text-soft hover:text-foreground block px-3 py-1.5 text-xs whitespace-nowrap transition-colors"
                    >
                      {name}
                    </a>
                  ) : (
                    <Link
                      href={href}
                      aria-current={isCurrent(href) ? "page" : undefined}
                      className={cn(
                        "block px-3 py-1.5 text-xs whitespace-nowrap transition-colors",
                        isCurrent(href)
                          ? "text-foreground font-medium"
                          : "text-soft hover:text-foreground",
                      )}
                    >
                      {name}
                      {isCurrent(href) && (
                        <motion.span
                          layoutId="nav-current"
                          transition={SPRING.snappy}
                          className="bg-blue absolute bottom-0.5 left-1/2 size-1 -translate-x-1/2 rounded-full"
                        />
                      )}
                    </Link>
                  )}
                </HoverItem>
              ))}
            </HoverList>

            <motion.button
              type="button"
              aria-label="Search"
              onClick={openPalette}
              whileTap={{ scale: 0.96 }}
              transition={SPRING.snappy}
              className="bg-surface hover:bg-surface-hover group text-soft ml-1 flex w-40 shrink cursor-pointer items-center gap-2 rounded-full px-3.5 py-1.5 text-left transition-colors lg:w-44"
            >
              <Search
                size={14}
                className="group-hover:text-foreground shrink-0 transition-colors"
              />
              <span className="text-2xs flex-1">Search…</span>
              <kbd className="border-border bg-background font-code text-2xs shrink-0 rounded-full border px-1.5 py-0.5 leading-none">
                ⌘k
              </kbd>
            </motion.button>

            <AccentPicker />

            <ThemeButton dark={isDarkMode} onClick={toggleTheme} />
          </div>

          {/* Mobile: quick utilities only — page links live in the bottom dock */}
          <div className="flex items-center gap-1 md:hidden">
            <button
              type="button"
              aria-label="Search"
              onClick={openPalette}
              className="text-soft hover:text-foreground hover:bg-surface flex size-10 items-center justify-center rounded-full transition-colors"
            >
              <Search size={18} />
            </button>

            <AccentPicker />

            <ThemeButton dark={isDarkMode} onClick={toggleTheme} />
          </div>
        </div>
      </div>
    </motion.nav>
  );
}

function ThemeButton({
  dark,
  onClick,
}: {
  dark: boolean;
  onClick: () => void;
}) {
  // Both icons are always mounted and stacked; the switch is a 160ms
  // crossfade with a quarter turn. The old version waited for one icon to
  // leave before the next came in, which left the button empty mid-switch.
  const icon =
    "absolute inset-0 m-auto transition-[opacity,transform] duration-150 ease-out";
  return (
    <motion.button
      type="button"
      aria-label="Toggle theme"
      onClick={onClick}
      whileTap={{ scale: 0.9 }}
      className="text-soft hover:text-foreground hover:bg-surface relative flex size-10 cursor-pointer items-center justify-center rounded-full transition-colors"
    >
      <SunDim
        size={18}
        aria-hidden="true"
        className={cn(
          icon,
          dark ? "rotate-0 opacity-100" : "scale-50 -rotate-90 opacity-0",
        )}
      />
      <MoonIcon
        size={18}
        aria-hidden="true"
        className={cn(
          icon,
          dark ? "scale-50 rotate-90 opacity-0" : "rotate-0 opacity-100",
        )}
      />
    </motion.button>
  );
}

/** True once the homepage hero (#about) has scrolled out of view. */
function useHeroGone(enabled: boolean) {
  const [gone, setGone] = useState(false);

  useEffect(() => {
    if (!enabled) return;
    const hero = document.getElementById("about");
    if (!hero) return;
    const io = new IntersectionObserver(
      ([entry]) => setGone(!entry.isIntersecting),
      { rootMargin: "-64px 0px 0px 0px" },
    );
    io.observe(hero);
    return () => io.disconnect();
  }, [enabled]);

  return enabled && gone;
}
