"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Panel } from "@/components/mdx/Panel";
import { LuPlay, LuRotateCcw, LuTrash2 } from "react-icons/lu";

/* ==================================================================== *
 * Shared: a tiny console renderer
 *
 * The point of the proxy post is that you can't see a trap fire — the
 * property access looks identical either way. So the whole post is built
 * around one thing: real code running in the page, with its console
 * output visible next to it. Everything below exists to make that output
 * read like devtools rather than like a string dump.
 * ==================================================================== */

type Level = "log" | "warn" | "error" | "info";

type Entry = { level: Level; nodes: React.ReactNode[] };

/* devtools-ish palette written as literals rather than palette classes:
   the site's own tokens only carry one accent, and a console needs four
   distinguishable value colours in both themes. */
const C = {
  string: "text-[#8a6d3b] dark:text-[#e5c07b]",
  number: "text-[#2b6cb0] dark:text-[#8ab4f8]",
  keyword: "text-[#7c3aed] dark:text-[#c4a7f7]",
  key: "text-[#4b5563] dark:text-[#9aa4b2]",
  punct: "text-faint",
};

const LEVEL_STYLE: Record<Level, string> = {
  log: "text-gray-700 dark:text-gray-300",
  info: "text-gray-700 dark:text-gray-300",
  warn: "text-[#8a5a00] dark:text-[#f0a92b]",
  error: "text-[#b3261e] dark:text-[#f2857b]",
};

const LEVEL_BG: Record<Level, string> = {
  log: "",
  info: "",
  warn: "bg-[#ffcf3f]/10",
  error: "bg-[#b3261e]/8 dark:bg-[#f2857b]/10",
};

function Tok({ c, children }: { c: string; children: React.ReactNode }) {
  return <span className={c}>{children}</span>;
}

/**
 * Format one logged value the way a devtools console would.
 *
 * `depth` exists so a self-referencing object can't hang the render, and
 * `top` distinguishes `console.log("hi")` (prints bare) from `["hi"]`
 * (prints quoted) — the same distinction devtools makes.
 */
function formatValue(value: unknown, depth = 0, top = false): React.ReactNode {
  if (typeof value === "string") {
    return top ? <>{value}</> : <Tok c={C.string}>&quot;{value}&quot;</Tok>;
  }
  if (typeof value === "number" || typeof value === "bigint") {
    return <Tok c={C.number}>{String(value)}</Tok>;
  }
  if (typeof value === "boolean" || value === null || value === undefined) {
    return <Tok c={C.keyword}>{String(value)}</Tok>;
  }
  if (typeof value === "function") {
    return <Tok c={C.keyword}>ƒ {value.name || "anonymous"}()</Tok>;
  }
  if (typeof value === "symbol") {
    return <Tok c={C.keyword}>{String(value)}</Tok>;
  }

  if (depth > 2) return <Tok c={C.punct}>…</Tok>;

  if (Array.isArray(value)) {
    return (
      <>
        <Tok c={C.punct}>[</Tok>
        {value.map((v, i) => (
          <span key={i}>
            {i > 0 && <Tok c={C.punct}>, </Tok>}
            {formatValue(v, depth + 1)}
          </span>
        ))}
        <Tok c={C.punct}>]</Tok>
      </>
    );
  }

  /* Reading an object's keys goes through the proxy's own get trap when the
     value being logged is a proxy — which is exactly right: what you see is
     what the proxy chose to hand back. */
  const entries = Object.entries(value as Record<string, unknown>);
  if (entries.length === 0) return <Tok c={C.punct}>{"{}"}</Tok>;

  return (
    <>
      <Tok c={C.punct}>{"{ "}</Tok>
      {entries.map(([k, v], i) => (
        <span key={k}>
          {i > 0 && <Tok c={C.punct}>, </Tok>}
          <Tok c={C.key}>{k}</Tok>
          <Tok c={C.punct}>: </Tok>
          {formatValue(v, depth + 1)}
        </span>
      ))}
      <Tok c={C.punct}>{" }"}</Tok>
    </>
  );
}

function toEntry(level: Level, args: unknown[]): Entry {
  return { level, nodes: args.map((a) => formatValue(a, 0, true)) };
}

/** The console pane itself — used by every component in this file. */
function ConsoleView({
  entries,
  visible,
  empty = "nothing logged yet",
  minHeight = 180,
}: {
  entries: Entry[];
  /** How many entries have been revealed so far, for the streaming effect. */
  visible: number;
  empty?: string;
  minHeight?: number;
}) {
  const scroller = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = scroller.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [visible]);

  const shown = entries.slice(0, visible);

  return (
    <div
      ref={scroller}
      className="font-code overflow-y-auto bg-white text-xs leading-6 dark:bg-[#101010]"
      style={{ minHeight, maxHeight: 340 }}
    >
      {shown.length === 0 ? (
        <div className="text-faint px-3 py-3">{empty}</div>
      ) : (
        shown.map((entry, i) => (
          <div
            key={i}
            className={`console-line flex gap-2 border-b border-gray-100 px-3 py-1.5 last:border-b-0 dark:border-gray-900 ${LEVEL_BG[entry.level]}`}
          >
            <span aria-hidden="true" className="text-faint select-none">
              {entry.level === "error"
                ? "✕"
                : entry.level === "warn"
                  ? "▲"
                  : "›"}
            </span>
            <span
              className={`min-w-0 wrap-break-word ${LEVEL_STYLE[entry.level]}`}
            >
              {entry.nodes.map((n, j) => (
                <span key={j}>
                  {j > 0 && " "}
                  {n}
                </span>
              ))}
            </span>
          </div>
        ))
      )}
    </div>
  );
}

/**
 * Reveal entries one at a time so a five-line result reads as a sequence of
 * events rather than appearing as a block. Reduced-motion gets them all at
 * once, since the staggering is decoration, not information.
 */
function useStreamedReveal(entries: Entry[], step = 110) {
  /* State with a lazy initialiser rather than a ref: this is read during
     render, and a ref read at that point is exactly what React's rules
     forbid. It never needs to change after mount — someone toggling their
     motion preference mid-post can have the animation. */
  const [instant] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );

  /* The batch is stored alongside its count so the reset can happen during
     render rather than in an effect. Resetting in an effect would paint the
     previous run's fully-revealed list for one frame before winding it back
     to zero, which reads as a flicker on every press of run. */
  const [shown, setShown] = useState({ source: entries, count: 0 });

  if (shown.source !== entries) {
    setShown({ source: entries, count: instant ? entries.length : 0 });
  }

  const revealed = shown.source === entries ? shown.count : 0;
  const done = revealed >= entries.length;

  useEffect(() => {
    if (instant || done || entries.length === 0) return;

    const id = setInterval(() => {
      setShown((s) =>
        s.source === entries
          ? { ...s, count: Math.min(s.count + 1, entries.length) }
          : s,
      );
    }, step);

    // `done` in the deps is what stops the timer: the last tick flips it and
    // the effect re-runs into this cleanup.
    return () => clearInterval(id);
  }, [entries, step, done, instant]);

  return revealed;
}

/* ==================================================================== *
 * 1. ConsoleSandbox — editable code, real execution, live output
 *
 * The patterns.dev version of this post embeds CodeSandbox. An iframe to
 * another origin costs ~1MB and a third-party cookie to run twelve lines
 * of JavaScript that the page's own engine could run for free — so this
 * runs the code in place instead.
 * ==================================================================== */

/* A deliberately small tokenizer. It only has to be right for the snippets
   in this post, which is why regex is a defensible choice here and would
   not be for a general editor. Order matters: comments and strings must
   match before anything can look inside them. */
const TOKENS =
  /(\/\/[^\n]*)|('(?:\\.|[^'\\])*'|"(?:\\.|[^"\\])*"|`(?:\\.|[^`\\])*`)|\b(const|let|var|function|return|if|else|new|class|typeof|delete|in|of|for|while|true|false|null|undefined|this)\b|\b(\d+(?:\.\d+)?)\b|\b(Proxy|Reflect|console|Object)\b/g;

function highlight(code: string): React.ReactNode[] {
  const out: React.ReactNode[] = [];
  let last = 0;
  let m: RegExpExecArray | null;
  let key = 0;

  TOKENS.lastIndex = 0;
  while ((m = TOKENS.exec(code)) !== null) {
    if (m.index > last) out.push(code.slice(last, m.index));

    const [full, comment, str, keyword, num, builtin] = m;
    const cls = comment
      ? "text-faint italic"
      : str
        ? C.string
        : keyword
          ? C.keyword
          : num
            ? C.number
            : builtin
              ? "text-blue"
              : "";

    out.push(
      <span key={key++} className={cls}>
        {full}
      </span>,
    );
    last = m.index + full.length;
  }

  if (last < code.length) out.push(code.slice(last));
  return out;
}

/**
 * Not used directly from MDX. A snippet has blank lines in it, and a blank
 * line inside a JSX attribute expression ends the element as far as the MDX
 * block parser is concerned — the prop arrives `undefined` and the page fails
 * to prerender. So the snippets live below as ordinary template literals and
 * MDX gets a zero-prop wrapper per example.
 */
function ConsoleSandbox({
  label = "live sandbox",
  source: initial,
  footnote,
  editable = true,
}: {
  label?: string;
  source: string;
  footnote?: React.ReactNode;
  editable?: boolean;
}) {
  const source = initial.trim();
  const [code, setCode] = useState(source);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [hasRun, setHasRun] = useState(false);
  const visible = useStreamedReveal(entries);

  const run = useCallback(() => {
    const collected: Entry[] = [];
    const sandboxConsole = {
      log: (...a: unknown[]) => collected.push(toEntry("log", a)),
      info: (...a: unknown[]) => collected.push(toEntry("info", a)),
      warn: (...a: unknown[]) => collected.push(toEntry("warn", a)),
      error: (...a: unknown[]) => collected.push(toEntry("error", a)),
      clear: () => collected.splice(0, collected.length),
    };

    try {
      /* Real execution, not a simulation — that is the entire value of the
         component. The code is authored in this repo and only editable by
         the reader in their own tab, so `new Function` is scoped to what
         the reader chooses to run against themselves. An infinite loop
         they type will hang their tab, same as it would in devtools. */
      const fn = new Function("console", `"use strict";\n${code}`);
      fn(sandboxConsole);
    } catch (err) {
      collected.push(
        toEntry("error", [
          err instanceof Error ? `${err.name}: ${err.message}` : String(err),
        ]),
      );
    }

    setHasRun(true);
    setEntries(collected);
  }, [code]);

  const dirty = code !== source;

  return (
    <Panel label={label} footnote={footnote}>
      {/* Container query, not a viewport one: this panel is a breakout inside
          a reading column whose width changes per tier, so what matters is
          how much room the panel itself got. Below the threshold the editor
          takes the full width and the console sits under it — two 370px
          columns wrap every other line of code, which is worse than tall. */}
      <div className="@container">
        <div className="grid gap-3 @min-[54rem]:grid-cols-2">
          {/* editor */}
          <div className="border-border border bg-white dark:bg-[#101010]">
            <div className="border-border text-2xs font-code text-faint flex items-center justify-between border-b px-3 py-1.5">
              <span className="lowercase">
                index.js {dirty && <span className="text-blue">· edited</span>}
              </span>
              <div className="flex items-center gap-3">
                {dirty && (
                  <button
                    type="button"
                    onClick={() => setCode(source)}
                    className="hover:text-blue inline-flex items-center gap-1 transition-colors"
                  >
                    <LuRotateCcw size={11} aria-hidden="true" />
                    revert
                  </button>
                )}
                <button
                  type="button"
                  onClick={run}
                  className="border-blue text-blue hover:bg-blue/5 inline-flex items-center gap-1.5 border px-2 py-1 transition-colors"
                >
                  <LuPlay size={11} aria-hidden="true" />
                  run
                </button>
              </div>
            </div>

            <div className="relative">
              <pre
                aria-hidden="true"
                className="font-code px-3 py-3 text-xs leading-6 wrap-break-word whitespace-pre-wrap text-gray-700 dark:text-gray-300"
              >
                {highlight(code)}
                {"\n"}
              </pre>
              {editable && (
                <textarea
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                      e.preventDefault();
                      run();
                    }
                    if (e.key === "Tab") {
                      e.preventDefault();
                      const el = e.currentTarget;
                      const { selectionStart: s, selectionEnd: t } = el;
                      const next = code.slice(0, s) + "  " + code.slice(t);
                      setCode(next);
                      requestAnimationFrame(() => {
                        el.selectionStart = el.selectionEnd = s + 2;
                      });
                    }
                  }}
                  spellCheck={false}
                  aria-label="editable example code"
                  className="font-code caret-blue absolute inset-0 resize-none overflow-hidden bg-transparent px-3 py-3 text-xs leading-6 wrap-break-word whitespace-pre-wrap text-transparent outline-none"
                />
              )}
            </div>
          </div>

          {/* console */}
          <div className="border-border border">
            <div className="border-border text-2xs font-code text-faint flex items-center justify-between border-b bg-gray-50 px-3 py-1.5 dark:bg-black">
              <span className="lowercase">console</span>
              {entries.length > 0 && (
                <button
                  type="button"
                  onClick={() => setEntries([])}
                  className="hover:text-blue inline-flex items-center gap-1 transition-colors"
                >
                  <LuTrash2 size={11} aria-hidden="true" />
                  clear
                </button>
              )}
            </div>
            <ConsoleView
              entries={entries}
              visible={visible}
              empty={
                hasRun ? "no output" : "press run — or edit the code first"
              }
            />
          </div>
        </div>
      </div>
    </Panel>
  );
}

/* ==================================================================== *
 * 2. ProxyTrapFlow — where the interception actually happens
 *
 * The sandbox shows you the output. This shows you the route: your code
 * never touches `person`, it touches a stand-in that decides what to do
 * before forwarding. Watching the highlight move through three boxes is
 * the whole mental model.
 * ==================================================================== */

type Action = {
  id: string;
  label: string;
  expr: string;
  kind: "get" | "set";
  run: (p: Record<string, unknown>) => void;
};

const ACTIONS: Action[] = [
  {
    id: "read-name",
    label: "read name",
    expr: "personProxy.name",
    kind: "get",
    run: (p) => {
      void p.name;
    },
  },
  {
    id: "read-missing",
    label: "read a key that isn't there",
    expr: "personProxy.nonExistentProperty",
    kind: "get",
    run: (p) => {
      void p.nonExistentProperty;
    },
  },
  {
    id: "set-age-ok",
    label: "set age to 43",
    expr: "personProxy.age = 43",
    kind: "set",
    run: (p) => {
      p.age = 43;
    },
  },
  {
    id: "set-age-bad",
    label: 'set age to "44"',
    expr: 'personProxy.age = "44"',
    kind: "set",
    run: (p) => {
      p.age = "44";
    },
  },
  {
    id: "set-name-bad",
    label: "set name to an empty string",
    expr: 'personProxy.name = ""',
    kind: "set",
    run: (p) => {
      p.name = "";
    },
  },
];

type Stage = "idle" | "caller" | "handler" | "target";

export function ProxyTrapFlow() {
  const [person, setPerson] = useState<Record<string, unknown>>({
    name: "John Doe",
    age: 42,
    nationality: "American",
  });
  const [entries, setEntries] = useState<Entry[]>([]);
  const [stage, setStage] = useState<Stage>("idle");
  const [active, setActive] = useState<Action | null>(null);
  const [touched, setTouched] = useState<string | null>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const visible = useStreamedReveal(entries, 60);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const fire = (action: Action) => {
    timers.current.forEach(clearTimeout);
    timers.current = [];

    const collected: Entry[] = [];
    const target = { ...person };
    let changed: string | null = null;

    /* The same handler the post's prose describes — validation on set,
       a friendlier message on get. Running it for real means the panel
       can't drift out of sync with the code above it. */
    const proxy = new Proxy(target, {
      get(obj, prop: string) {
        if (!(prop in obj)) {
          collected.push(
            toEntry("warn", [
              `Hmm.. ${prop} doesn't seem to exist on the target object`,
            ]),
          );
          return undefined;
        }
        collected.push(
          toEntry("log", [`The value of ${prop} is`, obj[prop as never]]),
        );
        return Reflect.get(obj, prop);
      },
      set(obj, prop: string, value) {
        if (prop === "age" && typeof value !== "number") {
          collected.push(
            toEntry("error", [
              "Sorry, you can only pass numeric values for age.",
            ]),
          );
          return true;
        }
        if (prop === "name" && String(value).length < 2) {
          collected.push(
            toEntry("error", ["You need to provide a valid name."]),
          );
          return true;
        }
        collected.push(
          toEntry("log", [
            `Changed ${prop} from ${String(obj[prop as never])} to ${String(value)}`,
          ]),
        );
        changed = prop;
        return Reflect.set(obj, prop, value);
      },
    });

    action.run(proxy);

    setActive(action);
    setTouched(null);
    setEntries([]);
    setStage("caller");

    const at = (ms: number, fn: () => void) => {
      timers.current.push(setTimeout(fn, ms));
    };

    at(260, () => setStage("handler"));
    at(700, () => {
      setStage("target");
      setEntries(collected);
      setPerson(target);
      setTouched(changed);
    });
    at(1500, () => setStage("idle"));
  };

  const box = (on: boolean) =>
    `border p-3 transition-colors duration-200 ${
      on ? "border-blue bg-blue/5" : "border-border bg-white dark:bg-[#101010]"
    }`;

  return (
    <Panel
      label="where the interception happens"
      footnote={
        <>
          Nothing in the left-hand column knows a proxy exists — that is the
          point. <code className="font-code text-xs">personProxy.age = 43</code>{" "}
          is ordinary assignment syntax; the handler in the middle is what turns
          it into a decision.
        </>
      }
    >
      <div className="mb-4 flex flex-wrap gap-1.5">
        {ACTIONS.map((a) => (
          <button
            key={a.id}
            type="button"
            onClick={() => fire(a)}
            aria-pressed={active?.id === a.id}
            className={`font-code border px-2.5 py-1.5 text-xs transition-colors ${
              active?.id === a.id
                ? "border-blue bg-blue/5 text-blue"
                : "border-border text-soft hover:border-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
            }`}
          >
            {a.label}
          </button>
        ))}
      </div>

      <div className="grid items-stretch gap-2 sm:grid-cols-[1fr_auto_1fr_auto_1fr]">
        {/* caller */}
        <div className={box(stage === "caller")}>
          <div className="text-2xs font-code text-faint mb-2 lowercase">
            your code
          </div>
          <div className="font-code text-xs leading-6 wrap-break-word text-gray-700 dark:text-gray-300">
            {active ? active.expr : "personProxy.name"}
          </div>
        </div>

        <Arrow on={stage === "handler" || stage === "target"} />

        {/* handler */}
        <div className={box(stage === "handler")}>
          <div className="text-2xs font-code text-faint mb-2 lowercase">
            proxy handler
          </div>
          <div className="flex gap-1.5">
            {(["get", "set"] as const).map((trap) => (
              <span
                key={trap}
                className={`font-code border px-2 py-1 text-xs transition-colors ${
                  active?.kind === trap && stage !== "idle"
                    ? "border-blue/50 bg-blue/10 text-blue"
                    : "border-border text-faint"
                }`}
              >
                {trap}()
              </span>
            ))}
          </div>
          <div className="text-2xs text-faint mt-2 leading-5">
            log it, validate it, then decide whether to forward
          </div>
        </div>

        <Arrow on={stage === "target"} />

        {/* target */}
        <div className={box(stage === "target")}>
          <div className="text-2xs font-code text-faint mb-2 lowercase">
            target object
          </div>
          <div className="font-code text-xs leading-6">
            {Object.entries(person).map(([k, v]) => (
              <div
                key={k}
                className={
                  touched === k
                    ? "text-blue"
                    : "text-gray-700 dark:text-gray-300"
                }
              >
                <span className={C.key}>{k}</span>
                <span className={C.punct}>: </span>
                {formatValue(v)}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="border-border mt-3 border">
        <div className="border-border text-2xs font-code text-faint border-b bg-gray-50 px-3 py-1.5 lowercase dark:bg-black">
          console
        </div>
        <ConsoleView
          entries={entries}
          visible={visible}
          minHeight={72}
          empty="pick an interaction above"
        />
      </div>
    </Panel>
  );
}

function Arrow({ on }: { on: boolean }) {
  return (
    <div
      aria-hidden="true"
      className="hidden items-center justify-center sm:flex"
    >
      <span
        className={`font-code text-xs transition-colors duration-200 ${
          on ? "text-blue" : "text-faint"
        }`}
      >
        →
      </span>
    </div>
  );
}

/* ==================================================================== *
 * 3. TrapCheatSheet — get and set are two of thirteen
 *
 * Nearly every proxy tutorial stops at get/set, which leaves readers
 * thinking a proxy can only intercept property access. Listing the rest
 * against the syntax that triggers them fixes that in one glance.
 * ==================================================================== */

const TRAPS: { trap: string; fires: string; use: string }[] = [
  {
    trap: "get",
    fires: "proxy.name · proxy['name']",
    use: "logging, lazy loading, computed properties",
  },
  {
    trap: "set",
    fires: "proxy.age = 43",
    use: "validation, change notification, freezing",
  },
  {
    trap: "has",
    fires: "'age' in proxy",
    use: "hiding private keys from `in`",
  },
  {
    trap: "deleteProperty",
    fires: "delete proxy.age",
    use: "audit trails, blocking deletes",
  },
  {
    trap: "apply",
    fires: "proxy(1, 2)",
    use: "timing, memoising, argument checks",
  },
  {
    trap: "construct",
    fires: "new proxy()",
    use: "instance counting, dependency injection",
  },
  {
    trap: "ownKeys",
    fires: "Object.keys(proxy) · spread",
    use: "hiding keys from enumeration",
  },
  {
    trap: "defineProperty",
    fires: "Object.defineProperty(proxy, …)",
    use: "schema enforcement",
  },
  {
    trap: "getPrototypeOf",
    fires: "proxy instanceof X",
    use: "faking a type",
  },
];

export function TrapCheatSheet() {
  return (
    <Panel
      label="the traps, and the syntax that fires them"
      footnote={
        <>
          Thirteen traps exist; these are the nine you will plausibly reach for.
          Every one of them has a matching{" "}
          <code className="font-code text-xs">Reflect</code> method with the
          same name and the same arguments — that symmetry is deliberate and it
          is what makes <code className="font-code text-xs">Reflect</code> the
          right default inside a handler.
        </>
      }
    >
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-border border-b">
              <th className="font-code text-2xs text-faint py-2 pr-4 font-normal lowercase">
                trap
              </th>
              <th className="font-code text-2xs text-faint py-2 pr-4 font-normal lowercase">
                fires on
              </th>
              <th className="font-code text-2xs text-faint py-2 font-normal lowercase">
                typical use
              </th>
            </tr>
          </thead>
          <tbody>
            {TRAPS.map((t) => (
              <tr
                key={t.trap}
                className="border-border/60 border-b last:border-b-0"
              >
                <td className="font-code text-blue py-2 pr-4 align-top text-xs whitespace-nowrap">
                  {t.trap}
                </td>
                <td className="font-code py-2 pr-4 align-top text-xs whitespace-nowrap text-gray-700 dark:text-gray-300">
                  {t.fires}
                </td>
                <td className="py-2 align-top text-sm text-gray-600 dark:text-gray-400">
                  {t.use}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Panel>
  );
}

/* ==================================================================== *
 * 4. The post's four sandboxes
 *
 * Each is a thin wrapper so the .mdx can write <ProxyBasicsDemo /> and
 * the snippet can stay a plain, unescaped template literal here.
 * ==================================================================== */

export function ProxyBasicsDemo() {
  return (
    <ConsoleSandbox
      label="a proxy with get and set traps"
      source={`
const person = {
  name: "John Doe",
  age: 42,
  nationality: "American",
};

const personProxy = new Proxy(person, {
  get: (obj, prop) => {
    console.log(\`The value of \${prop} is \${obj[prop]}\`);
    return obj[prop];
  },
  set: (obj, prop, value) => {
    console.log(\`Changed \${prop} from \${obj[prop]} to \${value}\`);
    obj[prop] = value;
    return true;
  },
});

personProxy.name;
personProxy.age = 43;
console.log(personProxy.age);
`}
      footnote="Everything in the console came from the handler, not from the object. Delete the two console.log lines and run again — the reads and writes still work, silently. That's the pass-through underneath."
    />
  );
}

export function ProxyValidationDemo() {
  return (
    <ConsoleSandbox
      label="a handler that says no"
      source={`
const person = { name: "John Doe", age: 42 };

const personProxy = new Proxy(person, {
  get: (obj, prop) => {
    if (!(prop in obj)) {
      console.warn(\`Hmm.. \${prop} doesn't exist on the target object\`);
      return undefined;
    }
    return obj[prop];
  },
  set: (obj, prop, value) => {
    if (prop === "age" && typeof value !== "number") {
      console.error("Sorry, you can only pass numeric values for age.");
      return true;
    }
    if (prop === "name" && value.length < 2) {
      console.error("You need to provide a valid name.");
      return true;
    }
    obj[prop] = value;
    return true;
  },
});

personProxy.nonExistentProperty;
personProxy.age = "44";
personProxy.name = "";

console.log("survived intact:", person);
`}
      footnote="The last line is the one that matters: after three rejected writes the target is untouched. Change a rejected write to a valid one and run it again."
    />
  );
}

export function ProxyReceiverDemo() {
  return (
    <ConsoleSandbox
      label="the receiver argument, and what it costs to drop it"
      source={`
const person = {
  first: "John",
  last: "Doe",
  get fullName() {
    // Both of these reads go through 'this'.
    return this.first + " " + this.last;
  },
};

function makeProxy(useReceiver) {
  return new Proxy(person, {
    get(obj, prop, receiver) {
      console.log("trap fired for:", prop);
      return useReceiver ? Reflect.get(obj, prop, receiver) : obj[prop];
    },
  });
}

console.log("--- without receiver ---");
console.log(makeProxy(false).fullName);

console.log("--- with receiver ---");
console.log(makeProxy(true).fullName);
`}
      footnote="Same answer, different number of trap lines. Without the receiver the getter reads first and last off the raw target, so the proxy never sees them — a logger built this way under-reports, and a validator built this way has a hole in it."
    />
  );
}

export function ProxyApplyDemo() {
  return (
    <ConsoleSandbox
      label="wrapping a function with the apply trap"
      source={`
function slowSquare(n) {
  let x = 0;
  for (let i = 0; i < 200000; i++) x += n;
  return n * n;
}

const cache = new Map();

const memoised = new Proxy(slowSquare, {
  apply(fn, thisArg, args) {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      console.log("cache hit:", key);
      return cache.get(key);
    }
    console.log("computing:", key);
    const result = Reflect.apply(fn, thisArg, args);
    cache.set(key, result);
    return result;
  },
});

console.log(memoised(9));
console.log(memoised(9));
console.log("still looks like the original:", memoised.name, memoised.length);
`}
      footnote="memoised.name is still 'slowSquare' and memoised.length is still 1 — a hand-written wrapper function would have lost both."
    />
  );
}
