"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Panel, Chip, Tabs } from "@/components/mdx/Panel";
import {
  LuChevronLeft,
  LuChevronRight,
  LuPause,
  LuPlay,
  LuRotateCcw,
} from "react-icons/lu";

/* ------------------------------------------------------------------ *
 * 1. ProtocolTimeline
 *
 * Every version fixed the previous one's bottleneck and then hit a new
 * one a layer down. The "broke" line is the point of the component —
 * a plain feature list hides the pattern.
 * ------------------------------------------------------------------ */

type Era = {
  v: string;
  year: string;
  headline: string;
  added: string[];
  broke: string;
  wire: React.ReactNode;
};

const eras: Era[] = [
  {
    v: "0.9",
    year: "1991",
    headline: "One line. One file. Goodbye.",
    added: ["GET, and nothing else", "no headers", "no status codes"],
    broke:
      "One connection per file, closed after every reply. A page with ten images paid to open ten connections.",
    wire: (
      <div className="font-code text-xs leading-6 text-gray-700 dark:text-gray-300">
        <div className="text-faint">→ request</div>
        <div>GET /index.html</div>
        <div className="text-faint mt-2">← response</div>
        <div>&lt;html&gt;…&lt;/html&gt;</div>
        <div className="text-faint mt-2">connection closed</div>
      </div>
    ),
  },
  {
    v: "1.0",
    year: "1996",
    headline: "Headers arrive. So does everything else.",
    added: [
      "POST, HEAD",
      "status codes",
      "request + response headers",
      "Content-Type, so not just HTML",
    ],
    broke:
      "Still one connection per request. And headers made every request bigger, sent again in full every single time.",
    wire: (
      <div className="font-code text-xs leading-6 text-gray-700 dark:text-gray-300">
        <div>GET /index.html HTTP/1.0</div>
        <div className="text-faint">User-Agent: …</div>
        <div className="mt-2">HTTP/1.0 200 OK</div>
        <div className="text-faint">Content-Type: text/html</div>
      </div>
    ),
  },
  {
    v: "1.1",
    year: "1997",
    headline: "Keep the connection. Still one lane.",
    added: [
      "connections that stay open",
      "start sending before you know the size",
      "real caching (Cache-Control, ETag)",
      "Host header → many sites, one address",
      "pipelining (in theory)",
    ],
    broke:
      "Replies must come back in the order they were asked for, so one slow reply holds up everything behind it. Browsers shipped with pipelining switched off.",
    wire: (
      <div className="font-code text-xs leading-6 text-gray-700 dark:text-gray-300">
        <div>GET /a.css HTTP/1.1</div>
        <div className="text-faint">Connection: keep-alive</div>
        <div className="text-faint mt-2">…same socket…</div>
        <div>GET /b.js HTTP/1.1</div>
      </div>
    ),
  },
  {
    v: "2",
    year: "2015",
    headline: "One connection. Everything at once.",
    added: [
      "binary format, every packet tagged",
      "replies in any order, one connection",
      "header compression",
      "priorities",
      "server push",
    ],
    broke:
      "HTTP stopped queueing, but TCP underneath still delivers one strict in-order stream — so a single lost packet stalls every request on the connection.",
    wire: (
      <div className="flex flex-wrap gap-1.5">
        <Chip active>HEADERS · stream 1</Chip>
        <Chip active>DATA · stream 3</Chip>
        <Chip active>DATA · stream 1</Chip>
        <Chip active>HEADERS · stream 5</Chip>
      </div>
    ),
  },
  {
    v: "3",
    year: "2022",
    headline: "Drop TCP. Rebuild it in userspace.",
    added: [
      "QUIC, built on UDP",
      "a lost packet stalls only its own request",
      "encryption folded into the handshake",
      "survives a switch from wifi to mobile",
      "header compression",
    ],
    broke:
      "More work for the processor per byte. That makes QUIC slower than HTTP/2 on very fast links — the opposite of the problem it was built for.",
    wire: (
      <div className="font-code text-xs leading-6 text-gray-700 dark:text-gray-300">
        <div className="text-faint">UDP datagram</div>
        <div>QUIC packet · conn-id 0x9f2a</div>
        <div className="pl-4">stream 0 → HEADERS</div>
        <div className="pl-4">stream 4 → DATA</div>
        <div className="text-faint pl-4">(lost — only stream 4 waits)</div>
      </div>
    ),
  },
];

export function ProtocolTimeline() {
  const [i, setI] = useState(0);
  const [playing, setPlaying] = useState(false);
  const started = useRef(false);
  const host = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (
      typeof window === "undefined" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }
    const el = host.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (e) => {
        if (e[0]?.isIntersecting && !started.current) {
          started.current = true;
          setPlaying(true);
          obs.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!playing) return;
    if (i >= eras.length - 1) {
      setPlaying(false);
      return;
    }
    const id = setTimeout(() => setI((v) => v + 1), 3400);
    return () => clearTimeout(id);
  }, [playing, i]);

  const go = useCallback((n: number) => {
    setPlaying(false);
    setI(Math.max(0, Math.min(eras.length - 1, n)));
  }, []);

  const era = eras[i];
  const atEnd = i === eras.length - 1;

  return (
    <div ref={host}>
      <Panel label="thirty years, five protocols">
        <div className="-mx-1 mb-5 flex gap-1 overflow-x-auto px-1 pb-1">
          {eras.map((e, idx) => {
            const now = idx === i;
            const done = idx < i;
            return (
              <button
                key={e.v}
                type="button"
                onClick={() => go(idx)}
                aria-current={now ? "step" : undefined}
                className={`group flex-1 shrink-0 basis-0 border-t-2 pt-2 text-left transition-colors ${
                  now
                    ? "border-blue"
                    : done
                      ? "border-blue/30"
                      : "border-border hover:border-gray-400"
                }`}
                style={{ minWidth: 84 }}
              >
                <span
                  className={`font-code block text-xs ${
                    now ? "text-blue" : "text-faint"
                  }`}
                >
                  HTTP/{e.v}
                </span>
                <span
                  className={`font-code block text-xs ${
                    now
                      ? "text-gray-900 dark:text-gray-100"
                      : "text-faint group-hover:text-gray-600 dark:group-hover:text-gray-300"
                  }`}
                >
                  {e.year}
                </span>
              </button>
            );
          })}
        </div>

        <div className="grid gap-5 md:grid-cols-[1fr_1fr] md:gap-6">
          <div>
            <h4 className="font-code text-blue text-xs lowercase">
              http/{era.v} · {era.year}
            </h4>
            <p className="mt-1.5 text-base font-semibold text-gray-900 dark:text-gray-100">
              {era.headline}
            </p>

            <ul className="mt-3 space-y-1">
              {era.added.map((a) => (
                <li key={a} className="text-soft flex gap-2 text-sm">
                  <span className="text-blue font-code">+</span>
                  {a}
                </li>
              ))}
            </ul>

            <div className="border-border border-l-amber mt-4 border-l-2 pl-3">
              <div className="font-code text-faint text-xs lowercase">
                what it broke
              </div>
              <p className="mt-1 text-sm leading-relaxed text-gray-700 dark:text-gray-300">
                {era.broke}
              </p>
            </div>
          </div>

          <div
            key={era.v}
            className="ht-stage border-border border bg-white p-3.5 dark:bg-gray-950/60"
          >
            <div className="font-code text-faint mb-2 text-xs lowercase">
              on the wire
            </div>
            {era.wire}
          </div>
        </div>

        <div className="border-border mt-5 flex items-center gap-1.5 border-t pt-3.5">
          <button
            type="button"
            onClick={() =>
              atEnd ? (setI(0), setPlaying(true)) : setPlaying((p) => !p)
            }
            className="border-border hover:border-blue hover:text-blue flex items-center gap-1.5 border px-2.5 py-1.5 text-gray-600 transition-colors dark:text-gray-400"
            aria-label={atEnd ? "Replay" : playing ? "Pause" : "Play"}
          >
            {atEnd ? (
              <LuRotateCcw size={15} />
            ) : playing ? (
              <LuPause size={15} />
            ) : (
              <LuPlay size={15} />
            )}
            <span className="font-code text-xs lowercase">
              {atEnd ? "replay" : playing ? "pause" : "play"}
            </span>
          </button>

          <div className="ml-auto flex items-center gap-1.5">
            <span className="font-code text-faint mr-1 text-xs">
              {i + 1} / {eras.length}
            </span>
            <button
              type="button"
              onClick={() => go(i - 1)}
              disabled={i === 0}
              className="border-border hover:border-blue hover:text-blue border p-1.5 text-gray-600 transition-colors disabled:pointer-events-none disabled:opacity-30 dark:text-gray-400"
              aria-label="Previous"
            >
              <LuChevronLeft size={16} />
            </button>
            <button
              type="button"
              onClick={() => go(i + 1)}
              disabled={atEnd}
              className="border-border hover:border-blue hover:text-blue border p-1.5 text-gray-600 transition-colors disabled:pointer-events-none disabled:opacity-30 dark:text-gray-400"
              aria-label="Next"
            >
              <LuChevronRight size={16} />
            </button>
          </div>
        </div>

        <style>{`
          .ht-stage { animation: htFade 0.35s ease-out; }
          @keyframes htFade {
            from { opacity: 0; transform: translateY(4px); }
            to   { opacity: 1; transform: translateY(0); }
          }
          @media (prefers-reduced-motion: reduce) { .ht-stage { animation: none; } }
        `}</style>
      </Panel>
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * 2. HeadOfLineBlocking
 *
 * The centrepiece. Same eight resources, three protocols, with and
 * without a dropped packet. Timings are illustrative — the ordering
 * and the stall behaviour are the accurate part, not the numbers.
 * ------------------------------------------------------------------ */

const RESOURCES = [
  "index.html",
  "main.css",
  "app.js",
  "logo.svg",
  "hero.jpg",
  "font.woff2",
  "chart.js",
  "avatar.png",
];

const CONNS = 6; // browsers cap parallel connections per origin at ~6
const UNIT = 22; // time for one request
const STALL = 16; // retransmit cost when a packet is dropped
const LOSS_ON = 2; // which resource loses a packet

type Proto = "h1" | "h2" | "h3";

type Bar = { start: number; end: number; stalled?: boolean };

function schedule(proto: Proto, loss: boolean): Bar[] {
  return RESOURCES.map((_, idx) => {
    if (proto === "h1") {
      // Six sockets, each strictly serial. Request 7 waits for socket 1.
      const wave = Math.floor(idx / CONNS);
      const start = wave * UNIT;
      // A drop only hurts the one socket carrying it.
      const stalled = loss && idx === LOSS_ON;
      return {
        start,
        end: start + UNIT + (stalled ? STALL : 0),
        stalled,
      };
    }

    // h2 and h3 both multiplex: everything starts at once.
    if (proto === "h2") {
      // TCP delivers one ordered byte stream, so the drop stalls all of it.
      return { start: 0, end: UNIT + (loss ? STALL : 0), stalled: loss };
    }

    // QUIC streams are independent — only the affected one waits.
    const stalled = loss && idx === LOSS_ON;
    return { start: 0, end: UNIT + (stalled ? STALL : 0), stalled };
  });
}

const PROTO_LABEL: Record<Proto, string> = {
  h1: "HTTP/1.1",
  h2: "HTTP/2",
  h3: "HTTP/3",
};

const VERDICT: Record<Proto, { clean: string; lossy: string }> = {
  h1: {
    clean:
      "Six connections, each handling one file at a time. Files seven and eight wait for one to free up. That staircase is the connection limit, not slow internet.",
    lossy:
      "A lost packet only stalls the connection carrying it. The other five keep going. Clumsy, but the damage stays in one place.",
  },
  h2: {
    clean:
      "One connection, all eight files at once. No staircase, no limit, and the headers are compressed.",
    lossy:
      "Here's the catch. TCP hands over one strict in-order stream, so one lost packet holds up everything behind it — including the seven files that arrived perfectly. On a patchy connection this can be slower than HTTP/1.1.",
  },
  h3: {
    clean:
      "Same as HTTP/2 from here, except the connection was set up in one round trip instead of two.",
    lossy:
      "QUIC tracks each file separately, so only the one that lost data waits. The other seven are untouched. This is the entire reason HTTP/3 exists.",
  },
};

export function HeadOfLineBlocking() {
  const [proto, setProto] = useState<Proto>("h1");
  const [loss, setLoss] = useState(false);

  const bars = schedule(proto, loss);
  const span = Math.max(...bars.map((b) => b.end)) || 1;
  const worst = Math.max(...bars.map((b) => b.end));

  return (
    <Panel
      label="eight files, one page load"
      footnote={loss ? VERDICT[proto].lossy : VERDICT[proto].clean}
    >
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <Tabs
          options={["h1", "h2", "h3"] as const}
          value={proto}
          onChange={setProto}
          labels={PROTO_LABEL}
        />

        <button
          type="button"
          onClick={() => setLoss((v) => !v)}
          aria-pressed={loss}
          className={`font-code border px-2.5 py-1.5 text-xs lowercase transition-colors ${
            loss
              ? "border-amber/60 bg-amber/10 text-gray-900 dark:text-gray-100"
              : "border-border text-soft hover:border-gray-400"
          }`}
        >
          drop a packet · {loss ? "on" : "off"}
        </button>
      </div>

      <div className="space-y-1.5">
        {RESOURCES.map((r, idx) => {
          const b = bars[idx];
          const base = UNIT;
          const stallWidth = b.end - b.start - base;
          return (
            <div key={r} className="flex items-center gap-3">
              <span
                className="font-code text-soft shrink-0 truncate text-xs"
                style={{ width: 92 }}
              >
                {r}
              </span>
              <div className="border-border relative h-5 flex-1 border bg-white dark:bg-gray-950">
                <div
                  className="bg-blue absolute inset-y-0 transition-all duration-500 ease-out"
                  style={{
                    left: `${(b.start / span) * 100}%`,
                    width: `${(base / span) * 100}%`,
                  }}
                />
                {stallWidth > 0 && (
                  <div
                    className="bg-amber absolute inset-y-0 transition-all duration-500 ease-out"
                    style={{
                      left: `${((b.start + base) / span) * 100}%`,
                      width: `${(stallWidth / span) * 100}%`,
                    }}
                    title="waiting for the lost packet to be sent again"
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="border-border mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 border-t pt-3.5">
        <span className="flex items-center gap-2">
          <span aria-hidden="true" className="bg-blue h-2.5 w-4" />
          <span className="font-code text-soft text-xs lowercase">
            transferring
          </span>
        </span>
        <span className="flex items-center gap-2">
          <span aria-hidden="true" className="bg-amber h-2.5 w-4" />
          <span className="font-code text-soft text-xs lowercase">
            stuck, waiting for the lost packet
          </span>
        </span>
        <span className="font-code text-faint ml-auto text-xs lowercase">
          page finishes at {worst} units
        </span>
      </div>
    </Panel>
  );
}

/* ------------------------------------------------------------------ *
 * 3. HandshakeCost
 *
 * Round trips before the first byte of the response. This is the part
 * that dominates on a high-latency link.
 * ------------------------------------------------------------------ */

type Leg = { label: string; rtt: number; tone: "tcp" | "tls" | "req" };

const STACKS: { name: string; note: string; legs: Leg[] }[] = [
  {
    name: "HTTP/1.1 + TLS 1.2",
    note: "the 2015 default",
    legs: [
      { label: "connect", rtt: 1, tone: "tcp" },
      { label: "encrypt", rtt: 2, tone: "tls" },
      { label: "request", rtt: 1, tone: "req" },
    ],
  },
  {
    name: "HTTP/2 + TLS 1.3",
    note: "most of the web today",
    legs: [
      { label: "connect", rtt: 1, tone: "tcp" },
      { label: "encrypt", rtt: 1, tone: "tls" },
      { label: "request", rtt: 1, tone: "req" },
    ],
  },
  {
    name: "HTTP/3 (QUIC)",
    note: "connect and encrypt in one step",
    legs: [
      { label: "connect + encrypt", rtt: 1, tone: "tcp" },
      { label: "request", rtt: 1, tone: "req" },
    ],
  },
  {
    name: "HTTP/3, returning visitor",
    note: "nothing to set up, just ask",
    legs: [{ label: "request, with data attached", rtt: 1, tone: "req" }],
  },
];

const TONE: Record<Leg["tone"], string> = {
  tcp: "bg-gray-300 dark:bg-gray-700",
  tls: "bg-amber",
  req: "bg-blue",
};

export function HandshakeCost() {
  const max = Math.max(
    ...STACKS.map((s) => s.legs.reduce((n, l) => n + l.rtt, 0)),
  );

  return (
    <Panel
      label="round trips (rtt) before anything loads"
      footnote="On a fast 20ms link, none of this is worth a paragraph. On a 200ms mobile link it's 800ms of setup before the server has even read your request — against 200ms for HTTP/3."
    >
      <div className="space-y-3">
        {STACKS.map((s) => {
          const total = s.legs.reduce((n, l) => n + l.rtt, 0);
          return (
            <div key={s.name}>
              <div className="mb-1.5 flex flex-wrap items-baseline gap-x-2">
                <span className="font-code text-xs text-gray-700 dark:text-gray-300">
                  {s.name}
                </span>
                <span className="font-code text-faint text-xs lowercase">
                  {s.note}
                </span>
                <span className="font-code text-blue ml-auto text-xs">
                  {total} round {total === 1 ? "trip" : "trips"}
                </span>
              </div>
              <div className="flex gap-0.5">
                {s.legs.map((l, idx) => (
                  <div
                    key={idx}
                    className={`${TONE[l.tone]} flex h-6 items-center justify-center overflow-hidden`}
                    style={{ width: `${(l.rtt / max) * 100}%` }}
                  >
                    <span className="font-code truncate px-1.5 text-xs text-gray-900 dark:text-gray-100">
                      {l.label}
                    </span>
                  </div>
                ))}
                <div
                  className="h-6"
                  style={{ width: `${((max - total) / max) * 100}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </Panel>
  );
}

/* ------------------------------------------------------------------ *
 * 4. StatusCodeCheatSheet
 *
 * Revision aid, not a spec dump. Five classes, and inside each only the
 * codes you actually meet in a normal week — with the line that tells
 * you which one to reach for when two look interchangeable.
 * ------------------------------------------------------------------ */

type CodeClass = "1xx" | "2xx" | "3xx" | "4xx" | "5xx";

const CLASSES: readonly CodeClass[] = ["1xx", "2xx", "3xx", "4xx", "5xx"];

const CLASS_META: Record<CodeClass, { name: string; gist: string }> = {
  "1xx": {
    name: "informational",
    gist: "the server got your request and is still working — the real reply is coming",
  },
  "2xx": { name: "success", gist: "received, understood, done" },
  "3xx": {
    name: "redirection",
    gist: "it moved, or your cached copy is still fine",
  },
  "4xx": {
    name: "client error",
    gist: "the client asked for something wrong — the same request gets the same answer",
  },
  "5xx": {
    name: "server error",
    gist: "the request was fine, the server broke — trying again might work",
  },
};

const CODES: { c: CodeClass; code: string; name: string; note: string }[] = [
  {
    c: "1xx",
    code: "101",
    name: "Switching Protocols",
    note: "what you see when a page opens a WebSocket",
  },
  {
    c: "1xx",
    code: "103",
    name: "Early Hints",
    note: "start downloading these while I build the page — the replacement for server push",
  },
  {
    c: "2xx",
    code: "200",
    name: "OK",
    note: "the default success, body included",
  },
  {
    c: "2xx",
    code: "201",
    name: "Created",
    note: "a POST made something new — send back its URL",
  },
  {
    c: "2xx",
    code: "204",
    name: "No Content",
    note: "done, and there's deliberately nothing to send back — the right answer for a delete",
  },
  {
    c: "2xx",
    code: "206",
    name: "Partial Content",
    note: "here's the chunk you asked for — video scrubbing, resumed downloads",
  },
  {
    c: "3xx",
    code: "301",
    name: "Moved Permanently",
    note: "permanent — cached hard by browsers, so be sure before you ship it",
  },
  {
    c: "3xx",
    code: "302",
    name: "Found",
    note: "temporary; method may change on the retry, which is why 307 exists",
  },
  {
    c: "3xx",
    code: "304",
    name: "Not Modified",
    note: "your cached copy is still good — nothing sent back, the cheapest reply there is",
  },
  {
    c: "3xx",
    code: "307 / 308",
    name: "Temporary / Permanent Redirect",
    note: "same as 302 / 301, but a POST stays a POST",
  },
  {
    c: "4xx",
    code: "400",
    name: "Bad Request",
    note: "malformed — the catch-all when nothing more specific fits",
  },
  {
    c: "4xx",
    code: "401",
    name: "Unauthorized",
    note: "actually unauthenticated: who are you? log in and try again",
  },
  {
    c: "4xx",
    code: "403",
    name: "Forbidden",
    note: "we know who you are and you still can't — re-authenticating won't help",
  },
  { c: "4xx", code: "404", name: "Not Found", note: "no such resource here" },
  {
    c: "4xx",
    code: "405",
    name: "Method Not Allowed",
    note: "the address exists, but you can't POST to it — say which ones work",
  },
  {
    c: "4xx",
    code: "409",
    name: "Conflict",
    note: "clashes with what's already there — a duplicate, or an edit based on an old copy",
  },
  {
    c: "4xx",
    code: "422",
    name: "Unprocessable Content",
    note: "we read it fine, we just can't do it — the usual answer to a failed validation",
  },
  {
    c: "4xx",
    code: "429",
    name: "Too Many Requests",
    note: "slow down — tell them how long to wait, don't make them guess",
  },
  {
    c: "5xx",
    code: "500",
    name: "Internal Server Error",
    note: "something threw and nobody caught it — the default for any crash",
  },
  {
    c: "5xx",
    code: "502",
    name: "Bad Gateway",
    note: "the proxy in front reached your real server and got nonsense back",
  },
  {
    c: "5xx",
    code: "503",
    name: "Service Unavailable",
    note: "overloaded, or down for maintenance — temporary, worth retrying",
  },
  {
    c: "5xx",
    code: "504",
    name: "Gateway Timeout",
    note: "the proxy waited, your real server never answered in time",
  },
];

export function StatusCodeCheatSheet() {
  const [active, setActive] = useState<CodeClass | "all">("all");
  const shown = active === "all" ? CODES : CODES.filter((c) => c.c === active);

  return (
    <Panel
      label="status codes, quickly"
      footnote={
        <>
          The two everyone gets backwards: <strong>401</strong> means we
          don&apos;t know who you are, <strong>403</strong> means we do and the
          answer is still no. And reach for <strong>422</strong> over a plain{" "}
          <strong>400</strong> when a form fails validation — the request made
          sense, it just asked for something you can&apos;t do.
        </>
      }
    >
      <Tabs
        options={["all", ...CLASSES] as const}
        value={active}
        onChange={setActive}
      />

      {active !== "all" && (
        <p className="text-soft mt-4 text-sm">
          <span className="font-code text-gray-700 dark:text-gray-300">
            {CLASS_META[active].name}
          </span>{" "}
          — {CLASS_META[active].gist}
        </p>
      )}

      <div className="mt-4">
        {shown.map((c) => (
          <div
            key={c.code}
            className="border-border flex flex-col gap-0.5 border-b py-2.5 last:border-b-0 sm:flex-row sm:items-baseline sm:gap-4"
          >
            <span className="font-code text-blue text-xs sm:w-20 sm:shrink-0">
              {c.code}
            </span>
            <span className="text-sm text-gray-700 sm:w-52 sm:shrink-0 dark:text-gray-300">
              {c.name}
            </span>
            <span className="text-soft text-sm">{c.note}</span>
          </div>
        ))}
      </div>
    </Panel>
  );
}

/* ------------------------------------------------------------------ *
 * 5. ProtocolCheatSheet
 * ------------------------------------------------------------------ */

const COLS = ["HTTP/1.1", "HTTP/2", "HTTP/3"] as const;

const ROWS: { k: string; v: [string, string, string] }[] = [
  { k: "shipped", v: ["1997", "2015", "2022"] },
  { k: "runs on", v: ["TCP", "TCP", "QUIC, over UDP"] },
  { k: "format", v: ["plain text", "binary", "binary"] },
  {
    k: "requests at once",
    v: [
      "one per connection, ~6 open",
      "all, on one connection",
      "all, on one connection",
    ],
  },
  {
    k: "one lost packet",
    v: ["stalls one connection", "stalls everything", "stalls one request"],
  },
  {
    k: "head-of-line blocking",
    v: ["in HTTP", "in TCP, underneath", "gone"],
  },
  { k: "header compression", v: ["none", "yes", "yes"] },
  {
    k: "setup before you can ask",
    v: ["3 round trips", "2 round trips", "1, or 0 if you've been before"],
  },
  {
    k: "encryption",
    v: ["optional", "optional, but always used", "built in"],
  },
  { k: "survives wifi → mobile", v: ["no", "no", "yes"] },
  {
    k: "best on",
    v: [
      "patchy links, by accident",
      "fast, stable links",
      "patchy or mobile links",
    ],
  },
];

export function ProtocolCheatSheet() {
  return (
    <Panel label="side by side">
      <div className="-mx-1 overflow-x-auto px-1">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr>
              <th className="border-border font-code text-faint border-b pr-4 pb-2 text-xs font-normal lowercase">
                &nbsp;
              </th>
              {COLS.map((c) => (
                <th
                  key={c}
                  className="border-border font-code border-b pr-4 pb-2 text-xs font-normal text-gray-700 dark:text-gray-300"
                >
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ROWS.map((r) => (
              <tr key={r.k} className="align-top">
                <td className="border-border font-code text-faint border-b py-2.5 pr-4 text-xs whitespace-nowrap lowercase">
                  {r.k}
                </td>
                {r.v.map((cell, idx) => (
                  <td
                    key={idx}
                    className="border-border border-b py-2.5 pr-4 text-sm text-gray-700 dark:text-gray-300"
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Panel>
  );
}
