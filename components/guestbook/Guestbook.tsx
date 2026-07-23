"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { Section, GridBand, GridCell, Button, Input } from "@/components/ui";

type Entry = { id: number; name: string; message: string; date: string };

// Deterministic accent per entry so the wall reads as colourful, not random.
const ACCENTS = [
  "#10b981",
  "#5d8cd7",
  "#8b5cf6",
  "#f59e0b",
  "#f43f5e",
  "#06b6d4",
];
const accentFor = (s: string) =>
  ACCENTS[[...s].reduce((a, c) => a + c.charCodeAt(0), 0) % ACCENTS.length];

function initials(name: string) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}

function relativeDate(iso: string) {
  const d = new Date(iso);
  const diff = (Date.now() - d.getTime()) / 1000;
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default function Guestbook() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "error">("idle");
  const [error, setError] = useState("");
  const [loaded, setLoaded] = useState(false);
  const honeypot = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch("/api/guestbook")
      .then((r) => r.json())
      .then((d) => setEntries(d.entries ?? []))
      .catch(() => setEntries([]))
      .finally(() => setLoaded(true));
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === "sending") return;
    setStatus("sending");
    setError("");

    try {
      const res = await fetch("/api/guestbook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          message,
          website: honeypot.current?.value ?? "",
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        setStatus("error");
        setError(data.error ?? "something went wrong");
        return;
      }

      if (data.entry) setEntries((prev) => [data.entry, ...prev]);
      setName("");
      setMessage("");
      setStatus("idle");
    } catch {
      setStatus("error");
      setError("network error, try again");
    }
  };

  return (
    <Section
      id="guestbook"
      title="guestbook"
      subtitle="leave a mark — say hi, drop a thought, or just sign the wall."
    >
      <GridBand cols="grid-cols-1">
        {/* form */}
        <GridCell tinted>
          <form onSubmit={submit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-4 sm:flex-row">
              <div className="w-full sm:max-w-[220px]">
                <Input
                  fullWidth
                  aria-label="your name"
                  placeholder="your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  maxLength={40}
                  required
                />
              </div>
              <div className="w-full flex-1">
                <Input
                  fullWidth
                  aria-label="your message"
                  placeholder="say something nice..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  maxLength={280}
                  required
                />
              </div>
              {/* honeypot — hidden from humans */}
              <input
                ref={honeypot}
                type="text"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                className="pointer-events-none absolute -left-[9999px] h-0 w-0 opacity-0"
              />
            </div>
            <div className="flex items-center gap-3">
              <Button
                type="submit"
                variant="gradient"
                disabled={status === "sending"}
              >
                {status === "sending" ? "signing..." : "sign guestbook"}
              </Button>
              {status === "error" && (
                <span className="text-destructive text-sm">{error}</span>
              )}
            </div>
          </form>
        </GridCell>
      </GridBand>

      {/* wall of entries */}
      <GridBand cols="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {!loaded && (
          <GridCell className="text-sm text-gray-500">
            loading the wall...
          </GridCell>
        )}
        {loaded && entries.length === 0 && (
          <GridCell className="text-sm text-gray-500">
            no signatures yet — be the first to sign 👋
          </GridCell>
        )}
        {entries.map((entry, i) => {
          const accent = accentFor(entry.name);
          return (
            <GridCell key={entry.id} tinted={i % 2 === 1}>
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col gap-3"
              >
                <div className="flex items-center gap-3">
                  <span
                    className="flex size-8 shrink-0 items-center justify-center text-xs font-semibold text-white"
                    style={{ backgroundColor: accent }}
                  >
                    {initials(entry.name) || "?"}
                  </span>
                  <div className="min-w-0">
                    <p className="ss01 normal-case-force truncate text-sm font-semibold">
                      {entry.name}
                    </p>
                    <p className="text-xs text-gray-400">
                      {relativeDate(entry.date)}
                    </p>
                  </div>
                </div>
                <p className="text-sm leading-relaxed text-pretty text-gray-600 dark:text-gray-400">
                  {entry.message}
                </p>
              </motion.div>
            </GridCell>
          );
        })}
      </GridBand>
    </Section>
  );
}
