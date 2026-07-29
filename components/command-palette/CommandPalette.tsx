"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { AnimatePresence, motion } from "motion/react";
import { useLenis } from "@studio-freight/react-lenis";
import {
  LuArrowRight,
  LuFileText,
  LuFolder,
  LuLinkedin,
  LuMail,
  LuMoon,
  LuSearch,
  LuSparkles,
  LuSun,
} from "react-icons/lu";
import { SiGithub } from "react-icons/si";
import { CONTACT_INFO, SOCIAL_LINKS } from "@/config/data";

type Cmd = {
  id: string;
  label: string;
  group: "navigate" | "projects" | "actions";
  keywords?: string;
  icon: React.ReactNode;
  run: () => void;
  /** Hidden until the query matches — used for easter eggs. */
  hidden?: boolean;
};

const GROUPS: Cmd["group"][] = ["navigate", "projects", "actions"];

export default function CommandPalette({
  projects,
}: {
  projects: { slug: string; title: string }[];
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const router = useRouter();
  const { setTheme, resolvedTheme } = useTheme();
  const lenis = useLenis();
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const close = () => {
    setOpen(false);
    setQuery("");
    setActive(0);
  };

  const commands: Cmd[] = useMemo(() => {
    const go = (hash: string) => {
      close();
      router.push(`/${hash}`);
    };
    const openUrl = (url: string) => {
      close();
      window.open(url, "_blank", "noopener,noreferrer");
    };

    const nav: Cmd[] = [
      { id: "about", label: "go to about", href: "#about" },
      { id: "experience", label: "go to work experience", href: "#experience" },
      { id: "projects", label: "go to projects", href: "#projects" },
      { id: "activity", label: "go to activity", href: "#github" },
      { id: "setup", label: "go to setup guides", href: "#setup" },
      { id: "contact", label: "go to contact", href: "#contact" },
    ].map((n) => ({
      id: n.id,
      label: n.label,
      group: "navigate" as const,
      icon: <LuArrowRight size={15} />,
      run: () => go(n.href),
    }));

    // Real routes, so they work from anywhere — not just the homepage.
    for (const route of [
      {
        id: "blog",
        label: "read the blog",
        href: "/blog",
        keywords: "writing posts articles",
      },
      {
        id: "all-projects",
        label: "browse all projects",
        href: "/projects",
        keywords: "work case study",
      },
      {
        id: "reading",
        label: "reading list",
        href: "/reading",
        keywords: "bookmarks saved links articles",
      },
      {
        id: "machine-coding",
        label: "machine coding questions",
        href: "/machine-coding",
        keywords:
          "interview frontend react debounce throttle pagination practice round",
      },
      {
        id: "setup-page",
        label: "setup & tools",
        href: "/setup",
        keywords: "uses editor terminal dotfiles config",
      },
      {
        id: "arcade",
        label: "arcade",
        href: "/arcade",
        keywords: "games play fun",
      },
      {
        id: "quiz",
        label: "today's code puzzle",
        href: "/arcade/quiz",
        keywords: "quiz guess output daily game",
      },
      {
        id: "snake",
        label: "play snake",
        href: "/arcade/snake",
        keywords: "game arcade high score",
      },
      {
        id: "resume-page",
        label: "view resume",
        href: "/resume",
        keywords: "cv hire experience",
      },
    ]) {
      nav.push({
        id: route.id,
        label: route.label,
        group: "navigate",
        keywords: route.keywords,
        icon: <LuArrowRight size={15} />,
        run: () => {
          close();
          router.push(route.href);
        },
      });
    }

    const projCmds: Cmd[] = projects.map((p) => ({
      id: `project-${p.slug}`,
      label: p.title,
      group: "projects",
      keywords: "project open view",
      icon: <LuFolder size={15} />,
      run: () => {
        close();
        router.push(`/project/${p.slug}`);
      },
    }));

    const actions: Cmd[] = [
      {
        id: "email",
        label: "email sourav",
        group: "actions",
        keywords: "contact mail",
        icon: <LuMail size={15} />,
        run: () => {
          close();
          window.location.href = `mailto:${CONTACT_INFO.email}`;
        },
      },
      {
        id: "resume-pdf",
        label: "download resume (pdf)",
        group: "actions",
        keywords: "cv download",
        icon: <LuFileText size={15} />,
        run: () => openUrl(CONTACT_INFO.resume),
      },
      {
        id: "github",
        label: "github profile",
        group: "actions",
        icon: <SiGithub size={15} />,
        run: () => openUrl(SOCIAL_LINKS.github),
      },
      {
        id: "linkedin",
        label: "linkedin profile",
        group: "actions",
        icon: <LuLinkedin size={15} />,
        run: () => openUrl(SOCIAL_LINKS.linkedin),
      },
      {
        id: "theme",
        label: "toggle theme",
        group: "actions",
        keywords: "dark light mode",
        icon:
          resolvedTheme === "dark" ? <LuSun size={15} /> : <LuMoon size={15} />,
        run: () => setTheme(resolvedTheme === "dark" ? "light" : "dark"),
      },
      {
        id: "hire-me",
        label: "sudo hire-me",
        group: "actions",
        keywords: "sudo hire secret party easter egg fun",
        hidden: true,
        icon: <LuSparkles size={15} />,
        run: () => {
          close();
          window.dispatchEvent(new Event("party-mode"));
          setTimeout(() => {
            window.location.href = `mailto:${CONTACT_INFO.email}?subject=let's work together`;
          }, 900);
        },
      },
    ];

    return [...nav, ...projCmds, ...actions];
  }, [projects, resolvedTheme, router, setTheme]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return commands.filter((c) => !c.hidden);
    return commands.filter((c) =>
      `${c.label} ${c.group} ${c.keywords ?? ""}`.toLowerCase().includes(q),
    );
  }, [commands, query]);

  useEffect(() => setActive(0), [query]);

  // open shortcut (⌘K / Ctrl+K) and external open event (navbar button)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    const onOpen = () => setOpen(true);
    window.addEventListener("keydown", onKey);
    window.addEventListener("open-command-palette", onOpen);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("open-command-palette", onOpen);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => inputRef.current?.focus(), 20);
    return () => clearTimeout(t);
  }, [open]);

  // Lock background scroll while the palette is open. This site drives scroll
  // with Lenis (virtual/transform scrolling), so overflow:hidden can't stop it
  // — we pause Lenis instead. The list opts back into native scrolling via
  // `data-lenis-prevent`. Body overflow:hidden is a fallback if Lenis is absent.
  useEffect(() => {
    if (!open) return;
    lenis?.stop();
    const root = document.documentElement;
    const prevOverflow = root.style.overflow;
    if (!lenis) root.style.overflow = "hidden";
    return () => {
      lenis?.start();
      root.style.overflow = prevOverflow;
    };
  }, [open, lenis]);

  // keep the highlighted row in view
  useEffect(() => {
    listRef.current
      ?.querySelector<HTMLElement>(`[data-idx="${active}"]`)
      ?.scrollIntoView({ block: "nearest" });
  }, [active]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      filtered[active]?.run();
    } else if (e.key === "Escape") {
      e.preventDefault();
      close();
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="command-palette"
          className="fixed inset-0 z-50 flex items-start justify-center px-4 pt-[12vh]"
          role="dialog"
          aria-modal="true"
          aria-label="Command menu"
          onKeyDown={onKeyDown}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
        >
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={close}
          />
          <motion.div
            className="border-border bg-background relative z-10 flex max-h-[70vh] w-full max-w-xl flex-col overflow-hidden border shadow-2xl"
            initial={{ y: -14, scale: 0.96 }}
            animate={{ y: 0, scale: 1 }}
            exit={{ y: -10, scale: 0.98 }}
            transition={{ type: "spring", duration: 0.32, bounce: 0.22 }}
          >
            <div className="border-border flex shrink-0 items-center gap-3 border-b px-4 py-3">
              <LuSearch className="shrink-0 text-gray-400" size={16} />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="type a command or search..."
                className="w-full bg-transparent text-sm outline-none placeholder:text-gray-400"
              />
              <kbd className="border-border font-code shrink-0 border px-1.5 py-0.5 text-[10px] text-gray-400">
                esc
              </kbd>
            </div>

            <div
              ref={listRef}
              data-lenis-prevent
              className="min-h-0 flex-1 overflow-y-auto overscroll-contain py-2"
            >
              {filtered.length === 0 && (
                <p className="px-4 py-6 text-center text-sm text-gray-400">
                  no results
                </p>
              )}
              {GROUPS.map((g) => {
                const items = filtered.filter((c) => c.group === g);
                if (!items.length) return null;
                return (
                  <div key={g} className="mb-1">
                    <p className="font-code px-4 py-1.5 text-[10px] tracking-wide text-gray-400 uppercase">
                      {g}
                    </p>
                    {items.map((c) => {
                      const idx = filtered.indexOf(c);
                      const isActive = idx === active;
                      return (
                        <button
                          key={c.id}
                          type="button"
                          data-idx={idx}
                          onMouseMove={() => setActive(idx)}
                          onClick={() => c.run()}
                          className={`flex w-full items-center gap-3 px-4 py-2 text-left text-sm transition-colors ${
                            isActive ? "bg-gray-100 dark:bg-gray-900" : ""
                          }`}
                        >
                          <span
                            className={`shrink-0 ${isActive ? "text-blue" : "text-gray-400"}`}
                          >
                            {c.icon}
                          </span>
                          <span className="ss01 normal-case-force truncate">
                            {c.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                );
              })}
            </div>

            <div className="border-border font-code flex shrink-0 items-center gap-4 border-t px-4 py-2 text-[10px] text-gray-400">
              <span>↑↓ navigate</span>
              <span>↵ select</span>
              <span>esc close</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
