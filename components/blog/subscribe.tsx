"use client";

import { useState } from "react";
import { LuArrowRight, LuCheck, LuLoader } from "react-icons/lu";

type State = "idle" | "loading" | "done" | "error";

/**
 * Inline newsletter capture. Rendered at the end of every post and on /blog —
 * the two places a reader has just decided they like the writing.
 */
export function Subscribe() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<State>("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (state === "loading") return;

    setState("loading");
    const form = new FormData(e.currentTarget);

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          // Honeypot — real users never fill this hidden field.
          website: form.get("website") ?? "",
        }),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) throw new Error(data.error ?? "Something went wrong.");
      setState("done");
      setMessage(data.message ?? "You're on the list.");
    } catch (err) {
      setState("error");
      setMessage(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  return (
    <section className="border-border border-t bg-gray-50 px-6 py-10 sm:px-10 dark:bg-black">
      <div className="mx-auto max-w-3xl">
        <h2 className="ss01 flex items-center gap-3 text-sm font-bold">
          <span aria-hidden="true" className="bg-blue h-3.5 w-[3px]" />
          get new posts by email
        </h2>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-gray-600 dark:text-gray-400">
          One email when something new goes up. No drip sequence, no spam,
          unsubscribe in one click.
        </p>

        {state === "done" ? (
          <p className="text-blue font-code mt-5 inline-flex items-center gap-2 text-sm">
            <LuCheck size={15} aria-hidden="true" />
            {message}
          </p>
        ) : (
          <form onSubmit={onSubmit} className="mt-5 flex max-w-md gap-2">
            {/* Honeypot: hidden from users, irresistible to bots. */}
            <input
              type="text"
              name="website"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              className="absolute h-0 w-0 opacity-0"
            />
            <label htmlFor="subscribe-email" className="sr-only">
              Email address
            </label>
            <input
              id="subscribe-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="border-border focus:border-blue min-w-0 flex-1 border bg-transparent px-3 py-2 text-sm transition-colors outline-none"
            />
            <button
              type="submit"
              disabled={state === "loading"}
              className="border-blue bg-blue inline-flex shrink-0 items-center gap-1.5 border px-4 py-2 text-sm text-white transition-opacity hover:opacity-90 disabled:opacity-60"
            >
              {state === "loading" ? (
                <LuLoader
                  size={14}
                  className="animate-spin"
                  aria-hidden="true"
                />
              ) : (
                <LuArrowRight size={14} aria-hidden="true" />
              )}
              subscribe
            </button>
          </form>
        )}

        {state === "error" && (
          <p role="alert" className="font-code mt-3 text-xs text-red-500">
            {message}
          </p>
        )}

        <p className="font-code mt-4 text-[11px] text-gray-400">
          prefer a reader?{" "}
          <a href="/feed.xml" className="hover:text-blue underline">
            rss
          </a>
        </p>
      </div>
    </section>
  );
}
