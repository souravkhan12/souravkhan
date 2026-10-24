/** Matches the blog index's shape so the page doesn't reflow when posts land. */
export default function BlogLoading() {
  return (
    <div className="pt-10 sm:pt-16" aria-busy="true" aria-label="Loading posts">
      <div className="bg-surface h-3 w-20 animate-pulse rounded-full" />
      <div className="bg-surface mt-6 h-9 w-4/5 animate-pulse rounded-xl" />
      <div className="bg-surface mt-3 h-9 w-2/5 animate-pulse rounded-xl" />

      <div className="bg-surface mt-12 aspect-[2/1] w-full animate-pulse rounded-2xl" />

      <div className="mt-8 flex flex-col gap-6">
        {[0, 1, 2].map((i) => (
          <div key={i}>
            <div className="bg-surface h-5 w-2/3 animate-pulse rounded-lg" />
            <div className="bg-surface mt-3 h-3 w-full max-w-xl animate-pulse rounded-full" />
            <div className="bg-surface mt-2 h-3 w-40 animate-pulse rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
}
