"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import {
  LuArrowRight,
  LuFileText,
  LuFolder,
  LuLinkedin,
  LuMail,
  LuMoon,
  LuSearch,
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

    nav.push({
      id: "blog",
      label: "read the blog",
      group: "navigate",
      icon: <LuArrowRight size={15} />,
      run: () => {
        close();
        router.push("/blog");
      },
    });

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
        id: "resume",
        label: "view resume",
        group: "actions",
        keywords: "cv",
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
    ];

    return [...nav, ...projCmds, ...actions];
  }, [projects, resolvedTheme, router, setTheme]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return commands;
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

  // keep the highlighted row in view
  useEffect(() => {
    listRef.current
      ?.querySelector<HTMLElement>(`[data-idx="${active}"]`)
      ?.scrollIntoView({ block: "nearest" });
  }, [active]);

  if (!open) return null;

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
    <div
      className="fixed inset-0 z-50 flex items-start justify-center px-4 pt-[12vh]"
      role="dialog"
      aria-modal="true"
      aria-label="Command menu"
    >
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={close}
      />
      <div
        className="border-border bg-background relative z-10 w-full max-w-xl border shadow-2xl"
        onKeyDown={onKeyDown}
      >
        <div className="border-border flex items-center gap-3 border-b px-4 py-3">
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

        <div ref={listRef} className="max-h-[52vh] overflow-y-auto py-2">
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

        <div className="border-border font-code flex items-center gap-4 border-t px-4 py-2 text-[10px] text-gray-400">
          <span>↑↓ navigate</span>
          <span>↵ select</span>
          <span>esc close</span>
        </div>
      </div>
    </div>
  );
}
