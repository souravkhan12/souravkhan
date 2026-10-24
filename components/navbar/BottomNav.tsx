"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "motion/react";
import { Home, Briefcase, PenLine, Compass, Mail } from "lucide-react";
import { useMounted } from "@/hooks/use-mounted";

/**
 * Thumb-reachable primary navigation for phones. The top bar keeps the brand
 * and quick utilities (search / accent / theme); the real page navigation
 * lives down here where it's easy to hit. Hidden from `md` up, where the top
 * bar already carries the links.
 */
type Item = {
  name: string;
  href: string; // "#id" section anchor, or a route
  icon: typeof Home;
  match: string; // id (for anchors) or pathname (for routes) used for the active state
};

const ITEMS: Item[] = [
  { name: "home", href: "/", icon: Home, match: "home" },
  { name: "work", href: "#experience", icon: Briefcase, match: "experience" },
  // Points at the site index rather than at /arcade directly: arcade is one of
  // eight destinations there (projects included), and a phone tab is too
  // scarce to spend on one.
  { name: "explore", href: "#explore", icon: Compass, match: "explore" },
  { name: "blog", href: "/blog", icon: PenLine, match: "blog" },
  { name: "contact", href: "#contact", icon: Mail, match: "contact" },
];

// In page order — the scroll-spy keeps the last one past the midline.
const SECTION_IDS = ["experience", "explore", "contact"];

export default function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();
  const mounted = useMounted();
  const [active, setActive] = useState<string>("home");

  const onHome = pathname === "/";

  // Scroll-spy on the home page: light up the tab for whichever section is in
  // view. Off the home page, the active tab is decided by the route below.
  useEffect(() => {
    if (!onHome) return;

    const onScroll = () => {
      // near the very top → "home"
      if (window.scrollY < 200) {
        setActive("home");
        return;
      }
      const mid = window.innerHeight / 2;
      let current = "home";
      for (const id of SECTION_IDS) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= mid) current = id;
      }
      setActive(current);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [onHome]);

  if (!mounted) return null;

  const isActive = (item: Item) =>
    item.href === "/blog"
      ? pathname.startsWith("/blog")
      : onHome && active === item.match;

  const goToSection = (id: string) => {
    if (pathname === "/") {
      if (id === "home") {
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }
      document
        .getElementById(id)
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    router.push(id === "home" ? "/" : `/#${id}`);
  };

  return (
    <motion.nav
      initial={{ y: 32, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      aria-label="primary"
      className="pointer-events-none fixed inset-x-0 bottom-0 z-40 px-4 md:hidden"
      style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 0.75rem)" }}
    >
      {/* A floating dock rather than a full-width bar: it reads as part of
          the page instead of the browser chrome, and the active tab's pill
          springs between items. */}
      <ul className="bg-background/80 shadow-soft pointer-events-auto mx-auto flex max-w-sm items-stretch rounded-full p-1.5 backdrop-blur-xl backdrop-saturate-150">
        {ITEMS.map((item) => {
          const activeNow = isActive(item);
          const Icon = item.icon;
          const inner = (
            <span className="relative flex h-12 w-full flex-col items-center justify-center gap-0.5 rounded-full">
              {activeNow && (
                <motion.span
                  layoutId="bottomnav-active"
                  className="bg-surface-hover absolute inset-0 rounded-full"
                  transition={{ type: "spring", stiffness: 500, damping: 38 }}
                />
              )}
              <Icon
                size={19}
                strokeWidth={activeNow ? 2.3 : 1.8}
                className={`relative ${activeNow ? "text-foreground" : "text-soft"}`}
              />
              <span
                className={`font-code relative text-[11px] leading-none lowercase ${
                  activeNow ? "text-foreground" : "text-faint"
                }`}
              >
                {item.name}
              </span>
            </span>
          );

          return (
            <li key={item.name} className="flex-1">
              {item.href.startsWith("#") || item.href === "/" ? (
                <motion.button
                  type="button"
                  whileTap={{ scale: 0.9 }}
                  onClick={() => goToSection(item.match)}
                  aria-current={activeNow ? "page" : undefined}
                  className="flex w-full cursor-pointer items-center justify-center"
                >
                  {inner}
                </motion.button>
              ) : (
                <Link
                  href={item.href}
                  aria-current={activeNow ? "page" : undefined}
                  className="flex w-full items-center justify-center transition-transform active:scale-90"
                >
                  {inner}
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </motion.nav>
  );
}
