"use client";

import { useEffect, useReducer, useRef } from "react";
import { Section, GridBand, GridCell, DotGrid, Button } from "@/components/ui";

const N = 15; // board is N×N
const SPEED = 130; // ms per tick
const START = [
  { x: 7, y: 7 },
  { x: 6, y: 7 },
  { x: 5, y: 7 },
];

type Cell = { x: number; y: number };
type Status = "idle" | "running" | "over";

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
  });
  const boardRef = useRef<HTMLDivElement>(null);
  const touch = useRef<{ x: number; y: number } | null>(null);
  const [, render] = useReducer((n) => n + 1, 0);

  useEffect(() => {
    const best = Number(localStorage.getItem("snake-best") || 0);
    game.current.best = best;
    render();
  }, []);

  // fixed-cadence game loop; reads/writes the ref so it never goes stale
  useEffect(() => {
    const id = setInterval(() => {
      const g = game.current;
      if (g.status !== "running") return;

      g.dir = g.pending;
      const head = {
        x: g.snake[0].x + g.dir.x,
        y: g.snake[0].y + g.dir.y,
      };

      const hitWall = head.x < 0 || head.x >= N || head.y < 0 || head.y >= N;
      const hitSelf = g.snake.some((s) => s.x === head.x && s.y === head.y);
      if (hitWall || hitSelf) {
        g.status = "over";
        if (g.score > g.best) {
          g.best = g.score;
          localStorage.setItem("snake-best", String(g.best));
        }
        render();
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
    const g = game.current;
    g.snake = START;
    g.dir = { x: 1, y: 0 };
    g.pending = { x: 1, y: 0 };
    g.apple = randomApple(START);
    g.score = 0;
    g.status = "running";
    render();
    boardRef.current?.focus();
  };

  const steer = (x: number, y: number) => {
    const g = game.current;
    if (g.status === "idle" || g.status === "over") {
      start();
    }
    // ignore direct reversals
    if (g.dir.x === -x && g.dir.y === -y) return;
    g.pending = { x, y };
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    const k = e.key.toLowerCase();
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
    if (map[k]) {
      e.preventDefault();
      steer(map[k][0], map[k][1]);
    } else if (k === " " || k === "enter") {
      e.preventDefault();
      if (game.current.status !== "running") start();
    }
  };

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
      subtitle="a little snake break — arrow keys / wasd, or swipe. eat the apples."
    >
      <GridBand cols="grid-cols-1">
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
            onKeyDown={onKeyDown}
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
              <div className="bg-background/80 absolute inset-0 flex flex-col items-center justify-center gap-3 backdrop-blur-[1px]">
                <p className="ss01 text-lg font-semibold">
                  {g.status === "over" ? `game over · ${g.score}` : "snake"}
                </p>
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
