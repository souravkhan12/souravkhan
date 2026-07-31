/**
 * An inline glossary term.
 *
 * The posts deliberately use plain words — "one trip to the server and back"
 * instead of "RTT". But a reader who only ever sees the plain version can't
 * follow anyone else's writing, so the real name goes in brackets right next to
 * it, with the definition one hover (or one tap) away.
 *
 * Usage in MDX:
 *   <Term abbr="RTT" def="One full trip from the browser to the server and back.">
 *     round trip
 *   </Term>
 *
 * `abbr` is optional — terms like "head-of-line blocking" have a real name but
 * no short form, so they get the underline and the definition, nothing more.
 *
 * No JavaScript: hover, keyboard focus and tap all resolve through CSS, so this
 * works in a server component and costs nothing on the client.
 */
export function Term({
  abbr,
  def,
  children,
}: {
  abbr?: string;
  def: string;
  children: React.ReactNode;
}) {
  return (
    <span className="group relative inline-block">
      <span
        tabIndex={0}
        role="note"
        aria-label={`${abbr ? `${abbr}. ` : ""}${def}`}
        className="decoration-blue/50 hover:decoration-blue focus:decoration-blue cursor-help underline decoration-dotted underline-offset-4 outline-none"
      >
        {children}
        {abbr && (
          <span className="font-code text-blue ml-1 text-[0.85em]">
            ({abbr})
          </span>
        )}
      </span>

      <span
        aria-hidden="true"
        className="border-border pointer-events-none invisible absolute bottom-full left-0 z-20 mb-2 w-64 max-w-[80vw] border bg-white px-3 py-2 text-sm leading-snug font-normal text-gray-600 opacity-0 shadow-sm transition-opacity duration-150 group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100 dark:bg-gray-950 dark:text-gray-400"
      >
        {def}
      </span>
    </span>
  );
}
