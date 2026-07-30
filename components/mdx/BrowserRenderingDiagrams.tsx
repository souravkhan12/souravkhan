"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  LuChevronLeft,
  LuChevronRight,
  LuPause,
  LuPlay,
  LuRotateCcw,
} from "react-icons/lu";

/* ------------------------------------------------------------------ *
 * Shared shell
 *
 * Matches the site's section-header treatment: squared border, gray-50 /
 * black band, thin blue accent bar, lowercase font-code label. `not-prose`
 * keeps the typography plugin from restyling anything inside.
 * ------------------------------------------------------------------ */

function Panel({
  label,
  children,
  footnote,
}: {
  label: string;
  children: React.ReactNode;
  footnote?: React.ReactNode;
}) {
  return (
    <figure className="not-prose blog-breakout border-border my-10 border bg-gray-50 dark:bg-black">
      <figcaption className="border-border flex items-center gap-3 border-b px-4 py-2.5 sm:px-5">
        <span aria-hidden="true" className="bg-blue h-3.5 w-[3px]" />
        <span className="font-code text-xs text-gray-500 lowercase">
          {label}
        </span>
      </figcaption>

      <div className="px-4 py-5 sm:px-5">{children}</div>

      {footnote && (
        <div className="border-border border-t px-4 py-3 text-sm leading-relaxed text-gray-600 sm:px-5 dark:text-gray-400">
          {footnote}
        </div>
      )}
    </figure>
  );
}

function Chip({
  children,
  active,
}: {
  children: React.ReactNode;
  active?: boolean;
}) {
  return (
    <span
      className={`font-code border px-2 py-1 text-xs transition-colors ${
        active
          ? "border-blue/40 bg-blue/5 text-blue"
          : "border-border bg-white text-gray-600 dark:bg-gray-950 dark:text-gray-400"
      }`}
    >
      {children}
    </span>
  );
}

/* ------------------------------------------------------------------ *
 * 1. RenderingPipeline
 *
 * A guided walkthrough rather than a one-shot animation. Each step shows
 * what the data *actually looks like* at that moment, next to one plain
 * sentence explaining it. Autoplays once (unless reduced motion), then
 * the reader can scrub back and forth.
 * ------------------------------------------------------------------ */

const SNIPPET_BYTES = [
  "3c",
  "68",
  "31",
  "3e",
  "48",
  "69",
  "3c",
  "2f",
  "68",
  "31",
  "3e",
];
const SNIPPET_CHARS = ["<", "h", "1", ">", "H", "i", "<", "/", "h", "1", ">"];

type Step = {
  n: string;
  label: string;
  plain: string;
  visual: React.ReactNode;
};

function TreeLine({
  depth,
  children,
  muted,
  struck,
}: {
  depth: number;
  children: React.ReactNode;
  muted?: boolean;
  struck?: boolean;
}) {
  return (
    <div
      className={`font-code text-xs leading-6 ${
        muted
          ? "text-gray-400 dark:text-gray-600"
          : "text-gray-700 dark:text-gray-300"
      } ${struck ? "line-through" : ""}`}
      style={{ paddingLeft: depth * 16 }}
    >
      {depth > 0 && (
        <span className="text-gray-300 dark:text-gray-700">└─ </span>
      )}
      {children}
    </div>
  );
}

const steps: Step[] = [
  {
    n: "01",
    label: "bytes",
    plain:
      "Your file arrives from the network as raw bytes. At this point it isn't text — it's just numbers.",
    visual: (
      <div className="flex flex-wrap gap-1.5">
        {SNIPPET_BYTES.map((b, i) => (
          <Chip key={i}>{b}</Chip>
        ))}
      </div>
    ),
  },
  {
    n: "02",
    label: "characters",
    plain:
      "The browser reads the file's encoding (usually UTF-8) and decodes those bytes into characters you'd recognise.",
    visual: (
      <div className="flex flex-wrap gap-1.5">
        {SNIPPET_CHARS.map((c, i) => (
          <Chip key={i} active>
            {c === " " ? "␣" : c}
          </Chip>
        ))}
      </div>
    ),
  },
  {
    n: "03",
    label: "tokens",
    plain:
      "The parser groups those characters into tokens. Now the browser knows an <h1> opened, some text followed, and the tag closed — instead of seeing 11 loose characters.",
    visual: (
      <div className="flex flex-wrap gap-1.5">
        <Chip active>StartTag: h1</Chip>
        <Chip active>Text: &quot;Hi&quot;</Chip>
        <Chip active>EndTag: h1</Chip>
      </div>
    ),
  },
  {
    n: "04",
    label: "nodes",
    plain:
      "Each token becomes a node: a real object with properties. A node knows what kind of element it is, but not yet where it sits in the page.",
    visual: (
      <div className="flex flex-wrap gap-2">
        {[
          { t: "Element", d: "tagName: h1" },
          { t: "Text", d: 'data: "Hi"' },
        ].map((n) => (
          <div
            key={n.t}
            className="border-border bg-white px-2.5 py-2 dark:bg-gray-950"
          >
            <div className="font-code text-blue text-xs">{n.t}</div>
            <div className="font-code mt-0.5 text-xs text-gray-500">{n.d}</div>
          </div>
        ))}
      </div>
    ),
  },
  {
    n: "05",
    label: "the DOM",
    plain:
      "Nodes get linked into a tree — parents, children, siblings. That tree is the DOM, and it's the first thing the browser can actually work with.",
    visual: (
      <div>
        <TreeLine depth={0}>html</TreeLine>
        <TreeLine depth={1}>head</TreeLine>
        <TreeLine depth={1}>body</TreeLine>
        <TreeLine depth={2}>h1 → &quot;Hi&quot;</TreeLine>
        <TreeLine depth={2}>p.note</TreeLine>
      </div>
    ),
  },
  {
    n: "06",
    label: "the CSSOM",
    plain:
      "Your CSS goes through those exact same five steps, on its own track, and ends up as a second tree: the CSSOM. It holds the computed styles for every element.",
    visual: (
      <div>
        <TreeLine depth={0}>body</TreeLine>
        <TreeLine depth={1}>font-size: 16px</TreeLine>
        <TreeLine depth={1}>h1</TreeLine>
        <TreeLine depth={2}>font-size: 2rem</TreeLine>
        <TreeLine depth={1}>p.note</TreeLine>
        <TreeLine depth={2}>display: none</TreeLine>
      </div>
    ),
  },
  {
    n: "07",
    label: "render tree",
    plain:
      "The two trees combine into the render tree: every visible node, carrying its styles. Note that p.note is gone — display: none means it has no box to draw, so it's skipped entirely.",
    visual: (
      <div>
        <TreeLine depth={0}>html</TreeLine>
        <TreeLine depth={1}>body · 16px</TreeLine>
        <TreeLine depth={2}>h1 · 2rem → &quot;Hi&quot;</TreeLine>
        <TreeLine depth={2} muted struck>
          p.note
        </TreeLine>
        <p className="font-code mt-2 text-xs text-gray-400">
          in the DOM, not in the render tree
        </p>
      </div>
    ),
  },
  {
    n: "08",
    label: "layout",
    plain:
      "Layout works out the exact size and position of every box in the viewport. Still nothing on screen — this is pure measurement.",
    visual: (
      <div className="border-border relative border border-dashed p-3">
        <div className="border-blue/40 bg-blue/5 relative border px-3 py-4">
          <span className="font-code text-blue text-xs">h1</span>
          <span className="font-code absolute -top-2 right-2 bg-gray-50 px-1 text-xs text-gray-400 dark:bg-black">
            640 × 38
          </span>
        </div>
        <span className="font-code mt-2 block text-xs text-gray-400">
          x: 0 · y: 0
        </span>
      </div>
    ),
  },
  {
    n: "09",
    label: "paint",
    plain:
      "Only now does the browser fill in pixels — text, colours, borders, images. This is the first moment the reader sees anything.",
    visual: (
      <div className="border-border border bg-white p-4 dark:bg-gray-950">
        <div className="text-xl font-bold text-gray-900 dark:text-gray-100">
          Hi
        </div>
        <div className="mt-2 h-1.5 w-24 bg-gray-200 dark:bg-gray-800" />
        <div className="mt-1.5 h-1.5 w-16 bg-gray-200 dark:bg-gray-800" />
      </div>
    ),
  },
];

export function RenderingPipeline() {
  const [i, setI] = useState(0);
  const [playing, setPlaying] = useState(false);
  const startedRef = useRef(false);

  // Autoplay once when it first scrolls into view, so the reader doesn't
  // arrive to find the animation already finished above the fold.
  const hostRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (
      typeof window === "undefined" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }
    const el = hostRef.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && !startedRef.current) {
          startedRef.current = true;
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
    if (i >= steps.length - 1) {
      setPlaying(false);
      return;
    }
    const id = setTimeout(() => setI((v) => v + 1), 2600);
    return () => clearTimeout(id);
  }, [playing, i]);

  const go = useCallback((next: number) => {
    setPlaying(false);
    setI(Math.max(0, Math.min(steps.length - 1, next)));
  }, []);

  const step = steps[i];
  const atEnd = i === steps.length - 1;

  return (
    <div ref={hostRef}>
      <Panel label="bytes → pixels · step through it">
        {/* Progress rail — doubles as navigation */}
        <div className="-mx-1 mb-5 flex gap-1 overflow-x-auto px-1 pb-1">
          {steps.map((s, idx) => {
            const done = idx < i;
            const now = idx === i;
            return (
              <button
                key={s.n}
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
                style={{ minWidth: 78 }}
              >
                <span
                  className={`font-code block text-xs ${
                    now ? "text-blue" : "text-gray-400"
                  }`}
                >
                  {s.n}
                </span>
                <span
                  className={`font-code block truncate text-xs lowercase ${
                    now
                      ? "text-gray-900 dark:text-gray-100"
                      : "text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300"
                  }`}
                >
                  {s.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Stage */}
        <div className="grid gap-5 sm:grid-cols-[1fr_1.1fr] sm:gap-6">
          <div>
            <h4 className="font-code text-blue text-xs lowercase">
              {step.n} · {step.label}
            </h4>
            <p className="mt-2 text-sm leading-relaxed text-gray-700 dark:text-gray-300">
              {step.plain}
            </p>
          </div>

          <div
            key={step.n}
            className="rp-stage border-border border bg-white p-3.5 dark:bg-gray-950/60"
          >
            {step.visual}
          </div>
        </div>

        {/* Controls */}
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
              {i + 1} / {steps.length}
            </span>
            <button
              type="button"
              onClick={() => go(i - 1)}
              disabled={i === 0}
              className="border-border hover:border-blue hover:text-blue border p-1.5 text-gray-600 transition-colors disabled:pointer-events-none disabled:opacity-30 dark:text-gray-400"
              aria-label="Previous step"
            >
              <LuChevronLeft size={16} />
            </button>
            <button
              type="button"
              onClick={() => go(i + 1)}
              disabled={atEnd}
              className="border-border hover:border-blue hover:text-blue border p-1.5 text-gray-600 transition-colors disabled:pointer-events-none disabled:opacity-30 dark:text-gray-400"
              aria-label="Next step"
            >
              <LuChevronRight size={16} />
            </button>
          </div>
        </div>

        <style>{`
          .rp-stage { animation: rpFadeSlide 0.35s ease-out; }
          @keyframes rpFadeSlide {
            from { opacity: 0; transform: translateY(4px); }
            to   { opacity: 1; transform: translateY(0); }
          }
          @media (prefers-reduced-motion: reduce) {
            .rp-stage { animation: none; }
          }
        `}</style>
      </Panel>
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * 2. ScriptBlockingPlayground
 *
 * Same timeline idea as before, but restyled to the site, with a plain
 * summary of what each attribute actually changes.
 * ------------------------------------------------------------------ */

type Mode = "blocking" | "async" | "defer";

const TIMELINES: Record<
  Mode,
  {
    tag: string;
    parse: [number, number][];
    fetch: [number, number];
    exec: [number, number];
    dcl: number;
    pauses: string;
    order: string;
    runsAt: string;
    verdict: string;
  }
> = {
  blocking: {
    tag: "<script src>",
    parse: [
      [0, 30],
      [65, 100],
    ],
    fetch: [30, 55],
    exec: [55, 65],
    dcl: 100,
    pauses: "yes — immediately",
    order: "document order",
    runsAt: "the moment it's fetched",
    verdict:
      "The parser hits the tag and stops dead: it waits for the whole network round trip, runs the script, and only then carries on building the DOM.",
  },
  async: {
    tag: "<script src async>",
    parse: [
      [0, 40],
      [50, 100],
    ],
    fetch: [10, 40],
    exec: [40, 50],
    dcl: 100,
    pauses: "yes — but only to run",
    order: "whichever downloads first",
    runsAt: "as soon as it's ready",
    verdict:
      "Downloading no longer blocks parsing, but execution still interrupts it the instant the file lands — and two async scripts can run in either order.",
  },
  defer: {
    tag: "<script src defer>",
    parse: [[0, 100]],
    fetch: [10, 40],
    exec: [100, 112],
    dcl: 112,
    pauses: "no",
    order: "document order",
    runsAt: "after the DOM is complete",
    verdict:
      "Downloads alongside parsing and runs only once the DOM is finished, in order. This is the safe default for scripts that touch the page.",
  },
};

const SPAN = 112;
const LABEL_W = 136;

export function ScriptBlockingPlayground() {
  const [mode, setMode] = useState<Mode>("blocking");
  const t = TIMELINES[mode];

  const lanes: { label: string; segs: [number, number][]; cls: string }[] = [
    {
      label: "html parsing",
      segs: t.parse,
      cls: "bg-blue",
    },
    {
      label: "script fetch",
      segs: [t.fetch],
      cls: "bg-gray-300 dark:bg-gray-700",
    },
    {
      label: "script running",
      segs: [t.exec],
      cls: "bg-amber",
    },
  ];

  return (
    <Panel label="script placement · what actually blocks" footnote={t.verdict}>
      {/* Mode switch */}
      <div className="mb-5 flex flex-wrap gap-1.5">
        {(Object.keys(TIMELINES) as Mode[]).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => setMode(m)}
            className={`font-code border px-2.5 py-1.5 text-xs transition-colors ${
              mode === m
                ? "border-blue bg-blue/5 text-blue"
                : "border-border text-gray-500 hover:border-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
            }`}
          >
            {TIMELINES[m].tag}
          </button>
        ))}
      </div>

      {/* Lanes */}
      <div className="relative">
        {lanes.map((lane) => (
          <div key={lane.label} className="mb-2.5 flex items-center gap-3">
            <span
              className="font-code shrink-0 text-xs text-gray-500 lowercase"
              style={{ width: LABEL_W }}
            >
              {lane.label}
            </span>
            <div className="border-border relative h-5 flex-1 border bg-white dark:bg-gray-950">
              {lane.segs.map(([s, e], idx) => (
                <div
                  key={idx}
                  className={`absolute inset-y-0 transition-all duration-500 ease-out ${lane.cls}`}
                  style={{
                    left: `${(s / SPAN) * 100}%`,
                    width: `${((e - s) / SPAN) * 100}%`,
                  }}
                />
              ))}
            </div>
          </div>
        ))}

        {/* DOMContentLoaded marker */}
        <div
          className="pointer-events-none absolute top-0 bottom-0 transition-all duration-500 ease-out"
          style={{
            left: `calc(${LABEL_W}px + 12px + (100% - ${LABEL_W}px - 12px) * ${
              t.dcl / SPAN
            })`,
          }}
        >
          <div className="h-full w-px bg-gray-400 dark:bg-gray-600" />
        </div>
      </div>

      <div className="mt-1 flex justify-end">
        <span className="font-code text-xs text-gray-400 lowercase">
          ↑ DOMContentLoaded
        </span>
      </div>

      {/* Plain-language summary */}
      <dl className="border-border mt-4 grid gap-x-6 gap-y-2.5 border-t pt-4 sm:grid-cols-3">
        {[
          ["pauses the parser?", t.pauses],
          ["runs in what order?", t.order],
          ["runs when?", t.runsAt],
        ].map(([k, v]) => (
          <div key={k}>
            <dt className="font-code text-xs text-gray-400 lowercase">{k}</dt>
            <dd className="mt-0.5 text-sm text-gray-700 dark:text-gray-300">
              {v}
            </dd>
          </div>
        ))}
      </dl>
    </Panel>
  );
}

/* ------------------------------------------------------------------ *
 * 3. BlockingCheatSheet
 *
 * The one-glance summary. Readers who skim the post should still leave
 * knowing which resources hold up the first paint.
 * ------------------------------------------------------------------ */

const ROWS: {
  resource: string;
  blocks: string;
  blocking: boolean;
  fix: string;
}[] = [
  {
    resource: "html",
    blocks: "everything — no DOM, no page",
    blocking: true,
    fix: "send the above-the-fold markup first",
  },
  {
    resource: "css in <head>",
    blocks: "the first paint, until the CSSOM is built",
    blocking: true,
    fix: "inline critical CSS, media-query the rest",
  },
  {
    resource: "<script>",
    blocks: "DOM construction, at the tag's position",
    blocking: true,
    fix: "add defer, or move it below the markup",
  },
  {
    resource: "<script defer>",
    blocks: "nothing",
    blocking: false,
    fix: "already the safe choice",
  },
  {
    resource: "images",
    blocks: "nothing — they paint in late",
    blocking: false,
    fix: "reserve the box so layout doesn't shift",
  },
];

export function BlockingCheatSheet() {
  return (
    <Panel label="does it block the first paint?">
      <div className="-mx-1 overflow-x-auto px-1">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr>
              {["resource", "", "what it holds up", "what to do"].map(
                (h, i) => (
                  <th
                    key={i}
                    className="border-border font-code border-b pr-4 pb-2 text-xs font-normal text-gray-400 lowercase"
                  >
                    {h}
                  </th>
                ),
              )}
            </tr>
          </thead>
          <tbody>
            {ROWS.map((r) => (
              <tr key={r.resource} className="align-top">
                <td className="border-border font-code border-b py-2.5 pr-4 text-xs whitespace-nowrap text-gray-800 dark:text-gray-200">
                  {r.resource}
                </td>
                <td className="border-border border-b py-2.5 pr-4">
                  <span
                    className={`font-code border px-1.5 py-0.5 text-xs whitespace-nowrap lowercase ${
                      r.blocking
                        ? "border-amber/50 bg-amber/10 text-gray-800 dark:text-gray-200"
                        : "border-border text-gray-400"
                    }`}
                  >
                    {r.blocking ? "blocks" : "free"}
                  </span>
                </td>
                <td className="border-border border-b py-2.5 pr-4 text-sm text-gray-600 dark:text-gray-400">
                  {r.blocks}
                </td>
                <td className="border-border border-b py-2.5 text-sm text-gray-600 dark:text-gray-400">
                  {r.fix}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Panel>
  );
}

/* ------------------------------------------------------------------ *
 * 4. RenderTreeMerge
 *
 * The DOM + CSSOM -> render tree step, shown side by side, with a live
 * toggle for display: none so the reader can watch a node drop out of
 * the render tree while staying in the DOM.
 * ------------------------------------------------------------------ */

export function RenderTreeMerge() {
  const [hidden, setHidden] = useState(true);

  const Col = ({
    title,
    sub,
    children,
  }: {
    title: string;
    sub: string;
    children: React.ReactNode;
  }) => (
    <div className="border-border border bg-white p-3.5 dark:bg-gray-950/60">
      <div className="font-code text-blue text-xs lowercase">{title}</div>
      <div className="font-code mt-0.5 text-xs text-gray-400 lowercase">
        {sub}
      </div>
      <div className="mt-3">{children}</div>
    </div>
  );

  return (
    <Panel
      label="dom + cssom = render tree"
      footnote={
        hidden
          ? "p.note is still in the DOM — you can read it, query it, change it from JavaScript. It just has no box, so the render tree skips it and paint never draws it."
          : "With the rule off, p.note gets a box and appears in the render tree. Toggle it back to watch it drop out again."
      }
    >
      <div className="grid gap-3 md:grid-cols-3">
        <Col title="dom" sub="what's on the page">
          <TreeLine depth={0}>body</TreeLine>
          <TreeLine depth={1}>h1</TreeLine>
          <TreeLine depth={1}>p.note</TreeLine>
          <TreeLine depth={1}>footer</TreeLine>
        </Col>

        <Col title="cssom" sub="how it should look">
          <TreeLine depth={0}>body · 18px</TreeLine>
          <TreeLine depth={1}>h1 · 2rem</TreeLine>
          <TreeLine depth={1} muted={!hidden}>
            p.note · {hidden ? "display: none" : "display: block"}
          </TreeLine>
          <TreeLine depth={1}>footer · 14px</TreeLine>
        </Col>

        <Col title="render tree" sub="what actually gets drawn">
          <TreeLine depth={0}>body · 18px</TreeLine>
          <TreeLine depth={1}>h1 · 2rem</TreeLine>
          <TreeLine depth={1} muted={hidden} struck={hidden}>
            p.note{hidden ? "" : " · display: block"}
          </TreeLine>
          <TreeLine depth={1}>footer · 14px</TreeLine>
        </Col>
      </div>

      <button
        type="button"
        onClick={() => setHidden((v) => !v)}
        aria-pressed={hidden}
        className={`font-code mt-4 border px-2.5 py-1.5 text-xs lowercase transition-colors ${
          hidden
            ? "border-blue bg-blue/5 text-blue"
            : "border-border text-gray-500 hover:border-gray-400"
        }`}
      >
        p.note &#123; display: none &#125; · {hidden ? "on" : "off"}
      </button>
    </Panel>
  );
}
