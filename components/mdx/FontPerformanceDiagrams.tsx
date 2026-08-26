"use client";

/**
 * Diagrams for "Making web fonts fast".
 *
 * Four things the prose kept failing to do:
 *
 *  1. FontDisplayTimeline — font-display is a two-timer state machine (block
 *     period, then swap period) and every explanation of it is a table of five
 *     words. Moving the download time and watching which timer the font misses
 *     is the only way the values stop looking arbitrary.
 *  2. FontDiscoveryChain — "preload fonts" sounds like a priority tweak. It
 *     isn't: a font request sits at the end of a four-step chain and can't
 *     start until layout knows an element needs it. Drawn as a chain, the
 *     reason preload wins is obvious; in prose it reads like folklore.
 *  3. FallbackMatcher — layout shift has to be watched. This one is not a
 *     simulation: it injects a real @font-face with size-adjust and the
 *     override descriptors, and measures the two columns with
 *     getBoundingClientRect, so the numbers come from the reader's own browser.
 *  4. FontCheatSheet — the revision table.
 *
 * Byte and timing figures are sourced in the post. The lane timings in
 * FontDiscoveryChain are illustrative shapes, not measurements — the footnote
 * says so.
 */

import { useEffect, useRef, useState } from "react";
import { Panel, Chip, Tabs } from "./Panel";

/* ------------------------------------------------------------------ *
 * 1. FontDisplayTimeline
 * ------------------------------------------------------------------ */

type DisplayValue = "auto" | "block" | "swap" | "fallback" | "optional";

/**
 * Block and swap periods as Chrome, Firefox and Safari implement them. The
 * spec only *recommends* 3s for block; `auto` is defined as "whatever the
 * browser wants", and what all three want is block.
 */
const PERIODS: Record<
  DisplayValue,
  { block: number; swap: number; verdict: string }
> = {
  auto: {
    block: 3000,
    swap: Infinity,
    verdict:
      "The default, and the reason this post exists. Every major browser treats it as block: three seconds of nothing.",
  },
  block: {
    block: 3000,
    swap: Infinity,
    verdict:
      "Hides the text for three seconds rather than show the wrong glyphs. Correct for icon fonts, where the fallback is a stray letter.",
  },
  swap: {
    block: 0,
    swap: Infinity,
    verdict:
      "Text is readable from the first paint, in whatever font you listed next. The real font takes over whenever it lands, however late.",
  },
  fallback: {
    block: 100,
    swap: 3000,
    verdict:
      "A brief flicker, then the fallback — and if the font is more than three seconds late it is dropped for this page load entirely.",
  },
  optional: {
    block: 100,
    swap: 0,
    verdict:
      "One chance and no swap. Miss the 100ms window and the page keeps the fallback; the font is cached for the next navigation instead.",
  },
};

const WINDOW_MS = 4000;
const SHOTS = [80, 1500, 3600];

type Phase = "invisible" | "fallback" | "webfont";

function phaseAt(t: number, arrival: number, v: DisplayValue): Phase {
  const { block, swap } = PERIODS[v];
  if (t < block) return t >= arrival ? "webfont" : "invisible";
  if (t >= arrival && arrival < block + swap) return "webfont";
  return "fallback";
}

const PHASE_LABEL: Record<Phase, string> = {
  invisible: "nothing on screen",
  fallback: "fallback font",
  webfont: "your font",
};

const SAMPLE = "Reading is a kind of listening.";

function Sample({ phase }: { phase: Phase }) {
  return (
    <span
      className="text-sm text-gray-800 dark:text-gray-200"
      style={{
        fontFamily:
          phase === "webfont"
            ? "Georgia, 'Times New Roman', serif"
            : "Arial, Helvetica, sans-serif",
        letterSpacing: phase === "webfont" ? "0.01em" : "0",
        opacity: phase === "invisible" ? 0 : 1,
      }}
    >
      {SAMPLE}
    </span>
  );
}

export function FontDisplayTimeline() {
  const [value, setValue] = useState<DisplayValue>("auto");
  const [arrival, setArrival] = useState(1800);
  const { block, swap, verdict } = PERIODS[value];

  const pct = (ms: number) => `${(Math.min(ms, WINDOW_MS) / WINDOW_MS) * 100}%`;
  const swapEnd = Math.min(block + swap, WINDOW_MS);
  const missed = arrival >= block + swap;

  return (
    <Panel
      label="which timer does the font miss"
      footnote={
        <>
          Two timers, not five behaviours. The <strong>block period</strong>{" "}
          hides the text; the <strong>swap period</strong> is how long the real
          font is still allowed to replace the fallback. Every value of{" "}
          <code className="font-code">font-display</code> is just a different
          pair of numbers.
        </>
      }
    >
      <Tabs
        options={["auto", "block", "swap", "fallback", "optional"] as const}
        value={value}
        onChange={setValue}
      />

      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2">
        <label
          htmlFor="fd-arrival"
          className="font-code text-faint w-32 shrink-0 text-xs lowercase"
        >
          font arrives after
        </label>
        <input
          id="fd-arrival"
          type="range"
          min={100}
          max={4000}
          step={100}
          value={arrival}
          onChange={(e) => setArrival(Number(e.target.value))}
          className="accent-blue h-1 min-w-40 flex-1"
        />
        <span className="font-code w-20 shrink-0 text-right text-xs text-gray-700 dark:text-gray-300">
          {(arrival / 1000).toFixed(1)}s
        </span>
      </div>

      {/* the two periods, drawn to scale */}
      <div className="mt-5">
        <div className="border-border relative h-8 border bg-white dark:bg-gray-950">
          <div
            className="bg-amber/25 border-amber/40 absolute top-0 bottom-0 left-0 border-r"
            style={{ width: pct(block) }}
          />
          <div
            className="absolute top-0 bottom-0 border-r border-gray-300 bg-gray-100 dark:border-gray-700 dark:bg-gray-900"
            style={{ left: pct(block), width: pct(swapEnd - block) }}
          />
          <div
            className="bg-blue absolute top-0 bottom-0 w-0.5"
            style={{ left: pct(arrival) }}
          />
          <span
            className="font-code text-blue absolute -top-4 text-[0.6875rem] whitespace-nowrap"
            style={{
              left: pct(arrival),
              transform: arrival > 2600 ? "translateX(-100%)" : "none",
            }}
          >
            font arrives
          </span>
        </div>

        <div className="font-code text-faint mt-1.5 flex text-[0.6875rem]">
          <span style={{ width: pct(block) }}>
            {block === 0 ? "" : `block ${(block / 1000).toFixed(1)}s`}
          </span>
          <span>
            {swap === Infinity
              ? "swap period — never expires"
              : swap === 0
                ? "no swap period"
                : `swap ${(swap / 1000).toFixed(1)}s`}
          </span>
          <span className="ml-auto">{WINDOW_MS / 1000}s</span>
        </div>
      </div>

      {/* what the reader is looking at */}
      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        {SHOTS.map((t) => {
          const phase = phaseAt(t, arrival, value);
          return (
            <div
              key={t}
              className={`border bg-white p-3 dark:bg-gray-950 ${
                phase === "invisible" ? "border-amber/40" : "border-border"
              }`}
            >
              <div className="font-code text-faint mb-2 text-xs lowercase">
                at {(t / 1000).toFixed(1)}s
              </div>
              <div className="flex min-h-10 items-center">
                <Sample phase={phase} />
              </div>
              <div
                className={`font-code mt-2 text-[0.6875rem] lowercase ${
                  phase === "invisible"
                    ? "text-amber"
                    : phase === "webfont"
                      ? "text-blue"
                      : "text-faint"
                }`}
              >
                {PHASE_LABEL[phase]}
              </div>
            </div>
          );
        })}
      </div>

      <div
        className={`mt-4 border-l-2 py-1 pl-3 text-sm leading-relaxed text-gray-700 dark:text-gray-300 ${
          missed ? "border-l-amber" : "border-l-blue"
        }`}
      >
        {verdict}
        {missed && (
          <>
            {" "}
            <strong>
              At {(arrival / 1000).toFixed(1)}s the font misses the swap period
              — the reader never sees it on this page.
            </strong>
          </>
        )}
      </div>
    </Panel>
  );
}

/* ------------------------------------------------------------------ *
 * 2. FontDiscoveryChain
 * ------------------------------------------------------------------ */

type Step = {
  label: string;
  ms: number;
  tone: "parse" | "wait" | "font";
};

type Lane = {
  name: string;
  steps: Step[];
  /** ms at which readable text first appears on screen. */
  textAt: number;
  note: string;
  best?: boolean;
};

const CHAIN_LANES: Lane[] = [
  {
    name: "stylesheet in <head>",
    steps: [
      { label: "parse html", ms: 150, tone: "parse" },
      { label: "download css", ms: 500, tone: "wait" },
      { label: "build cssom + render tree", ms: 120, tone: "wait" },
      { label: "layout: this text needs MyFont", ms: 80, tone: "wait" },
      { label: "download font", ms: 600, tone: "font" },
    ],
    textAt: 850,
    note: "The font request is fifth in a chain. Nothing before it can be skipped, because until layout runs nobody knows the font is needed.",
  },
  {
    name: 'css deferred with media="print"',
    steps: [
      { label: "parse html", ms: 150, tone: "parse" },
      { label: "page paints in the fallback", ms: 40, tone: "parse" },
      { label: "css loads off the critical path", ms: 500, tone: "wait" },
      { label: "apply, lay out, discover font", ms: 200, tone: "wait" },
      { label: "download font", ms: 600, tone: "font" },
    ],
    textAt: 190,
    note: "Text appears almost immediately — but the font is now discovered even later than before. Good for the first paint, worse for the swap.",
  },
  {
    name: "same css, plus a preload tag",
    steps: [
      { label: "scanner finds the preload", ms: 30, tone: "parse" },
      {
        label: "download font, while the css downloads too",
        ms: 600,
        tone: "font",
      },
      { label: "cssom, render tree, layout", ms: 220, tone: "wait" },
    ],
    textAt: 850,
    note: "The preload names the file, so the download starts from the raw HTML — before the stylesheet exists, let alone layout. The font is already in memory when layout asks for it, so the reader never sees the fallback at all.",
    best: true,
  },
];

const CHAIN_TONE: Record<Step["tone"], string> = {
  parse: "bg-gray-200 border-gray-300 dark:bg-gray-800 dark:border-gray-700",
  wait: "bg-amber/25 border-amber/40",
  font: "bg-blue/25 border-blue/40",
};

const CHAIN_TOTAL = Math.max(
  ...CHAIN_LANES.map((l) => l.steps.reduce((a, s) => a + s.ms, 0)),
);

export function FontDiscoveryChain() {
  return (
    <Panel
      label="when does the font request actually start"
      footnote={
        <>
          Shapes, not measurements — the point is the order of events. A font is
          the only common resource the browser cannot find by reading your HTML,
          which is the whole reason{" "}
          <code className="font-code">rel=&quot;preload&quot;</code> exists for
          it.
        </>
      }
    >
      <div className="space-y-6">
        {CHAIN_LANES.map((lane) => {
          const total = lane.steps.reduce((a, s) => a + s.ms, 0);
          return (
            <div key={lane.name}>
              <div className="mb-1.5 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <code
                  className={`font-code text-xs ${
                    lane.best ? "text-blue" : "text-gray-700 dark:text-gray-300"
                  }`}
                >
                  {lane.name}
                </code>
                <span className="font-code text-faint ml-auto text-xs">
                  text readable · {(lane.textAt / 1000).toFixed(2)}s
                </span>
                <span
                  className={`font-code text-xs ${
                    lane.best ? "text-blue" : "text-gray-700 dark:text-gray-300"
                  }`}
                >
                  font applied · {(total / 1000).toFixed(2)}s
                </span>
              </div>

              {/* Time, drawn to scale. Labels sit underneath so nothing clips. */}
              <div className="border-border flex h-5 border bg-white dark:bg-gray-950">
                {lane.steps.map((s) => (
                  <div
                    key={s.label}
                    title={`${s.label} — ${s.ms}ms`}
                    className={`border-r last:border-r-0 ${CHAIN_TONE[s.tone]}`}
                    style={{ width: `${(s.ms / CHAIN_TOTAL) * 100}%` }}
                  />
                ))}
              </div>

              {/* The chain itself. This is the part that matters. */}
              <div className="font-code mt-2 flex flex-wrap items-center gap-x-1.5 gap-y-1 text-[0.6875rem]">
                {lane.steps.map((s, i) => (
                  <span key={s.label} className="flex items-center gap-1.5">
                    {i > 0 && <span className="text-faint">→</span>}
                    <span
                      className={
                        s.tone === "font"
                          ? "text-blue"
                          : s.tone === "wait"
                            ? "text-gray-700 dark:text-gray-300"
                            : "text-faint"
                      }
                    >
                      {s.label}
                    </span>
                  </span>
                ))}
              </div>

              <p className="text-faint mt-2 text-xs leading-relaxed">
                {lane.note}
              </p>
            </div>
          );
        })}
      </div>

      <div className="border-border mt-5 flex flex-wrap items-center gap-2 border-t pt-3.5">
        <Chip>blocked on something else</Chip>
        <Chip active>downloading the font</Chip>
      </div>
    </Panel>
  );
}

/* ------------------------------------------------------------------ *
 * 3. FallbackMatcher
 * ------------------------------------------------------------------ */

/**
 * Not a simulation. Both faces below are real @font-face rules with real
 * override descriptors, and the columns are measured with
 * getBoundingClientRect, so the numbers are whatever this browser did.
 *
 * Two details make it work on any machine:
 *
 *  - `FpWeb` stands in for the downloaded font. Its glyphs are borrowed from
 *    whichever serif is installed, but its vertical metrics are pinned by the
 *    override descriptors, so the line box is 1.33em everywhere.
 *  - `FpMatched` pins the same metrics onto a sans-serif. The overrides are
 *    divided by `size-adjust` because the browser applies them to the adjusted
 *    em — 101% × 1.04 = 105%, matching FpWeb. This is the arithmetic the
 *    framework tools do for you.
 *
 * The paragraphs use `line-height: normal` on purpose. A fixed multiplier is
 * computed from font-size, not from font metrics, and would hide the whole
 * effect.
 */
const MATCH_CSS = `
@font-face {
  font-family: "FpWeb";
  src: local("Georgia"), local("Liberation Serif"), local("DejaVu Serif"),
       local("Times New Roman"), local("Times");
  ascent-override: 105%;
  descent-override: 28%;
  line-gap-override: 0%;
}
@font-face {
  font-family: "FpMatched";
  src: local("Arial"), local("Liberation Sans"), local("Helvetica"),
       local("Roboto");
  size-adjust: 104%;
  ascent-override: 101%;
  descent-override: 26.9%;
  line-gap-override: 0%;
}
`;

const WEBFONT = "FpWeb, Georgia, serif";
const PLAIN_FALLBACK = "Arial, Helvetica, sans-serif";
const MATCHED_FALLBACK = "FpMatched, Arial, sans-serif";

/**
 * Four lines that never wrap. Wrapping would let the line *count* change
 * between fonts, and a whole extra line would drown the effect being shown,
 * which is the height of each individual line.
 */
const LINES = [
  "Line heights come from",
  "the font's own metrics.",
  "Change the font and every",
  "line changes height.",
];

/** Height of the text block in each of the two states, in px. */
type Meas = { off: number | null; on: number | null };

const EMPTY: Meas = { off: null, on: null };

function Column({
  title,
  stack,
  loaded,
  pRef,
  meas,
}: {
  title: string;
  stack: string;
  loaded: boolean;
  pRef: React.RefObject<HTMLParagraphElement | null>;
  meas: Meas;
}) {
  const height = loaded ? meas.on : meas.off;
  const shift =
    meas.on !== null && meas.off !== null && loaded ? meas.on - meas.off : 0;

  return (
    <div className="border-border border bg-white p-3 dark:bg-gray-950">
      <div className="font-code text-faint mb-2 text-xs lowercase">{title}</div>

      <p
        ref={pRef}
        className="overflow-hidden text-sm text-gray-800 dark:text-gray-200"
        style={{
          fontFamily: loaded ? WEBFONT : stack,
          // Metric-driven, not a fixed multiplier — see the note above.
          lineHeight: "normal",
        }}
      >
        {LINES.map((l) => (
          <span key={l} className="block whitespace-nowrap">
            {l}
          </span>
        ))}
      </p>

      {/* the rest of the page — this is what gets shoved about */}
      <div className="mt-3 space-y-1.5">
        <div className="h-2 w-full bg-gray-200 dark:bg-gray-800" />
        <div className="h-2 w-4/5 bg-gray-200 dark:bg-gray-800" />
      </div>

      <div className="border-border mt-3 flex items-baseline gap-2 border-t pt-2">
        <span className="font-code text-faint text-[0.6875rem] lowercase">
          text block
        </span>
        <span className="font-code text-xs text-gray-700 dark:text-gray-300">
          {height === null ? "—" : `${height}px`}
        </span>
        <span
          className={`font-code ml-auto text-xs ${
            !loaded ? "text-faint" : shift === 0 ? "text-blue" : "text-amber"
          }`}
        >
          {!loaded
            ? "baseline"
            : shift === 0
              ? "no shift"
              : `${shift > 0 ? "+" : ""}${shift}px`}
        </span>
      </div>
    </div>
  );
}

export function FallbackMatcher() {
  const [loaded, setLoaded] = useState(false);
  const [plain, setPlain] = useState<Meas>(EMPTY);
  const [matched, setMatched] = useState<Meas>(EMPTY);
  const plainRef = useRef<HTMLParagraphElement | null>(null);
  const matchedRef = useRef<HTMLParagraphElement | null>(null);

  useEffect(() => {
    const key = loaded ? "on" : "off";
    let live = true;

    const measure = () => {
      if (!live) return;
      const read = (el: HTMLElement | null) =>
        el ? Math.round(el.getBoundingClientRect().height) : null;
      const p = read(plainRef.current);
      const m = read(matchedRef.current);
      // Bail when nothing moved, otherwise this loops on its own state.
      if (p !== null)
        setPlain((prev) => (prev[key] === p ? prev : { ...prev, [key]: p }));
      if (m !== null)
        setMatched((prev) => (prev[key] === m ? prev : { ...prev, [key]: m }));
    };

    measure();
    // The matched fallback is itself a @font-face, so the first measurement can
    // land before the browser has resolved it. Take a second one after.
    document.fonts?.ready.then(measure);

    return () => {
      live = false;
    };
  }, [loaded]);

  return (
    <Panel
      label="the swap, with and without matched metrics"
      footnote={
        <>
          The numbers come from your own browser, so they depend on which fonts
          this machine has. The four descriptors are supported by Chrome,
          Firefox and Edge since version 92 and Safari since 17 — about 94% of
          users. Everyone else gets the plain fallback, which is exactly what
          they had before.
        </>
      }
    >
      <style>{MATCH_CSS}</style>

      <div className="flex flex-wrap items-center gap-3">
        <Tabs
          options={["loading", "loaded"] as const}
          value={loaded ? "loaded" : "loading"}
          onChange={(v) => setLoaded(v === "loaded")}
          labels={{
            loading: "font still downloading",
            loaded: "font swapped in",
          }}
        />
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <Column
          title="fallback: Arial"
          stack={PLAIN_FALLBACK}
          loaded={loaded}
          pRef={plainRef}
          meas={plain}
        />
        <Column
          title="fallback: Arial + metric overrides"
          stack={MATCHED_FALLBACK}
          loaded={loaded}
          pRef={matchedRef}
          meas={matched}
        />
      </div>

      <p className="mt-4 text-sm leading-relaxed text-gray-700 dark:text-gray-300">
        Both columns swap to the same font. The right-hand fallback already
        stands as tall as the font that is coming, so nothing moves when it
        arrives. The left one changes height — and everything below it on a real
        page moves by that many pixels, after the reader has started reading.
      </p>
    </Panel>
  );
}

/* ------------------------------------------------------------------ *
 * 4. FontCheatSheet
 * ------------------------------------------------------------------ */

type SheetRow = [string, string, string];

const SHEET: Record<"css" | "html", SheetRow[]> = {
  css: [
    [
      "font-display: swap",
      "No block period, endless swap period.",
      "Body text. The reader can read from the first paint.",
    ],
    [
      "font-display: block",
      "Three seconds of invisible text.",
      "Icon fonts only, where the fallback glyph is a stray letter.",
    ],
    [
      "font-display: optional",
      "100ms, then the fallback keeps the page for good.",
      "When zero layout shift matters more than the font.",
    ],
    [
      'format("woff2")',
      "Brotli plus font-specific preprocessing.",
      "Always, and on its own — around 95% support since 2016.",
    ],
    [
      "unicode-range",
      "Splits one family into subsets, downloaded on demand.",
      "Anything multilingual. Greek is never fetched for English text.",
    ],
    [
      "size-adjust / *-override",
      "Forces the fallback's metrics to match the real font.",
      "Every font you swap. It's what makes swap free of layout shift.",
    ],
    [
      "src: url(data:...)",
      "Inlines the font as base64 in your CSS.",
      "Almost never — 33% bigger, and it blocks the stylesheet.",
    ],
  ],
  html: [
    [
      'rel="preload" as="font" crossorigin',
      "Starts the download from the raw HTML.",
      "The one or two fonts visible without scrolling. crossorigin is not optional.",
    ],
    [
      'rel="preconnect"',
      "Opens the DNS, TCP and TLS connection early.",
      "Third-party font hosts only. Pointless for your own domain.",
    ],
    [
      'media="print" onload="this.media=\'all\'"',
      "Loads a stylesheet without blocking the first paint.",
      "CSS that isn't needed for the top of the page. Pair it with a <noscript> copy.",
    ],
    [
      "document.fonts.ready",
      "A promise that settles when font loading and layout are done.",
      "When JavaScript has to react to the swap — measuring or drawing to canvas.",
    ],
    [
      "new FontFace(...).load()",
      "Requests one font from script, on your terms.",
      "Fonts chosen at runtime, or loaded only after an interaction.",
    ],
    [
      "Font Face Observer",
      "The same events as a 1.3 KB library.",
      "Only if you still support browsers without the CSS Font Loading API.",
    ],
  ],
};

export function FontCheatSheet() {
  const [tab, setTab] = useState<"css" | "html">("css");

  return (
    <Panel
      label="the lines, and when each one earns its place"
      footnote={
        <>
          If you only take three: <code className="font-code">woff2</code> and
          nothing else, <code className="font-code">font-display: swap</code>{" "}
          with a metric-matched fallback, and{" "}
          <code className="font-code">preload</code> on the one font the reader
          sees first.
        </>
      }
    >
      <Tabs
        options={["css", "html"] as const}
        value={tab}
        onChange={setTab}
        labels={{ css: "in your css", html: "in your html" }}
      />

      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-152 border-collapse text-left">
          <thead>
            <tr className="border-border border-b">
              {["you write", "it does", "reach for it when"].map((h) => (
                <th
                  key={h}
                  className="font-code text-faint px-2 py-2 text-xs font-normal lowercase"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {SHEET[tab].map(([a, b, c]) => (
              <tr key={a} className="border-border border-b last:border-0">
                <td className="font-code text-blue px-2 py-2.5 align-top text-xs">
                  {a}
                </td>
                <td className="px-2 py-2.5 align-top text-xs text-gray-700 dark:text-gray-300">
                  {b}
                </td>
                <td className="text-faint px-2 py-2.5 align-top text-xs">
                  {c}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Panel>
  );
}
