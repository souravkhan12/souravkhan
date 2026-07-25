"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "motion/react";
import { Home, Layers, PenLine, Gamepad2, Mail } from "lucide-react";
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
  { name: "projects", href: "#projects", icon: Layers, match: "projects" },
  { name: "arcade", href: "#arcade", icon: Gamepad2, match: "arcade" },
  { name: "blog", href: "/blog", icon: PenLine, match: "blog" },
  { name: "contact", href: "#contact", icon: Mail, match: "contact" },
];

const SECTION_IDS = ["projects", "arcade", "contact"];

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

  useEffect(() => {
    if (pathname.startsWith("/blog")) setActive("blog");
  }, [pathname]);

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
      initial={{ y: 24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      aria-label="primary"
      className="border-border bg-background/90 fixed inset-x-0 bottom-0 z-40 border-t backdrop-blur-md md:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <ul className="mx-auto flex max-w-[1200px] items-stretch">
        {ITEMS.map((item) => {
          const activeNow = isActive(item);
          const Icon = item.icon;
          const inner = (
            <span className="relative flex flex-col items-center gap-1 py-2.5">
              {activeNow && (
                <motion.span
                  layoutId="bottomnav-active"
                  className="bg-blue absolute -top-px left-1/2 h-[2px] w-6 -translate-x-1/2"
                  transition={{ type: "spring", stiffness: 500, damping: 40 }}
                />
              )}
              <Icon
                size={20}
                strokeWidth={activeNow ? 2.4 : 1.8}
                className={
                  activeNow ? "text-blue" : "text-gray-500 dark:text-gray-400"
                }
              />
              <span
                className={`font-code text-[10px] lowercase ${
                  activeNow ? "text-blue" : "text-gray-500 dark:text-gray-400"
                }`}
              >
                {item.name}
              </span>
            </span>
          );

          return (
            <li key={item.name} className="flex-1">
              {item.href.startsWith("#") || item.href === "/" ? (
                <button
                  type="button"
                  onClick={() => goToSection(item.match)}
                  aria-current={activeNow ? "page" : undefined}
                  className="flex w-full cursor-pointer items-center justify-center"
                >
                  {inner}
                </button>
              ) : (
                <Link
                  href={item.href}
                  aria-current={activeNow ? "page" : undefined}
                  className="flex w-full items-center justify-center"
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
