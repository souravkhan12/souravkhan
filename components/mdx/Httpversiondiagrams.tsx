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
      "One TCP connection per file, torn down after every response. A page with ten images paid ten handshakes.",
    wire: (
      <div className="font-code text-xs leading-6 text-gray-700 dark:text-gray-300">
        <div className="text-gray-400">→ request</div>
        <div>GET /index.html</div>
        <div className="mt-2 text-gray-400">← response</div>
        <div>&lt;html&gt;…&lt;/html&gt;</div>
        <div className="mt-2 text-gray-400">connection closed</div>
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
      "Still one connection per request by default. Headers made every request bigger, and you paid for them in full, every time.",
    wire: (
      <div className="font-code text-xs leading-6 text-gray-700 dark:text-gray-300">
        <div>GET /index.html HTTP/1.0</div>
        <div className="text-gray-400">User-Agent: …</div>
        <div className="mt-2">HTTP/1.0 200 OK</div>
        <div className="text-gray-400">Content-Type: text/html</div>
      </div>
    ),
  },
  {
    v: "1.1",
    year: "1997",
    headline: "Keep the connection. Still one lane.",
    added: [
      "persistent connections (keep-alive)",
      "chunked transfer encoding",
      "cache-control, ETag",
      "Host header → virtual hosting",
      "pipelining (in theory)",
    ],
    broke:
      "Head-of-line blocking. Responses must come back in request order, so one slow response stalls everything queued behind it. Browsers shipped with pipelining disabled.",
    wire: (
      <div className="font-code text-xs leading-6 text-gray-700 dark:text-gray-300">
        <div>GET /a.css HTTP/1.1</div>
        <div className="text-gray-400">Connection: keep-alive</div>
        <div className="mt-2 text-gray-400">…same socket…</div>
        <div>GET /b.js HTTP/1.1</div>
      </div>
    ),
  },
  {
    v: "2",
    year: "2015",
    headline: "Binary frames, one connection, many streams.",
    added: [
      "binary framing layer",
      "true multiplexing over one TCP connection",
      "HPACK header compression",
      "stream prioritisation",
      "server push",
    ],
    broke:
      "TCP head-of-line blocking. The application layer stopped queueing, but TCP still delivers one ordered byte stream — so a single lost packet stalls every stream on the connection.",
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
      "QUIC over UDP",
      "independent streams — loss is per-stream",
      "TLS 1.3 folded into the handshake (1-RTT, 0-RTT on resume)",
      "connection IDs → survives a network change",
      "QPACK header compression",
    ],
    broke:
      "Higher CPU cost per byte. Userspace ACKs and per-packet processing mean QUIC can lose to HTTP/2 on very fast links — the opposite of the problem it was built for.",
    wire: (
      <div className="font-code text-xs leading-6 text-gray-700 dark:text-gray-300">
        <div className="text-gray-400">UDP datagram</div>
        <div>QUIC packet · conn-id 0x9f2a</div>
        <div className="pl-4">stream 0 → HEADERS</div>
        <div className="pl-4">stream 4 → DATA</div>
        <div className="pl-4 text-gray-400">(lost — only stream 4 waits)</div>
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
                    now ? "text-blue" : "text-gray-400"
                  }`}
                >
                  HTTP/{e.v}
                </span>
                <span
                  className={`font-code block text-xs ${
                    now
                      ? "text-gray-900 dark:text-gray-100"
                      : "text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300"
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
                <li
                  key={a}
                  className="flex gap-2 text-sm text-gray-600 dark:text-gray-400"
                >
                  <span className="text-blue font-code">+</span>
                  {a}
                </li>
              ))}
            </ul>

            <div className="border-border border-l-amber mt-4 border-l-2 pl-3">
              <div className="font-code text-xs text-gray-400 lowercase">
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
            <div className="font-code mb-2 text-xs text-gray-400 lowercase">
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
            <span className="font-code mr-1 text-xs text-gray-400">
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
      "Six sockets, each handling one request at a time. Resources seven and eight wait for a socket to free up — that staircase is the connection limit, not bandwidth.",
    lossy:
      "A dropped packet only stalls the socket carrying it. The other five keep going. Crude, but the damage is contained.",
  },
  h2: {
    clean:
      "One connection, eight streams, all in flight at once. No staircase, no connection limit, and the header bytes are compressed away.",
    lossy:
      "Here's the catch. TCP hands the application one ordered byte stream, so a single lost packet holds up every stream behind it — including the seven that arrived perfectly. On a lossy link this can be slower than HTTP/1.1.",
  },
  h3: {
    clean:
      "Same multiplexing as HTTP/2, but the streams are QUIC's, not TCP's — and the handshake took one round trip instead of two.",
    lossy:
      "QUIC tracks each stream separately, so retransmission is scoped to the stream that lost data. Seven resources are unaffected. This is the entire reason HTTP/3 exists.",
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
      label="eight resources, one page load"
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
              : "border-border text-gray-500 hover:border-gray-400"
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
                className="font-code shrink-0 truncate text-xs text-gray-500"
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
                    title="waiting on retransmission"
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
          <span className="font-code text-xs text-gray-500 lowercase">
            transferring
          </span>
        </span>
        <span className="flex items-center gap-2">
          <span aria-hidden="true" className="bg-amber h-2.5 w-4" />
          <span className="font-code text-xs text-gray-500 lowercase">
            blocked, waiting on retransmit
          </span>
        </span>
        <span className="font-code ml-auto text-xs text-gray-400 lowercase">
          last byte at {worst} units
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
      { label: "TCP", rtt: 1, tone: "tcp" },
      { label: "TLS 1.2", rtt: 2, tone: "tls" },
      { label: "request", rtt: 1, tone: "req" },
    ],
  },
  {
    name: "HTTP/2 + TLS 1.3",
    note: "the common case today",
    legs: [
      { label: "TCP", rtt: 1, tone: "tcp" },
      { label: "TLS 1.3", rtt: 1, tone: "tls" },
      { label: "request", rtt: 1, tone: "req" },
    ],
  },
  {
    name: "HTTP/3 (QUIC)",
    note: "transport and crypto in one handshake",
    legs: [
      { label: "QUIC + TLS 1.3", rtt: 1, tone: "tcp" },
      { label: "request", rtt: 1, tone: "req" },
    ],
  },
  {
    name: "HTTP/3, 0-RTT resume",
    note: "returning visitor, replay risk applies",
    legs: [{ label: "request with data", rtt: 1, tone: "req" }],
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
      label="round trips before the first byte"
      footnote="On a 20ms link the difference is barely worth a paragraph. On a 200ms mobile link, HTTP/1.1 + TLS 1.2 spends 800ms on ceremony before the server has read your request, and HTTP/3 spends 200ms."
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
                <span className="font-code text-xs text-gray-400 lowercase">
                  {s.note}
                </span>
                <span className="font-code text-blue ml-auto text-xs">
                  {total} RTT
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
 * 4. ProtocolCheatSheet
 * ------------------------------------------------------------------ */

const COLS = ["HTTP/1.1", "HTTP/2", "HTTP/3"] as const;

const ROWS: { k: string; v: [string, string, string] }[] = [
  { k: "shipped", v: ["1997", "2015", "2022"] },
  { k: "transport", v: ["TCP", "TCP", "QUIC over UDP"] },
  { k: "format", v: ["plain text", "binary frames", "binary frames"] },
  {
    k: "concurrency",
    v: [
      "~6 connections",
      "one connection, N streams",
      "one connection, N streams",
    ],
  },
  {
    k: "head-of-line",
    v: ["at the application", "at TCP", "none across streams"],
  },
  { k: "header compression", v: ["none", "HPACK", "QPACK"] },
  { k: "handshake", v: ["2–3 RTT", "2 RTT", "1 RTT, 0 on resume"] },
  {
    k: "encryption",
    v: ["optional", "optional, TLS in practice", "always on"],
  },
  { k: "survives network change", v: ["no", "no", "yes, via connection ID"] },
  {
    k: "best on",
    v: ["lossy links, oddly", "fast, stable links", "lossy or mobile links"],
  },
];

export function ProtocolCheatSheet() {
  return (
    <Panel label="side by side">
      <div className="-mx-1 overflow-x-auto px-1">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr>
              <th className="border-border font-code border-b pr-4 pb-2 text-xs font-normal text-gray-400 lowercase">
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
                <td className="border-border font-code border-b py-2.5 pr-4 text-xs whitespace-nowrap text-gray-400 lowercase">
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
