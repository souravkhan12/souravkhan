/**
 * One row of the homepage: a small mono label in a fixed left column and the
 * content beside it. Below `md` the label stacks above the content — a
 * 160px gutter on a 390px screen would leave the content a sliver.
 *
 * The inner pages still use `Section`; this is the homepage's quieter,
 * résumé-like rhythm, with no grid borders.
 */
export function HomeSection({
  id,
  label,
  children,
  className = "",
}: {
  id?: string;
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      id={id}
      className={`scroll-mt-20 py-10 sm:py-14 md:grid md:grid-cols-[160px_minmax(0,1fr)] md:gap-x-10 ${className}`}
    >
      <h2 className="font-code text-faint text-2xs mb-5 font-normal tracking-normal md:mb-0 md:pt-0.5">
        {id ? (
          <a href={`#${id}`} className="hover:text-blue transition-colors">
            {label}
          </a>
        ) : (
          label
        )}
      </h2>
      <div className="min-w-0">{children}</div>
    </section>
  );
}
