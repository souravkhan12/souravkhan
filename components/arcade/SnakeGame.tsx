"use client";

import { useCallback, useEffect, useReducer, useRef, useState } from "react";
import { Section, GridBand, GridCell, DotGrid, Button } from "@/components/ui";

const N = 15; // board is N×N
const SPEED = 165; // ms per tick
const START = [
  { x: 7, y: 7 },
  { x: 6, y: 7 },
  { x: 5, y: 7 },
];

type Cell = { x: number; y: number };
type Status = "idle" | "running" | "over";
type Score = { name: string; score: number };
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

export default function SnakeGame() {
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
  const [, render] = useReducer((n) => n + 1, 0);

  const [name, setName] = useState("");
  const [board, setBoard] = useState<Score[]>([]);
  const [boardLoaded, setBoardLoaded] = useState(false);
  const [submit, setSubmit] = useState<Submit>({ state: "idle" });

  const nameRef = useRef("");
  nameRef.current = name;

  const loadBoard = useCallback(async () => {
    try {
      const r = await fetch("/api/scores", { cache: "no-store" });
      const d = await r.json();
      setBoard(d.scores ?? []);
    } catch {
      setBoard([]);
    } finally {
      setBoardLoaded(true);
    }
  }, []);

  const submitScore = useCallback(
    async (player: string, score: number) => {
      if (!player || score <= 0) return;
      setSubmit({ state: "saving" });
      try {
        const r = await fetch("/api/scores", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: player, score }),
        });
        const d = await r.json();
        if (!r.ok) {
          setSubmit({ state: "error", msg: d.error ?? "couldn't save" });
          return;
        }
        setSubmit({ state: "saved" });
        loadBoard();
      } catch {
        setSubmit({ state: "error", msg: "network error" });
      }
    },
    [loadBoard],
  );
  const submitRef = useRef(submitScore);
  submitRef.current = submitScore;

  // initial load: best score + remembered name + leaderboard
  useEffect(() => {
    game.current.best = Number(localStorage.getItem("snake-best") || 0);
    setName(localStorage.getItem("snake-name") || "");
    loadBoard();
    render();
  }, [loadBoard]);

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
        if (!g.submitted && g.score > 0) {
          g.submitted = true;
          submitRef.current(nameRef.current, g.score);
        }
        render();
        // return focus to the name field so Enter can restart
        setTimeout(() => {
          boardRef.current
            ?.querySelector<HTMLInputElement>("input[name=player]")
            ?.focus();
        }, 60);
        return;
      }

      const next = [head, ...g.snake];
      if (head.x === g.apple.x && head.y === g.apple.y) {
        g.score += 1;
        g.apple = randomApple(next);
      } else {
        next.pop();
      }
      g.snake = next;
      render();
    }, SPEED);
    return () => clearInterval(id);
  }, []);

  const start = () => {
    if (!nameRef.current.trim()) {
      boardRef.current
        ?.querySelector<HTMLInputElement>("input[name=player]")
        ?.focus();
      return;
    }
    localStorage.setItem("snake-name", nameRef.current.trim());
    const g = game.current;
    g.snake = START;
    g.dir = { x: 1, y: 0 };
    g.pending = { x: 1, y: 0 };
    g.apple = randomApple(START);
    g.score = 0;
    g.status = "running";
    g.submitted = false;
    setSubmit({ state: "idle" });
    render();
    boardRef.current?.focus();
  };

  const steer = (x: number, y: number) => {
    const g = game.current;
    if (g.status !== "running") return;
    if (g.dir.x === -x && g.dir.y === -y) return; // ignore reversals
    g.pending = { x, y };
  };

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
      const g = game.current;
      if (g.status !== "running") return;
      const m = map[e.key.toLowerCase()];
      if (!m) return;
      e.preventDefault();
      if (g.dir.x === -m[0] && g.dir.y === -m[1]) return;
      g.pending = { x: m[0], y: m[1] };
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const onTouchStart = (e: React.TouchEvent) => {
    touch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (!touch.current) return;
    const dx = e.changedTouches[0].clientX - touch.current.x;
    const dy = e.changedTouches[0].clientY - touch.current.y;
    if (Math.abs(dx) < 20 && Math.abs(dy) < 20) return;
    if (Math.abs(dx) > Math.abs(dy)) steer(dx > 0 ? 1 : -1, 0);
    else steer(0, dy > 0 ? 1 : -1);
    touch.current = null;
  };

  const g = game.current;
  const headKey = `${g.snake[0].x},${g.snake[0].y}`;
  const bodySet = new Set(g.snake.map((s) => `${s.x},${s.y}`));

  return (
    <Section
      id="arcade"
      title="arcade"
      subtitle="enter a name, play snake, and land your score on the board."
    >
      <GridBand cols="grid-cols-1 lg:grid-cols-[1.3fr_1fr]">
        {/* board */}
        <GridCell className="flex flex-col items-center gap-5">
          <div className="font-code flex w-full max-w-[420px] items-center justify-between text-xs text-gray-500">
            <span>
              score <span className="text-foreground">{g.score}</span>
            </span>
            <span>best {g.best}</span>
          </div>

          <div
            ref={boardRef}
            tabIndex={0}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
            role="application"
            aria-label="Snake game board"
            className="border-border relative aspect-square w-full max-w-[420px] touch-none border outline-none select-none focus-visible:ring-1 focus-visible:ring-[var(--focus)]"
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
                const isApple = g.apple.x === x && g.apple.y === y;
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

            {g.status !== "running" && (
              <div className="bg-background/85 absolute inset-0 flex flex-col items-center justify-center gap-3 px-6 text-center backdrop-blur-[1px]">
                <p className="ss01 text-lg font-semibold">
                  {g.status === "over" ? `game over · ${g.score}` : "snake"}
                </p>

                {g.status === "over" && (
                  <p className="font-code text-[11px] text-gray-500">
                    {submit.state === "saving" && "saving score…"}
                    {submit.state === "saved" && "saved to leaderboard ✓"}
                    {submit.state === "error" && submit.msg}
                    {submit.state === "idle" &&
                      g.score === 0 &&
                      "no points — give it another go"}
                  </p>
                )}

                <input
                  name="player"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onKeyDown={(e) => {
                    e.stopPropagation();
                    if (e.key === "Enter") start();
                  }}
                  maxLength={20}
                  placeholder="your name"
                  className="border-border bg-background w-44 border px-3 py-1.5 text-center text-sm outline-none focus:border-[var(--focus)]"
                />

                <Button variant="default" size="sm" onClick={start}>
                  {g.status === "over" ? "play again" : "play"}
                </Button>
                <p className="font-code text-[11px] text-gray-500">
                  arrow keys / wasd · swipe on mobile
                </p>
              </div>
            )}
          </div>

          {/* on-screen d-pad for touch devices */}
          <div className="grid grid-cols-3 gap-2 sm:hidden">
            <span />
            <DPad label="up" onPress={() => steer(0, -1)} char="↑" />
            <span />
            <DPad label="left" onPress={() => steer(-1, 0)} char="←" />
            <DPad label="down" onPress={() => steer(0, 1)} char="↓" />
            <DPad label="right" onPress={() => steer(1, 0)} char="→" />
          </div>
        </GridCell>

        {/* leaderboard */}
        <GridCell tinted className="flex flex-col">
          <h3 className="ss01 normal-case-force mb-4 text-base font-semibold">
            leaderboard
          </h3>

          {!boardLoaded && (
            <p className="text-sm text-gray-500">loading scores…</p>
          )}
          {boardLoaded && board.length === 0 && (
            <p className="text-sm text-gray-500">
              no scores yet — be the first to make the board 🐍
            </p>
          )}

          <ol className="flex flex-col">
            {board.map((s, i) => (
              <li
                key={`${s.name}-${i}`}
                className="border-border flex items-center gap-3 border-b py-2.5 text-sm last:border-b-0"
              >
                <span
                  className={`font-code w-6 shrink-0 text-xs ${
                    i < 3 ? "text-blue font-semibold" : "text-gray-400"
                  }`}
                >
                  {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : i + 1}
                </span>
                <span className="ss01 normal-case-force min-w-0 flex-1 truncate">
                  {s.name}
                </span>
                <span className="font-code shrink-0 tabular-nums">
                  {s.score}
                </span>
              </li>
            ))}
          </ol>
        </GridCell>
      </GridBand>
    </Section>
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
      onClick={onPress}
      className="border-border hover:border-blue hover:text-blue flex size-12 items-center justify-center border text-lg transition-colors"
    >
      {char}
    </button>
  );
}
