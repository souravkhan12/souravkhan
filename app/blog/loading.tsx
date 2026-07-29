/** Matches the post-list grid so the page doesn't reflow when posts land. */
export default function BlogLoading() {
  return (
    <div className="pt-8" aria-busy="true" aria-label="Loading posts">
      <div className="border-border flex flex-col gap-1.5 border-t border-r border-l bg-gray-50 px-6 py-5 sm:px-8 sm:py-6 dark:bg-black">
        <div className="bg-muted h-4 w-28 animate-pulse" />
        <div className="bg-muted ml-[18px] h-3 w-72 max-w-full animate-pulse" />
      </div>

      <div className="border-border grid grid-cols-1 border-t border-l">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={`border-border border-r border-b p-6 sm:p-8 ${
              i % 2 === 1 ? "bg-gray-50 dark:bg-black" : ""
            }`}
          >
            <div className="bg-muted h-3 w-40 animate-pulse" />
            <div className="bg-muted mt-3 h-5 w-2/3 animate-pulse" />
            <div className="bg-muted mt-3 h-3 w-full max-w-xl animate-pulse" />
            <div className="bg-muted mt-2 h-3 w-1/2 animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
}
