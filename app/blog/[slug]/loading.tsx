/**
 * Skeleton in the shape of the real post: title band, then body lines. A
 * spinner tells you nothing is happening yet; this tells you what's coming
 * and keeps the layout from jumping when the content lands.
 */
function Line({ className = "" }: { className?: string }) {
  return <div className={`bg-muted h-4 animate-pulse ${className}`} />;
}

export default function BlogPostLoading() {
  return (
    <div aria-busy="true" aria-label="Loading post">
      <header className="border-border border-b bg-gray-50 px-6 py-8 sm:px-10 sm:py-10 dark:bg-black">
        <div className="mx-auto max-w-3xl">
          <Line className="w-24" />
          <div className="mt-5 flex gap-2">
            <Line className="w-16" />
            <Line className="w-20" />
          </div>
          <div className="mt-4 space-y-2">
            <div className="bg-muted h-8 w-4/5 animate-pulse" />
            <div className="bg-muted h-8 w-2/5 animate-pulse" />
          </div>
          <div className="mt-4 space-y-2">
            <Line className="w-full max-w-2xl" />
            <Line className="w-3/5" />
          </div>
          <Line className="mt-5 w-40" />
        </div>
      </header>

      <div className="mx-auto max-w-3xl space-y-4 px-6 pt-12 pb-16 sm:px-10">
        <Line className="w-3/4" />
        <Line className="w-full" />
        <Line className="w-5/6" />
        <Line className="w-full" />
        <Line className="w-2/3" />
        <div className="bg-muted h-6 w-1/3 animate-pulse" />
        <Line className="w-full" />
        <Line className="w-4/5" />
        <Line className="w-full" />
      </div>
    </div>
  );
}
