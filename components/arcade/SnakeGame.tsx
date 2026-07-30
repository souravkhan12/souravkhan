"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Maximize2, X } from "lucide-react";
import { RemoveScroll } from "react-remove-scroll";
import { Section, GridBand, GridCell, DotGrid } from "@/components/ui";

const N = 15; // board is N×N
const SPEED = 200; // ms per tick
const SWIPE = 22; // px of travel before a swipe registers
const START = [
  { x: 7, y: 7 },
  { x: 6, y: 7 },
  { x: 5, y: 7 },
];

type Cell = { x: number; y: number };
type Status = "idle" | "running" | "over";
type Scheme = "swipe" | "pad";
const SCHEME_KEY = "snake-scheme";
type View = {
  snake: Cell[];
  apple: Cell;
  score: number;
  best: number;
  status: Status;
};
type Submit =
  | { state: "idle" }
  | { state: "saving" }
  | { state: "saved" }
  | { state: "error"; msg: string };

function randomApple(snake: Cell[]): Cell {
  while (true) {
    const c = {
      x: Math.floor(Math.random() * N),
      y: Math.floor(Math.random() * N),
    };
    if (!snake.some((s) => s.x === c.x && s.y === c.y)) return c;
  }
}

function buzz(ms: number) {
  if (typeof navigator !== "undefined" && "vibrate" in navigator) {
    navigator.vibrate?.(ms);
  }
}

export default function SnakeGame() {
  // Mutable game state lives in a ref (the loop mutates it every tick);
  // `view` is the snapshot React actually renders from.
  const game = useRef({
    snake: START,
    dir: { x: 1, y: 0 },
    pending: { x: 1, y: 0 },
    apple: { x: 11, y: 7 },
    score: 0,
    best: 0,
    status: "idle" as Status,
    submitted: false,
  });
  const boardRef = useRef<HTMLDivElement>(null);
  const touch = useRef<{ x: number; y: number } | null>(null);

  const [view, setView] = useState<View>({
    snake: START,
    apple: { x: 11, y: 7 },
    score: 0,
    best: 0,
    status: "idle",
  });
  const [record, setRecord] = useState<number | null>(null); // the score to beat
  const [plays, setPlays] = useState(0);
  const [beatRecord, setBeatRecord] = useState(false);
  const [submit, setSubmit] = useState<Submit>({ state: "idle" });
  // Touch control scheme. Swipe keeps the board tall and uncluttered; the pad
  // trades vertical space for buttons you can hit without covering the board.
  const [scheme, setScheme] = useState<Scheme>("swipe");
  const padRef = useRef<HTMLDivElement>(null);
  // Immersive mode: on a phone the board is nearly full-screen and the page
  // scrolls out from under you mid-run. `expanded` lifts the whole rig into a
  // fixed overlay so play is steady and there's nothing to scroll.
  const [expanded, setExpanded] = useState(false);

  const sync = useCallback(() => {
    const g = game.current;
    setView({
      snake: g.snake,
      apple: g.apple,
      score: g.score,
      best: g.best,
      status: g.status,
    });
  }, []);

  const loadRecord = useCallback(async () => {
    try {
      const r = await fetch("/api/scores", { cache: "no-store" });
      const d = await r.json();
      setRecord(Number(d.best) || 0);
      setPlays(Number(d.plays) || 0);
    } catch {
      setRecord(0);
    }
  }, []);

  const submitScore = useCallback(
    async (score: number) => {
      if (score <= 0) return;
      setSubmit({ state: "saving" });
      try {
        const r = await fetch("/api/scores", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ score }),
        });
        const d = await r.json();
        if (!r.ok) {
          setSubmit({ state: "error", msg: d.error ?? "couldn't save" });
          return;
        }
        setSubmit({ state: "saved" });
        loadRecord();
      } catch {
        setSubmit({ state: "error", msg: "network error" });
      }
    },
    [loadRecord],
  );

  // Latest-value boxes for things the interval closure needs to read.
  const live = useRef({ record: 0, submit: submitScore });
  useEffect(() => {
    live.current.record = record ?? 0;
    live.current.submit = submitScore;
  }, [record, submitScore]);

  // initial load: personal best (local) + the global number to beat (remote).
  // Both land in one async pass so nothing sets state synchronously on mount.
  useEffect(() => {
    let alive = true;
    const best = Number(localStorage.getItem("snake-best") || 0);
    game.current.best = best;
    (async () => {
      let data: { best?: number; plays?: number } = {};
      try {
        const r = await fetch("/api/scores", { cache: "no-store" });
        data = await r.json();
      } catch {
        /* offline — the board just shows 0 */
      }
      if (!alive) return;
      setView((v) => ({ ...v, best }));
      setRecord(Number(data.best) || 0);
      setPlays(Number(data.plays) || 0);
    })();
    return () => {
      alive = false;
    };
  }, []);

  // fixed-cadence game loop; reads/writes the ref so it never goes stale
  useEffect(() => {
    const id = setInterval(() => {
      const g = game.current;
      if (g.status !== "running") return;

      g.dir = g.pending;
      const head = { x: g.snake[0].x + g.dir.x, y: g.snake[0].y + g.dir.y };

      const hitWall = head.x < 0 || head.x >= N || head.y < 0 || head.y >= N;
      const hitSelf = g.snake.some((s) => s.x === head.x && s.y === head.y);
      if (hitWall || hitSelf) {
        g.status = "over";
        if (g.score > g.best) {
          g.best = g.score;
          localStorage.setItem("snake-best", String(g.best));
        }
        setBeatRecord(g.score > live.current.record);
        if (!g.submitted && g.score > 0) {
          g.submitted = true;
          live.current.submit(g.score);
        }
        buzz(40);
        sync();
        return;
      }

      const next = [head, ...g.snake];
      if (head.x === g.apple.x && head.y === g.apple.y) {
        g.score += 1;
        g.apple = randomApple(next);
        buzz(8);
      } else {
        next.pop();
      }
      g.snake = next;
      sync();
    }, SPEED);
    return () => clearInterval(id);
  }, [sync]);

  const start = useCallback(() => {
    const g = game.current;
    g.snake = START;
    g.dir = { x: 1, y: 0 };
    g.pending = { x: 1, y: 0 };
    g.apple = randomApple(START);
    g.score = 0;
    g.status = "running";
    g.submitted = false;
    setBeatRecord(false);
    setSubmit({ state: "idle" });
    sync();
    boardRef.current?.focus({ preventScroll: true });
    // On a phone the board is nearly full-screen and the page scrolls out from
    // under the run. Lift the whole rig into the immersive overlay instead of
    // chasing it with scrollIntoView.
    if (window.matchMedia("(max-width: 640px)").matches) {
      setExpanded(true);
    }
  }, [sync]);

  // Remember the control scheme between visits — re-picking the pad every
  // session is the kind of friction that makes people stop playing.
  // Read after paint, matching AccentPicker: the server can't know the stored
  // choice, so the default renders first and the saved one lands next frame.
  useEffect(() => {
    const id = requestAnimationFrame(() => {
      const saved = localStorage.getItem(SCHEME_KEY);
      if (saved === "pad" || saved === "swipe") setScheme(saved);
    });
    return () => cancelAnimationFrame(id);
  }, []);

  const pickScheme = useCallback((next: Scheme) => {
    setScheme(next);
    localStorage.setItem(SCHEME_KEY, next);
    buzz(5);
    // Expanding the pad pushes it below the fold; bring the whole rig — board
    // and buttons — back into frame after the layout settles.
    if (next === "pad") {
      requestAnimationFrame(() =>
        padRef.current?.scrollIntoView({ behavior: "smooth", block: "end" }),
      );
    }
  }, []);

  const steer = useCallback((x: number, y: number) => {
    const g = game.current;
    if (g.status !== "running") return;
    if (g.dir.x === -x && g.dir.y === -y) return; // ignore reversals
    if (g.pending.x === x && g.pending.y === y) return;
    g.pending = { x, y };
    buzz(5);
  }, []);

  // Steer from a window-level listener so clicking anywhere never loses
  // control (focus on the board is no longer required while playing).
  useEffect(() => {
    const map: Record<string, [number, number]> = {
      arrowup: [0, -1],
      w: [0, -1],
      arrowdown: [0, 1],
      s: [0, 1],
      arrowleft: [-1, 0],
      a: [-1, 0],
      arrowright: [1, 0],
      d: [1, 0],
    };
    const onKey = (e: KeyboardEvent) => {
      if (game.current.status !== "running") return;
      const m = map[e.key.toLowerCase()];
      if (!m) return;
      e.preventDefault();
      steer(m[0], m[1]);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [steer]);

  // Swipes are read while the finger is still moving (not on lift) so turns
  // land in the same tick you make them. Each registered swipe re-anchors the
  // origin, so one continuous drag can chain several turns.
  useEffect(() => {
    // In fullscreen the whole screen steers — the board is only a fraction of
    // it and reaching for it defeats the point. Otherwise, only the board does,
    // so the surrounding page still scrolls normally.
    const el: HTMLElement | Document | null = expanded
      ? document
      : boardRef.current;
    if (!el) return;

    const onStart = (e: TouchEvent) => {
      touch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };
    const onMove = (e: TouchEvent) => {
      if (game.current.status === "running") e.preventDefault();
      if (!touch.current) return;
      const t = e.touches[0];
      const dx = t.clientX - touch.current.x;
      const dy = t.clientY - touch.current.y;
      if (Math.abs(dx) < SWIPE && Math.abs(dy) < SWIPE) return;
      if (Math.abs(dx) > Math.abs(dy)) steer(dx > 0 ? 1 : -1, 0);
      else steer(0, dy > 0 ? 1 : -1);
      touch.current = { x: t.clientX, y: t.clientY };
    };
    const onEnd = () => {
      touch.current = null;
    };

    // passive:false so preventDefault actually stops the page scrolling
    el.addEventListener("touchstart", onStart as EventListener, {
      passive: false,
    });
    el.addEventListener("touchmove", onMove as EventListener, {
      passive: false,
    });
    el.addEventListener("touchend", onEnd);
    el.addEventListener("touchcancel", onEnd);
    return () => {
      el.removeEventListener("touchstart", onStart as EventListener);
      el.removeEventListener("touchmove", onMove as EventListener);
      el.removeEventListener("touchend", onEnd);
      el.removeEventListener("touchcancel", onEnd);
    };
  }, [steer, expanded]);

  const headKey = `${view.snake[0].x},${view.snake[0].y}`;
  const bodySet = new Set(view.snake.map((s) => `${s.x},${s.y}`));
  const target = record ?? 0;
  const running = view.status === "running";
  const leading = running && view.score > target;
  const toBeat = Math.max(target - view.best + 1, 0);

  return (
    <Section
      id="snake"
      title="snake"
      subtitle="one number to beat. no names, no sign-up — just snake."
    >
      <GridBand cols="grid-cols-1 lg:grid-cols-[1.3fr_1fr]">
        {/* board */}
        <GridCell className="flex flex-col items-center gap-4 sm:gap-5">
          <Rig expanded={expanded} onClose={() => setExpanded(false)}>
            <div className="font-code flex w-full max-w-[440px] items-center justify-between text-xs text-gray-500">
              <span className="flex items-baseline gap-2">
                score
                <span className="font-code text-foreground text-base tabular-nums">
                  {view.score}
                </span>
              </span>
              <span className="flex items-baseline gap-2">
                {running ? (
                  leading ? (
                    <span className="text-blue">
                      you&apos;re in the lead 🔥
                    </span>
                  ) : (
                    <>
                      to take the lead
                      <span className="font-code text-blue text-base tabular-nums">
                        {target - view.score + 1}
                      </span>
                    </>
                  )
                ) : (
                  <>
                    your best
                    <span className="font-code text-foreground text-base tabular-nums">
                      {view.best}
                    </span>
                  </>
                )}
              </span>
            </div>

            <div
              ref={boardRef}
              tabIndex={0}
              role="application"
              aria-label="Snake game board"
              // touch-action is only locked down while a game is actually in
              // play. Locking it always turned the board — nearly a full phone
              // screen — into a dead zone you couldn't scroll past.
              className={`border-border relative aspect-square w-full max-w-[440px] border outline-none select-none focus-visible:ring-1 focus-visible:ring-[var(--focus)] ${
                running ? "touch-none" : "touch-auto"
              }`}
            >
              <DotGrid />
              <div
                className="absolute inset-0 grid gap-px p-1"
                style={{ gridTemplateColumns: `repeat(${N}, 1fr)` }}
              >
                {Array.from({ length: N * N }).map((_, idx) => {
                  const x = idx % N;
                  const y = Math.floor(idx / N);
                  const key = `${x},${y}`;
                  const isHead = key === headKey;
                  const isBody = !isHead && bodySet.has(key);
                  const isApple = view.apple.x === x && view.apple.y === y;
                  return (
                    <div
                      key={idx}
                      className={
                        isHead
                          ? "bg-foreground rounded-[2px]"
                          : isBody
                            ? "bg-foreground/70 rounded-[1px]"
                            : isApple
                              ? "bg-blue animate-pulse rounded-full"
                              : ""
                      }
                    />
                  );
                })}
              </div>

              {!running && (
                // the whole board is the tap target — much kinder on touch than
                // hunting for a small button
                <button
                  type="button"
                  onClick={start}
                  aria-label={
                    view.status === "over" ? "play again" : "play snake"
                  }
                  className="bg-background/85 absolute inset-0 flex cursor-pointer flex-col items-center justify-center gap-3 px-6 text-center backdrop-blur-[1px]"
                >
                  <p className="font-code text-lg">
                    {view.status === "over"
                      ? `game over · ${view.score}`
                      : "snake"}
                  </p>

                  {view.status === "over" && (
                    <p className="font-code text-[11px] text-gray-500">
                      {submit.state === "saving" && "saving…"}
                      {submit.state === "saved" &&
                        (beatRecord ? "new high score 🏆" : "score counted ✓")}
                      {submit.state === "error" && submit.msg}
                      {submit.state === "idle" &&
                        view.score === 0 &&
                        "no points — give it another go"}
                    </p>
                  )}

                  {view.status !== "over" && target > 0 && (
                    <p className="font-code text-[11px] text-gray-500">
                      high score to beat ·{" "}
                      <span className="font-code text-blue">{target}</span>
                    </p>
                  )}

                  <span className="border-border bg-background pointer-events-none inline-flex h-11 items-center border px-6 text-sm">
                    {view.status === "over" ? "play again" : "play"}
                  </span>

                  <p className="font-code flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-[11px] text-gray-500">
                    <span className="hidden sm:inline">arrow keys / wasd</span>
                    <span className="border-blue/40 text-blue bg-blue/5 border px-1.5 py-0.5">
                      📱 on mobile · swipe or tap the d-pad
                    </span>
                  </p>
                </button>
              )}
            </div>

            {/* touch controls — scheme picker, then the pad it opens */}
            <div
              ref={padRef}
              className="flex w-full flex-col items-center gap-3 sm:hidden"
            >
              <div
                role="group"
                aria-label="touch controls"
                className="border-border font-code flex w-full max-w-[260px] border text-xs"
              >
                <SchemeTab
                  label="swipe"
                  active={scheme === "swipe"}
                  onPick={() => pickScheme("swipe")}
                />
                <SchemeTab
                  label="d-pad"
                  active={scheme === "pad"}
                  onPick={() => pickScheme("pad")}
                />
              </div>

              {scheme === "swipe" ? (
                <p className="font-code text-[11px] text-gray-500">
                  drag anywhere on the board to steer
                </p>
              ) : (
                // Taller keys than the board-side buttons: with the pad chosen we
                // have the vertical room, and bigger targets mean fewer misfires.
                <div className="grid w-full max-w-[300px] grid-cols-3 gap-2 pb-2">
                  <span />
                  <DPad label="up" onPress={() => steer(0, -1)} char="↑" />
                  <span />
                  <DPad label="left" onPress={() => steer(-1, 0)} char="←" />
                  <DPad label="down" onPress={() => steer(0, 1)} char="↓" />
                  <DPad label="right" onPress={() => steer(1, 0)} char="→" />
                </div>
              )}

              {!expanded && (
                <button
                  type="button"
                  onClick={() => setExpanded(true)}
                  className="border-border hover:border-blue hover:text-blue font-code mt-1 inline-flex items-center gap-1.5 border px-3 py-1.5 text-[11px] text-gray-500 transition-colors"
                >
                  <Maximize2 size={13} />
                  fullscreen
                </button>
              )}
            </div>
          </Rig>
        </GridCell>

        {/* the number to beat — this is where the name leaderboard used to be */}
        <GridCell tinted className="flex flex-col justify-between gap-8">
          <div>
            <h3 className="ss01 normal-case-force text-base font-bold">
              high score
            </h3>
            <p className="font-code mt-1 text-[11px] text-gray-500">
              global · anonymous
            </p>

            {record === null ? (
              <p className="mt-6 text-sm text-gray-500">loading…</p>
            ) : record === 0 ? (
              <>
                <p className="font-code text-blue mt-6 text-6xl leading-none tabular-nums">
                  0
                </p>
                <p className="mt-4 text-sm text-gray-500">
                  nobody has scored yet — set the first one 🐍
                </p>
              </>
            ) : (
              <>
                <p className="font-code text-blue mt-6 text-6xl leading-none tabular-nums sm:text-7xl">
                  {record}
                </p>
                <p className="mt-4 text-sm text-gray-500">
                  {view.best > record
                    ? "that one's yours. hold the line."
                    : view.best > 0
                      ? `your best is ${view.best} — ${toBeat} more to take it.`
                      : "no leaderboard, no names. just this number."}
                </p>
              </>
            )}
          </div>

          <div className="border-border grid grid-cols-2 gap-px border-t pt-5">
            <Stat label="your best" value={view.best} />
            <Stat label="runs played" value={plays} />
          </div>

          <div className="font-code flex flex-col gap-1.5 text-[11px] text-gray-500">
            <span className="hidden sm:inline">
              arrow keys or wasd to steer
            </span>
            <span className="border-blue/40 text-blue bg-blue/5 w-fit border px-1.5 py-0.5">
              📱 on mobile · swipe the board or tap the d-pad
            </span>
            <span>every apple is a point · walls and tails end it</span>
          </div>
        </GridCell>
      </GridBand>
    </Section>
  );
}

/**
 * Immersive wrapper for the board rig. Off (the default, and always on desktop)
 * it's transparent — the score / board / controls stay in their grid cell. On,
 * it lifts the exact same subtree (refs intact — it's never duplicated) into a
 * fixed, scroll-locked overlay so a phone run can't be scrolled out of frame.
 */
function Rig({
  expanded,
  onClose,
  children,
}: {
  expanded: boolean;
  onClose: () => void;
  children: React.ReactNode;
}) {
  if (!expanded) return <>{children}</>;

  return (
    <RemoveScroll>
      <div
        className="bg-background fixed inset-0 z-50 flex flex-col items-center justify-center gap-4 px-4"
        style={{
          paddingTop: "calc(env(safe-area-inset-top) + 3.25rem)",
          paddingBottom: "calc(env(safe-area-inset-bottom) + 1rem)",
        }}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="exit fullscreen"
          className="border-border hover:border-blue hover:text-blue font-code absolute right-4 flex items-center gap-1.5 border px-3 py-1.5 text-xs text-gray-500 transition-colors"
          style={{ top: "calc(env(safe-area-inset-top) + 0.75rem)" }}
        >
          <X size={14} />
          close
        </button>
        {children}
      </div>
    </RemoveScroll>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="font-code text-2xl leading-none tabular-nums">
        {value}
      </span>
      <span className="font-code text-[11px] text-gray-500">{label}</span>
    </div>
  );
}

function DPad({
  label,
  char,
  onPress,
}: {
  label: string;
  char: string;
  onPress: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      // pointerdown fires on touch-down, so turns feel instant instead of
      // waiting out the browser's click resolution
      onPointerDown={(e) => {
        e.preventDefault();
        onPress();
      }}
      onContextMenu={(e) => e.preventDefault()}
      className="border-border hover:border-blue hover:text-blue active:border-blue active:bg-blue/10 active:text-blue flex h-20 w-full touch-manipulation items-center justify-center border text-2xl transition-colors select-none"
    >
      {char}
    </button>
  );
}

function SchemeTab({
  label,
  active,
  onPick,
}: {
  label: string;
  active: boolean;
  onPick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onPick}
      aria-pressed={active}
      className={`flex-1 touch-manipulation px-3 py-2 transition-colors ${
        active ? "bg-blue/10 text-blue" : "text-gray-500"
      }`}
    >
      {label}
    </button>
  );
}
