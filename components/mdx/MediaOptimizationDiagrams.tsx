"use client";

/**
 * Diagrams for "Making images and video fast".
 *
 * Five things prose kept failing to do:
 *
 *  1. FormatLadder   — "AVIF is smaller" is a number nobody feels. Bars drawn
 *                      to scale, per content type, make the gap physical — and
 *                      show the cases where the newest format is not the pick.
 *  2. ResponsivePicker — the srcset/sizes rule is a two-variable calculation
 *                      (viewport × pixel ratio) resolved before layout exists.
 *                      Static code can't show the browser getting it wrong;
 *                      dragging a slider with `sizes` removed can.
 *  3. LoadingRace    — lazy-loading the hero is a *timing* bug. A still image
 *                      makes the three strategies look equivalent; racing them
 *                      shows where the extra half-second actually goes.
 *  4. PlaceholderPreview — layout shift has to be watched to be understood.
 *                      The text getting shoved down the page is the lesson.
 *  5. MediaCheatSheet — the revision table. The row people screenshot.
 *
 * Byte figures are sourced in the post. Timings in LoadingRace are
 * illustrative shapes, not measurements — the footnote says so.
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { LuPlay, LuRotateCcw } from "react-icons/lu";
import { Panel, Chip, Tabs } from "./Panel";

const fmtKb = (kb: number) =>
  kb >= 1000 ? `${(kb / 1000).toFixed(1)} MB` : `${kb} KB`;

/* ------------------------------------------------------------------ *
 * 1. FormatLadder
 * ------------------------------------------------------------------ */

type Kind = "photo" | "screenshot" | "logo" | "animation";

type Row = { name: string; kb: number; pick?: boolean; note: string };

const LADDER: Record<
  Kind,
  { rows: Row[]; verdict: React.ReactNode; subject: string }
> = {
  photo: {
    subject: "2000 × 2000 product shot",
    rows: [
      {
        name: "AVIF",
        kb: 210,
        pick: true,
        note: "smallest, slowest to encode",
      },
      { name: "WebP", kb: 350, note: "safe everywhere since 2020" },
      { name: "JPEG", kb: 540, note: "the fallback, at quality 80" },
      { name: "PNG", kb: 2100, note: "never, for photographs" },
    ],
    verdict: (
      <>
        Photographs are what the new formats are tuned for. AVIF first, WebP
        second, JPEG as the fallback.
      </>
    ),
  },
  screenshot: {
    subject: "flat UI screenshot with text",
    rows: [
      { name: "AVIF", kb: 140, pick: true, note: "keeps edges sharp" },
      { name: "WebP lossless", kb: 180, note: "good, and much simpler" },
      { name: "PNG", kb: 320, note: "the honest baseline" },
      { name: "JPEG", kb: 240, note: "smears text — don't" },
    ],
    verdict: (
      <>
        Flat colour and text is the case where JPEG loses even when it&apos;s
        smaller. Fuzz around letters is far more visible than fuzz in a photo.
      </>
    ),
  },
  logo: {
    subject: "a logo, drawn at any size",
    rows: [
      { name: "SVG", kb: 4, pick: true, note: "shapes, not pixels" },
      { name: "AVIF", kb: 16, note: "one size only" },
      { name: "WebP", kb: 18, note: "one size only" },
      { name: "PNG", kb: 28, note: "one size only" },
    ],
    verdict: (
      <>
        The whole format ladder is the wrong ladder here. SVG stores the shapes,
        so it&apos;s sharp on every screen and needs no `srcset` at all.
      </>
    ),
  },
  animation: {
    subject: "a 5-second loop",
    rows: [
      { name: "WebM video", kb: 341, pick: true, note: "91% off the GIF" },
      { name: "MP4 video", kb: 551, note: "the fallback" },
      { name: "Animated WebP", kb: 700, note: "if it must be an <img>" },
      { name: "GIF", kb: 3700, note: "256 colours, 3.7 MB" },
    ],
    verdict: (
      <>
        A GIF is a stack of images with no video compression at all. Every frame
        pays full price. Swapping it for a muted, looping{" "}
        <code className="font-code">&lt;video&gt;</code> is the single largest
        win on this page.
      </>
    ),
  },
};

const KIND_LABEL: Record<Kind, string> = {
  photo: "photo",
  screenshot: "ui screenshot",
  logo: "logo / icon",
  animation: "animation",
};

const KINDS = ["photo", "screenshot", "logo", "animation"] as const;

export function FormatLadder() {
  const [kind, setKind] = useState<Kind>("photo");
  const { rows, verdict, subject } = LADDER[kind];
  const max = Math.max(...rows.map((r) => r.kb));

  return (
    <Panel
      label="same picture, four formats"
      footnote={
        <>
          There is no single best format — there is a best format{" "}
          <em>for this kind of content</em>. That&apos;s the whole reason{" "}
          <code className="font-code">&lt;picture&gt;</code> lets you list
          several and let the browser choose.
        </>
      }
    >
      <Tabs
        options={KINDS}
        value={kind}
        onChange={setKind}
        labels={KIND_LABEL}
      />

      <div className="font-code text-faint mt-4 mb-3 text-xs lowercase">
        {subject}
      </div>

      <div className="space-y-2.5">
        {rows.map((r) => (
          <div key={r.name} className="flex items-center gap-3">
            <div
              className={`font-code w-28 shrink-0 text-xs ${
                r.pick ? "text-blue" : "text-gray-600 dark:text-gray-400"
              }`}
            >
              {r.name}
            </div>

            <div className="border-border h-6 min-w-0 flex-1 border bg-white dark:bg-gray-950">
              <div
                className={`ml-flow h-full ${r.pick ? "bg-blue/25" : "bg-gray-200 dark:bg-gray-800"}`}
                style={{ width: `${Math.max(2, (r.kb / max) * 100)}%` }}
              />
            </div>

            <div className="w-20 shrink-0 text-right">
              <span
                className={`font-code text-xs ${
                  r.pick ? "text-blue" : "text-gray-700 dark:text-gray-300"
                }`}
              >
                {fmtKb(r.kb)}
              </span>
            </div>

            <div className="text-faint hidden w-44 shrink-0 text-xs sm:block">
              {r.note}
            </div>
          </div>
        ))}
      </div>

      <p className="mt-4 text-sm leading-relaxed text-gray-700 dark:text-gray-300">
        {verdict}
      </p>

      <style>{`
        .ml-flow { transition: width 0.4s ease-out; }
        @media (prefers-reduced-motion: reduce) { .ml-flow { transition: none; } }
      `}</style>
    </Panel>
  );
}

/* ------------------------------------------------------------------ *
 * 2. ResponsivePicker
 * ------------------------------------------------------------------ */

const CANDIDATES = [
  { w: 400, kb: 32 },
  { w: 800, kb: 98 },
  { w: 1200, kb: 190 },
  { w: 1600, kb: 310 },
];

/** The layout the demo describes: one column on phones, three from 900px up. */
function displayWidth(vw: number) {
  return vw >= 900 ? Math.round(vw * 0.31) : vw - 32;
}

function pick(neededPx: number) {
  return CANDIDATES.find((c) => c.w >= neededPx) ?? CANDIDATES[3];
}

export function ResponsivePicker() {
  const [vw, setVw] = useState(1280);
  const [dpr, setDpr] = useState<1 | 2 | 3>(2);
  const [hasSizes, setHasSizes] = useState(true);

  const css = displayWidth(vw);
  // Without `sizes` the browser has no layout yet, so it assumes the image
  // fills the viewport. That single default is the whole bug.
  const assumed = hasSizes ? css : vw;
  const chosen = pick(assumed * dpr);
  const ideal = pick(css * dpr);
  const waste = chosen.kb - ideal.kb;

  const cols = vw >= 900 ? 3 : 1;

  return (
    <Panel
      label="which file does the browser actually download"
      footnote={
        <>
          <code className="font-code">srcset</code> lists what exists.{" "}
          <code className="font-code">sizes</code> tells the browser how wide
          the image will be on screen. Leave{" "}
          <code className="font-code">sizes</code> out and it assumes the full
          width of the window — so it downloads the biggest file on the smallest
          phone.
        </>
      }
    >
      {/* controls */}
      <div className="space-y-3.5">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <label
            htmlFor="rp-vw"
            className="font-code text-faint w-28 shrink-0 text-xs lowercase"
          >
            window width
          </label>
          <input
            id="rp-vw"
            type="range"
            min={320}
            max={1600}
            step={20}
            value={vw}
            onChange={(e) => setVw(Number(e.target.value))}
            className="accent-blue h-1 min-w-40 flex-1"
          />
          <span className="font-code w-20 shrink-0 text-right text-xs text-gray-700 dark:text-gray-300">
            {vw}px
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <span className="font-code text-faint w-28 shrink-0 text-xs lowercase">
            screen density
          </span>
          <Tabs
            options={["1", "2", "3"] as const}
            value={String(dpr) as "1" | "2" | "3"}
            onChange={(v) => setDpr(Number(v) as 1 | 2 | 3)}
            labels={{
              "1": "1x  desktop",
              "2": "2x  retina",
              "3": "3x  phone",
            }}
          />
        </div>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <span className="font-code text-faint w-28 shrink-0 text-xs lowercase">
            sizes attribute
          </span>
          <Tabs
            options={["on", "off"] as const}
            value={hasSizes ? "on" : "off"}
            onChange={(v) => setHasSizes(v === "on")}
            labels={{
              on: 'sizes="(min-width:900px) 31vw, 100vw"',
              off: "sizes missing",
            }}
          />
        </div>
      </div>

      {/* the page, drawn to scale */}
      <div className="border-border mt-5 border bg-white p-3 dark:bg-gray-950">
        <div className="font-code text-faint mb-2 text-xs lowercase">
          the page at {vw}px — the image is one card in the grid
        </div>
        <div
          className="rp-vp border-border mx-auto flex gap-1.5 border-x border-dashed p-1.5"
          style={{ width: `${(vw / 1600) * 100}%` }}
        >
          {Array.from({ length: cols }).map((_, i) => (
            <div
              key={i}
              className={`h-10 flex-1 ${
                i === 0
                  ? "bg-blue/25 border-blue/40 border"
                  : "border-border border bg-gray-100 dark:bg-gray-900"
              }`}
            />
          ))}
        </div>
      </div>

      {/* the maths */}
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div className="border-border border bg-white p-3 dark:bg-gray-950">
          <div className="font-code text-faint mb-2 text-xs lowercase">
            what the browser works out
          </div>
          <dl className="font-code space-y-1 text-xs">
            <Calc k="width on screen" v={`${css}px`} />
            <Calc
              k="width it assumes"
              v={`${assumed}px`}
              warn={!hasSizes}
              hint={hasSizes ? undefined : "no sizes → 100vw"}
            />
            <Calc k="× screen density" v={`${dpr}×`} />
            <Calc k="pixels needed" v={`${assumed * dpr}px`} strong />
          </dl>
        </div>

        <div className="border-border border bg-white p-3 dark:bg-gray-950">
          <div className="font-code text-faint mb-2 text-xs lowercase">
            candidates in srcset
          </div>
          <div className="space-y-1">
            {CANDIDATES.map((c) => {
              const on = c.w === chosen.w;
              return (
                <div
                  key={c.w}
                  className={`font-code flex items-center gap-2 border px-2 py-1 text-xs transition-colors ${
                    on
                      ? waste > 0
                        ? "border-amber/50 bg-amber/10 text-gray-800 dark:text-gray-200"
                        : "border-blue/40 bg-blue/5 text-blue"
                      : "border-transparent text-gray-500 dark:text-gray-500"
                  }`}
                >
                  <span className="flex-1">hero-{c.w}.avif</span>
                  <span>{c.w}w</span>
                  <span className="w-14 text-right">{fmtKb(c.kb)}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div
        className={`mt-3 border-l-2 py-1 pl-3 text-sm leading-relaxed ${
          waste > 0
            ? "border-l-amber text-gray-700 dark:text-gray-300"
            : "border-l-blue text-gray-700 dark:text-gray-300"
        }`}
      >
        {waste > 0 ? (
          <>
            Downloads <strong>{fmtKb(chosen.kb)}</strong> to fill a {css}px slot
            that only needed <strong>{fmtKb(ideal.kb)}</strong>. That&apos;s{" "}
            <strong>{fmtKb(waste)}</strong> thrown away, every visit.
          </>
        ) : (
          <>
            Downloads <strong>{fmtKb(chosen.kb)}</strong> — the smallest file
            that still covers {css}px at {dpr}×. Nothing wasted.
          </>
        )}
      </div>

      <style>{`
        .rp-vp { transition: width 0.25s ease-out; }
        @media (prefers-reduced-motion: reduce) { .rp-vp { transition: none; } }
      `}</style>
    </Panel>
  );
}

function Calc({
  k,
  v,
  strong,
  warn,
  hint,
}: {
  k: string;
  v: string;
  strong?: boolean;
  warn?: boolean;
  hint?: string;
}) {
  return (
    <div className="flex items-baseline gap-2">
      <dt className="text-faint flex-1 lowercase">{k}</dt>
      {hint && <dd className="text-amber text-[0.6875rem]">{hint}</dd>}
      <dd
        className={
          warn
            ? "text-amber"
            : strong
              ? "text-blue"
              : "text-gray-700 dark:text-gray-300"
        }
      >
        {v}
      </dd>
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * 3. LoadingRace
 * ------------------------------------------------------------------ */

type Seg = { label: string; ms: number; tone: "wait" | "find" | "load" };

type Lane = {
  code: string;
  segs: Seg[];
  verdict: string;
  best?: boolean;
};

const LANES: Lane[] = [
  {
    code: 'loading="lazy"',
    segs: [
      { label: "html", ms: 200, tone: "find" },
      { label: "wait for css + layout", ms: 620, tone: "wait" },
      { label: "download", ms: 900, tone: "load" },
    ],
    verdict:
      "Lazy images are only requested once the browser knows where they land — and that needs CSS and layout first.",
  },
  {
    code: "no attribute",
    segs: [
      { label: "html", ms: 200, tone: "find" },
      { label: "queued behind css + js", ms: 260, tone: "wait" },
      { label: "download", ms: 900, tone: "load" },
    ],
    verdict:
      "The scanner that runs ahead of the parser spots the tag early, but the request still queues behind higher-priority files.",
  },
  {
    code: 'fetchpriority="high"',
    segs: [
      { label: "html", ms: 90, tone: "find" },
      { label: "download", ms: 900, tone: "load" },
    ],
    verdict:
      "Told explicitly that this one matters, the browser starts it before the stylesheet finishes.",
    best: true,
  },
];

const TONE: Record<Seg["tone"], string> = {
  wait: "bg-amber/25 border-amber/40",
  find: "bg-gray-200 border-gray-300 dark:bg-gray-800 dark:border-gray-700",
  load: "bg-blue/25 border-blue/40",
};

const TOTAL = Math.max(
  ...LANES.map((l) => l.segs.reduce((a, s) => a + s.ms, 0)),
);
const RUN_MS = 2400;

export function LoadingRace() {
  const [t, setT] = useState(0); // 0 → 1
  const [running, setRunning] = useState(false);
  const started = useRef(false);
  const host = useRef<HTMLDivElement | null>(null);

  const start = useCallback(() => {
    setT(0);
    setRunning(true);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const el = host.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (e) => {
        if (e[0]?.isIntersecting && !started.current) {
          started.current = true;
          start();
          obs.disconnect();
        }
      },
      { threshold: 0.35 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [start]);

  useEffect(() => {
    if (!running) return;
    // Reduced motion still gets the finished picture — it just skips straight
    // to it. Read here rather than in the effect body so no setState fires
    // synchronously on mount.
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    let raf = 0;
    const t0 = performance.now();
    const tick = (now: number) => {
      const p = reduce ? 1 : Math.min(1, (now - t0) / RUN_MS);
      setT(p);
      if (p < 1) raf = requestAnimationFrame(tick);
      else setRunning(false);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [running]);

  const clock = t * TOTAL;

  return (
    <div ref={host}>
      <Panel
        label="the same hero image, three strategies"
        footnote={
          <>
            Shapes, not measurements — the point is the order of events, not the
            exact milliseconds. Only mark an image{" "}
            <code className="font-code">lazy</code> if the reader has to scroll
            to reach it.
          </>
        }
      >
        <div className="space-y-4">
          {LANES.map((lane) => {
            const total = lane.segs.reduce((a, s) => a + s.ms, 0);
            const done = clock >= total;
            let acc = 0;
            return (
              <div key={lane.code}>
                <div className="mb-1.5 flex items-baseline gap-2">
                  <code
                    className={`font-code text-xs ${
                      lane.best
                        ? "text-blue"
                        : "text-gray-700 dark:text-gray-300"
                    }`}
                  >
                    {lane.code}
                  </code>
                  <span
                    className={`font-code ml-auto text-xs transition-opacity ${
                      done ? "text-blue opacity-100" : "opacity-0"
                    }`}
                  >
                    image shown · {(total / 1000).toFixed(2)}s
                  </span>
                </div>

                <div className="border-border relative h-7 border bg-white dark:bg-gray-950">
                  {lane.segs.map((s) => {
                    const left = acc;
                    acc += s.ms;
                    const visible = Math.max(0, Math.min(s.ms, clock - left));
                    return (
                      <div
                        key={s.label}
                        className={`absolute top-0 bottom-0 overflow-hidden border-r ${TONE[s.tone]}`}
                        style={{
                          left: `${(left / TOTAL) * 100}%`,
                          width: `${(visible / TOTAL) * 100}%`,
                        }}
                      >
                        <span className="font-code absolute top-1/2 left-1.5 -translate-y-1/2 text-[0.6875rem] whitespace-nowrap text-gray-700 dark:text-gray-300">
                          {s.label}
                        </span>
                      </div>
                    );
                  })}

                  {/* finish flag */}
                  <div
                    className={`bg-blue absolute top-0 bottom-0 w-0.5 transition-opacity ${
                      done ? "opacity-100" : "opacity-0"
                    }`}
                    style={{ left: `${(total / TOTAL) * 100}%` }}
                  />
                </div>

                <p className="text-faint mt-1.5 text-xs leading-relaxed">
                  {lane.verdict}
                </p>
              </div>
            );
          })}
        </div>

        <div className="border-border mt-5 flex items-center gap-3 border-t pt-3.5">
          <button
            type="button"
            onClick={start}
            className="border-border hover:border-blue hover:text-blue flex items-center gap-1.5 border px-2.5 py-1.5 text-gray-600 transition-colors dark:text-gray-400"
          >
            {t >= 1 ? <LuRotateCcw size={15} /> : <LuPlay size={15} />}
            <span className="font-code text-xs lowercase">
              {t >= 1 ? "replay" : "play"}
            </span>
          </button>

          <div className="ml-auto flex flex-wrap items-center gap-2">
            <Chip>waiting</Chip>
            <Chip active>downloading</Chip>
          </div>
        </div>
      </Panel>
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * 4. PlaceholderPreview
 * ------------------------------------------------------------------ */

type Ph = "none" | "colour" | "blur";

const PH_LABEL: Record<Ph, string> = {
  none: "no width / height",
  colour: "solid colour",
  blur: "blur-up",
};

const PHOTO = "linear-gradient(135deg,#5d8cd7 0%,#7c7cf0 38%,#ffcf3f 100%)";

/**
 * The image slot, remounted on every reload so the download replays from the
 * start. Only the "no dimensions" case has nothing holding the space open, so
 * it's the only one where the text below gets shoved down when the image lands.
 */
function ImageSlot({ ph }: { ph: Ph }) {
  const [loaded, setLoaded] = useState(false);
  const reserves = ph !== "none";

  useEffect(() => {
    const id = setTimeout(() => setLoaded(true), 1300);
    return () => clearTimeout(id);
  }, []);

  return (
    <div
      className="ph-slot relative w-full overflow-hidden"
      style={{
        // The reserved box is 16:9. Without dimensions there is no box at all
        // until the bytes land.
        paddingTop: reserves || loaded ? "56.25%" : "0%",
      }}
    >
      <div
        className="absolute inset-0"
        style={{
          background:
            ph === "colour" ? "#5d8cd7" : ph === "blur" ? PHOTO : "transparent",
          filter: ph === "blur" ? "blur(14px)" : undefined,
          transform: ph === "blur" ? "scale(1.1)" : undefined,
        }}
      />
      <div
        className="ph-real absolute inset-0"
        style={{ background: PHOTO, opacity: loaded ? 1 : 0 }}
      />
    </div>
  );
}

export function PlaceholderPreview() {
  const [ph, setPh] = useState<Ph>("none");
  const [run, setRun] = useState(0);

  const shift = ph === "none" ? "0.31" : "0.00";

  return (
    <Panel
      label="what the reader looks at while the image downloads"
      footnote={
        <>
          <code className="font-code">width</code> and{" "}
          <code className="font-code">height</code> are not decoration — they
          are how the browser reserves the right-shaped hole before a single
          byte of the image arrives.
        </>
      }
    >
      <div className="flex flex-wrap items-center gap-3">
        <Tabs
          options={["none", "colour", "blur"] as const}
          value={ph}
          onChange={setPh}
          labels={PH_LABEL}
        />
        <button
          type="button"
          onClick={() => setRun((r) => r + 1)}
          className="border-border hover:border-blue hover:text-blue ml-auto flex items-center gap-1.5 border px-2.5 py-1.5 text-gray-600 transition-colors dark:text-gray-400"
        >
          <LuRotateCcw size={15} />
          <span className="font-code text-xs lowercase">reload</span>
        </button>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-[minmax(0,1fr)_11rem]">
        {/* the article */}
        <div className="border-border border bg-white p-3 dark:bg-gray-950">
          <div className="mb-2 h-2 w-2/5 bg-gray-300 dark:bg-gray-700" />

          <ImageSlot key={`${ph}-${run}`} ph={ph} />

          <div className="mt-2 space-y-1.5">
            <div className="h-2 w-full bg-gray-200 dark:bg-gray-800" />
            <div className="h-2 w-11/12 bg-gray-200 dark:bg-gray-800" />
            <div className="h-2 w-3/4 bg-gray-200 dark:bg-gray-800" />
          </div>
        </div>

        {/* readout */}
        <div className="border-border flex flex-col justify-center border bg-white p-3 dark:bg-gray-950">
          <div className="font-code text-faint text-xs lowercase">
            layout shift
          </div>
          <div
            className={`font-code mt-1 text-2xl ${
              ph === "none" ? "text-amber" : "text-blue"
            }`}
          >
            {shift}
          </div>
          <p className="text-faint mt-2 text-xs leading-relaxed">
            {ph === "none"
              ? "The image has no reserved box, so the text below jumps down the moment it arrives."
              : ph === "colour"
                ? "One averaged colour. Costs nothing — it's a hex code in your HTML."
                : "A 20px-wide copy of the image, blurred up. Roughly 300 bytes, and it hints at the real picture."}
          </p>
        </div>
      </div>

      <style>{`
        .ph-slot { transition: padding-top 0.35s ease-out; }
        .ph-real { transition: opacity 0.45s ease-out; }
        @media (prefers-reduced-motion: reduce) {
          .ph-slot, .ph-real { transition: none; }
        }
      `}</style>
    </Panel>
  );
}

/* ------------------------------------------------------------------ *
 * 5. MediaCheatSheet
 * ------------------------------------------------------------------ */

type SheetRow = [string, string, string];

const SHEET: Record<"images" | "video", SheetRow[]> = {
  images: [
    [
      "<picture> + <source type>",
      "Offers AVIF, then WebP, then the old format.",
      "Any photo. The browser takes the first one it understands.",
    ],
    [
      'srcset="a.jpg 800w"',
      "Lists the sizes that exist.",
      "The image is fluid — it grows and shrinks with the layout.",
    ],
    [
      'sizes="(min-width:900px) 31vw, 100vw"',
      "Tells the browser how wide the image will be.",
      "Always, whenever you use w descriptors. Missing = 100vw.",
    ],
    [
      'srcset="a.jpg 2x"',
      "Picks by screen density only.",
      "Fixed-size things: avatars, icons, logos.",
    ],
    [
      "width + height",
      "Reserves the box before the bytes arrive.",
      "Every single image. Stops the page jumping.",
    ],
    [
      'loading="lazy"',
      "Doesn't request it until it's near the screen.",
      "Below the fold only. Never the hero.",
    ],
    [
      'fetchpriority="high"',
      "Jumps the download queue.",
      "The one big image at the top. One per page.",
    ],
    [
      'decoding="async"',
      "Decodes off the main thread.",
      "Long lists of images, where decoding stutters the scroll.",
    ],
  ],
  video: [
    [
      "<source> order",
      "First playable wins — WebM before MP4.",
      "Always. MP4 stays last as the fallback.",
    ],
    [
      "poster",
      "A still image shown before playback.",
      "Always. It's the only thing on screen until video data arrives.",
    ],
    [
      'preload="none"',
      "Downloads nothing until the user hits play.",
      "Anything the reader might scroll past.",
    ],
    [
      'preload="metadata"',
      "Grabs length and dimensions only.",
      "The sensible default for a video the reader came to watch.",
    ],
    [
      "muted + playsinline + loop",
      "The three attributes autoplay needs to be allowed.",
      "Background and decorative video. Autoplay is blocked without them.",
    ],
    [
      "no audio track (-an)",
      "Strips a stream nobody will hear.",
      "Every muted background video. Free bytes.",
    ],
    [
      "<source media=...>",
      "A different file per screen size.",
      "When the phone crop shouldn't just be a shrunken desktop crop.",
    ],
    [
      "HLS / DASH",
      "Serves a few seconds at a time, switching quality as needed.",
      "Anything past ~30 seconds. One fixed file can't adapt.",
    ],
  ],
};

export function MediaCheatSheet() {
  const [tab, setTab] = useState<"images" | "video">("images");

  return (
    <Panel
      label="the attributes, and when each one earns its place"
      footnote={
        <>
          If you only take three: <code className="font-code">width</code> +{" "}
          <code className="font-code">height</code> on everything,{" "}
          <code className="font-code">loading=&quot;lazy&quot;</code> on nothing
          above the fold, and{" "}
          <code className="font-code">preload=&quot;none&quot;</code> on video.
        </>
      }
    >
      <Tabs
        options={["images", "video"] as const}
        value={tab}
        onChange={setTab}
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
