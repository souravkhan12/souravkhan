/**
 * A margin note — tangential detail that shouldn't interrupt the main thread.
 *
 * Usage in MDX: <Aside>Historically this was …</Aside>
 */
export function Aside({ children }: { children: React.ReactNode }) {
  return (
    <aside className="not-prose border-border text-soft my-6 border-l-2 pl-5 text-sm leading-relaxed [&>p]:m-0 [&>p+p]:mt-3">
      {children}
    </aside>
  );
}
