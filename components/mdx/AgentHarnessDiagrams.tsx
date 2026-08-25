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
 * Shared shell — matches the site's section-header treatment used by
 * the other MDX diagram files: squared border, gray-50 / black band,
 * thin blue accent bar, lowercase font-code label. `not-prose` keeps
 * the typography plugin from restyling anything inside.
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
        <span className="font-code text-soft text-xs lowercase">{label}</span>
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
 * 1. HarnessLoop
 *
 * A guided walkthrough of one turn of the agent loop. Each step shows
 * what's *actually moving* at that moment — the message being built, the
 * tool the model asked for, the output the harness fed back — next to a
 * plain sentence. Autoplays once, then the reader scrubs.
 *
 * Two lanes are colour-coded throughout so the core point lands:
 *   blue  = the harness (your code)
 *   amber = the model (the LLM, which only ever emits text)
 * ------------------------------------------------------------------ */

type Actor = "harness" | "model" | "world";

type Step = {
  n: string;
  label: string;
  actor: Actor;
  plain: string;
  visual: React.ReactNode;
};

const ACTOR_META: Record<Actor, { name: string; cls: string; dot: string }> = {
  harness: { name: "harness", cls: "text-blue", dot: "bg-blue" },
  model: { name: "model", cls: "text-amber", dot: "bg-amber" },
  world: {
    name: "your machine",
    cls: "text-gray-600 dark:text-gray-300",
    dot: "bg-gray-400 dark:bg-gray-500",
  },
};

function MsgLine({
  role,
  children,
  dim,
}: {
  role: string;
  children: React.ReactNode;
  dim?: boolean;
}) {
  return (
    <div className={`font-code text-xs leading-6 ${dim ? "opacity-45" : ""}`}>
      <span className="text-faint">{role}: </span>
      <span className="text-gray-700 dark:text-gray-300">{children}</span>
    </div>
  );
}

const steps: Step[] = [
  {
    n: "01",
    label: "the ask",
    actor: "world",
    plain:
      "You type a task in plain English. That's the only thing a human does in the whole loop — everything after this is the harness and the model passing messages back and forth.",
    visual: (
      <div className="border-border border bg-white p-3 dark:bg-gray-950">
        <MsgLine role="user">
          &quot;the login test is failing — fix it&quot;
        </MsgLine>
      </div>
    ),
  },
  {
    n: "02",
    label: "assemble context",
    actor: "harness",
    plain:
      "The model can't see your repo, your tools or your last message. The harness builds the whole picture for it: a system prompt, the list of tools it's allowed to call, and the conversation so far — packed into one text blob that fits the context window.",
    visual: (
      <div className="space-y-1.5">
        <div className="flex flex-wrap gap-1.5">
          <Chip active>system prompt</Chip>
          <Chip active>tool schemas</Chip>
          <Chip active>history</Chip>
          <Chip active>the ask</Chip>
        </div>
        <p className="font-code text-faint text-xs">
          → one prompt, ~12k tokens
        </p>
      </div>
    ),
  },
  {
    n: "03",
    label: "the model thinks",
    actor: "model",
    plain:
      "The model reads that blob and emits text. It has no hands — it can't open a file or run a command. All it can do is write a message. Here it decides it wants to look at the failing test, so it writes a request to call a tool.",
    visual: (
      <div className="border-border border bg-white p-3 dark:bg-gray-950">
        <MsgLine role="assistant">I need to see the test first.</MsgLine>
        <div className="border-amber/40 bg-amber/5 mt-2 border px-2.5 py-2">
          <div className="font-code text-amber text-xs">
            tool_call: read_file
          </div>
          <div className="font-code text-soft mt-0.5 text-xs">
            {`{ path: "login.test.ts" }`}
          </div>
        </div>
      </div>
    ),
  },
  {
    n: "04",
    label: "the harness executes",
    actor: "harness",
    plain:
      "This is the part people miss. The model only *asked*. The harness is what actually reads the file off disk — running real code with real permissions on your machine — and captures the result.",
    visual: (
      <div className="border-border border bg-white p-3 dark:bg-gray-950">
        <div className="font-code text-blue text-xs">
          fs.readFileSync(&quot;login.test.ts&quot;)
        </div>
        <div className="font-code text-faint mt-1.5 text-xs">
          → 34 lines returned
        </div>
      </div>
    ),
  },
  {
    n: "05",
    label: "feed back the result",
    actor: "harness",
    plain:
      "The harness appends the tool's output to the conversation as a new message and sends the whole thing to the model again. The model now knows something it didn't a moment ago. This append-and-resend is the loop.",
    visual: (
      <div className="border-border border bg-white p-3 dark:bg-gray-950">
        <MsgLine role="user" dim>
          &quot;fix the login test&quot;
        </MsgLine>
        <MsgLine role="assistant" dim>
          tool_call: read_file
        </MsgLine>
        <MsgLine role="tool">expect(user.name).toBe(&quot;Sam&quot;)…</MsgLine>
      </div>
    ),
  },
  {
    n: "06",
    label: "act, then repeat",
    actor: "model",
    plain:
      "With the file in view the model spots the bug and asks for an edit. The harness applies it, runs the test, feeds back the result — and the loop turns again. It keeps turning until the model stops asking for tools.",
    visual: (
      <div className="border-border border bg-white p-3 dark:bg-gray-950">
        <div className="border-amber/40 bg-amber/5 border px-2.5 py-2">
          <div className="font-code text-amber text-xs">
            tool_call: edit_file
          </div>
          <div className="font-code text-soft mt-0.5 text-xs">
            &quot;Sam&quot; → &quot;Samantha&quot;
          </div>
        </div>
        <div className="font-code text-blue mt-2 text-xs">
          harness runs: npm test → ✓ pass
        </div>
      </div>
    ),
  },
  {
    n: "07",
    label: "done",
    actor: "model",
    plain:
      "The model emits a message with no tool call — just an answer for you. The harness sees there's nothing left to execute, breaks the loop, and prints the reply. One task; a dozen quiet round trips you never saw.",
    visual: (
      <div className="border-border border bg-white p-3 dark:bg-gray-950">
        <MsgLine role="assistant">
          Fixed — the assertion expected the old display name. Test passes now.
        </MsgLine>
        <div className="font-code text-faint mt-2 text-xs">
          no tool_call → loop ends
        </div>
      </div>
    ),
  },
];

export function HarnessLoop() {
  const [i, setI] = useState(0);
  const [playing, setPlaying] = useState(false);
  const startedRef = useRef(false);
  const hostRef = useRef<HTMLDivElement | null>(null);

  // Autoplay once when it first scrolls into view.
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
    const id = setTimeout(() => setI((v) => v + 1), 2800);
    return () => clearTimeout(id);
  }, [playing, i]);

  const go = useCallback((next: number) => {
    setPlaying(false);
    setI(Math.max(0, Math.min(steps.length - 1, next)));
  }, []);

  const step = steps[i];
  const meta = ACTOR_META[step.actor];
  const atEnd = i === steps.length - 1;

  return (
    <div ref={hostRef}>
      <Panel label="one turn of the agent loop · step through it">
        {/* Actor legend */}
        <div className="mb-4 flex flex-wrap items-center gap-x-4 gap-y-1.5">
          {(["harness", "model"] as Actor[]).map((a) => (
            <span key={a} className="flex items-center gap-1.5">
              <span
                className={`h-2 w-2 ${ACTOR_META[a].dot}`}
                aria-hidden="true"
              />
              <span className="font-code text-faint text-xs lowercase">
                {ACTOR_META[a].name}
                {a === "harness" ? " · your code" : " · the llm (text only)"}
              </span>
            </span>
          ))}
        </div>

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
                style={{ minWidth: 88 }}
              >
                <span
                  className={`font-code block text-xs ${
                    now ? "text-blue" : "text-faint"
                  }`}
                >
                  {s.n}
                </span>
                <span
                  className={`font-code block truncate text-xs lowercase ${
                    now
                      ? "text-gray-900 dark:text-gray-100"
                      : "text-faint group-hover:text-gray-600 dark:group-hover:text-gray-300"
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
            <div className="flex items-center gap-2">
              <span className={`h-2 w-2 ${meta.dot}`} aria-hidden="true" />
              <h4 className={`font-code text-xs lowercase ${meta.cls}`}>
                {step.n} · {step.label}
              </h4>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-gray-700 dark:text-gray-300">
              {step.plain}
            </p>
          </div>

          <div
            key={step.n}
            className="ah-stage border-border border bg-white p-3.5 dark:bg-gray-950/60"
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
            <span className="font-code text-faint mr-1 text-xs">
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
          .ah-stage { animation: ahFadeSlide 0.35s ease-out; }
          @keyframes ahFadeSlide {
            from { opacity: 0; transform: translateY(4px); }
            to   { opacity: 1; transform: translateY(0); }
          }
          @media (prefers-reduced-motion: reduce) {
            .ah-stage { animation: none; }
          }
        `}</style>
      </Panel>
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * 2. ContextBuilderPlayground
 *
 * The lever readers can actually pull. Toggle each thing the harness
 * *could* put in the prompt and watch the model's behaviour degrade or
 * improve. Makes concrete the claim that a harness is mostly a context
 * manager, not a model wrapper.
 * ------------------------------------------------------------------ */

type Part = {
  key: string;
  label: string;
  tokens: number;
  essential?: boolean;
  whenOn: string;
  whenOff: string;
};

const PARTS: Part[] = [
  {
    key: "system",
    label: "system prompt",
    tokens: 900,
    essential: true,
    whenOn: "The model knows it's a coding agent and how to behave.",
    whenOff:
      "Without it the model answers like a chatbot — explains, doesn't do.",
  },
  {
    key: "tools",
    label: "tool schemas",
    tokens: 1400,
    essential: true,
    whenOn:
      "The model knows read_file, edit_file and run exist, and their arguments.",
    whenOff:
      "No tools declared → the model can't act at all. It can only describe what you should do.",
  },
  {
    key: "files",
    label: "relevant file snippets",
    tokens: 3200,
    whenOn:
      "The model edits with the real code in front of it — fewer wrong guesses.",
    whenOff:
      "The model hasn't seen your code, so it hallucinates function names and imports.",
  },
  {
    key: "history",
    label: "conversation history",
    tokens: 2600,
    whenOn:
      "The model remembers what it already tried and doesn't loop on the same fix.",
    whenOff:
      "Every turn is amnesiac — it re-reads the same file and repeats mistakes.",
  },
  {
    key: "errors",
    label: "last command output",
    tokens: 800,
    whenOn: "The model sees the actual stack trace and fixes the real error.",
    whenOff: "It's fixing blind, guessing at what the failure might have been.",
  },
];

const WINDOW = 12000;

export function ContextBuilderPlayground() {
  const [on, setOn] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(PARTS.map((p) => [p.key, true])),
  );

  const used = PARTS.reduce((sum, p) => (on[p.key] ? sum + p.tokens : sum), 0);
  const pct = Math.min(100, Math.round((used / WINDOW) * 100));

  const canAct = on.tools && on.system;
  const willGuess = !on.files || !on.history;

  const verdict = !canAct
    ? "As built, this prompt can't produce an action — the model will reply with prose, not a tool call. A harness that forgets the tool schemas is just a chat box."
    : willGuess
      ? "This will run, but the model is working partly blind. Expect confident edits to functions that don't exist."
      : "A complete prompt: the model can see the code, remembers its own attempts, and knows exactly which tools it may call. This is what a good harness assembles every single turn.";

  return (
    <Panel
      label="build the prompt · toggle what the harness sends"
      footnote={verdict}
    >
      <p className="text-soft mb-4 text-sm leading-relaxed">
        The model is fixed. The one thing a harness fully controls is what goes
        in the prompt — so that&apos;s the real product. Switch pieces off and
        read what breaks.
      </p>

      <div className="space-y-2">
        {PARTS.map((p) => {
          const active = on[p.key];
          return (
            <button
              key={p.key}
              type="button"
              onClick={() => setOn((s) => ({ ...s, [p.key]: !s[p.key] }))}
              aria-pressed={active}
              className={`flex w-full items-start gap-3 border px-3 py-2.5 text-left transition-colors ${
                active
                  ? "border-blue/40 bg-blue/5"
                  : "border-border bg-white opacity-60 hover:opacity-100 dark:bg-gray-950"
              }`}
            >
              <span
                className={`font-code mt-0.5 h-4 w-4 shrink-0 border text-center text-xs leading-4 ${
                  active
                    ? "border-blue bg-blue text-white"
                    : "border-border text-transparent"
                }`}
                aria-hidden="true"
              >
                ✓
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex items-center justify-between gap-2">
                  <span
                    className={`font-code text-xs lowercase ${
                      active ? "text-blue" : "text-faint"
                    }`}
                  >
                    {p.label}
                    {p.essential && (
                      <span className="text-faint"> · required</span>
                    )}
                  </span>
                  <span className="font-code text-faint text-xs">
                    {p.tokens.toLocaleString()} tok
                  </span>
                </span>
                <span className="text-soft mt-1 block text-sm leading-snug">
                  {active ? p.whenOn : p.whenOff}
                </span>
              </span>
            </button>
          );
        })}
      </div>

      {/* Context window meter */}
      <div className="mt-5">
        <div className="mb-1.5 flex items-center justify-between">
          <span className="font-code text-faint text-xs lowercase">
            context window
          </span>
          <span
            className={`font-code text-xs ${
              pct > 100 ? "text-amber" : "text-soft"
            }`}
          >
            {used.toLocaleString()} / {WINDOW.toLocaleString()} tok · {pct}%
          </span>
        </div>
        <div className="border-border relative h-3 w-full border bg-white dark:bg-gray-950">
          <div
            className={`absolute inset-y-0 left-0 transition-all duration-300 ${
              pct >= 100 ? "bg-amber" : "bg-blue"
            }`}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <span
          className={`font-code border px-2 py-1 text-xs lowercase ${
            canAct
              ? "border-blue/40 bg-blue/5 text-blue"
              : "border-amber/50 bg-amber/10 text-gray-800 dark:text-gray-200"
          }`}
        >
          {canAct ? "can act" : "can't act — no prose→action path"}
        </span>
        <span
          className={`font-code border px-2 py-1 text-xs lowercase ${
            willGuess
              ? "border-amber/50 bg-amber/10 text-gray-800 dark:text-gray-200"
              : "border-border text-faint"
          }`}
        >
          {willGuess ? "working blind" : "grounded in real code"}
        </span>
      </div>
    </Panel>
  );
}

/* ------------------------------------------------------------------ *
 * 3. HarnessAnatomy
 *
 * The one-glance summary: what the harness owns vs. what the model owns.
 * Readers who skim should still leave with the mental model.
 * ------------------------------------------------------------------ */

const ROWS: { job: string; owner: "harness" | "model"; note: string }[] = [
  {
    job: "understand the task",
    owner: "model",
    note: "reads plain English, decides the next move",
  },
  {
    job: "know which tools exist",
    owner: "harness",
    note: "declares the tool schemas in every prompt",
  },
  {
    job: "choose a tool to call",
    owner: "model",
    note: "emits a structured request — just text",
  },
  {
    job: "actually run the tool",
    owner: "harness",
    note: "reads files, runs commands, applies edits",
  },
  {
    job: "feed the result back",
    owner: "harness",
    note: "appends output, re-sends the conversation",
  },
  {
    job: "manage the context window",
    owner: "harness",
    note: "trims, summarises, keeps the prompt in budget",
  },
  {
    job: "decide when it's done",
    owner: "harness",
    note: "stops looping when no tool is requested",
  },
];

export function HarnessAnatomy() {
  return (
    <Panel label="who owns what · harness vs. model">
      <div className="-mx-1 overflow-x-auto px-1">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr>
              {["the job", "owner", "what that means"].map((h, i) => (
                <th
                  key={i}
                  className="border-border font-code text-faint border-b pr-4 pb-2 text-xs font-normal lowercase"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ROWS.map((r) => (
              <tr key={r.job} className="align-top">
                <td className="border-border font-code border-b py-2.5 pr-4 text-xs text-gray-800 dark:text-gray-200">
                  {r.job}
                </td>
                <td className="border-border border-b py-2.5 pr-4">
                  <span
                    className={`font-code border px-1.5 py-0.5 text-xs whitespace-nowrap lowercase ${
                      r.owner === "harness"
                        ? "border-blue/40 bg-blue/5 text-blue"
                        : "border-amber/50 bg-amber/10 text-gray-800 dark:text-gray-200"
                    }`}
                  >
                    {r.owner}
                  </span>
                </td>
                <td className="border-border text-soft border-b py-2.5 text-sm">
                  {r.note}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="font-code text-faint mt-4 text-xs leading-relaxed">
        count the blue rows: the model does two things, the harness does five.
        the intelligence is rented — the product is the loop around it.
      </p>
    </Panel>
  );
}
